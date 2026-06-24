"""Generate embeddings from feature texts using sentence-transformers.

Loads all-MiniLM-L6-v2, encodes in batches (batch_size=32),
normalizes to unit vectors, and saves as .npy files.
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

OUTPUT_DIR = Path(__file__).parent / "output"
MODEL_NAME = "all-MiniLM-L6-v2"
BATCH_SIZE = 32
EMBEDDING_DIM = 384


def encode_batches(
    model: SentenceTransformer,
    texts: list[str],
    batch_size: int = BATCH_SIZE,
    show_progress: bool = True,
) -> np.ndarray:
    """Encode texts in batches and return normalized embeddings."""
    total = len(texts)
    if total == 0:
        return np.empty((0, EMBEDDING_DIM), dtype=np.float32)

    print(f"  Encoding {total} texts in batches of {batch_size}...")

    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=show_progress,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )

    print(f"  Embedding shape: {embeddings.shape}")
    return embeddings.astype(np.float32)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate embeddings from feature texts")
    parser.add_argument("--input-dir", type=str, default=None, help="Input directory")
    parser.add_argument("--output-dir", type=str, default=None, help="Output directory")
    parser.add_argument("--model", type=str, default=MODEL_NAME, help="Sentence transformer model name")
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE, help="Encoding batch size")
    args = parser.parse_args()

    in_dir = Path(args.input_dir) if args.input_dir else OUTPUT_DIR
    out_dir = Path(args.output_dir) if args.output_dir else OUTPUT_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading model: {args.model}")
    try:
        model = SentenceTransformer(args.model)
    except Exception as e:
        print(f"Failed to load model '{args.model}': {e}", file=sys.stderr)
        sys.exit(1)

    for media_type in ("anime", "manga"):
        input_path = in_dir / f"feature_texts_{media_type}.json"
        if not input_path.exists():
            print(f"Skipping {media_type}: {input_path} not found")
            continue

        print(f"\nGenerating embeddings for {media_type}...")
        with open(input_path, "r", encoding="utf-8") as f:
            features = json.load(f)

        texts = [item["feature_text"] for item in features]
        ids = [item["id"] for item in features]

        if not texts:
            print(f"  No texts to encode for {media_type}")
            continue

        embeddings = encode_batches(model, texts, batch_size=args.batch_size)

        output_path = out_dir / f"{media_type}_embeddings.npy"
        np.save(output_path, embeddings)
        print(f"  Saved embeddings to {output_path}")

        id_map_path = out_dir / f"{media_type}_embedding_ids.json"
        with open(id_map_path, "w", encoding="utf-8") as f:
            json.dump(ids, f)
        print(f"  Saved ID mapping to {id_map_path}")

    print("\nEmbedding generation complete.")


if __name__ == "__main__":
    main()
