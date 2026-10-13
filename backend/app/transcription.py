from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from faster_whisper import WhisperModel

from app.config import settings


@dataclass
class Transcription:
    text: str
    detected_language: str | None
    language_probability: float | None


@lru_cache(maxsize=1)
def get_model() -> WhisperModel:
    """Load once on first use so health checks do not download model weights."""
    return WhisperModel(
        settings.model_size,
        device=settings.device,
        compute_type=settings.compute_type,
    )


def transcribe_file(path: Path, language: str | None = None) -> Transcription:
    segments, info = get_model().transcribe(
        str(path),
        language=language,
        task="transcribe",
        beam_size=5,
        vad_filter=True,
    )
    text = " ".join(segment.text.strip() for segment in segments).strip()
    return Transcription(
        text=text,
        detected_language=info.language,
        language_probability=info.language_probability,
    )
