"""
seed_index.py - Build FAISS HNSW index from seed_data.json

Usage:
    python seed_index.py

This script:
1. Loads anime metadata from seed_data.json
2. Generates 384-dim embeddings using sentence-transformers (all-MiniLM-L6-v2)
3. Normalizes embeddings to unit vectors (cosine similarity = inner product)
4. Builds a FAISS HNSW (IndexHNSWFlat) index for fast approximate search
5. Saves the index and metadata for runtime use by main.py
"""

import json
import os
import logging
import sys
from pathlib import Path

import numpy as np

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# Paths relative to this script
SCRIPT_DIR = Path(__file__).parent
DATA_FILE = SCRIPT_DIR / "seed_data.json"
INDEX_FILE = SCRIPT_DIR / "anime_index.faiss"
METADATA_FILE = SCRIPT_DIR / "anime_metadata.json"
EMBEDDINGS_FILE = SCRIPT_DIR / "anime_embeddings.npy"


def load_seed_data(path: Path) -> list[dict]:
    """Load anime metadata from JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    logger.info(f"Loaded {len(data)} anime entries from {path}")
    return data


def generate_embeddings(anime_list: list[dict]) -> np.ndarray:
    """Generate normalized SBERT embeddings for all anime synopses."""
    from sentence_transformers import SentenceTransformer

    logger.info("Loading Sentence-BERT model: all-MiniLM-L6-v2 ...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Model loaded successfully.")

    # Build text corpus: combine synopsis + genres for richer embeddings
    texts = []
    for anime in anime_list:
        synopsis = anime.get("synopsis", "")
        genres = ", ".join(anime.get("genres", []))
        # Combine synopsis and genres for better semantic representation
        text = f"{synopsis} [GENRES: {genres}]"
        texts.append(text)

    logger.info(f"Generating embeddings for {len(texts)} texts (384-dim)...")
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=32)

    # Normalize to unit vectors (so inner product = cosine similarity)
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1.0  # Avoid division by zero
    embeddings = embeddings / norms

    logger.info(f"Embeddings shape: {embeddings.shape}")
    logger.info(f"Embeddings normalized (unit vectors).")
    return embeddings


def build_faiss_index(embeddings: np.ndarray) -> object:
    """Build a FAISS HNSW index for fast approximate nearest neighbor search."""
    import faiss

    dim = embeddings.shape[1]
    logger.info(f"Building FAISS HNSW index (dim={dim})...")

    # HNSW parameters
    # M = number of bi-directional links per node (higher = more accurate but slower index build)
    # efConstruction = exploration depth during construction (higher = better recall)
    M = 32
    ef_construction = 200

    index = faiss.IndexHNSWFlat(dim, M)
    index.hnsw.efConstruction = ef_construction
    index.hnsw.efSearch = 50  # Default search depth

    index.add(embeddings)
    logger.info(f"FAISS index built with {index.ntotal} vectors.")
    logger.info(f"Index type: {type(index).__name__}")
    return index


def save_artifacts(
    index: object,
    embeddings: np.ndarray,
    anime_list: list[dict],
):
    """Save FAISS index, metadata JSON, and raw embeddings to disk."""
    # Save FAISS index
    faiss.write_index(index, str(INDEX_FILE))
    logger.info(f"FAISS index saved to {INDEX_FILE}")

    # Save metadata (used at runtime to look up anime by ID)
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(anime_list, f, ensure_ascii=False, indent=2)
    logger.info(f"Metadata saved to {METADATA_FILE}")

    # Save raw embeddings for reference (optional)
    np.save(str(EMBEDDINGS_FILE), embeddings)
    logger.info(f"Embeddings saved to {EMBEDDINGS_FILE}")


def main():
    logger.info("=" * 60)
    logger.info("AniBrain ML Engine - Index Builder")
    logger.info("=" * 60)

    if not DATA_FILE.exists():
        logger.error(f"Seed data file not found: {DATA_FILE}")
        logger.error("Run this script from the ml-engine/ directory.")
        sys.exit(1)

    # Load data
    anime_list = load_seed_data(DATA_FILE)

    # Generate embeddings
    embeddings = generate_embeddings(anime_list)

    # Build FAISS index
    index = build_faiss_index(embeddings)

    # Save all artifacts
    save_artifacts(index, embeddings, anime_list)

    logger.info("=" * 60)
    logger.info("Index build complete! Ready to start main.py")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
