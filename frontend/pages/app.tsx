import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import {
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
  Camera,
  Layers,
  Sliders,
  Sparkle
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
import { scenes as defaultScenes, projects, type Scene, type Shot } from "@/lib/data";
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
  const [currentScenes, setCurrentScenes] = useState<Scene[]>(defaultScenes);
  const [activeProjectName, setActiveProjectName] = useState<string>("CineSync Director Mode");
  const [autoMode, setAutoMode] = useState(true);
  const [selectedSceneId, setSelectedSceneId] = useState(defaultScenes[0].id);
  const [selectedShotId, setSelectedShotId] = useState(defaultScenes[0].shots[0].id);
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

  const isMountedRef = useRef(true);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  // Handle deep linking from /dashboard?project=id
  useEffect(() => {
    if (router.query.project) {
      const match = projects.find((p) => p.id === router.query.project);
      if (match) {
        setActiveProjectName(match.name);
      }
    }
  }, [router.query.project]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      if (isMountedRef.current) {
        setToastMessage(null);
      }
    }, 4000);
  };

  const selectedScene = useMemo(
    () => currentScenes.find((scene) => scene.id === selectedSceneId) ?? currentScenes[0] ?? defaultScenes[0],
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

  // Sync shot camera parameters when selectedShot changes
  const handleShotSelect = useCallback((shotId: string) => {
    setSelectedShotId(shotId);
    const shot = selectedScene.shots.find((s) => s.id === shotId);
    if (shot) {
      const desc = `${shot.name} ${shot.description}`.toLowerCase();
      if (desc.includes("wide") || desc.includes("35mm") || desc.includes("establishing")) {
        setLens("Wide");
      } else if (desc.includes("close") || desc.includes("85mm") || desc.includes("portrait")) {
        setLens("Close");
      } else {
        setLens("Natural");
      }

      if (desc.includes("dolly")) {
        setMovement("Dolly");
      } else if (desc.includes("tracking") || desc.includes("pan")) {
        setMovement("Tracking");
      } else {
        setMovement("Static");
      }
    }
  }, [selectedScene.shots]);

  const handleSceneChange = (sceneId: string) => {
    setSelectedSceneId(sceneId);
    const nextScene = currentScenes.find((scene) => scene.id === sceneId) ?? currentScenes[0];
    if (nextScene && nextScene.shots.length > 0) {
      handleShotSelect(nextScene.shots[0].id);
    }
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

  // Global hotkey listener with strict modal and input safety
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputActive =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";
      const isModalOpen = scriptPanelOpen || improveOpen || parsedScenes.length > 0;

      if (isInputActive || isModalOpen) {
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
  }, [handleShotSelect, improveOpen, isGeneratingVideo, parsedScenes.length, scriptPanelOpen, selectedScene.shots]);

  // Backend API Handlers
  const handleParseScript = async () => {
    if (!scriptInput.trim()) return;

    setIsParsingScript(true);
    setApiError(null);

    try {
      const result = await parseScript(scriptInput);
      if (isMountedRef.current) {
        setParsedScenes(result.scenes);
        setScriptPanelOpen(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setApiError(err instanceof Error ? err.message : "Failed to parse script");
      }
    } finally {
      if (isMountedRef.current) {
        setIsParsingScript(false);
      }
    }
  };

  const handleGenerateShotsForScene = async (sceneIndex: number) => {
    if (sceneIndex >= parsedScenes.length) return;

    setIsGeneratingShots(true);
    setApiError(null);

    try {
      const result = await generateShots(parsedScenes[sceneIndex]);
      if (isMountedRef.current) {
        setGeneratedShots(result.shots);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setApiError(err instanceof Error ? err.message : "Failed to generate shots");
      }
    } finally {
      if (isMountedRef.current) {
        setIsGeneratingShots(false);
      }
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
      handleShotSelect(formatted[0].shots[0].id);
    }
    setParsedScenes([]);
    setGeneratedShots([]);
    showNotification("Parsed scenes loaded into Director Workspace.");
  };

  const pollVideoStatus = useCallback(async (taskId: string) => {
    if (!isMountedRef.current) return;

    try {
      const status = await checkVideoStatus(taskId);
      if (!isMountedRef.current) return;

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
        pollTimerRef.current = setTimeout(() => pollVideoStatus(taskId), 2500);
      }
    } catch {
      if (isMountedRef.current) {
        setVideoStatus("error");
        setApiError("Failed to check video status");
        setIsGeneratingVideo(false);
      }
    }
  }, []);

  const handleGenerateVideoWithBackend = async () => {
    if (!selectedScene || !selectedShot) return;

    setIsGeneratingVideo(true);
    setVideoStatus("processing");
    setApiError(null);
    setPreviewVersion((c) => c + 1);

    try {
      const camera = {
        movement: movement.toLowerCase(),
        lens: lens === "Wide" ? "35mm" : lens === "Natural" ? "50mm" : "85mm",
        framing: framing.toLowerCase()
      };

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

      if (isMountedRef.current) {
        setVideoTaskId(result.task_id);
        deductCredits(20);
        pollVideoStatus(result.task_id);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setVideoStatus("error");
        setApiError(err instanceof Error ? err.message : "Failed to generate video");
        setIsGeneratingVideo(false);
      }
    }
  };

  const handleRegenerate = () => {
    handleGenerateVideoWithBackend();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      if (isMountedRef.current) {
        setReferenceImagePath(result.file_path);
        setUseReferenceImage(true);
        showNotification("Reference anchor image uploaded.");
      }
    } catch (err) {
      if (isMountedRef.current) {
        setApiError(err instanceof Error ? err.message : "Failed to upload image");
      }
    }
  };

  return (
    <AppShell navActionLabel="Dashboard" navActionHref="/dashboard">
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          {/* Top Bar Header */}
          <Card className="spotlight mb-6 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <Clapperboard className="size-5" />
              </div>
              <div>
                <div className="font-sora text-xl sm:text-2xl font-bold text-white">{activeProjectName}</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Direct scenes with persistent multi-shot character anchors and precision optics.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Toggle
                checked={autoMode}
                label={`Auto AI Director ${autoMode ? "ON" : "OFF"}`}
                onChange={setAutoMode}
              />
              <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs text-white flex items-center gap-1.5">
                <span className="text-gold">●</span> {formatCredits(user.credits)}
              </div>
            </div>
          </Card>

          {/* Quick Metrics Bar */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Active sequence stack", `${String(currentScenes.length).padStart(2, "0")} Scenes loaded`],
              ["Anchor continuity", "Character + Lighting locked"],
              ["Coverage mode", autoMode ? "AI Director Orchestrated" : "Full Manual Control"]
            ].map(([label, value]) => (
              <Card key={label} className="p-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">{label}</div>
                <div className="mt-1 font-sora text-base sm:text-lg font-semibold text-white truncate">{value}</div>
              </Card>
            ))}
          </div>

          {/* Main 3-Column Studio Layout */}
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_380px] xl:grid-cols-[280px_minmax(0,1.1fr)_420px]">
            {/* Left Column: Sequence Stack */}
            <Card className="spotlight h-fit p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Scenes</div>
                  <div className="font-sora text-lg font-bold text-white">Sequence Stack</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setScriptPanelOpen(true)}
                >
                  <FileText className="size-3.5" />
                  Parse Script
                </Button>
              </div>

              <div className="space-y-2.5">
                {currentScenes.map((scene, idx) => {
                  const active = scene.id === selectedScene.id;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleSceneChange(scene.id)}
                      className={cn(
                        "w-full rounded-2xl border p-3.5 text-left transition",
                        active
                          ? "border-accent bg-accent/15 shadow-glow"
                          : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">
                          0{idx + 1}. {scene.title}
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{scene.duration}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-2">{scene.description}</p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{scene.shots.length} Shots</span>
                        <span className="text-emerald">● {scene.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Middle Column: Unified Timeline & Director Controls */}
            <div className="space-y-6">
              {/* Primary Authoritative Timeline Scrubber */}
              <TimelineScrubber
                shots={timelineShots}
                currentShotId={selectedShot.id}
                onSelectShot={handleShotSelect}
              />

              {/* Suggested Coverage Grid */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Shot Coverage
                    </div>
                    <div className="font-sora text-lg font-bold text-white">
                      {selectedScene.title} Coverage
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">Click to direct shot</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedScene.shots.map((shot, sIdx) => {
                    const active = shot.id === selectedShot.id;

                    return (
                      <button
                        key={shot.id}
                        type="button"
                        onClick={() => handleShotSelect(shot.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition flex flex-col justify-between",
                          active
                            ? "border-accent bg-accent/15 shadow-glow"
                            : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/5"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>SHOT 0{sIdx + 1}</span>
                            <span>{shot.duration}</span>
                          </div>
                          <div className="mt-1.5 font-medium text-white text-sm leading-snug">
                            {shot.name}
                          </div>
                          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed break-words">
                            {shot.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Camera & Directing Controls (Layout Stable) */}
              <Card className="p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="size-4 text-accent" />
                    <h3 className="font-sora text-lg font-bold text-white">Camera Optics & Physics</h3>
                  </div>
                  {autoMode && (
                    <span className="rounded-full bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-[10px] font-mono text-accent">
                      AI Auto-Selected
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Lens Focal Length
                    </div>
                    <Tabs items={[...lensOptions]} value={lens} onChange={setLens} />
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Camera Trajectory
                    </div>
                    <Tabs items={[...movementOptions]} value={movement} onChange={setMovement} />
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Framing Geometry
                    </div>
                    <Tabs items={[...framingOptions]} value={framing} onChange={setFraming} />
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Actor Emotion Intensity
                    </div>
                    <Slider label="Emotion" value={emotion} onChange={setEmotion} />
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Continuity Locks
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
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
                              "rounded-xl border p-3 text-xs font-medium text-center transition",
                              consistencyLocks[typedKey]
                                ? "border-accent bg-accent/15 text-white shadow-glow"
                                : "border-white/8 bg-white/5 text-slate-400 hover:border-white/15"
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shot Regeneration & Reference Anchor */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Shot Tuning
                    </div>
                    <div className="font-sora text-lg font-bold text-white">Regenerate Shot Only</div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gold" onClick={() => setImproveOpen(true)}>
                    <Sparkles className="size-3.5" />
                    Creative Directions
                  </Button>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {regenerateOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRegenerateFocus(option)}
                      className={cn(
                        "rounded-xl border p-3 text-left text-xs font-medium transition",
                        option === regenerateFocus
                          ? "border-accent bg-accent/15 text-white shadow-glow"
                          : "border-white/8 bg-white/5 text-slate-300 hover:border-white/15"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Reference Image Upload Anchor */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">Visual Character Anchor</span>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useReferenceImage}
                        onChange={(e) => setUseReferenceImage(e.target.checked)}
                        className="rounded border-white/20 bg-white/10"
                      />
                      Lock to Reference
                    </label>
                  </div>
                  {useReferenceImage && (
                    <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 py-3 transition hover:border-accent/40 hover:bg-white/5 mt-2">
                      <div className="text-center">
                        <Upload className="mx-auto mb-1 size-4 text-slate-400" />
                        <span className="text-xs text-slate-300">
                          {referenceImagePath ? "Change anchor image" : "Upload PNG/JPG portrait"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleRegenerate}
                    disabled={isGeneratingVideo}
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Rendering...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="size-4" />
                        Regenerate Shot Cut
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column: Live Viewport & Continuity Monitor */}
            <div className="space-y-6">
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Viewport
                    </div>
                    <div className="font-sora text-lg font-bold text-white truncate">
                      {selectedShot.name} · v{previewVersion}
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald">
                    ● ACTIVE SHOT
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedShot.id}-${previewVersion}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VideoPlayer
                      animated={false}
                      title={selectedShot.thumbnailLabel}
                      subtitle={`${selectedShot.description} Directed on ${lens.toLowerCase()} lens, ${movement.toLowerCase()} motion, ${framing.toLowerCase()} framing.`}
                      focalLength={lens === "Wide" ? "35mm Prime" : lens === "Close" ? "85mm Tele" : "50mm Master"}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Continuity Status Monitors */}
                <div className="space-y-2 pt-2">
                  {previewStatuses.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-xs"
                    >
                      <div className="text-slate-200">
                        {item.label}: <span className="text-slate-400">{item.status}</span>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center gap-1.5"
                    onClick={handleRegenerate}
                    disabled={isGeneratingVideo}
                  >
                    <WandSparkles className="size-4" />
                    Fix Consistency
                  </Button>
                  <Button
                    size="sm"
                    className="w-full justify-center gap-1.5"
                    onClick={() => {
                      if (videoUrl) {
                        window.open(videoUrl, "_blank");
                      } else {
                        showNotification("Shot blueprint validated. Add SiliconFlow BYOK key to trigger direct MP4 download.");
                      }
                    }}
                  >
                    <Download className="size-4" />
                    Download Shot
                  </Button>
                </div>
              </Card>

              {/* Consistency Lock Report */}
              <Card className="p-5 space-y-3">
                <div className="font-sora text-sm font-bold text-white">Continuity Rules Engine</div>
                <div className="space-y-2 text-xs">
                  {[
                    `Character Lock: ${consistencyLocks.character ? "Face + Clothes Anchored" : "Free Seed"}`,
                    `Lighting Profile: ${consistencyLocks.camera ? "Fixed Directional Key" : "Adaptive Match"}`,
                    `Color Grading: ${consistencyLocks.style ? "Preset Color Palette Bound" : "Open Variation"}`
                  ].map((status) => (
                    <div key={status} className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-slate-300">
                      {status}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Script Parser Modal */}
      <Modal
        open={scriptPanelOpen}
        onClose={() => setScriptPanelOpen(false)}
        title="Parse Script into Scenes"
        description="Enter your screenplay text below. Claude 3.5 Sonnet will decompose it into structured scene coverage."
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Screenplay Text</span>
            <textarea
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              rows={8}
              placeholder="EXT. RAIN-SLICKED ALLEY - NIGHT&#10;&#10;A lone detective pauses beneath flickering neon..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-accent font-mono text-sm"
            />
          </label>

          {apiError && (
            <div className="flex items-center gap-3 rounded-xl border border-rose/20 bg-rose/10 px-4 py-3 text-rose-200 text-xs">
              <span>{apiError}</span>
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
                Decomposing Screenplay...
              </>
            ) : (
              <>
                <FileText className="size-4" />
                Decompose Screenplay
              </>
            )}
          </Button>
        </div>
      </Modal>

      {/* Parsed Scenes Workspace Import Modal */}
      <Modal
        open={parsedScenes.length > 0 && !scriptPanelOpen}
        onClose={() => { setParsedScenes([]); setGeneratedShots([]); }}
        title="Screenplay Decomposed"
        description="Review extracted scenes before applying to your Director Studio."
      >
        <div className="space-y-4">
          {parsedScenes.map((scene, index) => (
            <Card key={scene.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-white">Scene {scene.number}: {scene.title}</div>
                  <div className="mt-1 text-xs text-slate-300">{scene.description}</div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">
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
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold text-white">Generated Shot Coverage:</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {generatedShots.map((shot) => (
                  <div key={shot.id} className="rounded-xl bg-white/5 p-3 text-xs">
                    <div className="font-semibold text-white">{shot.type}</div>
                    <div className="text-slate-400 mt-0.5">
                      {shot.camera_movement} · {shot.lens} · {shot.framing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5 sm:flex-row pt-2">
            <Button
              className="flex-1 gap-2"
              onClick={handleApplyParsedScenes}
            >
              <Check className="size-4" />
              Apply to Studio Workspace
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

      {/* Video Generation Result Modal */}
      <Modal
        open={videoStatus === "processing" || videoStatus === "ready"}
        onClose={() => setVideoStatus("idle")}
        title={videoStatus === "ready" ? (videoUrl ? "Live AI Video Ready!" : "Cinematic Blueprint Compiled!") : "Rendering on Wan2.2"}
        description={videoStatus === "ready" ? (videoUrl ? "Your video has been rendered successfully." : "Shot parameters and prompt directives have been compiled.") : "Please wait while your video is being generated."}
      >
        <div className="space-y-4">
          {videoStatus === "processing" && (
            <div className="flex flex-col items-center py-6">
              <div className="size-12 animate-spin rounded-full border-4 border-white/10 border-t-accent" />
              <div className="mt-4 text-xs font-mono text-slate-400">Task Identifier: {videoTaskId}</div>
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
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 space-y-2 text-xs">
                  <div className="text-sm font-semibold text-white">
                    🔑 Ready for Live AI Video Rendering
                  </div>
                  <p className="text-slate-300">
                    Camera: <strong>{movement}</strong> motion with <strong>{lens}</strong> lens and <strong>{framing}</strong> framing.
                  </p>
                  <p className="text-slate-400">
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

      {/* Creative Improve Modal */}
      <Modal
        open={improveOpen}
        onClose={() => setImproveOpen(false)}
        title="Direct Creative Direction"
        description="Shift camera style, emotional tone, or lighting without re-prompting from scratch."
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
              <div className="flex-1 text-xs text-slate-200">
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
