# AniBrain Data Pipeline

Fetches anime and manga data from the [AniList GraphQL API](https://docs.anilist.co/),
cleans it, generates embeddings with sentence-transformers, builds a FAISS HNSW index,
and outputs files ready for the ML Engine.

## Pipeline Steps

1. **Fetch** — Downloads all anime (~20K) and manga (~100K) from AniList with pagination and rate limiting
2. **Clean** — Strips HTML from descriptions, normalizes text, drops entries with short/null synopses, deduplicates
3. **Build Features** — Constructs feature text: `{synopsis} [SEP] Genres: {genres} [SEP] Tags: {tags} [SEP] Studio: {studio}`
4. **Generate Embeddings** — Encodes feature texts with `all-MiniLM-L6-v2` (384-dim), normalizes to unit vectors
5. **Build Index** — Creates FAISS HNSW indexes + metadata JSON for the ML Engine

## Outputs

| File | Description |
|------|-------------|
| `output/anime_index.faiss` | FAISS HNSW index for anime |
| `output/manga_index.faiss` | FAISS HNSW index for manga |
| `output/anime_metadata.json` | Metadata for each anime (id, titles, synopsis, genres, etc.) |
| `output/manga_metadata.json` | Metadata for each manga |

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run full pipeline (fetches all anime + manga)
python run_pipeline.py

# Run with sample for testing (5 pages = ~250 entries)
python run_pipeline.py --sample

# Anime only
python run_pipeline.py --anime-only

# Include adult content
python run_pipeline.py --include-adult
```

### Run individual steps

```bash
python fetch_anilist.py
python clean_data.py
python build_features.py
python generate_embeddings.py
python build_index.py
```

### Resume from a specific step

```bash
# Skip fetch if raw data already exists
python run_pipeline.py --skip-fetch

# Skip fetch and cleaning
python run_pipeline.py --skip-fetch --skip-cleaning

# Skip embedding generation (e.g., on a machine without enough RAM)
python run_pipeline.py --skip-embeddings
```

### Versioned outputs

```bash
python run_pipeline.py --output-version v2
# Output goes to output/v2/anime_index.faiss (etc.)
```

### Overwrite existing indexes

```bash
python run_pipeline.py --force
```

## Docker

```bash
# Build
docker build -t anibrain-pipeline .

# Run (full pipeline)
docker run --rm anibrain-pipeline

# Run with sample
docker run --rm anibrain-pipeline python run_pipeline.py --sample

# Run with mounted output dir
docker run --rm -v $(pwd)/output:/app/output anibrain-pipeline
```

## GitHub Actions

The pipeline runs weekly (Monday 06:00 UTC) via the included workflow.
It can also be triggered manually from the Actions tab with options for
sample mode and force overwrite.

Artifacts (`.faiss` indexes + `.json` metadata) are uploaded and retained for 30 days.

## Requirements

- Python 3.11+
- See `requirements.txt` for pinned dependencies

No AniList API key is needed for public read queries.
Rate limit is 90 requests/minute — the pipeline adds a 700ms delay between pages.
