"""Prompt builder for public showcase.

This file shows how scene, shot, and camera controls are combined into a
structured video prompt. Keep advanced consistency logic private.
"""

from typing import Dict


def build_prompt(scene: Dict, shot: Dict, camera: Dict, use_reference: bool = False) -> str:
    scene_context = (
        f"Environment: {scene.get('environment', 'cinematic environment')}\n"
        f"Mood: {scene.get('mood', 'cinematic')}\n"
        f"Action: {scene.get('action', scene.get('description', ''))}"
    )

    shot_context = (
        f"Shot type: {shot.get('type', 'medium shot')}\n"
        f"Lighting: {shot.get('lighting', 'cinematic lighting')}\n"
        f"Emotion: {shot.get('emotion', 'dramatic')}"
    )

    camera_context = (
        f"Movement: {camera.get('movement', shot.get('camera_movement', 'static'))}\n"
        f"Lens: {camera.get('lens', shot.get('lens', '35mm'))}\n"
        f"Framing: {camera.get('framing', shot.get('framing', 'rule of thirds'))}"
    )

    reference_line = "Use the provided reference image as visual guidance." if use_reference else ""

    return f"""
Create a cinematic AI video shot.

SCENE
{scene_context}

SHOT DESIGN
{shot_context}

CAMERA
{camera_context}

STYLE
Realistic film look, controlled lighting, depth of field, natural motion, cinematic color grade.

{reference_line}
""".strip()
