"""Scene-to-shot generator for public showcase."""

from typing import Dict, List


def generate_shots(scene: Dict) -> List[Dict[str, str]]:
    """Create a basic shot list for a scene.

    This public-safe version demonstrates the structure without exposing
    private prompt templates or advanced shot logic.
    """
    mood = scene.get("mood", "cinematic")

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
