"""Validate a CSV manifest and make reproducible train/validation splits.

Expected columns: audio_path,text. Paths are resolved relative to --audio-root.
"""

import argparse
import csv
import random
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, help="CSV containing audio_path,text columns")
    parser.add_argument("--audio-root", type=Path, default=Path("."))
    parser.add_argument("--output-dir", type=Path, default=Path("data/processed"))
    parser.add_argument("--validation-ratio", type=float, default=0.1)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if not 0 < args.validation_ratio < 1:
        parser.error("--validation-ratio must be between 0 and 1")

    rows: list[dict[str, str]] = []
    errors: list[str] = []
    with args.manifest.open(newline="", encoding="utf-8-sig") as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or not {"audio_path", "text"}.issubset(reader.fieldnames):
            parser.error("manifest must contain audio_path and text columns")
        for line, row in enumerate(reader, start=2):
            audio_path = (row.get("audio_path") or "").strip()
            text = " ".join((row.get("text") or "").split())
            resolved = (args.audio_root / audio_path).resolve()
            if not audio_path:
                errors.append(f"line {line}: audio_path is empty")
            elif not resolved.is_file():
                errors.append(f"line {line}: audio file not found: {resolved}")
            if not text:
                errors.append(f"line {line}: transcript is empty")
            if audio_path and text and resolved.is_file():
                rows.append({"audio_path": str(resolved), "text": text})

    if errors:
        print("Dataset validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    if len(rows) < 2:
        print("Need at least two valid examples to create both splits", file=sys.stderr)
        return 1

    random.Random(args.seed).shuffle(rows)
    validation_count = max(1, round(len(rows) * args.validation_ratio))
    validation = rows[:validation_count]
    train = rows[validation_count:]
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, split in (("train.csv", train), ("validation.csv", validation)):
        with (args.output_dir / name).open("w", newline="", encoding="utf-8") as output:
            writer = csv.DictWriter(output, fieldnames=["audio_path", "text"])
            writer.writeheader()
            writer.writerows(split)
    print(f"Prepared {len(train)} train and {len(validation)} validation examples in {args.output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
