import { useState, useCallback } from "react";

export function useShot() {
  const [shots, setShots] = useState([]);
  const [activeShotId, setActiveShotId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [camera, setCamera] = useState({
    lens: "natural",
    movement: "Static",
    framing: "1-1",
  });

  const generateShots = useCallback(async (scene) => {
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/generate-shots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scene }) // ✅ FIXED
      });

      const data = await res.json();
      setShots(data.shots || []);
      setActiveShotId(null);

    } catch (e) {
      console.error("Shot fetch error", e);
      setShots([]);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const updateShot = (id, updates) => {
    setShots((prev) =>
      prev.map((shot) =>
        shot.id === id ? { ...shot, ...updates } : shot
      )
    );
  };

  return {
    shots,
    generateShots,
    isGenerating,
    activeShotId,
    selectShot: setActiveShotId,
    updateShot,
    camera,
    setLens: (lens) => setCamera((p) => ({ ...p, lens })),
    setMovement: (m) => setCamera((p) => ({ ...p, movement: m })),
    setFraming: (f) => setCamera((p) => ({ ...p, framing: f })),
    isReady: activeShotId !== null,
  };
}