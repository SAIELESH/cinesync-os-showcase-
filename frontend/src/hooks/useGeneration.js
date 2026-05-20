import { useState, useCallback } from "react";

const POLL_INTERVAL = 5000;
const MAX_POLLS = 120;

export function useGeneration() {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);

  const generate = useCallback(async (scene, shot, camera, imagePath, useReference) => {
    if (!scene || !shot) return;

    setStatus("loading");
    setProgress(10);
    setVideoUrl(null);

    try {
      const response = await fetch("http://localhost:5000/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scene,
          shot,
          camera,
          image_path: imagePath, // ✅ FIXED
          use_reference: useReference
        })
      });

      const data = await response.json();
      const id = data.task_id;

      let pollCount = 0;

      while (pollCount < MAX_POLLS) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
        pollCount++;

        const res = await fetch(`http://localhost:5000/video-status/${id}`);
        const statusData = await res.json();

        if (statusData.status === "ready") {
          setVideoUrl(statusData.video_url);
          setProgress(100);
          setStatus("done");
          return;
        }

        setProgress((prev) => Math.min(prev + 5, 95));
      }

    } catch (e) {
      console.error(e);
      setStatus("idle");
    }
  }, []);

  return { status, progress, videoUrl, generate };
}