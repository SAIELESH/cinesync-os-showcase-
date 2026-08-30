"""Video generation adapter.

Supports:
1. Live AI Video Generation via SiliconFlow (Wan-AI / Wan2.2 T2V) when SILICONFLOW_API_KEY is configured.
2. Preview / Blueprint Mode when no API key is provided, returning structured prompt data and BYOK instructions.
"""

from typing import Optional, Dict, Any
from uuid import uuid4
import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SILICONFLOW_API_KEY")
BASE_URL = os.getenv("SILICONFLOW_BASE_URL", "https://api.siliconflow.com/v1")
VIDEO_MODEL = os.getenv("VIDEO_MODEL", "Wan-AI/Wan2.2-T2V-A14B")


def encode_image(image_path: str) -> Optional[str]:
    try:
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        print("Image encoding error:", e)
        return None


def submit_video_job(
    prompt: str,
    image_path: Optional[str] = None,
    use_reference: bool = False
) -> Dict[str, Any]:
    """Submit video generation request to Wan2.2 or fallback to showcase mode."""
    if API_KEY:
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        payload: Dict[str, Any] = {
            "model": VIDEO_MODEL,
            "prompt": prompt,
            "image_size": "1280x720"
        }
        if use_reference and image_path:
            encoded = encode_image(image_path)
            if encoded:
                payload["image"] = encoded

        try:
            response = requests.post(
                f"{BASE_URL}/video/submit",
                headers=headers,
                json=payload,
                timeout=60
            )
            if response.status_code == 200:
                data = response.json()
                request_id = data.get("requestId")
                if not request_id:
                    raise ValueError("No requestId returned from video API")
                return {
                    "task_id": request_id,
                    "status": "processing",
                    "message": "AI video generation started on Wan2.2 cluster.",
                    "is_live": True
                }
            else:
                print(f"Video API Error ({response.status_code}): {response.text}")
        except Exception as e:
            print("Video generation submit error:", e)

    # Blueprint Mode (no API key configured)
    task_id = f"demo_{uuid4().hex[:8]}"
    return {
        "task_id": task_id,
        "status": "ready",
        "prompt": prompt,
        "message": "Cinematic blueprint compiled. Set SILICONFLOW_API_KEY in .env to generate live AI video.",
        "is_live": False
    }


def check_video_status(task_id: str) -> Dict[str, Any]:
    """Poll video status from live API or return showcase blueprint."""
    if API_KEY and not task_id.startswith("demo_") and not task_id.startswith("mock_"):
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.post(
                f"{BASE_URL}/video/status",
                headers=headers,
                json={"requestId": task_id},
                timeout=30
            )
            if response.status_code == 200:
                data = response.json()
                status = data.get("status")
                if status == "Succeed":
                    videos = data.get("results", {}).get("videos", [])
                    if videos and videos[0].get("url"):
                        return {
                            "status": "ready",
                            "video_url": videos[0]["url"]
                        }
                    return {"status": "failed", "error": "No video URL returned"}
                elif status == "Failed":
                    return {"status": "failed", "error": data.get("reason", "Video generation failed")}
                elif status in ["InQueue", "InProgress"]:
                    return {"status": "processing"}
                return {"status": "processing", "raw": data}
            return {"status": "error", "error": response.text}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    return {
        "task_id": task_id,
        "status": "ready",
        "video_url": "",
        "message": "Blueprint compiled. Add SILICONFLOW_API_KEY to generate live AI video."
    }
