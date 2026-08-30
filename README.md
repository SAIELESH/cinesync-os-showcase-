# CineSync OS — AI Filmmaking & Director Operating System

CineSync OS is an AI-assisted filmmaking operating system that converts raw screenplays into structured scenes, multi-shot coverage, optical camera controls, and high-definition AI video outputs.

---

## 🎬 Overview

Most AI video generators treat creators like prompt engineers. CineSync OS provides a systematic, multi-shot creative workflow:

```text
Screenplay → Scene Decomposition → Shot Planning → Optical Physics → Consistency Locks → AI Video Generation
```

The goal is to empower creators and production teams to think like directors, not prompt writers.

---

## ✨ Core Features

- **Claude 3.5 Sonnet Screenplay Parser:** Automatically breaks down scripts into scene units, environment definitions, and character identity directives.
- **Context-Aware Cinematography Planner:** Recommends focal lengths (24mm, 35mm, 50mm, 85mm, 100mm), camera physics (Dolly, Pan, Tilt, Tracking, Handheld), and framing rules.
- **Character & Lighting Consistency Locks:** Enforces strict wardrobe, facial fidelity, and lighting continuity across multi-shot takes.
- **Dual Video Generation Engine:**
  - **Live AI Diffusion Mode:** Generates real high-definition MP4 videos using **Wan2.2 (Wan-AI)** video models via SiliconFlow BYOK.
  - **Zero-Config Blueprint Mode:** Synthesizes cinematic prompt blueprints and camera vectors instantly without requiring API keys.
- **Director Studio Console:** A pro 3-column workspace featuring live sequence stacks, optical controls, reactive consistency monitors, and selective shot regeneration.
- **Client-Side BYOK Key Configuration:** Enter and manage your own API keys directly within the browser interface with zero backend configuration needed.

---

## 🛠️ Tech Stack

#### Frontend
- **Framework:** Next.js 15 (Pages Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + PostCSS + Obsidian Dark Theme
- **Motion & UI:** Framer Motion + Lucide React + Glassmorphism

#### Backend
- **Framework:** Python 3.11+ + FastAPI + Uvicorn + Pydantic
- **Security & Headers:** Support for dynamic client BYOK API key headers (`X-SiliconFlow-Key`, `X-Anthropic-Key`)

#### AI & Video Models
- **Script Intelligence:** Claude 3.5 Sonnet (Anthropic)
- **Video Diffusion:** Wan2.2 Text-to-Video & Image-to-Video (Wan-AI via SiliconFlow)
- **Prompt Synthesis:** Structured cinematic prompt compiler

---

## 🚀 Running Locally & BYOK (Bring Your Own Key)

CineSync OS runs out-of-the-box in **Blueprint Mode** with zero configuration required.

### 1. Launch the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5000
```

### 2. Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### 3. Add Your BYOK Keys (Directly in UI)
Click **"Add BYOK Key"** or the key icon in the navigation bar to enter your keys:
- **SiliconFlow API Key:** For live Wan2.2 video generation.
- **Anthropic API Key:** For Claude 3.5 Sonnet script breakdown.

Keys are stored locally in your browser and transmitted securely over custom headers.

---

## 👤 Author

**Sailesh Krishnan**  
AI Engineer | GenAI & Filmmaking Systems  
GitHub: [SAIELESH](https://github.com/SAIELESH)

---

## 📄 License

All Rights Reserved. Shared for portfolio and demonstration purposes.
