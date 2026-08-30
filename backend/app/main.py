"""CineSync OS - Production Backend API

FastAPI service powering the cinematic AI filmmaking pipeline:
Script -> Scenes -> Shots -> Prompt -> Video Generation.
"""

from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from parser import parse_script_to_scenes
from shots import generate_shots
from prompt_builder import build_prompt
from generator import submit_video_job, check_video_status

app = FastAPI(
    title="CineSync OS API",
    version="1.0.0",
    description="Backend API for AI filmmaking and cinematic consistency orchestration.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    return {"status": "ok", "service": "CineSync OS Production API"}


@app.post("/parse-script")
def parse_script(
    request: ScriptRequest,
    x_anthropic_key: Optional[str] = Header(None, alias="x-anthropic-key")
):
    """Convert script text into structured cinematic scenes."""
    try:
        scenes = parse_script_to_scenes(request.script, api_key=x_anthropic_key)
        return {"scenes": scenes, "total": len(scenes)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Script parsing failed: {exc}")


@app.post("/generate-shots")
def generate_shots_endpoint(
    request: ShotRequest,
    x_anthropic_key: Optional[str] = Header(None, alias="x-anthropic-key")
):
    """Generate a context-aware shot list for a selected scene."""
    if not request.scene:
        raise HTTPException(status_code=400, detail="Scene is required")

    try:
        shots = generate_shots(request.scene, api_key=x_anthropic_key)
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
def generate_video_endpoint(
    request: VideoRequest,
    x_siliconflow_key: Optional[str] = Header(None, alias="x-siliconflow-key")
):
    """Submit a video generation job."""
    if not request.scene or not request.shot:
        raise HTTPException(status_code=400, detail="Scene and shot are required")

    prompt = build_prompt(request.scene, request.shot, request.camera, request.use_reference)
    result = submit_video_job(
        prompt=prompt,
        image_path=request.image_path,
        use_reference=request.use_reference,
        api_key=x_siliconflow_key
    )
    return result


@app.get("/video-status/{task_id}")
def video_status(
    task_id: str,
    x_siliconflow_key: Optional[str] = Header(None, alias="x-siliconflow-key")
):
    """Check status of a generated video job."""
    return check_video_status(task_id, api_key=x_siliconflow_key)


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
