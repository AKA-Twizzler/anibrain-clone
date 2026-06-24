"""
main.py - AniBrain ML Recommendation Engine (FastAPI)
"""

import json
import logging
import sys
from pathlib import Path
from typing import Optional

import numpy as np
import faiss
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).parent
INDEX_PATH = BASE_DIR / "anime_index.faiss"
METADATA_PATH = BASE_DIR / "anime_metadata.json"

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AniBrain ML Engine",
    description="Sentence-BERT + FAISS recommendation engine for anime/manga",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global state (loaded at startup)
# ---------------------------------------------------------------------------
index: Optional[faiss.Index] = None
anime_list: list[dict] = []
anime_map: dict[int, dict] = {}
model: Optional[SentenceTransformer] = None


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------
class RecommendRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Anime title to base recommendations on")


class FromTextRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Free text query for recommendations")
    genres: Optional[list[str]] = Field(None, description="Optional genre filter")
    rating_min: Optional[float] = Field(None, ge=0, le=10, description="Optional minimum rating filter")


class AnimeResult(BaseModel):
    id: int
    title: str
    synopsis: str
    genres: list[str]
    similarity_score: float
    image_url: str


class ApiResponse(BaseModel):
    data: list[AnimeResult]
    code: int
    metadata: dict


class HealthResponse(BaseModel):
    status: str
    index_size: int
    model_loaded: bool


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
@app.on_event("startup")
def load_artifacts():
    global index, anime_list, anime_map, model

    logger.info("=" * 60)
    logger.info("AniBrain ML Engine - Starting up")
    logger.info("=" * 60)

    # Load metadata
    if not METADATA_PATH.exists():
        logger.error(f"Metadata file not found: {METADATA_PATH}")
        logger.error("Run seed_index.py first to build the index and metadata.")
        sys.exit(1)
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        anime_list = json.load(f)
    anime_map = {a["id"]: a for a in anime_list}
    logger.info(f"Loaded {len(anime_list)} anime entries from metadata.")

    # Load FAISS index
    if not INDEX_PATH.exists():
        logger.error(f"FAISS index file not found: {INDEX_PATH}")
        logger.error("Run seed_index.py first to build the index.")
        sys.exit(1)
    index = faiss.read_index(str(INDEX_PATH))
    logger.info(f"FAISS index loaded: {index.ntotal} vectors, dimension {index.d}")

    # Load Sentence-BERT model
    logger.info("Loading Sentence-BERT model: all-MiniLM-L6-v2 ...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Sentence-BERT model loaded successfully.")

    logger.info("Startup complete. Ready to serve requests.")


# ---------------------------------------------------------------------------
# Helper: embed text -> normalized vector
# ---------------------------------------------------------------------------
def embed_text(text: str) -> np.ndarray:
    emb = model.encode([text])
    norm = np.linalg.norm(emb, axis=1, keepdims=True)
    norm[norm == 0] = 1.0
    emb = emb / norm
    return emb


# ---------------------------------------------------------------------------
# Helper: search index -> results
# ---------------------------------------------------------------------------
def search_index(query_emb: np.ndarray, top_k: int = 20) -> list[dict]:
    distances, indices = index.search(query_emb, top_k)
    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx == -1 or idx >= len(anime_list):
            continue
        anime = anime_list[idx]
        # IndexHNSWFlat returns squared L2 distances
        # For normalized unit vectors: ||a-b||^2 = 2 - 2*cos(a,b)
        # cosine_similarity = 1 - (squared_L2 / 2)
        cosine_sim = max(-1.0, min(1.0, 1.0 - float(dist) / 2.0))
        similarity = max(0.0, min(100.0, cosine_sim * 100.0))
        synopsis = anime.get("synopsis", "")
        if len(synopsis) > 300:
            synopsis = synopsis[:297] + "..."
        results.append(
            AnimeResult(
                id=anime["id"],
                title=anime["title"],
                synopsis=synopsis,
                genres=anime.get("genres", []),
                similarity_score=round(similarity, 2),
                image_url=anime.get("image_url", ""),
            )
        )
    return results


# ---------------------------------------------------------------------------
# Helper: find closest anime by title (fuzzy match)
# ---------------------------------------------------------------------------
def find_closest_anime(title: str) -> Optional[dict]:
    title_lower = title.strip().lower()
    # Exact match first
    for a in anime_list:
        if a["title"].lower() == title_lower:
            return a
    # Partial match
    for a in anime_list:
        if title_lower in a["title"].lower():
            return a
    # Word-level fuzzy match
    title_words = set(title_lower.split())
    best_match = None
    best_score = 0
    for a in anime_list:
        a_words = set(a["title"].lower().split())
        if not title_words or not a_words:
            continue
        overlap = len(title_words & a_words)
        score = overlap / max(len(title_words), len(a_words))
        if score > best_score:
            best_score = score
            best_match = a
    if best_score > 0.3:
        return best_match
    return None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.post("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        index_size=index.ntotal if index is not None else 0,
        model_loaded=model is not None,
    )


@app.post("/recommend", response_model=ApiResponse)
def recommend(req: RecommendRequest):
    """
    Recommend anime based on a given title.
    Finds the closest matching anime in the database, embeds its synopsis,
    and returns the top 20 most similar anime.
    """
    logger.info(f"Recommendation request for title: {req.title}")

    closest = find_closest_anime(req.title)
    if closest is None:
        raise HTTPException(
            status_code=404,
            detail=f"Anime with title '{req.title}' not found in database.",
        )

    logger.info(f"Closest match: {closest['title']} (id={closest['id']})")

    # Build query text from matched anime
    synopsis = closest.get("synopsis", "")
    genres = ", ".join(closest.get("genres", []))
    query_text = f"{synopsis} [GENRES: {genres}]"

    # Embed and search
    query_emb = embed_text(query_text)
    results = search_index(query_emb, top_k=20)

    return ApiResponse(
        data=results,
        code=200,
        metadata={"cache": True},
    )


@app.post("/from-text", response_model=ApiResponse)
def recommend_from_text(req: FromTextRequest):
    """
    Recommend anime based on an arbitrary free-text query.
    Optionally filter results by genre or minimum rating.
    """
    logger.info(f"From-text request (len={len(req.text)})")

    # Embed the query text directly (no metadata lookup needed)
    query_text = req.text
    if req.genres:
        query_text = f"{query_text} [GENRES: {', '.join(req.genres)}]"

    query_emb = embed_text(query_text)
    results = search_index(query_emb, top_k=20)

    # Apply genre filter if specified
    if req.genres:
        genre_set = set(g.lower() for g in req.genres)
        filtered = []
        for r in results:
            result_genres = [g.lower() for g in r.genres]
            if any(g in result_genres for g in genre_set):
                filtered.append(r)
        results = filtered[:20]

    return ApiResponse(
        data=results,
        code=200,
        metadata={"cache": True},
    )


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
