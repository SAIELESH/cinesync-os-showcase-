"""CineSync OS - Public Backend Showcase

FastAPI backend demonstrating the M1 workflow:
Script -> Scenes -> Shots -> Prompt -> Video Job.

This public version is intentionally simplified for portfolio use.
It does not include private orchestration logic, paid API keys, or production secrets.
"""

from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from parser import parse_script_to_scenes
from shots import generate_shots
from prompt_builder import build_prompt
from generator import submit_video_job, check_video_status

app = FastAPI(
    title="CineSync OS Showcase API",
    version="1.0.0",
    description="Portfolio-safe backend for an AI filmmaking workflow prototype.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo only. Restrict this in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScriptRequest(BaseModel):
    script: str = Field(..., min_length=1, description="Raw script or story text")


class ShotRequest(BaseModel):
    scene: Dict[str, Any]


class VideoRequest(BaseModel):
    scene: Dict[str, Any]
    shot: Dict[str, Any]
    camera: Dict[str, Any] = Field(default_factory=dict)
    use_reference: bool = False
    image_path: Optional[str] = None


@app.get("/")
def health_check():
    return {"status": "ok", "service": "CineSync OS Showcase API"}


@app.post("/parse-script")
def parse_script(request: ScriptRequest):
    """Convert script text into structured cinematic scenes."""
    try:
        scenes = parse_script_to_scenes(request.script)
        return {"scenes": scenes, "total": len(scenes)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Script parsing failed: {exc}")


@app.post("/generate-shots")
def generate_shots_endpoint(request: ShotRequest):
    """Generate a basic shot list for a selected scene."""
    if not request.scene:
        raise HTTPException(status_code=400, detail="Scene is required")

    try:
        shots = generate_shots(request.scene)
        return {"shots": shots, "total": len(shots)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Shot generation failed: {exc}")


@app.post("/build-prompt")
def build_prompt_endpoint(request: VideoRequest):
    """Build a cinematic generation prompt from scene, shot, and camera inputs."""
    try:
        prompt = build_prompt(
            scene=request.scene,
            shot=request.shot,
            camera=request.camera,
            use_reference=request.use_reference,
        )
        return {"prompt": prompt}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prompt build failed: {exc}")


@app.post("/generate-video")
def generate_video_endpoint(request: VideoRequest):
    """Submit a video generation job."""
    if not request.scene or not request.shot:
        raise HTTPException(status_code=400, detail="Scene and shot are required")

    prompt = build_prompt(request.scene, request.shot, request.camera, request.use_reference)
    result = submit_video_job(
        prompt=prompt,
        image_path=request.image_path,
        use_reference=request.use_reference
    )
    return result


@app.get("/video-status/{task_id}")
def video_status(task_id: str):
    """Check status of a generated video job."""
    return check_video_status(task_id)


@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload reference image for consistent character and style conditioning."""
    import os
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    return {
        "file_path": file_path,
        "filename": file.filename,
        "message": "Image uploaded successfully.",
    }
