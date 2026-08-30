"""Script-to-scene parser.

Supports:
1. Live dynamic parsing via Claude 3.5 Sonnet when ANTHROPIC_API_KEY is configured.
2. Robust local screenplay parser that properly handles sluglines (INT/EXT) without splitting abbreviations.
"""

from typing import Dict, List, Any
import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")


def _clean_json(text: str) -> str:
    text = re.sub(r"```json|```", "", text).strip()
    match = re.search(r"\[.*\]", text, re.DOTALL)
    return match.group(0) if match else text


def _split_screenplay_scenes(script: str) -> List[str]:
    # Match standard screenplay scene headings like INT., EXT., INT/EXT., SCENE
    pattern = r"(?=(?:^|\n)(?:INT\.|EXT\.|INT/EXT\.|SCENE\s*\d*))"
    chunks = re.split(pattern, script.strip(), flags=re.IGNORECASE)
    cleaned = [c.strip() for c in chunks if c.strip()]
    if not cleaned:
        # Fallback to paragraph splitting
        cleaned = [p.strip() for p in re.split(r"\n\s*\n", script.strip()) if p.strip()]
    return cleaned[:6]


def parse_script_to_scenes(script: str, api_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """Convert raw script text into structured cinematic scenes."""
    active_key = api_key or ANTHROPIC_KEY
    if active_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=active_key)
            prompt = f"""Break the following script into 3–6 cinematic scene units.
Return a valid JSON array only with no markdown formatting.
Each object must contain:
- title: concise scene title
- environment: location, lighting, atmosphere
- character: physical description and locked identity
- mood: emotional tone
- action: visual action occurring in the scene
- description: full visual summary

Script:
{script}"""
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1200,
                temperature=0.4,
                messages=[{"role": "user", "content": prompt}]
            )
            raw = _clean_json(response.content[0].text)
            parsed = json.loads(raw)
            if isinstance(parsed, list) and len(parsed) > 0:
                return [
                    {
                        "id": f"s{i+1}",
                        "number": str(i + 1).zfill(2),
                        "title": s.get("title", f"Scene {i+1}"),
                        "environment": s.get("environment", "Cinematic environment"),
                        "character": s.get("character", "Main character"),
                        "mood": s.get("mood", "Dramatic"),
                        "action": s.get("action", ""),
                        "description": s.get("description", s.get("action", ""))
                    }
                    for i, s in enumerate(parsed)
                ]
        except Exception as e:
            print("Anthropic parse error, falling back to local engine:", e)

    # Local deterministic parser
    chunks = _split_screenplay_scenes(script)
    if not chunks:
        chunks = [script[:300] or "A character enters a cinematic environment."]

    scenes = []
    for idx, chunk in enumerate(chunks, start=1):
        # Extract potential slugline or first line as title
        first_line = chunk.split("\n")[0].strip()
        title = first_line[:40] if len(first_line) > 3 else f"Scene {idx}"
        scenes.append({
            "id": f"s{idx}",
            "number": str(idx).zfill(2),
            "title": title,
            "environment": "Cinematic location derived from script",
            "character": "Main character in consistent wardrobe",
            "mood": "Cinematic and dramatic",
            "action": chunk[:250],
            "description": chunk[:350],
        })

    return scenes
