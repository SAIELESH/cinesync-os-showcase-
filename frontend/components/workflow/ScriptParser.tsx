"use client";

import { useState } from "react";
import { WandSparkles, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { parseScript, type Scene } from "@/lib/api";
import { cn } from "@/lib/utils";

type ScriptParserProps = {
  onScenesParsed: (scenes: Scene[]) => void;
};

export function ScriptParser({ onScenesParsed }: ScriptParserProps) {
  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!script.trim()) {
      setError("Please enter a script to parse");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseScript(script);
      if (result.scenes && result.scenes.length > 0) {
        onScenesParsed(result.scenes);
      } else {
        setError("Please enter a scene description or screenplay dialogue to extract shots.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to decompose screenplay into scenes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="spotlight p-6 lg:p-8">
      <div className="mb-6 space-y-3">
        <div className="text-sm uppercase tracking-[0.34em] text-slate-400">
          Step 1
        </div>
        <h1 className="font-[var(--font-sora)] text-3xl font-semibold text-white">
          Script to Scenes
        </h1>
        <p className="max-w-2xl text-slate-300">
          Paste your script or scene description below. Our AI will break it
          down into cinematic scenes with consistent characters and environments.
        </p>
      </div>

      <label className="block">
        <span className="mb-3 block text-sm font-medium text-white">
          Your Script
        </span>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={10}
          placeholder="INT. COFFEE SHOP - DAY&#10;&#10;A bustling coffee shop on a rainy afternoon. SARAH (28), a freelance writer, sits by the window with her laptop..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-mono text-white outline-none transition placeholder:text-slate-500 focus:border-accent/35"
        />
      </label>

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-rose/20 bg-rose/10 px-4 py-3 text-rose-200">
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="mt-6">
        <Button
          size="lg"
          className={cn("w-full gap-2", isLoading && "opacity-80")}
          onClick={handleParse}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Parsing Script...
            </>
          ) : (
            <>
              <WandSparkles className="size-4" />
              Parse Script into Scenes
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}