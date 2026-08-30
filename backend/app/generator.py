"""Video generation adapter.

Public-safe version defaults to mock responses so the repo runs without paid APIs.
Private builds can replace this adapter with SiliconFlow, fal.ai, Runway, etc.
"""

from typing import Optional, Dict
from uuid import uuid4
import os


VIDEO_PROVIDER = os.getenv("VIDEO_PROVIDER", "mock")


def submit_video_job(prompt: str, image_path: Optional[str] = None) -> Dict[str, str]:
    """Submit a video job.

    In public mock mode, this returns a fake task id. This is intentional so
    recruiters can run the API without requiring paid credentials.
    """
    if VIDEO_PROVIDER == "mock":
        return {
            "task_id": f"mock_{uuid4().hex[:10]}",
            "status": "queued",
            "message": "Mock video job created. Connect a provider in private deployment.",
        }

    raise NotImplementedError(
        "Real provider integration is intentionally excluded from the public showcase."
    )


def check_video_status(task_id: str) -> Dict[str, str]:
    """Return mock job status for showcase."""
    return {
        "task_id": task_id,
        "status": "ready" if task_id.startswith("mock_") else "unknown",
        "video_url": "/demo-video.mp4" if task_id.startswith("mock_") else "",
        "message": "Mock status response for public showcase.",
    }
