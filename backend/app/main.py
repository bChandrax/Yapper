import logging
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.transcription import transcribe_file

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Setswana Whisper API",
    description="Speech-to-text API for the Project Whisper demo.",
    version="0.1.0",
)

ALLOWED_SUFFIXES = {".wav", ".mp3", ".m4a", ".ogg", ".flac", ".webm", ".mp4"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    language: str | None = Query(default=None, description="Optional Whisper language code"),
) -> dict[str, str | float | None]:
    suffix = Path(file.filename or "audio").suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=415, detail="Unsupported audio file type")

    max_bytes = settings.max_upload_mb * 1024 * 1024
    temp_path: Path | None = None
    size = 0
    try:
        with tempfile.NamedTemporaryFile(prefix="whisper-", suffix=suffix, delete=False) as temp:
            temp_path = Path(temp.name)
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > max_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"Audio exceeds the {settings.max_upload_mb} MB upload limit",
                    )
                temp.write(chunk)
        if size == 0:
            raise HTTPException(status_code=400, detail="Audio file is empty")

        result = await run_in_threadpool(transcribe_file, temp_path, language)
        return {
            "text": result.text,
            "detected_language": result.detected_language,
            "language_probability": result.language_probability,
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Transcription failed")
        raise HTTPException(status_code=500, detail="Transcription failed") from exc
    finally:
        await file.close()
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)
