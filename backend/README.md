# CineSync OS Backend Showcase

Portfolio-safe FastAPI backend for the CineSync OS M1 prototype.

## What this demonstrates

- Script-to-scene parsing API
- Scene-to-shot generation API
- Camera-aware prompt builder
- Video generation job interface
- Status polling interface
- Clean FastAPI service structure

## Why this is public-safe

This repo intentionally excludes:

- Real API keys
- Full production orchestration logic
- Advanced consistency-engine logic
- Proprietary prompt templates
- Paid video provider implementation details

The public version runs in `mock` mode so recruiters and collaborators can test the API without paid credentials.

## Run locally

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5000
```

Open:

```text
http://localhost:5000/docs
```

## API Flow

```text
POST /parse-script
POST /generate-shots
POST /build-prompt
POST /generate-video
GET  /video-status/{task_id}
```

## Example request

```bash
curl -X POST http://localhost:5000/parse-script \
  -H "Content-Type: application/json" \
  -d '{"script":"A lonely filmmaker walks through a neon-lit Chennai street at night."}'
```
