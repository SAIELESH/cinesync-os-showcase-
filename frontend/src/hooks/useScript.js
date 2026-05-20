import { useState, useCallback } from "react";
import { DEFAULT_SCRIPT } from "../constants/data";

export function useScript() {
  const [scriptText, setScriptText] = useState(DEFAULT_SCRIPT);
  const [scenes, setScenes] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [error, setError] = useState(null);

  // Format + normalize scenes
  const formatScenes = (scenesList) =>
    scenesList.map((scene, index) => ({
      id: scene.id || `s${index + 1}-${Date.now()}`,
      number: String(index + 1).padStart(2, "0"),
      title: scene.title || `Scene ${index + 1}`,
      description: scene.description || "No description",
    }));

  // 🔥 REAL parsing
  const parseScript = useCallback(async () => {
    if (!scriptText.trim()) return;

    setIsParsing(true);
    setActiveSceneId(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/parse-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script: scriptText }),
      });

      if (!res.ok) throw new Error("Failed to parse script");

      const data = await res.json();

      if (!data.scenes || !Array.isArray(data.scenes)) {
        throw new Error("Invalid response");
      }

      const formatted = formatScenes(data.scenes);

      setScenes(formatted);
      setActiveSceneId(formatted[0]?.id || null);

    } catch (err) {
      console.error(err);
      setError("Failed to generate scenes");
      setScenes([]);
    } finally {
      setIsParsing(false);
    }
  }, [scriptText]);

  // ➕ Add
  const addScene = useCallback(() => {
    setScenes((prev) => {
      const updated = [
        ...prev,
        {
          id: `s${prev.length + 1}-${Date.now()}`,
          title: "New Scene",
          description: "Describe your scene...",
        },
      ];
      return formatScenes(updated);
    });
  }, []);

  // ✏️ Update
  const updateScene = useCallback((id, updates) => {
    setScenes((prev) => {
      const updated = prev.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      );
      return formatScenes(updated);
    });
  }, []);

  // ❌ Delete
  const deleteScene = useCallback((id) => {
    setScenes((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (id === activeSceneId) {
        setActiveSceneId(filtered[0]?.id || null);
      }
      return formatScenes(filtered);
    });
  }, [activeSceneId]);

  const activeScene =
    scenes.find((s) => s.id === activeSceneId) ?? null;

  return {
    scriptText,
    setScriptText,
    scenes,
    isParsing,
    parseScript,
    activeSceneId,
    setActiveSceneId,
    activeScene,
    error,
    addScene,
    updateScene,
    deleteScene,
  };
}