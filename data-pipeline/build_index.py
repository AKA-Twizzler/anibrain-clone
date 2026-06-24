"""Build FAISS HNSW index and metadata JSON from embeddings.

Outputs:
  - anime_index.faiss / manga_index.faiss  (FAISS HNSW index)
  - anime_metadata.json / manga_metadata.json  (metadata for ML Engine)
"""

import argparse
import json
import sys
from pathlib import Path

import faiss
import numpy as np

OUTPUT_DIR = Path(__file__).parent / "output"


def build_hnsw_index(embeddings: np.ndarray, m: int = 32) -> faiss.Index:
    """Build a FAISS HNSW index with L2 distance.

    Args:
        embeddings: Float32 array of shape (n, dim)
        m: HNSW graph degree (higher = better recall, slower index)
    """
    dim = embeddings.shape[1]
    print(f"  Building HNSW index (dim={dim}, M={m})...")

    index = faiss.IndexHNSWFlat(dim, m)
    index.hnsw.efConstruction = 200

    index.add(embeddings)
    print(f"  Index size: {index.ntotal} vectors")
    return index


def build_metadata(
    cleaned_data: list[dict],
    embedding_ids: list[int],
) -> list[dict]:
    """Build metadata entries aligned with the FAISS index order.

    Only includes entries whose ids are in embedding_ids (survived cleaning).
    """
    id_to_entry = {e["id"]: e for e in cleaned_data}
    metadata = []

    for idx, eid in enumerate(embedding_ids):
        entry = id_to_entry.get(eid)
        if entry is None:
            print(f"  [WARN] id {eid} at index {idx} not found in cleaned data", file=sys.stderr)
            continue

        synopsis = (entry.get("description") or "")[:500].strip()
        title = entry.get("title") or {}

        meta = {
            "id": eid,
            "titleRomaji": title.get("romaji") or "",
            "titleEnglish": title.get("english") or "",
            "titleNative": title.get("native") or "",
            "synopsis": synopsis,
            "genres": entry.get("genres") or [],
            "format": entry.get("format") or "",
            "image_url": (entry.get("coverImage") or {}).get("large") or "",
            "averageScore": entry.get("averageScore"),
        }
        metadata.append(meta)

    return metadata


def main() -> None:
    parser = argparse.ArgumentParser(description="Build FAISS index and metadata")
    parser.add_argument("--input-dir", type=str, default=None, help="Input directory")
    parser.add_argument("--output-dir", type=str, default=None, help="Output directory")
    parser.add_argument("--force", action="store_true", help="Overwrite existing index files")
    parser.add_argument("--output-version", type=str, default=None,
                        help="Version subdirectory for outputs (e.g., v1)")
    args = parser.parse_args()

    in_dir = Path(args.input_dir) if args.input_dir else OUTPUT_DIR
    out_dir = Path(args.output_dir) if args.output_dir else OUTPUT_DIR

    if args.output_version:
        out_dir = out_dir / args.output_version
    out_dir.mkdir(parents=True, exist_ok=True)

    for media_type in ("anime", "manga"):
        print(f"\nProcessing {media_type}...")

        emb_path = in_dir / f"{media_type}_embeddings.npy"
        if not emb_path.exists():
            print(f"  Skipping: {emb_path} not found")
            continue

        embeddings = np.load(emb_path)
        print(f"  Loaded embeddings: {embeddings.shape}")

        if embeddings.shape[0] == 0:
            print(f"  Skipping: empty embeddings for {media_type}")
            continue

        index_path = out_dir / f"{media_type}_index.faiss"
        metadata_path = out_dir / f"{media_type}_metadata.json"

        if index_path.exists() and not args.force:
            print(f"  [SKIP] {index_path} exists. Use --force to overwrite.")
            continue
        if metadata_path.exists() and not args.force:
            print(f"  [SKIP] {metadata_path} exists. Use --force to overwrite.")
            continue

        index = build_hnsw_index(embeddings)
        faiss.write_index(index, str(index_path))
        print(f"  Saved index: {index_path}")

        cleaned_path = in_dir / f"cleaned_{media_type}.json"
        id_map_path = in_dir / f"{media_type}_embedding_ids.json"

        if cleaned_path.exists() and id_map_path.exists():
            with open(cleaned_path, "r", encoding="utf-8") as f:
                cleaned_data = json.load(f)
            with open(id_map_path, "r", encoding="utf-8") as f:
                embedding_ids = json.load(f)

            metadata = build_metadata(cleaned_data, embedding_ids)
            with open(metadata_path, "w", encoding="utf-8") as f:
                json.dump(metadata, f, ensure_ascii=False, indent=2)
            print(f"  Saved metadata ({len(metadata)} entries): {metadata_path}")
        else:
            print(f"  [WARN] Cleaned data or ID mapping not found, skipping metadata", file=sys.stderr)

    print("\nIndex building complete.")


if __name__ == "__main__":
    main()
