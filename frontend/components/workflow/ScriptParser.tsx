"use client";

import { useState } from "react";
import { WandSparkles, AlertCircle, Loader2, FileText, Key, Check } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { parseScript, type Scene } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ScriptParserProps = {
  onScenesParsed: (scenes: Scene[]) => void;
};

export function ScriptParser({ onScenesParsed }: ScriptParserProps) {
  const { user } = useAuth();
  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasAnthropicKey = Boolean(user.anthropicKey);

  const handleOpenByok = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-byok-modal"));
    }
  };

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
    <Card className="spotlight p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Step 1 · Scene Decomposition
          </div>
          <h1 className="font-sora text-2xl sm:text-3xl font-bold text-white">
            Screenplay to Cinematic Scenes
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-300">
            Paste your screenplay text or narrative beat below to extract structured scenes with consistent character and environment anchors.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="shrink-0">
          {hasAnthropicKey ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs font-mono text-emerald">
              <Check className="size-3.5" />
              <span>Claude 3.5 Sonnet NLP Active</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300">
              <FileText className="size-3.5" />
              <span>Deterministic Parser (0ms · Free)</span>
            </div>
          )}
        </div>
      </div>

      {/* Parser Mode Explanation Strip */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <strong className="text-white">Parsing Engine: </strong>
          {hasAnthropicKey
            ? "Using your personal Anthropic API key to analyze narrative subtext and emotional dynamics."
            : "Running fast deterministic syntax decomposition (Fountain/Final Draft headings: INT./EXT.)."}
        </div>
        {!hasAnthropicKey && (
          <button
            type="button"
            onClick={handleOpenByok}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline shrink-0"
          >
            <Key className="size-3" />
            Enable Claude 3.5 via BYOK
          </button>
        )}
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Screenplay Text or Story Beat
        </span>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={9}
          placeholder="INT. RAIN-SLICKED ALLEY - NIGHT&#10;&#10;A lone detective pauses beneath flickering neon..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-mono text-white outline-none transition placeholder:text-slate-500 focus:border-accent"
        />
      </label>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose/20 bg-rose/10 px-4 py-3 text-rose-200 text-xs">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <Button
          size="lg"
          className={cn("w-full gap-2 font-bold shadow-glow", isLoading && "opacity-80")}
          onClick={handleParse}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Extracting Scenes...
            </>
          ) : (
            <>
              <WandSparkles className="size-4" />
              Decompose into Production Scenes
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}