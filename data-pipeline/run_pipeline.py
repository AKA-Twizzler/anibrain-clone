"""Run the full data pipeline: fetch -> clean -> features -> embeddings -> index.

Usage:
    python run_pipeline.py                         # Full pipeline
    python run_pipeline.py --sample                # 5 pages for testing
    python run_pipeline.py --include-adult         # Include 18+ content
    python run_pipeline.py --force                 # Overwrite existing indexes
    python run_pipeline.py --anime-only            # Anime only
    python run_pipeline.py --manga-only            # Manga only
    python run_pipeline.py --skip-fetch            # Resume from cleaning
    python run_pipeline.py --skip-embeddings       # Stop after features
    python run_pipeline.py --output-version v2     # Versioned output dir
"""

import argparse
import subprocess
import sys
import time
from pathlib import Path

PIPELINE_DIR = Path(__file__).parent


def run_step(step_name: str, script: str, extra_args: list[str] | None = None) -> None:
    print(f"\n{'='*60}")
    print(f"  Step: {step_name}")
    print(f"{'='*60}")
    start = time.time()

    cmd = [sys.executable, str(PIPELINE_DIR / script)]
    if extra_args:
        cmd.extend(extra_args)

    print(f"  Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=PIPELINE_DIR)

    elapsed = time.time() - start
    if result.returncode != 0:
        print(f"\n  [FAIL] {step_name} exited with code {result.returncode} ({elapsed:.1f}s)")
        sys.exit(result.returncode)
    print(f"\n  [OK] {step_name} completed in {elapsed:.1f}s")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the full AniBrain data pipeline")
    parser.add_argument("--sample", action="store_true", help="Fetch only 5 pages for testing")
    parser.add_argument("--include-adult", action="store_true", help="Include adult/18+ content")
    parser.add_argument("--force", action="store_true", help="Overwrite existing index files")
    parser.add_argument("--anime-only", action="store_true", help="Process only anime")
    parser.add_argument("--manga-only", action="store_true", help="Process only manga")
    parser.add_argument("--skip-fetch", action="store_true", help="Skip fetch step (use existing raw data)")
    parser.add_argument("--skip-cleaning", action="store_true", help="Skip cleaning step")
    parser.add_argument("--skip-features", action="store_true", help="Skip feature building step")
    parser.add_argument("--skip-embeddings", action="store_true", help="Skip embedding generation step")
    parser.add_argument("--skip-index", action="store_true", help="Skip index building step")
    parser.add_argument("--output-version", type=str, default=None,
                        help="Version subdirectory for index outputs (e.g., v2)")
    parser.add_argument("--output-dir", type=str, default=None, help="Base output directory")
    parser.add_argument("--model", type=str, default="all-MiniLM-L6-v2",
                        help="Sentence transformer model name")
    args = parser.parse_args()

    common_args = []
    if args.anime_only:
        common_args.append("--anime-only")
    if args.manga_only:
        common_args.append("--manga-only")
    if args.output_dir:
        common_args.extend(["--output-dir", args.output_dir])

    if not args.skip_fetch:
        fetch_args = list(common_args)
        if args.sample:
            fetch_args.append("--sample")
        if args.include_adult:
            fetch_args.append("--include-adult")
        run_step("Fetch from AniList", "fetch_anilist.py", fetch_args)
    else:
        print("\n[Skipping fetch step]")

    if not args.skip_cleaning:
        run_step("Clean data", "clean_data.py", common_args)
    else:
        print("\n[Skipping cleaning step]")

    if not args.skip_features:
        run_step("Build feature texts", "build_features.py", common_args)
    else:
        print("\n[Skipping feature building step]")

    embed_args = list(common_args)
    if args.model:
        embed_args.extend(["--model", args.model])
    if not args.skip_embeddings:
        run_step("Generate embeddings", "generate_embeddings.py", embed_args)
    else:
        print("\n[Skipping embedding generation step]")

    index_args = list(common_args)
    if args.force:
        index_args.append("--force")
    if args.output_version:
        index_args.extend(["--output-version", args.output_version])
    if not args.skip_index:
        run_step("Build FAISS index", "build_index.py", index_args)
    else:
        print("\n[Skipping index building step]")

    print(f"\n{'='*60}")
    print("  Pipeline complete!")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
