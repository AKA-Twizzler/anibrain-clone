"""Clean and normalize fetched anime/manga data.

Steps:
1. Remove HTML tags from descriptions
2. Drop entries with empty/null synopsis (less than 50 chars)
3. Normalize text (lowercase, strip whitespace)
4. Deduplicate by id
"""

import argparse
import html
import json
import re
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"


def clean_html(text: str | None) -> str:
    """Remove HTML tags and decode entities from a text string."""
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_text(text: str) -> str:
    return text.lower().strip()


def clean_entry(entry: dict) -> dict | None:
    """Clean and normalize a single media entry. Returns None if entry should be dropped."""
    entry_id = entry.get("id")
    raw_desc = entry.get("description") or ""
    cleaned_desc = clean_html(raw_desc)

    if len(cleaned_desc) < 50:
        return None

    entry["description"] = cleaned_desc

    titles = entry.get("title") or {}
    for key in ("romaji", "english", "native"):
        if titles.get(key):
            titles[key] = normalize_text(titles[key])

    genres = entry.get("genres") or []
    entry["genres"] = [g.lower().strip() for g in genres if g]

    tags = entry.get("tags") or []
    for tag in tags:
        if tag.get("name"):
            tag["name"] = tag["name"].lower().strip()

    studios_data = entry.get("studios") or {}
    studio_nodes = studios_data.get("nodes") or []
    entry["studio_names"] = [s["name"].strip() for s in studio_nodes if s.get("name")]

    for num_field in ("id", "idMal", "episodes", "duration", "seasonYear",
                      "averageScore", "meanScore", "popularity"):
        if num_field in entry and entry[num_field] is not None:
            try:
                entry[num_field] = int(entry[num_field])
            except (ValueError, TypeError):
                entry[num_field] = None

    for str_field in ("format", "status", "season", "source", "countryOfOrigin"):
        if str_field in entry and entry[str_field] is not None:
            entry[str_field] = str(entry[str_field]).strip()

    entry["id"] = entry_id
    return entry


def clean_all(data: list[dict]) -> list[dict]:
    """Clean all entries, removing invalid ones and deduplicating by id."""
    seen_ids: set[int] = set()
    cleaned: list[dict] = []

    for entry in data:
        entry_id = entry.get("id")
        if entry_id is None:
            continue
        if entry_id in seen_ids:
            continue
        seen_ids.add(entry_id)

        result = clean_entry(entry)
        if result is not None:
            cleaned.append(result)

    return cleaned


def main() -> None:
    parser = argparse.ArgumentParser(description="Clean and normalize fetched AniList data")
    parser.add_argument("--input-dir", type=str, default=None, help="Input directory (default: ./output)")
    parser.add_argument("--output-dir", type=str, default=None, help="Output directory (default: ./output)")
    args = parser.parse_args()

    in_dir = Path(args.input_dir) if args.input_dir else OUTPUT_DIR
    out_dir = Path(args.output_dir) if args.output_dir else OUTPUT_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    for media_type in ("anime", "manga"):
        input_path = in_dir / f"raw_{media_type}.json"
        if not input_path.exists():
            print(f"Skipping {media_type}: {input_path} not found")
            continue

        print(f"\nCleaning {media_type}...")
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        print(f"  Loaded {len(data)} raw entries")
        cleaned = clean_all(data)
        print(f"  Cleaned: {len(cleaned)} entries (removed {len(data) - len(cleaned)})")

        output_path = out_dir / f"cleaned_{media_type}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(cleaned, f, ensure_ascii=False, indent=2)
        print(f"  Saved to {output_path}")


if __name__ == "__main__":
    main()
