"""Build feature text strings from cleaned data for embedding generation.

For each entry, constructs:
  "{synopsis} [SEP] Genres: {genres} [SEP] Tags: {tags} [SEP] Studio: {studio}"
"""

import argparse
import json
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"


def build_feature_text(entry: dict) -> str:
    synopsis = (entry.get("description") or "").strip()

    genres_list = entry.get("genres") or []
    genres_str = ", ".join(genres_list) if genres_list else "none"

    tags_list = entry.get("tags") or []
    # Filter meaningful tags (rank >= 50) and sort by rank descending
    meaningful_tags = [t for t in tags_list if t.get("rank") is not None and t["rank"] >= 50]
    meaningful_tags.sort(key=lambda t: t["rank"], reverse=True)
    tags_str = ", ".join(t["name"] for t in meaningful_tags) if meaningful_tags else "none"

    studio_names = entry.get("studio_names") or []
    studio_str = ", ".join(studio_names) if studio_names else "unknown"

    parts = [
        synopsis,
        f"Genres: {genres_str}",
        f"Tags: {tags_str}",
        f"Studio: {studio_str}",
    ]
    return " [SEP] ".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build feature texts from cleaned data")
    parser.add_argument("--input-dir", type=str, default=None, help="Input directory")
    parser.add_argument("--output-dir", type=str, default=None, help="Output directory")
    args = parser.parse_args()

    in_dir = Path(args.input_dir) if args.input_dir else OUTPUT_DIR
    out_dir = Path(args.output_dir) if args.output_dir else OUTPUT_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    for media_type in ("anime", "manga"):
        input_path = in_dir / f"cleaned_{media_type}.json"
        if not input_path.exists():
            print(f"Skipping {media_type}: {input_path} not found")
            continue

        print(f"\nBuilding features for {media_type}...")
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        features = []
        for entry in data:
            feature_text = build_feature_text(entry)
            features.append({
                "id": entry.get("id"),
                "feature_text": feature_text,
            })

        print(f"  Built {len(features)} feature texts")

        output_path = out_dir / f"feature_texts_{media_type}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(features, f, ensure_ascii=False, indent=2)
        print(f"  Saved to {output_path}")


if __name__ == "__main__":
    main()
