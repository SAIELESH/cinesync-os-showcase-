import { useState } from "react";
import { AppShell } from "@/components/global/layout/AppShell";
import { ScriptParser } from "@/components/workflow/ScriptParser";
import { SceneEditor } from "@/components/workflow/SceneEditor";
import { ShotConfiguration } from "@/components/workflow/ShotConfiguration";
import { Card } from "@/components/global/ui/Card";
import { checkVideoStatus } from "@/lib/api";
import type { Scene, Shot } from "@/lib/api";

type VideoStatus = "idle" | "processing" | "ready" | "error";

export default function WorkflowPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentShots, setCurrentShots] = useState<Shot[]>([]);
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
  };

  const handleVideoGenerated = async (generatedTaskId: string) => {
    setTaskId(generatedTaskId);
    setVideoStatus("processing");

    // Poll for video status
    const pollStatus = async () => {
      try {
        const status = await checkVideoStatus(generatedTaskId);

        if (status.status === "ready" && status.video_url) {
          setVideoStatus("ready");
          setVideoUrl(status.video_url);
        } else if (status.status === "failed" || status.status === "error") {
          setVideoStatus("error");
        } else if (status.status === "processing") {
          setTimeout(pollStatus, 3000); // Poll again in 3 seconds
        }
      } catch (error) {
        setVideoStatus("error");
      }
    };

    setTimeout(pollStatus, 3000); // Start polling after 3 seconds
  };

  return (
    <AppShell navActionLabel="Dashboard" navActionHref="/dashboard">
      <section className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.34em] text-slate-400">
              CineSync Workflow
            </div>
            <h1 className="mt-2 font-[var(--font-sora)] text-4xl font-semibold text-white">
              Script to Video
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Transform your script into cinematic video. Parse your script into scenes,
              generate shots, configure camera settings, and render your video.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-between">
            {[
              { step: 1, label: "Parse Script", done: scenes.length > 0 },
              { step: 2, label: "Edit Scenes", done: currentScene !== null },
              { step: 3, label: "Configure Shots", done: currentShots.length > 0 },
              { step: 4, label: "Generate Video", done: videoStatus === "ready" },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex items-center"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition ${
                    item.done
                      ? "bg-accent text-white"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {item.step}
                </div>
                <span
                  className={`ml-3 text-sm ${
                    item.done ? "text-white" : "text-slate-500"
                  } hidden md:block`}
                >
                  {item.label}
                </span>
                {index < 3 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 ${
                      item.done ? "bg-accent" : "bg-white/10"
                    } hidden md:block`}
                  />
                )}
              </div>
            ))}
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
                <ShotConfiguration
                  scene={currentScene}
                  shots={currentShots}
                  onVideoGenerated={handleVideoGenerated}
                />
              ) : (
                <Card className="p-6 lg:p-8">
                  <div className="text-center text-slate-400">
                    <p>Generate shots for a scene to configure and render video.</p>
                  </div>
                </Card>
              )}

              {/* Video Status / Result */}
              {videoStatus === "processing" && (
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 animate-spin rounded-full border-4 border-white/10 border-t-accent" />
                    <div>
                      <div className="font-medium text-white">Generating Video</div>
                      <div className="text-sm text-slate-400">
                        Task ID: {taskId}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {videoStatus === "ready" && videoUrl && (
                <Card className="gold-glow p-6">
                  <div className="mb-4">
                    <div className="text-sm uppercase tracking-[0.28em] text-emerald">
                      Success
                    </div>
                    <div className="mt-1 font-[var(--font-sora)] text-xl text-white">
                      Video Ready
                    </div>
                  </div>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-2xl"
                  />
                  <a
                    href={videoUrl}
                    download
                    className="mt-4 block text-center text-sm text-accent hover:underline"
                  >
                    Download Video
                  </a>
                </Card>
              )}

              {videoStatus === "error" && (
                <Card className="border-rose/20 bg-rose/10 p-6">
                  <div className="text-rose-200">
                    <div className="font-medium">Video Generation Failed</div>
                    <div className="mt-1 text-sm opacity-80">
                      There was an error generating your video. Please try again.
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}