"""Scene-to-shot generator.

Supports:
1. Live dynamic shot generation via Claude 3.5 Sonnet when ANTHROPIC_API_KEY is configured.
2. Context-aware local cinematography planner tailoring focal lengths, lighting, and camera movement.
"""

from typing import Dict, List, Any
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")


def _clean_json(text: str) -> str:
    text = re.sub(r"```json|```", "", text).strip()
    match = re.search(r"\[.*\]", text, re.DOTALL)
    return match.group(0) if match else text


def generate_shots(scene: Dict) -> List[Dict[str, Any]]:
    """Create a context-aware cinematography shot list for a scene."""
    if ANTHROPIC_KEY:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
            prompt = f"""You are a master cinematographer.
Generate 3 to 4 varied cinematic shots for this scene.
Return a valid JSON array only.
Each shot must have:
- id: e.g. "sh1"
- type: e.g. "Wide Establishing", "Medium Shot", "Close-up", "Tracking Shot", "Over-the-Shoulder"
- camera_movement: e.g. "slow dolly in", "tracking right", "handheld subtle float", "static"
- lens: e.g. "24mm", "35mm", "50mm", "85mm", "100mm"
- framing: e.g. "rule of thirds", "centered", "tight close", "dutch angle"
- lighting: cinematic lighting description matching environment
- emotion: mood/intensity conveyed

Scene details:
Title: {scene.get('title')}
Environment: {scene.get('environment')}
Character: {scene.get('character')}
Mood: {scene.get('mood')}
Action: {scene.get('action')}"""

            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                temperature=0.5,
                messages=[{"role": "user", "content": prompt}]
            )
            raw = _clean_json(response.content[0].text)
            parsed = json.loads(raw)
            if isinstance(parsed, list) and len(parsed) > 0:
                return parsed
        except Exception as e:
            print("Anthropic shot generation error, falling back to local engine:", e)

    # Dynamic local cinematography rules
    action_text = (scene.get("action", "") + " " + scene.get("description", "")).lower()
    mood = scene.get("mood", "cinematic and tense")

    is_action = any(w in action_text for w in ["run", "walk", "flee", "fight", "drive", "step", "move", "chase", "door"])
    is_dialogue = any(w in action_text for w in ["talk", "speak", "whisper", "look", "stare", "say", "sit", "think"])

    if is_action:
        return [
            {
                "id": "sh1",
                "type": "Wide Establishing Shot",
                "camera_movement": "dynamic dolly tracking",
                "lens": "24mm",
                "framing": "wide dynamic perspective",
                "lighting": "atmospheric key lighting with directional spill",
                "emotion": f"urgent {mood}",
            },
            {
                "id": "sh2",
                "type": "Tracking Medium",
                "camera_movement": "fast tracking with subtle handheld momentum",
                "lens": "35mm",
                "framing": "rule of thirds subject lead",
                "lighting": "high contrast edge lighting",
                "emotion": f"focused {mood}",
            },
            {
                "id": "sh3",
                "type": "Action Close-up",
                "camera_movement": "intense push-in",
                "lens": "85mm",
                "framing": "tight action framing",
                "lighting": "dramatic specular highlights with shallow depth of field",
                "emotion": "high intensity",
            }
        ]

    if is_dialogue:
        return [
            {
                "id": "sh1",
                "type": "Medium Two-Shot / Over Shoulder",
                "camera_movement": "gentle slow dolly in",
                "lens": "50mm",
                "framing": "over the shoulder composition",
                "lighting": "soft motivated key light with natural eye reflections",
                "emotion": f"intimate {mood}",
            },
            {
                "id": "sh2",
                "type": "Subject Coverage",
                "camera_movement": "static with gentle breath-like drift",
                "lens": "50mm",
                "framing": "centered portrait balance",
                "lighting": "subtle fill and warm rim light",
                "emotion": f"reflective {mood}",
            },
            {
                "id": "sh3",
                "type": "Emotional Extreme Close-up",
                "camera_movement": "static locked",
                "lens": "85mm",
                "framing": "tight eye-line focus",
                "lighting": "sculpted chiaroscuro shadows",
                "emotion": f"raw {mood}",
            }
        ]

    # Default balanced cinematic coverage
    return [
        {
            "id": "sh1",
            "type": "Wide Establishing Shot",
            "camera_movement": "slow dolly in",
            "lens": "35mm",
            "framing": "rule of thirds",
            "lighting": "soft cinematic key light with atmospheric depth",
            "emotion": mood,
        },
        {
            "id": "sh2",
            "type": "Medium Shot",
            "camera_movement": "gentle push in",
            "lens": "50mm",
            "framing": "centered subject framing",
            "lighting": "controlled contrast with motivated practical light",
            "emotion": "focused and intimate",
        },
        {
            "id": "sh3",
            "type": "Close-up",
            "camera_movement": "static with subtle handheld realism",
            "lens": "85mm",
            "framing": "tight emotional framing",
            "lighting": "dramatic shadows with shallow depth of field",
            "emotion": "high emotional intensity",
        },
    ]
