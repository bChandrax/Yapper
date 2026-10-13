"""Calculate word error rate for reference and hypothesis CSV files."""

import argparse
import csv
import re
import unicodedata
from pathlib import Path


def normalize(text: str) -> list[str]:
    text = unicodedata.normalize("NFC", text).lower()
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    return text.split()


def edit_distance(reference: list[str], hypothesis: list[str]) -> int:
    previous = list(range(len(hypothesis) + 1))
    for i, ref_word in enumerate(reference, start=1):
        current = [i]
        for j, hyp_word in enumerate(hypothesis, start=1):
            current.append(min(
                current[j - 1] + 1,
                previous[j] + 1,
                previous[j - 1] + (ref_word != hyp_word),
            ))
        previous = current
    return previous[-1]


def read_texts(path: Path) -> list[str]:
    with path.open(newline="", encoding="utf-8-sig") as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or "text" not in reader.fieldnames:
            raise ValueError(f"{path} must contain a text column")
        return [row["text"] for row in reader]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("references", type=Path, help="CSV with a text column")
    parser.add_argument("hypotheses", type=Path, help="CSV with a text column, same row order")
    args = parser.parse_args()
    references, hypotheses = read_texts(args.references), read_texts(args.hypotheses)
    if not references or len(references) != len(hypotheses):
        parser.error("reference and hypothesis files must have the same non-zero number of rows")
    reference_words = [word for text in references for word in normalize(text)]
    hypothesis_words = [word for text in hypotheses for word in normalize(text)]
    if not reference_words:
        parser.error("references contain no words after normalization")
    errors = edit_distance(reference_words, hypothesis_words)
    print(f"WER: {errors / len(reference_words):.4f} ({errors} errors / {len(reference_words)} reference words)")


if __name__ == "__main__":
    main()
