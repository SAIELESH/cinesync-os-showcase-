"use client";

import { useState } from "react";
import { Plus, Trash2, Clapperboard, Loader2 } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { generateShots, type Scene, type Shot } from "@/lib/api";
import { cn } from "@/lib/utils";

type SceneEditorProps = {
  scenes: Scene[];
  onScenesChange: (scenes: Scene[]) => void;
  onGenerateShots: (scene: Scene, shots: Shot[]) => void;
};

export function SceneEditor({
  scenes,
  onScenesChange,
  onGenerateShots,
}: SceneEditorProps) {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(
    scenes.length > 0 ? scenes[0].id : null
  );
  const [generatingShotFor, setGeneratingShotFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const updateScene = (field: keyof Scene, value: string) => {
    if (!selectedScene) return;
    const updatedScenes = scenes.map((s) =>
      s.id === selectedScene.id ? { ...s, [field]: value } : s
    );
    onScenesChange(updatedScenes);
  };

  const handleGenerateShots = async () => {
    if (!selectedScene) return;

    setGeneratingShotFor(selectedScene.id);
    setError(null);

    try {
      const result = await generateShots(selectedScene);
      onGenerateShots(selectedScene, result.shots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate shots");
    } finally {
      setGeneratingShotFor(null);
    }
  };

  if (scenes.length === 0) {
    return (
      <Card className="p-6 lg:p-8">
        <div className="text-center text-slate-400">
          <Clapperboard className="mx-auto mb-4 size-12 opacity-50" />
          <p>No scenes yet. Parse a script to get started.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="spotlight p-6 lg:p-8">
      <div className="mb-6 space-y-3">
        <div className="text-sm uppercase tracking-[0.34em] text-slate-400">
          Step 2
        </div>
        <h1 className="font-[var(--font-sora)] text-3xl font-semibold text-white">
          Edit Scenes
        </h1>
        <p className="max-w-2xl text-slate-300">
          Review and edit your parsed scenes. Customize characters, environments,
          and actions before generating shots.
        </p>
      </div>

      {/* Scene Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedSceneId(scene.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition",
              selectedSceneId === scene.id
                ? "bg-accent/20 text-white border border-accent/40"
                : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
            )}
          >
            Scene {scene.number}
          </button>
        ))}
      </div>

      {/* Scene Editor Form */}
      {selectedScene && (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Title
            </label>
            <input
              type="text"
              value={selectedScene.title}
              onChange={(e) => updateScene("title", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/35"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Environment
            </label>
            <textarea
              value={selectedScene.environment}
              onChange={(e) => updateScene("environment", e.target.value)}
              rows={2}
              placeholder="Location, time, atmosphere..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/35"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Character
            </label>
            <textarea
              value={selectedScene.character}
              onChange={(e) => updateScene("character", e.target.value)}
              rows={2}
              placeholder="Physical description, clothing, identity..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/35"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Mood
              </label>
              <input
                type="text"
                value={selectedScene.mood}
                onChange={(e) => updateScene("mood", e.target.value)}
                placeholder="Emotional tone..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/35"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Duration
              </label>
              <input
                type="text"
                value={selectedScene.duration || ""}
                onChange={(e) => updateScene("duration", e.target.value)}
                placeholder="e.g., 30s"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/35"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Action
            </label>
            <textarea
              value={selectedScene.action}
              onChange={(e) => updateScene("action", e.target.value)}
              rows={3}
              placeholder="What is happening visually..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/35"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose/20 bg-rose/10 px-4 py-3 text-rose-200">
              <Trash2 className="size-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button
            size="lg"
            className={cn("w-full gap-2", generatingShotFor && "opacity-80")}
            onClick={handleGenerateShots}
            disabled={generatingShotFor === selectedScene.id}
          >
            {generatingShotFor === selectedScene.id ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating Shots...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Generate Shots for This Scene
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}