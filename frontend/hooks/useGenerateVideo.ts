import { useEffect, useMemo, useState } from "react";

const loadingSteps = [
  "Generating shots...",
  "Applying consistency...",
  "Rendering video..."
];

export function useGenerateVideo() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (state !== "loading") {
      return;
    }

    setProgress(8);
    setActiveStepIndex(0);

    const startedAt = Date.now();
    const duration = 3600;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress < 35) {
        setActiveStepIndex(0);
      } else if (nextProgress < 72) {
        setActiveStepIndex(1);
      } else {
        setActiveStepIndex(2);
      }

      if (nextProgress >= 100) {
        window.clearInterval(timer);
        setState(prompt.trim().length > 0 ? "success" : "error");
      }
    }, 180);

    return () => window.clearInterval(timer);
  }, [prompt, state]);

  const activeStep = useMemo(() => loadingSteps[activeStepIndex], [activeStepIndex]);

  const generate = (value: string) => {
    setPrompt(value);
    setState("loading");
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setActiveStepIndex(0);
  };

  return {
    state,
    progress,
    activeStep,
    generate,
    reset
  };
}
