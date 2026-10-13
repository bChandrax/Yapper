# Project Whisper backend

Starter backend for the Setswana speech-to-text demo. The API and dataset tools use Python so the team can work in one language.

## Stack

- Python 3.12
- FastAPI for the HTTP API and interactive `/docs` page
- faster-whisper for local CPU/GPU transcription
- CSV manifests and scripts for dataset validation/splitting and word error rate (WER) evaluation
- Docker Compose for a repeatable local demo

The inference endpoint uses the multilingual `small` checkpoint by default and automatic language detection. Whisper's Setswana performance must be measured against the team's labeled validation recordings before selecting a fine-tuning plan. Training a fine-tuned checkpoint is intentionally not claimed as complete: it requires a consented, transcribed dataset and suitable training compute.

## Run locally

Use Python 3.12. Install FFmpeg, then run:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs`. The first transcription downloads model weights; this can take time and needs network access. For a smaller model use `WHISPER_MODEL=base`. To use a compatible NVIDIA GPU, set `WHISPER_DEVICE=cuda` and an appropriate `WHISPER_COMPUTE_TYPE` after installing the CTranslate2 CUDA dependencies for that machine.

## Run with Docker

```bash
docker compose up --build
```

The first launch downloads and caches the model. Health check: `GET /health`.

## API

`POST /api/v1/transcribe` accepts multipart form data with an audio `file` and optional Whisper `language` code. Supported filename suffixes: WAV, MP3, M4A, OGG, FLAC, WEBM, and MP4. Uploads are limited to 25 MB by default, processed from a temporary file, then deleted. A successful response looks like:

```json
{
  "text": "Recognized words appear here.",
  "detected_language": "en",
  "language_probability": 0.91
}
```

The API does not persist recordings or transcripts. Do not put private or non-consented recordings into the demo.

## Dataset pipeline

Keep raw recordings outside Git. Prepare a CSV manifest with `audio_path,text` columns; paths are relative to the audio root. Example:

```csv
audio_path,text
speaker-001/clip-001.wav,"Dumelang, lo kae?"
speaker-002/clip-002.wav,Ke a leboga.
```

Validate files and create a reproducible split:

```bash
python pipeline/prepare_dataset.py manifest.csv --audio-root /path/to/recordings --output-dir data/processed
```

The script checks paths and transcripts, normalizes whitespace, and writes `train.csv` and `validation.csv`. Record speaker IDs and ensure speakers do not leak across splits when preparing real evaluation data; this starter split is row-random and should only be used for initial smoke checks.

To score model outputs, make two CSVs with a `text` column in matching row order and run:

```bash
python pipeline/evaluate_transcripts.py references.csv hypotheses.csv
```

WER is reported after lowercasing, Unicode NFC normalization, and punctuation removal. Agree on Setswana normalization conventions with the team before comparing model versions.

## Suggested next backend milestones

1. Agree the frontend request/response contract and test it with one audio clip.
2. Collect a consented, diverse Setswana dataset and document transcription conventions.
3. Establish a baseline WER with the selected multilingual model.
4. Use the baseline and available compute to choose and implement a fine-tuning recipe; keep train/validation/test speakers separate.
5. Add request IDs, structured logs, and persistent job storage only if the demo needs asynchronous or historical results.
