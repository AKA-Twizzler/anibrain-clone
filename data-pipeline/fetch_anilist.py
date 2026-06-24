"""Fetch all anime and manga data from the AniList GraphQL API.

Usage:
    python fetch_anilist.py                    # Fetch all anime + manga
    python fetch_anilist.py --sample           # 5 pages (250 entries) for testing
    python fetch_anilist.py --include-adult    # Include 18+ content
    python fetch_anilist.py --anime-only       # Only anime
    python fetch_anilist.py --manga-only       # Only manga
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

API_URL = "https://graphql.anilist.co"
PER_PAGE = 50
RATE_LIMIT_DELAY = 0.7  # seconds between pages (90 req/min = 0.667s, use 0.7 for safety)
SAMPLE_PAGES = 5
OUTPUT_DIR = Path(__file__).parent / "output"

MEDIA_QUERY = """
query ($page: Int, $perPage: Int, $type: MediaType, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
      total
      currentPage
      lastPage
    }
    media(type: $type, sort: ID, isAdult: $isAdult) {
      id
      idMal
      title {
        romaji
        english
        native
      }
      description
      genres
      tags {
        name
        rank
      }
      studios {
        nodes {
          name
        }
      }
      format
      episodes
      duration
      status
      season
      seasonYear
      averageScore
      meanScore
      popularity
      source
      coverImage {
        large
      }
      bannerImage
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      countryOfOrigin
      isAdult
    }
  }
}
"""


def fetch_page(session: requests.Session, page: int, media_type: str, is_adult: bool) -> dict | None:
    """Fetch a single page of results from AniList."""
    variables = {
        "page": page,
        "perPage": PER_PAGE,
        "type": media_type.upper(),
        "isAdult": is_adult,
    }
    try:
        resp = session.post(API_URL, json={"query": MEDIA_QUERY, "variables": variables}, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if "errors" in data:
            print(f"  [WARN] Page {page}: API errors: {data['errors']}", file=sys.stderr)
            return None
        return data["data"]["Page"]
    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] Page {page}: {e}", file=sys.stderr)
        return None
    except (KeyError, ValueError) as e:
        print(f"  [ERROR] Page {page}: Malformed response: {e}", file=sys.stderr)
        return None


def fetch_all(media_type: str, sample: bool = False, include_adult: bool = False) -> list[dict]:
    """Fetch all entries of a given media type with pagination."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    session = requests.Session()
    session.headers.update({"Accept": "application/json"})

    all_media: list[dict] = []
    page = 1
    has_next = True
    total = None
    no_progress = 0  # consecutive empty pages

    print(f"\nFetching {media_type}...")

    while has_next:
        if sample and page > SAMPLE_PAGES:
            print(f"  [SAMPLE] Stopping after {SAMPLE_PAGES} pages (--sample mode)")
            break

        page_data = fetch_page(session, page, media_type, include_adult)
        if page_data is None:
            no_progress += 1
            if no_progress >= 3:
                print(f"  [ERROR] {no_progress} consecutive failures. Aborting.", file=sys.stderr)
                break
            page += 1
            time.sleep(RATE_LIMIT_DELAY * 2)
            continue

        no_progress = 0
        page_info = page_data.get("pageInfo", {})
        media_list = page_data.get("media", [])

        if total is None and page_info.get("total"):
            total = page_info["total"]
            print(f"  Total entries available: {total}")

        all_media.extend(media_list)
        current = page_info.get("currentPage", page)
        last = page_info.get("lastPage", "?")
        has_next = page_info.get("hasNextPage", False)

        print(f"  Page {current}/{last} — fetched {len(media_list)} entries (total: {len(all_media)})")

        page += 1
        time.sleep(RATE_LIMIT_DELAY)

    print(f"  Done. Total {media_type} fetched: {len(all_media)}")
    return all_media


def save_raw(media: list[dict], filename: str) -> None:
    """Save raw fetched data to JSON."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = OUTPUT_DIR / filename
    with open(path, "w", encoding="utf-8") as f:
        json.dump(media, f, ensure_ascii=False, indent=2)
    print(f"  Saved {len(media)} entries to {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch anime/manga data from AniList API")
    parser.add_argument("--sample", action="store_true", help=f"Fetch only {SAMPLE_PAGES} pages for testing")
    parser.add_argument("--include-adult", action="store_true", help="Include adult/18+ content")
    parser.add_argument("--anime-only", action="store_true", help="Fetch only anime")
    parser.add_argument("--manga-only", action="store_true", help="Fetch only manga")
    parser.add_argument("--output-dir", type=str, default=None, help="Output directory (default: ./output)")
    args = parser.parse_args()

    if args.output_dir:
        global OUTPUT_DIR
        OUTPUT_DIR = Path(args.output_dir)

    do_anime = not args.manga_only
    do_manga = not args.anime_only

    if do_anime:
        anime = fetch_all("ANIME", sample=args.sample, include_adult=args.include_adult)
        save_raw(anime, "raw_anime.json")

    if do_manga:
        manga = fetch_all("MANGA", sample=args.sample, include_adult=args.include_adult)
        save_raw(manga, "raw_manga.json")

    print("\nFetch complete.")


if __name__ == "__main__":
    main()
