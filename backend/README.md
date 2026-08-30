# CineSync OS Production Backend

FastAPI service powering the CineSync AI Filmmaking and Director Operating System.

## Core Capabilities

- **Claude 3.5 Sonnet Script Ingestion:** Parses raw scripts into scene breakdowns and mood vectors.
- **Cinematography Planner:** Context-aware shot list generation (lenses, framing, movements, lighting).
- **Camera-Aware Prompt Builder:** Builds strict character identity and optical consistency conditioning prompts.
- **Dual Video Generation Engine:**
  - **Live Mode:** Renders high-definition AI video via Wan2.2 (Wan-AI) diffusion models using BYOK (Bring Your Own Key).
  - **Blueprint Mode:** Compiles prompt blueprints and camera vectors for zero-cost operation.
- **Reference Conditioning:** Ingests character and scene reference images for multi-shot consistency.

## Run Locally

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5000
```

Interactive API documentation is available at `http://localhost:5000/docs`.

## API Endpoints

- `POST /parse-script` — Ingests screenplay text and returns structured scene units.
- `POST /generate-shots` — Generates cinematic coverage shots for a selected scene.
- `POST /build-prompt` — Compiles prompt with lens, camera movement, and consistency rules.
- `POST /generate-video` — Dispatches video rendering job (Wan2.2 or Blueprint).
- `GET  /video-status/{task_id}` — Polls job status and returns final MP4 video URL.
- `POST /upload-image` — Uploads reference image for identity conditioning.
