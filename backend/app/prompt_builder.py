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

    character_context = (
        f"MAIN CHARACTER (STRICT IDENTITY LOCK):\n"
        f"{scene.get('character', 'consistent lead character with identical appearance across frames')}"
    )

    shot_context = (
        f"Shot type: {shot.get('type', 'medium shot')}\n"
        f"Lighting: {shot.get('lighting', 'cinematic lighting with natural contrast')}\n"
        f"Emotion: {shot.get('emotion', scene.get('mood', 'dramatic'))}"
    )

    camera_context = (
        f"Movement: {camera.get('movement', shot.get('camera_movement', 'static'))}\n"
        f"Lens: {camera.get('lens', shot.get('lens', '35mm'))}\n"
        f"Framing: {camera.get('framing', shot.get('framing', 'rule of thirds'))}"
    )

    reference_line = "REFERENCE IMAGE: Maintain exact character face, wardrobe, and location continuity from reference image." if use_reference else ""

    return f"""
Create a high-fidelity cinematic AI video shot.

SCENE CONTEXT
{scene_context}

CHARACTER DIRECTIVE
{character_context}

SHOT DESIGN
{shot_context}

CAMERA CONTROLS
{camera_context}

STYLE & CONTINUITY
Ultra realistic film look, cinematic lighting, accurate optical depth of field, film-grade color grading, natural motion blur.

{reference_line}
""".strip()
