# CineSync OS M1 Architecture

## Overview

CineSync OS M1 is an AI-assisted filmmaking workflow prototype that converts a written script into structured scenes, shot suggestions, camera-engineering choices, and a video-generation request. The goal of M1 is not to replace a filmmaker, but to prove that creative intent can be transformed into a structured production pipeline.

## Architecture Goals

- Convert unstructured scripts into editable scene units.
- Convert scenes into shot-level planning blocks.
- Allow basic cinematography control through lens, framing, and movement choices.
- Send a selected shot into a generation pipeline.
- Provide a simple three-column UI that mirrors a production workflow: script, engineering, and generation.
- Keep the system modular so future models, APIs, and local generation engines can be swapped without redesigning the full product.

## High-Level System

```text
User Script
    ↓
Script-to-Scene Layer
    ↓
Scene-to-Shot Layer
    ↓
Camera Engineering Layer
    ↓
Prompt / Generation Request Layer
    ↓
Video Generation API / Model
    ↓
Preview + Download UI
```

## Frontend Architecture

The frontend is built around a three-column workflow.

### 1. Script Column

Responsible for:

- Script input
- Scene parsing interaction
- Scene list display
- Scene selection

Representative modules:

```text
src/components/column1/
├── ScriptColumn.jsx
├── ScriptInput.jsx
└── SceneCard.jsx
```

### 2. Engineering Column

Responsible for converting creative intent into shot-level controls.

It includes:

- Shot list display
- Lens selection
- Movement selection
- Framing controls
- Selected shot state

Representative modules:

```text
src/components/column2/
├── EngineeringColumn.jsx
├── ShotCard.jsx
├── LensPicker.jsx
├── MovementPicker.jsx
└── FramingGrid.jsx
```

### 3. Generation Column

Responsible for sending the selected shot and camera controls into the generation layer and previewing the result.

Representative modules:

```text
src/components/column3/
├── GenerationColumn.jsx
├── GenerateButton.jsx
├── PreviewBox.jsx
└── DownloadButton.jsx
```

### Layout Layer

The layout layer provides the app shell and consistent column structure.

```text
src/components/layout/
├── AppShell.jsx
└── ColumnHeader.jsx
```

## Backend Architecture

The backend is designed as a lightweight orchestration layer. In M1, it coordinates parsing, shot generation, prompt/request preparation, and video-generation calls.

Representative backend modules:

```text
Backend/app/
├── main.py
├── parser.py
├── shots.py
├── prompt_builder.py
└── generator.py
```

### Backend Responsibilities

| Module | Responsibility |
|---|---|
| `main.py` | FastAPI entry point and route orchestration |
| `parser.py` | Converts script text into scene-level structure |
| `shots.py` | Creates shot-level suggestions from selected scenes |
| `prompt_builder.py` | Converts scene, shot, and camera controls into a generation-ready request |
| `generator.py` | Connects to the selected video-generation provider |

## Data Flow

1. User enters a script in the UI.
2. Frontend sends the script to the backend parser route.
3. Backend returns editable scene objects.
4. User selects a scene.
5. Frontend requests shot suggestions for that scene.
6. Backend returns structured shot options.
7. User selects camera controls such as lens, movement, and framing.
8. Frontend sends the selected scene, shot, and camera metadata to the generation endpoint.
9. Backend prepares a generation request.
10. Video generation provider returns a generated output or task status.
11. UI previews the final output.

## Component Interaction

```text
ScriptInput
  → ScriptColumn
  → useScript
  → Backend parser route
  → SceneCard list
  → selected scene
  → EngineeringColumn
  → useShot
  → Backend shot route
  → ShotCard list
  → LensPicker / MovementPicker / FramingGrid
  → GenerationColumn
  → useGeneration
  → Backend generation route
  → PreviewBox
```

## Design Principles

### 1. Workflow-first design

The system is designed around filmmaker workflow rather than isolated prompting. Script, scene, shot, camera, and generation are treated as separate but connected stages.

### 2. Modular AI layer

The generation model is not hard-coded as the product itself. The system can support different video APIs, hosted models, or future local models through replaceable integration modules.

### 3. Human-in-the-loop editing

Each major output is editable. The user can review and adjust scenes, shots, and camera choices before generation.

## Current M1 Scope

M1 validates:

- Script-to-scene flow
- Scene-to-shot flow
- Basic camera-control UI
- Video-generation request flow
- Deployed prototype-style UI

M1 does not attempt to fully solve:

- Character consistency
- Multi-shot continuity
- Actor reference locking
- Advanced cinematic style control
- Long-form scene assembly
- Local model orchestration

These are intentionally treated as future product layers.

## Future Extension Areas

High-level future improvements include:

- Character reference library
- Global style controls
- Multi-shot scene continuity
- Shot timeline assembly
- More advanced camera planning
- Model-agnostic generation routing
- Review, versioning, and regeneration workflows

## Security and IP Notes

This repository does not include:

- `.env` files
- API keys
- private credentials
- full proprietary prompts
- private orchestration logic
- provider-specific secrets
- internal roadmap documents

This version demonstrate capability without exposing the full product strategy.
