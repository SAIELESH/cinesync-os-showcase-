import { useState } from "react";
import { AppShell } from "@/components/global/layout/AppShell";
import { ScriptParser } from "@/components/workflow/ScriptParser";
import { SceneEditor } from "@/components/workflow/SceneEditor";
import { ShotConfiguration } from "@/components/workflow/ShotConfiguration";
import { Card } from "@/components/global/ui/Card";
import { TimelineScrubber, type TimelineShot } from "@/components/global/ui/TimelineScrubber";
import { checkVideoStatus } from "@/lib/api";
import type { Scene, Shot } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Sparkles, Film, ArrowRight, Download, CheckCircle2, AlertCircle } from "lucide-react";

type VideoStatus = "idle" | "processing" | "ready" | "error";

export default function WorkflowPage() {
  const { deductCredits } = useAuth();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentShots, setCurrentShots] = useState<Shot[]>([]);
  const [selectedShotId, setSelectedShotId] = useState<string>("");
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [taskId, setTaskId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleScenesParsed = (parsedScenes: Scene[]) => {
    setScenes(parsedScenes);
    if (parsedScenes.length > 0) {
      setCurrentScene(parsedScenes[0]);
    }
  };

  const handleScenesChange = (updatedScenes: Scene[]) => {
    setScenes(updatedScenes);
  };

  const handleGenerateShots = (scene: Scene, shots: Shot[]) => {
    setCurrentScene(scene);
    setCurrentShots(shots);
    if (shots.length > 0) {
      setSelectedShotId(shots[0].id);
    }
  };

  const handleVideoGenerated = async (generatedTaskId: string) => {
    setTaskId(generatedTaskId);
    setVideoStatus("processing");
    deductCredits(25);

    // Poll for video status
    const pollStatus = async () => {
      try {
        const status = await checkVideoStatus(generatedTaskId);

        if (status.status === "ready") {
          setVideoStatus("ready");
          if (status.video_url) {
            setVideoUrl(status.video_url);
          }
        } else if (status.status === "failed" || status.status === "error") {
          setVideoStatus("error");
        } else if (status.status === "processing") {
          setTimeout(pollStatus, 3000);
        }
      } catch (error) {
        setVideoStatus("error");
      }
    };

    setTimeout(pollStatus, 1500);
  };

  const timelineShots: TimelineShot[] = currentShots.map((s, idx) => ({
    id: s.id,
    name: s.type || `Shot ${idx + 1}`,
    duration: 4,
    lens: s.lens || "50mm Prime",
    movement: s.camera_movement || "Static",
    framing: s.framing || "Rule of Thirds"
  }));

  return (
    <AppShell navActionLabel="Dashboard" navActionHref="/dashboard">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
              <Film className="size-3.5" />
              <span>DIRECTOR WORKFLOW PIPELINE</span>
            </div>
            <h1 className="mt-3 font-sora text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Script-to-Video Coverage Engine
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-300">
              Break down screenplays with Claude 3.5 Sonnet, assign lens physics, and render multi-shot video clips with persistent character anchoring.
            </p>
          </div>

          {/* Progress Step Indicator */}
          <div className="mb-8 rounded-2xl border border-white/[0.08] bg-[#0B1017] p-4 sm:p-5 shadow-card-elevation">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: 1, label: "Parse Screenplay", done: scenes.length > 0 },
                { step: 2, label: "Scene Breakdown", done: scenes.length > 0 && currentShots.length > 0 },
                { step: 3, label: "Direct Shots & Lens", done: taskId !== "" || videoStatus !== "idle" },
                { step: 4, label: "Wan2.2 4K Export", done: videoStatus === "ready" },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                      item.done
                        ? "bg-accent text-background shadow-glow"
                        : "bg-white/5 text-slate-400 border border-white/10"
                    }`}
                  >
                    {item.done ? "✓" : `0${item.step}`}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-semibold leading-tight ${item.done ? "text-white" : "text-slate-400"}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {item.done ? "Completed" : `Step 0${item.step}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <ScriptParser onScenesParsed={handleScenesParsed} />

              {scenes.length > 0 && (
                <SceneEditor
                  scenes={scenes}
                  onScenesChange={handleScenesChange}
                  onGenerateShots={handleGenerateShots}
                />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {currentShots.length > 0 ? (
                <>
                  <TimelineScrubber
                    shots={timelineShots}
                    currentShotId={selectedShotId || currentShots[0]?.id}
                    onSelectShot={setSelectedShotId}
                  />

                  <ShotConfiguration
                    scene={currentScene}
                    shots={currentShots}
                    onVideoGenerated={handleVideoGenerated}
                  />
                </>
              ) : (
                <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[320px]">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 mb-3">
                    <Film className="size-6 text-accent" />
                  </div>
                  <h3 className="font-sora text-lg font-semibold text-white">
                    Awaiting Screenplay Input
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">
                    Paste your screenplay scene on the left to extract character keypoints, camera angles, and shot configurations.
                  </p>
                </Card>
              )}

              {/* Video Status / Result */}
              {videoStatus === "processing" && (
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 shadow-glow">
                  <div className="flex items-center gap-4">
                    <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <div>
                      <div className="font-sora text-sm font-semibold text-white">
                        Rendering Video on Wan2.2 Queue...
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        Task Identifier: {taskId}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {videoStatus === "ready" && (
                <div className="rounded-2xl border border-emerald/30 bg-[#0B1017] p-6 shadow-modal-elevation space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-emerald">
                        ● RENDER COMPLETE
                      </div>
                      <div className="mt-1 font-sora text-lg font-bold text-white">
                        {currentScene?.title || "Director Scene Blueprint"}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-mono text-emerald border border-emerald/30">
                      4K Export
                    </span>
                  </div>

                  {videoUrl ? (
                    <div>
                      <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full rounded-xl border border-white/10"
                      />
                      <a
                        href={videoUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition border border-white/10"
                      >
                        <Download className="size-4 text-accent" />
                        Download High-Definition MP4
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5">
                        <div className="text-[10px] font-mono uppercase text-slate-400">
                          DIRECTOR DIRECTIVE BLUEPRINT
                        </div>
                        <p><strong>Environment:</strong> {currentScene?.environment || "Cinematic Alley"}</p>
                        <p><strong>Character Lock:</strong> {currentScene?.character || "Protagonist"}</p>
                        <p><strong>Camera Trajectory:</strong> {currentScene?.action || "Slow push dolly"}</p>
                      </div>

                      <div className="rounded-xl border border-accent/25 bg-accent/10 p-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
                          <CheckCircle2 className="size-4 text-accent" />
                          Deterministic Shot Manifest Compiled
                        </div>
                        Add your SiliconFlow API Key via the BYOK button in the top navigation to trigger live diffusion renders.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {videoStatus === "error" && (
                <div className="rounded-2xl border border-rose/30 bg-rose/10 p-5 text-xs text-rose-200 flex items-start gap-3">
                  <AlertCircle className="size-5 shrink-0 text-rose" />
                  <div>
                    <div className="font-semibold text-white">Generation Alert</div>
                    <div className="mt-0.5">There was an issue processing the video request. Please verify your BYOK keys and retry.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}