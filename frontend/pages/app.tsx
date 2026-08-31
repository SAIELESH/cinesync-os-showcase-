import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import {
  CirclePlus,
  Clapperboard,
  Download,
  Film,
  RefreshCw,
  Sparkles,
  WandSparkles,
  Upload,
  Loader2,
  FileText,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ImprovePanelContent } from "@/components/director/ImprovePanelContent";
import { StatusPill } from "@/components/director/StatusPill";
import { AppShell } from "@/components/global/layout/AppShell";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { Modal } from "@/components/global/ui/Modal";
import { Slider } from "@/components/global/ui/Slider";
import { Tabs } from "@/components/global/ui/Tabs";
import { Toggle } from "@/components/global/ui/Toggle";
import { VideoPlayer } from "@/components/global/ui/VideoPlayer";
import { TimelineScrubber, type TimelineShot } from "@/components/global/ui/TimelineScrubber";
import { parseScript, generateShots, generateVideo, checkVideoStatus, uploadImage } from "@/lib/api";
import type { Scene as APIScene, Shot as APIShot } from "@/lib/api";
import { scenes, projects, type Scene } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { cn, formatCredits } from "@/lib/utils";

const lensOptions = ["Wide", "Natural", "Close"] as const;
const movementOptions = ["Static", "Dolly", "Tracking"] as const;
const framingOptions = ["Center", "Rule of Thirds", "Over Shoulder"] as const;
const improveOptions = ["More cinematic", "More emotional", "Change camera style", "Fix consistency"];
const regenerateOptions = ["More emotional", "Change camera angle", "Improve lighting", "Fix consistency"];

export default function DirectorModePage() {
  const router = useRouter();
  const { user, deductCredits } = useAuth();
  const [currentScenes, setCurrentScenes] = useState<Scene[]>(scenes);
  const [activeProjectName, setActiveProjectName] = useState<string>("CineSync Director Mode");
  const [autoMode, setAutoMode] = useState(true);
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0].id);
  const [selectedShotId, setSelectedShotId] = useState(scenes[0].shots[0].id);
  const [lens, setLens] = useState<(typeof lensOptions)[number]>("Natural");
  const [movement, setMovement] = useState<(typeof movementOptions)[number]>("Dolly");
  const [framing, setFraming] = useState<(typeof framingOptions)[number]>("Rule of Thirds");
  const [emotion, setEmotion] = useState(64);
  const [intensity, setIntensity] = useState(58);
  const [consistencyLocks, setConsistencyLocks] = useState({
    character: true,
    style: true,
    camera: false
  });
  const [regenerateFocus, setRegenerateFocus] = useState(regenerateOptions[0]);
  const [previewVersion, setPreviewVersion] = useState(1);
  const [improveOpen, setImproveOpen] = useState(false);
  const [improveSelection, setImproveSelection] = useState(improveOptions[0]);
  const [improveIntensity, setImproveIntensity] = useState(62);

  // Handle deep linking from /dashboard?project=id
  useEffect(() => {
    if (router.query.project) {
      const match = projects.find((p) => p.id === router.query.project);
      if (match) {
        setActiveProjectName(match.name);
      }
    }
  }, [router.query.project]);

  // Backend Integration State
  const [scriptPanelOpen, setScriptPanelOpen] = useState(false);
  const [scriptInput, setScriptInput] = useState("");
  const [isParsingScript, setIsParsingScript] = useState(false);
  const [parsedScenes, setParsedScenes] = useState<APIScene[]>([]);
  const [generatedShots, setGeneratedShots] = useState<APIShot[]>([]);
  const [isGeneratingShots, setIsGeneratingShots] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoTaskId, setVideoTaskId] = useState<string>("");
  const [videoStatus, setVideoStatus] = useState<"idle" | "processing" | "ready" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState("");
  const [useReferenceImage, setUseReferenceImage] = useState(false);
  const [referenceImagePath, setReferenceImagePath] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedScene = useMemo(
    () => currentScenes.find((scene) => scene.id === selectedSceneId) ?? currentScenes[0] ?? scenes[0],
    [currentScenes, selectedSceneId]
  );

  const selectedShot = useMemo(
    () => selectedScene.shots.find((shot) => shot.id === selectedShotId) ?? selectedScene.shots[0],
    [selectedScene, selectedShotId]
  );

  const previewStatuses = useMemo(
    () => [
      { label: "Character", status: consistencyLocks.character ? "Stable" : "Drift" },
      { label: "Lighting", status: "Stable" },
      { label: "Style", status: consistencyLocks.style ? "Stable" : "Drift" }
    ] as const,
    [consistencyLocks.character, consistencyLocks.style]
  );

  const handleSceneChange = (sceneId: string) => {
    setSelectedSceneId(sceneId);
    const nextScene = currentScenes.find((scene) => scene.id === sceneId) ?? currentScenes[0];
    if (nextScene && nextScene.shots.length > 0) {
      setSelectedShotId(nextScene.shots[0].id);
    }
    setPreviewVersion((current) => current + 1);
  };

  const handleShotSelect = (shotId: string) => {
    setSelectedShotId(shotId);
    setPreviewVersion((current) => current + 1);
  };

  const handleRegenerate = () => {
    setPreviewVersion((current) => current + 1);
    handleGenerateVideoWithBackend();
  };

  const updateLock = (key: keyof typeof consistencyLocks) => {
    setConsistencyLocks((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const timelineShots: TimelineShot[] = useMemo(
    () =>
      selectedScene.shots.map((s, idx) => ({
        id: s.id,
        name: s.name,
        duration: parseFloat(s.duration.replace("s", "")) || 4,
        lens: idx === 0 ? "35mm Prime" : idx === 1 ? "50mm Master" : "85mm Tele",
        movement: idx === 0 ? "Slow Dolly In" : idx === 1 ? "Tracking Pan" : "Micro Push In"
      })),
    [selectedScene.shots]
  );

  // Keyboard shortcut listener for Director ergonomics
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "1" && selectedScene.shots[0]) {
        handleShotSelect(selectedScene.shots[0].id);
      } else if (e.key === "2" && selectedScene.shots[1]) {
        handleShotSelect(selectedScene.shots[1].id);
      } else if (e.key === "3" && selectedScene.shots[2]) {
        handleShotSelect(selectedScene.shots[2].id);
      } else if (e.key.toLowerCase() === "m") {
        setAutoMode((prev) => !prev);
      } else if (e.key.toLowerCase() === "r" && !isGeneratingVideo) {
        handleRegenerate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRegenerate, isGeneratingVideo, selectedScene.shots]);

  // Backend API Handlers
  const handleParseScript = async () => {
    if (!scriptInput.trim()) return;
    
    setIsParsingScript(true);
    setApiError(null);
    
    try {
      const result = await parseScript(scriptInput);
      setParsedScenes(result.scenes);
      setScriptPanelOpen(false);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to parse script");
    } finally {
      setIsParsingScript(false);
    }
  };

  const handleGenerateShotsForScene = async (sceneIndex: number) => {
    if (sceneIndex >= parsedScenes.length) return;
    
    setIsGeneratingShots(true);
    setApiError(null);
    
    try {
      const result = await generateShots(parsedScenes[sceneIndex]);
      setGeneratedShots(result.shots);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to generate shots");
    } finally {
      setIsGeneratingShots(false);
    }
  };

  const handleApplyParsedScenes = () => {
    if (parsedScenes.length === 0) return;
    const formatted: Scene[] = parsedScenes.map((ps, idx) => ({
      id: ps.id || `scene-${idx + 1}`,
      title: ps.title || `Scene ${idx + 1}`,
      description: ps.description || ps.action || "",
      duration: ps.duration || "00:15",
      status: "Ready",
      shots:
        generatedShots.length > 0
          ? generatedShots.map((gs, sIdx) => ({
              id: gs.id || `shot-${sIdx + 1}`,
              name: gs.type || `Shot ${sIdx + 1}`,
              description: `${gs.camera_movement}, ${gs.lens}, ${gs.lighting}`,
              thumbnailLabel: gs.type,
              duration: "4s",
            }))
          : [
              {
                id: `shot-default-${idx + 1}`,
                name: "Wide Establishing",
                description: `${ps.environment} - ${ps.character}`,
                thumbnailLabel: "Establishing shot",
                duration: "4s",
              },
            ],
    }));

    setCurrentScenes(formatted);
    setSelectedSceneId(formatted[0].id);
    if (formatted[0].shots.length > 0) {
      setSelectedShotId(formatted[0].shots[0].id);
    }
    setParsedScenes([]);
    setGeneratedShots([]);
  };

  const handleGenerateVideoWithBackend = async () => {
    if (!selectedScene || !selectedShot) return;
    
    setIsGeneratingVideo(true);
    setVideoStatus("processing");
    setApiError(null);
    
    try {
      // Map frontend camera options to backend format
      const camera = {
        movement: movement.toLowerCase(),
        lens: lens === "Wide" ? "35mm" : lens === "Natural" ? "50mm" : "85mm",
        framing: framing.toLowerCase()
      };

      // Map selectedShot to backend Shot format
      const backendShot = {
        id: selectedShot.id,
        type: selectedShot.name,
        camera_movement: movement.toLowerCase(),
        lens: camera.lens,
        framing: camera.framing.toLowerCase(),
        lighting: "cinematic",
        emotion: "dramatic"
      };

      const result = await generateVideo({
        scene: {
          id: selectedScene.id,
          number: "01",
          title: selectedScene.title,
          environment: selectedScene.description || "cinematic environment",
          character: "main character",
          mood: "dramatic",
          action: selectedScene.description || "scene action",
          description: selectedScene.description || "",
          duration: selectedScene.duration
        },
        shot: backendShot,
        camera,
        image_path: useReferenceImage ? referenceImagePath : undefined,
        use_reference: useReferenceImage
      });

      setVideoTaskId(result.task_id);
      deductCredits(20);
      
      // Start polling for status
      pollVideoStatus(result.task_id);
    } catch (err) {
      setVideoStatus("error");
      setApiError(err instanceof Error ? err.message : "Failed to generate video");
      setIsGeneratingVideo(false);
    }
  };

  const pollVideoStatus = async (taskId: string) => {
    try {
      const status = await checkVideoStatus(taskId);

      if (status.status === "ready") {
        setVideoStatus("ready");
        if (status.video_url) {
          setVideoUrl(status.video_url);
        }
        setIsGeneratingVideo(false);
      } else if (status.status === "failed" || status.status === "error") {
        setVideoStatus("error");
        setApiError(status.error || "Video generation failed");
        setIsGeneratingVideo(false);
      } else if (status.status === "processing") {
        setTimeout(() => pollVideoStatus(taskId), 2500);
      }
    } catch (err) {
      setVideoStatus("error");
      setApiError("Failed to check video status");
      setIsGeneratingVideo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      setReferenceImagePath(result.file_path);
      setUseReferenceImage(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to upload image");
    }
  };

  return (
    <AppShell navActionLabel="Dashboard" navActionHref="/dashboard">
      <section className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <Card className="spotlight mb-6 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/5 p-3 text-accent">
                <Clapperboard className="size-6" />
              </div>
              <div>
                <div className="font-[var(--font-sora)] text-2xl font-semibold text-white">{activeProjectName}</div>
                <div className="text-sm text-slate-400">Direct scenes with cinematic consistency controls and shot-level regeneration.</div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Toggle checked={autoMode} label={`Auto Mode ${autoMode ? "ON" : "OFF"}`} onChange={setAutoMode} />
              <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white">
                {formatCredits(user.credits)}
              </div>
            </div>
          </Card>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {[
              ["Active scene", `${String(currentScenes.length).padStart(2, "0")} live sequences`],
              ["Locked identity", "Character + style preserved"],
              ["Shot edits", "Selective regeneration only"]
            ].map(([label, value]) => (
              <Card key={label} className="p-4">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</div>
                <div className="mt-2 font-[var(--font-sora)] text-xl text-white">{value}</div>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1.1fr)_420px]">
            <Card className="spotlight h-fit p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Scenes</div>
                  <div className="mt-1 font-[var(--font-sora)] text-xl text-white">Sequence Stack</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={() => setScriptPanelOpen(true)}
                >
                  <FileText className="size-4" />
                  Parse Script
                </Button>
              </div>
              <div className="space-y-3">
                {currentScenes.map((scene) => {
                  const active = scene.id === selectedScene.id;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleSceneChange(scene.id)}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition",
                        active
                          ? "border-accent/35 bg-accent/10 shadow-glow"
                          : "border-white/8 bg-white/5 hover:border-white/15 hover:bg-white/8"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white">{scene.title}</div>
                        <span className="text-xs uppercase tracking-[0.22em] text-slate-400">{scene.duration}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{scene.description}</p>
                      <div className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">{scene.status}</div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="space-y-6">
              <TimelineScrubber
                shots={timelineShots}
                currentShotId={selectedShot.id}
                onSelectShot={handleShotSelect}
              />

              <Card className="gold-glow p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Shots</div>
                    <div className="mt-1 font-[var(--font-sora)] text-xl text-white">Suggested coverage</div>
                  </div>
                  <div className="text-sm text-slate-400">Click a shot to update preview</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedScene.shots.map((shot) => {
                    const active = shot.id === selectedShot.id;

                    return (
                      <button
                        key={shot.id}
                        type="button"
                        onClick={() => handleShotSelect(shot.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition flex flex-col justify-between",
                          active
                            ? "border-accent/35 bg-accent/10 shadow-glow"
                            : "border-white/8 bg-white/5 hover:border-white/15 hover:bg-white/8"
                        )}
                      >
                        <div>
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-400 font-mono">{shot.duration}</div>
                          <div className="mt-1.5 font-medium text-white text-sm sm:text-base leading-snug">{shot.name}</div>
                          <p className="mt-2 text-xs text-slate-300 leading-relaxed break-words">{shot.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {!autoMode ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card className="p-5">
                    <div className="mb-4 font-[var(--font-sora)] text-xl text-white">Camera Controls</div>
                    <div className="space-y-5">
                      <div>
                        <div className="mb-3 text-sm font-medium text-white">Lens</div>
                        <Tabs items={[...lensOptions]} value={lens} onChange={setLens} />
                      </div>
                      <div>
                        <div className="mb-3 text-sm font-medium text-white">Movement</div>
                        <Tabs items={[...movementOptions]} value={movement} onChange={setMovement} />
                      </div>
                      <div>
                        <div className="mb-3 text-sm font-medium text-white">Framing</div>
                        <Tabs items={[...framingOptions]} value={framing} onChange={setFraming} />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5">
                    <Slider
                      label="Emotion"
                      value={emotion}
                      onChange={setEmotion}
                      markers={["Low", "Medium", "High"]}
                    />
                  </Card>

                  <Card className="p-5">
                    <div className="mb-4 font-[var(--font-sora)] text-xl text-white">Consistency Locks</div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        ["character", "Lock Character"],
                        ["style", "Lock Style"],
                        ["camera", "Lock Camera"]
                      ].map(([key, label]) => {
                        const typedKey = key as keyof typeof consistencyLocks;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => updateLock(typedKey)}
                            className={cn(
                              "rounded-2xl border p-4 text-left transition",
                              consistencyLocks[typedKey]
                                ? "border-accent/35 bg-accent/10 text-white shadow-glow"
                                : "border-white/8 bg-white/5 text-slate-300 hover:border-white/15"
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-[var(--font-sora)] text-xl text-white">Auto Mode is simplifying controls</div>
                      <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        CineSync is choosing camera language, framing, and consistency defaults automatically so you can direct outcomes instead of configuring them.
                      </p>
                    </div>
                    <div className="rounded-full bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-accent">
                      Auto ON
                    </div>
                  </div>
                </Card>
              )}

              <Card className="gold-glow p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-[var(--font-sora)] text-xl text-white">Regenerate Panel</div>
                    <p className="mt-1 text-sm text-slate-400">Update only the selected shot while preserving scene continuity.</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => setImproveOpen(true)}>
                    <Sparkles className="size-4" />
                    Improve modal
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {regenerateOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRegenerateFocus(option)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition",
                        option === regenerateFocus
                          ? "border-accent/35 bg-accent/10 text-white shadow-glow"
                          : "border-white/8 bg-white/5 text-slate-300 hover:border-white/15"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="mt-5">
                  <Slider
                    label="Intensity"
                    value={intensity}
                    onChange={setIntensity}
                    markers={["Subtle", "Balanced", "Strong"]}
                  />
                </div>

                {/* Reference Image Upload */}
                <div className="mt-5 rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Reference Image</span>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={useReferenceImage}
                        onChange={(e) => setUseReferenceImage(e.target.checked)}
                        className="rounded border-white/20 bg-white/10"
                      />
                      Use for generation
                    </label>
                  </div>
                  {useReferenceImage ? (
                    <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 py-4 transition hover:border-accent/40 hover:bg-white/5">
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 size-5 text-slate-400" />
                        <span className="text-xs text-slate-300">
                          {referenceImagePath ? "Change image" : "Upload reference image"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : null}
                  {referenceImagePath && (
                    <div className="mt-2 text-xs text-slate-400">
                      Uploaded: {referenceImagePath.split('/').pop()}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button className="gap-2" onClick={handleRegenerate}>
                    <RefreshCw className="size-4" />
                    Regenerate
                  </Button>
                  <Button variant="secondary" onClick={() => setImproveOpen(true)}>
                    Open Improve Panel
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Preview</div>
                    <div className="mt-1 font-[var(--font-sora)] text-xl text-white">
                      {selectedShot.name} · v{previewVersion}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                    Live shot
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedShot.id}-${previewVersion}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.26 }}
                  >
                    <VideoPlayer
                      animated={false}
                      title={selectedShot.thumbnailLabel}
                      subtitle={`${selectedShot.description} Lens ${lens.toLowerCase()}, ${movement.toLowerCase()} movement, ${framing.toLowerCase()} framing.`}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="mt-5 space-y-3">
                  {previewStatuses.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      <div className="text-sm text-slate-200">
                        {item.label}: <span className="text-slate-400">{item.status}</span>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button variant="secondary" className="gap-2" onClick={handleRegenerate}>
                    <WandSparkles className="size-4" />
                    Fix Consistency
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => {
                      if (videoUrl) {
                        window.open(videoUrl, "_blank");
                      } else {
                        showNotification("Shot blueprint compiled and validated. Add your SiliconFlow API Key via the BYOK button in the top navigation to render and download live MP4 videos.");
                      }
                    }}
                  >
                    <Download className="size-4" />
                    Download Shot
                  </Button>
                </div>
              </Card>

              <Card className="p-5">
                <div className="mb-4 font-[var(--font-sora)] text-xl text-white">Consistency Status</div>
                <div className="grid gap-3">
                  {[
                    `Character: ${consistencyLocks.character ? "Stable (Locked)" : "Drift Risk (Unlocked)"}`,
                    `Lighting: ${consistencyLocks.camera ? "Directional Lock Active" : "Adaptive Match"}`,
                    `Style: ${consistencyLocks.style ? "Preset Bound (Locked)" : "Free Variation"}`
                  ].map((status) => (
                    <div key={status} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300">
                      {status}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Timeline</div>
                  <div className="mt-1 font-[var(--font-sora)] text-xl text-white">Scene Output</div>
                </div>
                <div className="text-sm text-slate-400">Shot order is editable and export-aware</div>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedScene.shots.map((shot, index) => (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={() => handleShotSelect(shot.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm transition",
                      selectedShot.id === shot.id
                        ? "border-accent/35 bg-accent/10 text-white shadow-glow"
                        : "border-white/8 bg-white/5 text-slate-300 hover:border-white/15"
                    )}
                  >
                    Shot {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={handleGenerateVideoWithBackend}
                  disabled={isGeneratingVideo}
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generating AI Video...
                    </>
                  ) : (
                    <>
                      <Film className="size-4" />
                      Generate AI Shot
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    if (videoUrl) {
                      window.open(videoUrl, "_blank");
                    } else {
                      showNotification("Shot blueprint compiled and validated. Add your SiliconFlow API Key via the BYOK button in the top navigation to render and download live MP4 videos.");
                    }
                  }}
                >
                  <Download className="size-4" />
                  Download Shot
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Full Scene Preview</div>
                  <div className="mt-1 font-[var(--font-sora)] text-xl text-white">{selectedScene.title}</div>
                </div>
                <div className="rounded-full bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold">
                  Export ready
                </div>
              </div>
              <VideoPlayer
                title={`${selectedScene.title} assembly`}
                subtitle={selectedScene.description}
                aspect="wide"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Script Parser Modal */}
      <Modal
        open={scriptPanelOpen}
        onClose={() => setScriptPanelOpen(false)}
        title="Parse Script into Scenes"
        description="Enter your script below and our AI will break it into cinematic scenes with consistent characters."
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Your Script</span>
            <textarea
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              rows={8}
              placeholder="INT. COFFEE SHOP - DAY&#10;&#10;A bustling coffee shop on a rainy afternoon. SARAH (28), a freelance writer, sits by the window with her laptop..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-accent/35 font-mono text-sm"
            />
          </label>

          {apiError && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose/20 bg-rose/10 px-4 py-3 text-rose-200">
              <span className="text-sm">{apiError}</span>
            </div>
          )}

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleParseScript}
            disabled={isParsingScript || !scriptInput.trim()}
          >
            {isParsingScript ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Parsing Script...
              </>
            ) : (
              <>
                <FileText className="size-4" />
                Parse Script
              </>
            )}
          </Button>
        </div>
      </Modal>

      {/* Parsed Scenes Modal */}
      <Modal
        open={parsedScenes.length > 0 && !scriptPanelOpen}
        onClose={() => { setParsedScenes([]); setGeneratedShots([]); }}
        title="Parsed Scenes"
        description="Your script has been broken into scenes. Generate shots for any scene."
      >
        <div className="space-y-4">
          {parsedScenes.map((scene, index) => (
            <Card key={scene.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-white">Scene {scene.number}: {scene.title}</div>
                  <div className="mt-2 text-sm text-slate-300">{scene.description}</div>
                  <div className="mt-2 text-xs text-slate-400">
                    <span className="mr-4">Character: {scene.character}</span>
                    <span>Mood: {scene.mood}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="ml-4 shrink-0"
                  onClick={() => handleGenerateShotsForScene(index)}
                  disabled={isGeneratingShots}
                >
                  {isGeneratingShots ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Film className="size-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}

          {generatedShots.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 text-sm font-medium text-white">Generated Shots:</div>
              <div className="grid gap-2 md:grid-cols-2">
                {generatedShots.map((shot) => (
                  <div key={shot.id} className="rounded-xl bg-white/5 px-4 py-3 text-sm">
                    <div className="font-medium text-white">{shot.type}</div>
                    <div className="text-xs text-slate-400">
                      {shot.camera_movement} · {shot.lens} · {shot.framing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1 gap-2"
              onClick={handleApplyParsedScenes}
            >
              <Check className="size-4" />
              Apply to Director Studio Workspace
            </Button>
            <Button
              variant="secondary"
              onClick={() => { setParsedScenes([]); setGeneratedShots([]); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Video Generation Status Modal */}
      <Modal
        open={videoStatus === "processing" || videoStatus === "ready"}
        onClose={() => setVideoStatus("idle")}
        title={videoStatus === "ready" ? (videoUrl ? "Live AI Video Ready!" : "Cinematic Blueprint Compiled!") : "Generating Video"}
        description={videoStatus === "ready" ? (videoUrl ? "Your video has been generated successfully." : "Your shot parameters and prompt directives have been compiled.") : "Please wait while your video is being generated."}
      >
        <div className="space-y-4">
          {videoStatus === "processing" && (
            <div className="flex flex-col items-center py-8">
              <div className="size-16 animate-spin rounded-full border-4 border-white/10 border-t-accent" />
              <div className="mt-4 text-sm text-slate-400">Task ID: {videoTaskId}</div>
            </div>
          )}

          {videoStatus === "ready" && (
            <div className="space-y-4">
              {videoUrl ? (
                <>
                  <video src={videoUrl} controls autoPlay className="w-full rounded-2xl" />
                  <a
                    href={videoUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-sm font-medium text-accent hover:underline"
                  >
                    Download Video MP4
                  </a>
                </>
              ) : (
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 space-y-2">
                  <div className="text-sm font-semibold text-white">
                    🔑 Cinematic Blueprint Ready for Rendering
                  </div>
                  <p className="text-xs text-slate-300">
                    Camera: <strong>{movement}</strong> motion with <strong>{lens}</strong> lens and <strong>{framing}</strong> framing.
                  </p>
                  <p className="text-xs text-slate-400">
                    To render live AI video with Wan-AI (Wan2.2), add your SiliconFlow API Key via the <strong>Add BYOK Key</strong> button in the top navigation.
                  </p>
                </div>
              )}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setVideoStatus("idle")}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={improveOpen}
        onClose={() => setImproveOpen(false)}
        title="Improve your video"
        description="Push the current video toward a new creative direction while keeping the directing workflow visual and prompt-free."
      >
        <ImprovePanelContent
          options={improveOptions}
          selected={improveSelection}
          intensity={improveIntensity}
          onSelect={setImproveSelection}
          onIntensityChange={setImproveIntensity}
          onRegenerate={() => {
            setImproveOpen(false);
            setRegenerateFocus(improveSelection === "Change camera style" ? "Change camera angle" : improveSelection);
            setIntensity(improveIntensity);
            handleRegenerate();
          }}
        />
      </Modal>

      {/* Floating In-App Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl border border-accent/40 bg-[#0c121c]/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-accent/20 p-2 text-accent">
                <Sparkles className="size-4" />
              </div>
              <div className="flex-1 text-sm text-slate-200">
                {toastMessage}
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
