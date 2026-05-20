"""Script-to-scene parser.

Public-safe implementation:
- Uses a local deterministic parser by default.
- Optionally supports LLM-backed parsing via environment variables.
- Does not expose private prompts or production orchestration logic.
"""

from typing import Dict, List
import re


def _split_script(script: str) -> List[str]:
    chunks = re.split(r"\n\s*\n|(?<=\.)\s+(?=[A-Z])", script.strip())
    return [chunk.strip() for chunk in chunks if chunk.strip()][:6]


def parse_script_to_scenes(script: str) -> List[Dict[str, str]]:
    """Convert raw script text into simplified scene objects.

    This deterministic version keeps the public repo easy to run without API keys.
    Replace with an LLM provider in private/production builds.
    """
    chunks = _split_script(script)

    if not chunks:
        chunks = [script[:300] or "A character enters a cinematic environment."]

    scenes = []
    for idx, chunk in enumerate(chunks, start=1):
        scenes.append(
            {
                "id": f"s{idx}",
                "number": str(idx).zfill(2),
                "title": f"Scene {idx}",
                "environment": "cinematic location derived from script context",
                "character": "main character from script",
                "mood": "dramatic and cinematic",
                "action": chunk[:240],
                "description": chunk[:300],
            }
        )

    return scenes
