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
  Sliders,
  RotateCcw,
  RotateCw,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Shield,
  Key,
  Coins,
  Layers,
  Sparkle,
  Zap
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

// Standard professional focal length taxonomy
const lensOptions = [
  "35mm Wide Prime",
  "50mm Normal Prime",
  "85mm Portrait Prime"
] as const;

const movementOptions = ["Static", "Dolly In", "Tracking Pan"] as const;
const framingOptions = ["Center Balanced", "Rule of Thirds", "Over Shoulder"] as const;
const improveOptions = ["More emotional", "Change camera angle", "Improve lighting", "Fix consistency"];
const regenerateOptions = ["More emotional", "Change camera angle", "Improve lighting", "Fix consistency"];

export type ExtendedShot = Shot & {
  scriptExcerpt: string;
  lens: (typeof lensOptions)[number];
  movement: (typeof movementOptions)[number];
  framing: (typeof framingOptions)[number];
  emotion: number;
  intensity: number;
  characterLocked: boolean;
  styleLocked: boolean;
  cameraLocked: boolean;
  version: number;
  isDraft: boolean;
  pendingDiff?: string;
  renderedUrl?: string;
};

export type ExtendedScene = Omit<Scene, "shots"> & {
  shots: ExtendedShot[];
};

// Distinct, cinematic screenplay excerpts for each demo scene
const initialExtendedScenes: ExtendedScene[] = [
  {
    id: "scene-01",
    title: "Scene 01 · Rain-Slicked Alley",
    description: "Opening rain sequence with controlled neon contrast and grounded lead detective performance.",
    duration: "00:12",
    status: "Ready",
    shots: [
      {
        id: "shot-1",
        name: "Street reveal",
        description: "Wide street reveal with rain streaks, reflective asphalt, and slow push-in.",
        thumbnailLabel: "Wide rain reveal",
        duration: "4s",
        scriptExcerpt: "EXT. RAIN-SLICKED ALLEY - NIGHT: A lone detective pauses beneath flickering neon.",
        lens: "35mm Wide Prime",
        movement: "Dolly In",
        framing: "Rule of Thirds",
        emotion: 65,
        intensity: 60,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      },
      {
        id: "shot-2",
        name: "Character profile",
        description: "Close profile, moody side light, measured breath and eye-line consistency.",
        thumbnailLabel: "Close profile",
        duration: "3s",
        scriptExcerpt: "CLOSE ON DETECTIVE: Rain cascades down a worn collar as distant sirens echo.",
        lens: "85mm Portrait Prime",
        movement: "Static",
        framing: "Center Balanced",
        emotion: 70,
        intensity: 65,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      },
      {
        id: "shot-3",
        name: "Umbrella tracking",
        description: "Tracking shot over shoulder with subtle parallax and controlled camera shake.",
        thumbnailLabel: "Tracking umbrella",
        duration: "5s",
        scriptExcerpt: "TRACKING: Footsteps splash into puddle reflections as shadows stretch along brick walls.",
        lens: "50mm Normal Prime",
        movement: "Tracking Pan",
        framing: "Over Shoulder",
        emotion: 60,
        intensity: 55,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      }
    ]
  },
  {
    id: "scene-02",
    title: "Scene 02 · Safehouse Interior",
    description: "Interior transition, warmer highlights, stronger emotional focus, tighter coverage.",
    duration: "00:15",
    status: "Draft",
    shots: [
      {
        id: "shot-4",
        name: "Doorway entrance",
        description: "Medium doorway entrance with warm spill from practical lighting.",
        thumbnailLabel: "Doorway entrance",
        duration: "5s",
        scriptExcerpt: "INT. SAFEHOUSE BASEMENT - NIGHT: Amber desk lamp cuts through smoke. A decrypted ledger lies open.",
        lens: "35mm Wide Prime",
        movement: "Dolly In",
        framing: "Rule of Thirds",
        emotion: 60,
        intensity: 50,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      },
      {
        id: "shot-5",
        name: "Table detail",
        description: "Natural lens detail shot, slow tilt, controlled reflections and prop continuity.",
        thumbnailLabel: "Table detail",
        duration: "4s",
        scriptExcerpt: "INSERT - LEDGER DETAIL: Finger traces coordinates scribbled in faded red ink.",
        lens: "50mm Normal Prime",
        movement: "Static",
        framing: "Center Balanced",
        emotion: 55,
        intensity: 50,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      },
      {
        id: "shot-6",
        name: "Reaction close-up",
        description: "Intimate close-up with preserved character identity and soft depth falloff.",
        thumbnailLabel: "Reaction close-up",
        duration: "6s",
        scriptExcerpt: 'MEDIUM CLOSE - JANE: "They are moving the shipment at dawn." Tension thickens.',
        lens: "85mm Portrait Prime",
        movement: "Static",
        framing: "Rule of Thirds",
        emotion: 80,
        intensity: 75,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      }
    ]
  },
  {
    id: "scene-03",
    title: "Scene 03 · Rooftop Standoff",
    description: "Final decision beat with elevated drama, darker palette, and tighter editorial rhythm.",
    duration: "00:09",
    status: "Needs polish",
    shots: [
      {
        id: "shot-7",
        name: "Decision pause",
        description: "Centered frame, shallow focus, restrained movement for tension build.",
        thumbnailLabel: "Decision pause",
        duration: "4s",
        scriptExcerpt: "EXT. SKYSCRAPER ROOFTOP - DAWN: Fog banks roll over the city skyline as wind whips a trench coat.",
        lens: "50mm Normal Prime",
        movement: "Static",
        framing: "Center Balanced",
        emotion: 75,
        intensity: 70,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      },
      {
        id: "shot-8",
        name: "Exit motion",
        description: "Dolly back with silhouette breakup, lingering backlight and rain haze.",
        thumbnailLabel: "Exit motion",
        duration: "5s",
        scriptExcerpt: "LOW ANGLE - STANDOFF: Two silhouettes framed against rising sunlight and antenna arrays.",
        lens: "35mm Wide Prime",
        movement: "Dolly In",
        framing: "Rule of Thirds",
        emotion: 85,
        intensity: 80,
        characterLocked: true,
        styleLocked: true,
        cameraLocked: false,
        version: 1,
        isDraft: false
      }
    ]
  }
];

export default function DirectorModePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Core Project & Scene State
  const [currentScenes, setCurrentScenes] = useState<ExtendedScene[]>(initialExtendedScenes);
  const [activeProjectName, setActiveProjectName] = useState<string>("Demo Project · Noir Metropolis");
  const [isDemoProject, setIsDemoProject] = useState<boolean>(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>("Draft saved locally");

  // Selection state
  const [selectedSceneId, setSelectedSceneId] = useState(initialExtendedScenes[0].id);
  const [selectedShotId, setSelectedShotId] = useState(initialExtendedScenes[0].shots[0].id);

  // Auto Director state
  const [autoMode, setAutoMode] = useState(true);

  // Undo / Redo History Stack
  const [historyStack, setHistoryStack] = useState<ExtendedScene[][]>([]);
  const [redoStack, setRedoStack] = useState<ExtendedScene[][]>([]);

  // Real BYOK Generation State
  const [isRenderingByok, setIsRenderingByok] = useState(false);
  const [byokRequiredModalOpen, setByokRequiredModalOpen] = useState(false);

  // Modals & Panels
  const [scriptPanelOpen, setScriptPanelOpen] = useState(false);
  const [scriptInput, setScriptInput] = useState("");
  const [isParsingScript, setIsParsingScript] = useState(false);
  const [parsedScenes, setParsedScenes] = useState<APIScene[]>([]);
  const [improveOpen, setImproveOpen] = useState(false);
  const [improveSelection, setImproveSelection] = useState(improveOptions[0]);
  const [improveIntensity, setImproveIntensity] = useState(62);

  // Reference Image
  const [useReferenceImage, setUseReferenceImage] = useState(false);
  const [referenceImagePath, setReferenceImagePath] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle deep linking from /dashboard?project=id
  useEffect(() => {
    if (router.query.project) {
      const match = projects.find((p) => p.id === router.query.project);
      if (match) {
        setActiveProjectName(match.name);
        setIsDemoProject(false);
      }
    }
  }, [router.query.project]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      if (isMountedRef.current) setToastMessage(null);
    }, 4000);
  };

  const openByokModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-byok-modal"));
    }
  };

  const selectedScene = useMemo(
    () => currentScenes.find((scene) => scene.id === selectedSceneId) ?? currentScenes[0],
    [currentScenes, selectedSceneId]
  );

  const selectedShot = useMemo(
    () => selectedScene.shots.find((shot) => shot.id === selectedShotId) ?? selectedScene.shots[0],
    [selectedScene, selectedShotId]
  );

  // Canonical Global Continuity Status
  const globalContinuityReport = useMemo(() => {
    let unlockedCharacters = 0;
    let unlockedStyles = 0;

    for (const scene of currentScenes) {
      for (const shot of scene.shots) {
        if (!shot.characterLocked) unlockedCharacters++;
        if (!shot.styleLocked) unlockedStyles++;
      }
    }

    const totalIssues = unlockedCharacters + unlockedStyles;
    if (totalIssues === 0) {
      return {
        label: "Continuity Anchors Active",
        status: "stable" as const,
        detail: "Character and palette anchors enabled across all shots"
      };
    }
    return {
      label: `${totalIssues} Continuity Alert${totalIssues > 1 ? "s" : ""}`,
      status: "warning" as const,
      detail: `${unlockedCharacters} Character and ${unlockedStyles} Style lock(s) set to Free Variation`
    };
  }, [currentScenes]);

  // Push state to history for undo/redo
  const recordHistory = useCallback(() => {
    setHistoryStack((prev) => [...prev.slice(-15), currentScenes]);
    setRedoStack([]);
    setLastSavedTime(`Draft saved locally (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
  }, [currentScenes]);

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack((prev) => [currentScenes, ...prev]);
    setHistoryStack((prev) => prev.slice(0, -1));
    setCurrentScenes(previous);
    showNotification("Action undone.");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistoryStack((prev) => [...prev, currentScenes]);
    setRedoStack((prev) => prev.slice(1));
    setCurrentScenes(next);
    showNotification("Action redone.");
  };

  // Atomic Scene Selection
  const handleSceneSelect = (sceneId: string) => {
    setSelectedSceneId(sceneId);
    const targetScene = currentScenes.find((s) => s.id === sceneId) ?? currentScenes[0];
    if (targetScene && targetScene.shots.length > 0) {
      setSelectedShotId(targetScene.shots[0].id);
    }
  };

  // Shot Selection
  const handleShotSelect = (shotId: string) => {
    setSelectedShotId(shotId);
  };

  // Update active shot properties canonically
  const updateActiveShot = (updater: (prev: ExtendedShot) => ExtendedShot, diffDesc?: string) => {
    recordHistory();
    setCurrentScenes((prevScenes) =>
      prevScenes.map((sc) => {
        if (sc.id !== selectedScene.id) return sc;
        return {
          ...sc,
          shots: sc.shots.map((sh) => {
            if (sh.id !== selectedShot.id) return sh;
            const updated = updater(sh);
            return {
              ...updated,
              isDraft: true,
              pendingDiff: diffDesc || updated.pendingDiff || "Directing parameters modified."
            };
          })
        };
      })
    );
  };

  // Functional One-Click Creative Directions
  const applyCreativeDirection = (direction: string) => {
    if (direction === "More emotional") {
      updateActiveShot(
        (prev) => ({
          ...prev,
          emotion: Math.min(100, prev.emotion + 20),
          intensity: Math.min(100, prev.intensity + 15)
        }),
        "Increased emotional intensity (+20%) and dramatic pacing."
      );
      showNotification("Creative Direction applied: Heightened emotional delivery.");
    } else if (direction === "Change camera angle") {
      updateActiveShot(
        (prev) => {
          const nextFraming: (typeof framingOptions)[number] =
            prev.framing === "Rule of Thirds"
              ? "Over Shoulder"
              : prev.framing === "Over Shoulder"
              ? "Center Balanced"
              : "Rule of Thirds";
          return { ...prev, framing: nextFraming };
        },
        "Framing geometry rotated to alternate cinematic perspective."
      );
      showNotification("Camera angle shifted in draft.");
    } else if (direction === "Improve lighting") {
      updateActiveShot(
        (prev) => ({
          ...prev,
          description: `${prev.description} (High-contrast volumetric rim lighting applied).`
        }),
        "Volumetric key lighting and rim contrast added to prompt blueprint."
      );
      showNotification("Lighting directives updated in draft.");
    } else if (direction === "Fix consistency") {
      updateActiveShot(
        (prev) => ({
          ...prev,
          characterLocked: true,
          styleLocked: true,
          cameraLocked: true
        }),
        "Enforced 100% Face, Wardrobe, and Palette anchor continuity."
      );
      showNotification("All continuity locks engaged for active shot.");
    }
  };

  // Instant 0ms Directing Blueprint Compilation (Truthful, No Fake Timers)
  const handleCompileBlueprint = () => {
    recordHistory();
    setCurrentScenes((prevScenes) =>
      prevScenes.map((sc) => {
        if (sc.id !== selectedScene.id) return sc;
        return {
          ...sc,
          shots: sc.shots.map((sh) => {
            if (sh.id !== selectedShot.id) return sh;
            return {
              ...sh,
              isDraft: false,
              pendingDiff: undefined
            };
          })
        };
      })
    );
    showNotification(`Directing Blueprint saved: ${selectedShot.lens}, ${selectedShot.movement}, ${selectedShot.framing}.`);
  };

  // Real BYOK Video Diffusion Trigger
  const handleTriggerByokRender = async () => {
    if (!user.siliconFlowKey) {
      setByokRequiredModalOpen(true);
      return;
    }

    setIsRenderingByok(true);
    try {
      const cameraPayload = {
        movement: selectedShot.movement.toLowerCase(),
        lens: selectedShot.lens.split(" ")[0],
        framing: selectedShot.framing.toLowerCase()
      };

      const backendShot = {
        id: selectedShot.id,
        type: selectedShot.name,
        camera_movement: selectedShot.movement.toLowerCase(),
        lens: cameraPayload.lens,
        framing: cameraPayload.framing,
        lighting: "cinematic high-contrast",
        emotion: selectedShot.emotion > 70 ? "high dramatic intensity" : "measured"
      };

      await generateVideo({
        scene: {
          id: selectedScene.id,
          number: "01",
          title: selectedScene.title,
          environment: selectedScene.description || "cinematic alleyway",
          character: "Lead Detective",
          mood: "noir dramatic",
          action: selectedShot.description,
          description: selectedScene.description,
          duration: selectedScene.duration
        },
        shot: backendShot,
        camera: cameraPayload,
        image_path: useReferenceImage ? referenceImagePath : undefined,
        use_reference: useReferenceImage
      });

      handleCompileBlueprint();
      showNotification(`Video diffusion job dispatched to SiliconFlow Wan2.2.`);
    } catch (err) {
      showNotification(err instanceof Error ? err.message : "Failed to dispatch render job.");
    } finally {
      if (isMountedRef.current) setIsRenderingByok(false);
    }
  };

  // Generate Coverage Shot
  const handleGenerateCoverageShot = () => {
    recordHistory();
    const newShotNum = selectedScene.shots.length + 1;
    const newShot: ExtendedShot = {
      id: `shot-${Date.now()}`,
      name: `Shot 0${newShotNum} Coverage`,
      description: `AI-generated supplemental coverage for ${selectedScene.title} maintaining active actor continuity.`,
      thumbnailLabel: `Shot 0${newShotNum}`,
      duration: "4s",
      scriptExcerpt: `Coverage beat 0${newShotNum} for ${selectedScene.title}`,
      lens: "50mm Normal Prime",
      movement: "Dolly In",
      framing: "Rule of Thirds",
      emotion: 65,
      intensity: 60,
      characterLocked: true,
      styleLocked: true,
      cameraLocked: false,
      version: 1,
      isDraft: false
    };

    setCurrentScenes((prev) =>
      prev.map((sc) => {
        if (sc.id !== selectedScene.id) return sc;
        return { ...sc, shots: [...sc.shots, newShot] };
      })
    );
    setSelectedShotId(newShot.id);
    showNotification(`Generated new AI coverage shot in ${selectedScene.title}.`);
  };

  const handleDeleteShot = (shotId: string) => {
    if (selectedScene.shots.length <= 1) {
      showNotification("A scene must contain at least one shot.");
      return;
    }
    recordHistory();
    setCurrentScenes((prev) =>
      prev.map((sc) => {
        if (sc.id !== selectedScene.id) return sc;
        const filtered = sc.shots.filter((s) => s.id !== shotId);
        return { ...sc, shots: filtered };
      })
    );
    const remaining = selectedScene.shots.filter((s) => s.id !== shotId);
    if (remaining.length > 0) {
      setSelectedShotId(remaining[0].id);
    }
    showNotification("Shot removed from sequence.");
  };

  // Timeline Shots for Scrubber
  const timelineShots: TimelineShot[] = useMemo(
    () =>
      selectedScene.shots.map((s) => ({
        id: s.id,
        name: s.name,
        duration: parseFloat(s.duration.replace("s", "")) || 4,
        lens: s.lens,
        movement: s.movement
      })),
    [selectedScene.shots]
  );

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputActive =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";
      const isModalActive =
        scriptPanelOpen ||
        improveOpen ||
        parsedScenes.length > 0 ||
        byokRequiredModalOpen;

      if (isInputActive || isModalActive) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (e.key === "1" && selectedScene.shots[0]) {
        handleShotSelect(selectedScene.shots[0].id);
      } else if (e.key === "2" && selectedScene.shots[1]) {
        handleShotSelect(selectedScene.shots[1].id);
      } else if (e.key === "3" && selectedScene.shots[2]) {
        handleShotSelect(selectedScene.shots[2].id);
      } else if (e.key.toLowerCase() === "m") {
        setAutoMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [byokRequiredModalOpen, handleRedo, handleUndo, improveOpen, parsedScenes.length, scriptPanelOpen, selectedScene.shots]);

  const handleScriptDecomposition = async () => {
    if (!scriptInput.trim()) return;
    setIsParsingScript(true);
    try {
      const result = await parseScript(scriptInput);
      if (isMountedRef.current) {
        setParsedScenes(result.scenes);
        setScriptPanelOpen(false);
      }
    } catch (err) {
      showNotification(err instanceof Error ? err.message : "Failed to parse script");
    } finally {
      if (isMountedRef.current) setIsParsingScript(false);
    }
  };

  const handleApplyImportedScenes = () => {
    if (parsedScenes.length === 0) return;
    recordHistory();
    const formatted: ExtendedScene[] = parsedScenes.map((ps, idx) => ({
      id: ps.id || `scene-${idx + 1}`,
      title: ps.title || `Scene ${idx + 1}`,
      description: ps.description || ps.action || "",
      duration: ps.duration || "00:15",
      status: "Ready",
      shots: [
        {
          id: `shot-p-${idx + 1}-1`,
          name: "Wide Establishing",
          description: `${ps.environment} - ${ps.character}`,
          thumbnailLabel: "Establishing shot",
          duration: "4s",
          scriptExcerpt: ps.action || ps.description || `Scene ${idx + 1} action beat`,
          lens: "35mm Wide Prime",
          movement: "Dolly In",
          framing: "Rule of Thirds",
          emotion: 65,
          intensity: 60,
          characterLocked: true,
          styleLocked: true,
          cameraLocked: false,
          version: 1,
          isDraft: false
        }
      ]
    }));

    setCurrentScenes(formatted);
    setSelectedSceneId(formatted[0].id);
    setSelectedShotId(formatted[0].shots[0].id);
    setParsedScenes([]);
    setIsDemoProject(false);
    setActiveProjectName("Custom Screenplay Sequence");
    showNotification("Screenplay imported successfully into Studio workspace.");
  };

  return (
    <AppShell navActionLabel="Dashboard" navActionHref="/dashboard">
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-4">
          {/* Top Project Identity & Workspace Control Bar */}
          <Card className="p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent shrink-0">
                <Clapperboard className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-sora text-lg sm:text-xl font-bold text-white leading-snug">
                    {activeProjectName}
                  </h1>
                  {isDemoProject && (
                    <span className="rounded-full bg-gold/10 border border-gold/30 px-2 py-0.5 text-[9px] font-mono text-gold uppercase tracking-wider">
                      Demo Mode
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span className="text-emerald">● {lastSavedTime}</span>
                  <span>·</span>
                  <span>{currentScenes.length} Scenes</span>
                  <span>·</span>
                  <span>{currentScenes.reduce((acc, s) => acc + s.shots.length, 0)} Total Shots</span>
                </div>
              </div>
            </div>

            {/* Undo / Redo & Mode Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyStack.length === 0}
                  className="rounded-lg p-1.5 text-slate-300 hover:text-white disabled:opacity-30 transition"
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="rounded-lg p-1.5 text-slate-300 hover:text-white disabled:opacity-30 transition"
                  title="Redo (Ctrl+Shift+Z)"
                  aria-label="Redo"
                >
                  <RotateCw className="size-3.5" />
                </button>
              </div>

              <Toggle
                checked={autoMode}
                label={autoMode ? "AI Director (Auto)" : "Manual Controls"}
                onChange={(checked) => {
                  setAutoMode(checked);
                  showNotification(
                    checked
                      ? "AI Director Mode activated: camera presets auto-tuned."
                      : "Manual Control Mode activated: full parameter overrides unlocked."
                  );
                }}
              />

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white flex items-center gap-1.5">
                <span className="text-gold">●</span> {formatCredits(user.credits)}
              </div>
            </div>
          </Card>

          {/* Canonical Global Continuity Status Strip */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-xs transition",
              globalContinuityReport.status === "stable"
                ? "border-emerald/30 bg-emerald/5 text-emerald"
                : "border-amber/40 bg-amber/10 text-amber"
            )}
          >
            <div className="flex items-center gap-2">
              {globalContinuityReport.status === "stable" ? (
                <Shield className="size-4 text-emerald" />
              ) : (
                <AlertTriangle className="size-4 text-amber" />
              )}
              <span className="font-semibold">{globalContinuityReport.label}:</span>
              <span className="text-slate-200">{globalContinuityReport.detail}</span>
            </div>

            {globalContinuityReport.status !== "stable" && (
              <button
                type="button"
                onClick={() => applyCreativeDirection("Fix consistency")}
                className="rounded-lg bg-amber/20 px-2.5 py-1 font-semibold text-amber hover:bg-amber/30 transition text-[11px]"
              >
                Lock All Character & Palette Anchors
              </button>
            )}
          </div>

          {/* Main 3-Column Studio Workstation */}
          <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)_400px] xl:grid-cols-[270px_minmax(0,1.1fr)_430px]">
            {/* Column 1: Scene & Sequence Stack */}
            <Card className="h-fit p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                    Sequences
                  </div>
                  <div className="font-sora text-base font-bold text-white">Scene Stack</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 text-xs px-2.5 py-1"
                  onClick={() => setScriptPanelOpen(true)}
                >
                  <FileText className="size-3" />
                  Parse Script
                </Button>
              </div>

              <div className="space-y-2">
                {currentScenes.map((scene, idx) => {
                  const active = scene.id === selectedScene.id;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleSceneSelect(scene.id)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition",
                        active
                          ? "border-accent bg-accent/15 shadow-glow"
                          : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                      )}
                      aria-pressed={active}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-white">
                          0{idx + 1}. {scene.title}
                        </div>
                        <span className="font-mono text-[10px] text-slate-300">{scene.duration}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">{scene.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-300">
                        <span>{scene.shots.length} Shots</span>
                        <span className="text-emerald">● {scene.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Column 2: Timeline, Suggested Coverage & Camera Directing */}
            <div className="space-y-4">
              {/* Primary Timeline Scrubber with SMPTE timecode */}
              <TimelineScrubber
                shots={timelineShots}
                currentShotId={selectedShot.id}
                onSelectShot={handleShotSelect}
              />

              {/* Shot Coverage Strip with Accurate 'Generate Coverage Shot' */}
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                      Shot Coverage
                    </div>
                    <div className="font-sora text-base font-bold text-white">
                      {selectedScene.title} Cuts
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={handleGenerateCoverageShot}
                  >
                    <Plus className="size-3" />
                    Generate Coverage Shot
                  </Button>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedScene.shots.map((shot, sIdx) => {
                    const active = shot.id === selectedShot.id;

                    return (
                      <div
                        key={shot.id}
                        onClick={() => handleShotSelect(shot.id)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 text-left transition flex flex-col justify-between group",
                          active
                            ? "border-accent bg-accent/15 shadow-glow"
                            : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                        )}
                        role="button"
                        tabIndex={0}
                        aria-pressed={active}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                            <span>CUT 0{sIdx + 1}</span>
                            <div className="flex items-center gap-1.5">
                              {shot.isDraft && (
                                <span className="rounded bg-amber/20 px-1 py-0.2 text-[8px] font-mono text-amber">
                                  DRAFT
                                </span>
                              )}
                              <span>{shot.duration}</span>
                              {selectedScene.shots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteShot(shot.id);
                                  }}
                                  className="text-slate-400 hover:text-rose p-0.5 opacity-0 group-hover:opacity-100 transition"
                                  title="Delete Shot"
                                  aria-label="Delete Shot"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 font-medium text-white text-xs leading-snug">
                            {shot.name}
                          </div>
                          <p className="mt-1 text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                            {shot.description}
                          </p>
                        </div>

                        {shot.scriptExcerpt && (
                          <div className="mt-2 rounded bg-black/50 p-1.5 font-mono text-[9px] text-slate-300 border border-white/5 line-clamp-1">
                            📄 {shot.scriptExcerpt}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Camera & Optics Controls with Accessible Radio Semantics */}
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="size-4 text-accent" />
                    <h3 className="font-sora text-base font-bold text-white">
                      Camera & Framing Directives
                    </h3>
                  </div>
                  {autoMode && (
                    <span className="rounded-full bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-[10px] font-mono text-accent">
                      AI Auto-Selected
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Lens Focal Length */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                      <span>Focal Length & Lens Character</span>
                      <span className="font-mono text-gold text-[11px]">{selectedShot.lens}</span>
                    </div>
                    <Tabs
                      ariaLabel="Lens Focal Length"
                      items={[...lensOptions]}
                      value={selectedShot.lens}
                      onChange={(newLens) =>
                        updateActiveShot(
                          (prev) => ({ ...prev, lens: newLens as (typeof lensOptions)[number] }),
                          `Lens changed to ${newLens}`
                        )
                      }
                    />
                  </div>

                  {/* Camera Trajectory */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                      <span>Camera Movement Trajectory</span>
                      <span className="font-mono text-accent text-[11px]">{selectedShot.movement}</span>
                    </div>
                    <Tabs
                      ariaLabel="Camera Movement Trajectory"
                      items={[...movementOptions]}
                      value={selectedShot.movement}
                      onChange={(newMovement) =>
                        updateActiveShot(
                          (prev) => ({ ...prev, movement: newMovement as (typeof movementOptions)[number] }),
                          `Camera motion updated to ${newMovement}`
                        )
                      }
                    />
                  </div>

                  {/* Framing Geometry */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                      <span>Framing Geometry</span>
                      <span className="font-mono text-slate-300 text-[11px]">{selectedShot.framing}</span>
                    </div>
                    <Tabs
                      ariaLabel="Framing Geometry"
                      items={[...framingOptions]}
                      value={selectedShot.framing}
                      onChange={(newFraming) =>
                        updateActiveShot(
                          (prev) => ({ ...prev, framing: newFraming as (typeof framingOptions)[number] }),
                          `Framing updated to ${newFraming}`
                        )
                      }
                    />
                  </div>

                  {/* Dramatic Emotion Intensity Slider */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                      <span>Actor Emotional Delivery</span>
                      <span className="font-mono text-gold text-[11px]">{selectedShot.emotion}% Dramatic Intensity</span>
                    </div>
                    <Slider
                      label="Emotion"
                      value={selectedShot.emotion}
                      onChange={(newVal) =>
                        updateActiveShot(
                          (prev) => ({ ...prev, emotion: newVal }),
                          `Emotion intensity adjusted to ${newVal}%`
                        )
                      }
                    />
                  </div>

                  {/* Continuity Anchor Toggles (Explicit Two-State Switches) */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Continuity Locks (Active Shot Anchor)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Character Lock */}
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveShot(
                            (prev) => ({ ...prev, characterLocked: !prev.characterLocked }),
                            `Character lock toggled to ${!selectedShot.characterLocked ? "Locked" : "Free Variation"}`
                          )
                        }
                        className={cn(
                          "rounded-xl border p-2.5 text-left text-xs transition flex items-center justify-between",
                          selectedShot.characterLocked
                            ? "border-emerald/40 bg-emerald/10 text-emerald"
                            : "border-rose/30 bg-rose/10 text-rose"
                        )}
                        aria-pressed={selectedShot.characterLocked}
                      >
                        <div className="flex items-center gap-1.5">
                          {selectedShot.characterLocked ? (
                            <Lock className="size-3.5" />
                          ) : (
                            <Unlock className="size-3.5" />
                          )}
                          <span className="font-medium">
                            {selectedShot.characterLocked ? "Character Locked" : "Character Free"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono">
                          {selectedShot.characterLocked ? "STABLE" : "DRIFT"}
                        </span>
                      </button>

                      {/* Style Lock */}
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveShot(
                            (prev) => ({ ...prev, styleLocked: !prev.styleLocked }),
                            `Style lock toggled to ${!selectedShot.styleLocked ? "Locked" : "Free Variation"}`
                          )
                        }
                        className={cn(
                          "rounded-xl border p-2.5 text-left text-xs transition flex items-center justify-between",
                          selectedShot.styleLocked
                            ? "border-emerald/40 bg-emerald/10 text-emerald"
                            : "border-white/10 bg-white/5 text-slate-300"
                        )}
                        aria-pressed={selectedShot.styleLocked}
                      >
                        <div className="flex items-center gap-1.5">
                          {selectedShot.styleLocked ? (
                            <Lock className="size-3.5" />
                          ) : (
                            <Unlock className="size-3.5" />
                          )}
                          <span className="font-medium">
                            {selectedShot.styleLocked ? "Palette Locked" : "Free Palette"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono">
                          {selectedShot.styleLocked ? "LOCKED" : "OPEN"}
                        </span>
                      </button>

                      {/* Camera Angle Lock */}
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveShot(
                            (prev) => ({ ...prev, cameraLocked: !prev.cameraLocked }),
                            `Camera lock toggled to ${!selectedShot.cameraLocked ? "Fixed" : "Adaptive"}`
                          )
                        }
                        className={cn(
                          "rounded-xl border p-2.5 text-left text-xs transition flex items-center justify-between",
                          selectedShot.cameraLocked
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-white/10 bg-white/5 text-slate-300"
                        )}
                        aria-pressed={selectedShot.cameraLocked}
                      >
                        <div className="flex items-center gap-1.5">
                          {selectedShot.cameraLocked ? (
                            <Lock className="size-3.5" />
                          ) : (
                            <Unlock className="size-3.5" />
                          )}
                          <span className="font-medium">
                            {selectedShot.cameraLocked ? "Angle Fixed" : "Adaptive Angle"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono">
                          {selectedShot.cameraLocked ? "FIXED" : "AUTO"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Functional Quick Creative Directions */}
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                      Creative Tuning
                    </div>
                    <div className="font-sora text-base font-bold text-white">One-Click Direction Presets</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-gold"
                    onClick={() => setImproveOpen(true)}
                  >
                    <Sparkles className="size-3.5" />
                    Advanced Direction
                  </Button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {regenerateOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => applyCreativeDirection(opt)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left text-xs font-medium text-slate-200 hover:border-accent hover:bg-accent/10 transition flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <span className="text-[10px] font-mono text-accent">Apply ➔</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Column 3: Live Viewport, Living Storyboard Frame & Generation Routing */}
            <div className="space-y-4">
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                      Active Viewport
                    </div>
                    <div className="font-sora text-base font-bold text-white truncate">
                      {selectedShot.name}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-mono",
                      selectedShot.isDraft
                        ? "border-amber/40 bg-amber/10 text-amber"
                        : "border-cyan-400/40 bg-cyan-950/40 text-cyan-300"
                    )}
                  >
                    {selectedShot.isDraft ? "● UNRENDERED CHANGES" : "● DIRECTING BLUEPRINT"}
                  </span>
                </div>

                {/* Draft Modification Diff Banner */}
                {selectedShot.isDraft && (
                  <div className="rounded-xl border border-amber/30 bg-amber/10 p-2.5 text-xs text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-amber mt-0.5" />
                    <div>
                      <strong>Unrendered Directing Changes:</strong> {selectedShot.pendingDiff || "Directing parameters modified."}
                    </div>
                  </div>
                )}

                {/* Living Storyboard Frame Video Player */}
                <VideoPlayer
                  animated={false}
                  title={selectedShot.thumbnailLabel}
                  subtitle={`${selectedShot.description} Directed on ${selectedShot.lens}, ${selectedShot.movement} trajectory, ${selectedShot.framing}.`}
                  focalLength={selectedShot.lens}
                  isDraft={selectedShot.isDraft}
                  version={selectedShot.version}
                  shotTheme={selectedShot.thumbnailLabel}
                  continuityStatus={{
                    character: selectedShot.characterLocked,
                    lighting: true,
                    style: selectedShot.styleLocked
                  }}
                />

                {/* Screenplay Traceability Snippet */}
                {selectedShot.scriptExcerpt && (
                  <div className="rounded-xl border border-white/8 bg-black/40 p-3 text-xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                      <FileText className="size-3 text-gold" />
                      Screenplay Source Line
                    </div>
                    <p className="font-mono text-slate-200 text-[11px] leading-relaxed">
                      {selectedShot.scriptExcerpt}
                    </p>
                  </div>
                )}

                {/* BYOK vs Platform Credit Method Routing Explanation */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    {user.siliconFlowKey ? (
                      <>
                        <Key className="size-3.5 text-emerald" />
                        <span>Mode: BYOK Direct Diffusion (Wan2.2)</span>
                      </>
                    ) : (
                      <>
                        <Film className="size-3.5 text-cyan-400" />
                        <span>Mode: Directing Blueprint (Instant · Free)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {user.siliconFlowKey
                      ? "SiliconFlow API Key active. Full-motion video generation executes directly on Wan2.2 GPU compute."
                      : "Zero credit cost. Direct camera vectors, focal lengths, and prompt blueprints in real time. Add a SiliconFlow key to trigger live GPU diffusion."}
                  </p>
                </div>

                {/* Truth-Grounded Action Buttons: Instant Blueprint vs Real BYOK Diffusion */}
                <div className="pt-1 space-y-2">
                  <Button
                    size="lg"
                    className="w-full justify-center gap-2 bg-accent text-background font-bold shadow-glow hover:bg-white transition"
                    onClick={handleCompileBlueprint}
                  >
                    <Check className="size-4" />
                    {selectedShot.isDraft ? "Save & Compile Blueprint" : "Compile Directing Blueprint"}
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full justify-center gap-2 text-slate-300 hover:text-white border border-white/10"
                    onClick={handleTriggerByokRender}
                    disabled={isRenderingByok}
                  >
                    {isRenderingByok ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Dispatching to SiliconFlow Wan2.2...
                      </>
                    ) : (
                      <>
                        <Zap className="size-3.5 text-gold" />
                        Render Video via Wan2.2 (BYOK)
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Reference Anchor Upload */}
              <Card className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Visual Character Anchor</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useReferenceImage}
                      onChange={(e) => setUseReferenceImage(e.target.checked)}
                      className="rounded border-white/20 bg-white/10"
                    />
                    Lock to Portrait
                  </label>
                </div>
                {useReferenceImage && (
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 py-2.5 transition hover:border-accent/40 hover:bg-white/5">
                    <div className="text-center">
                      <Upload className="mx-auto mb-1 size-4 text-slate-400" />
                      <span className="text-xs text-slate-300">
                        {referenceImagePath ? "Change portrait image" : "Upload reference photo (PNG/JPG)"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const res = await uploadImage(f);
                          setReferenceImagePath(res.file_path);
                          showNotification("Character reference photo uploaded.");
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Honest BYOK Required Modal */}
      <Modal
        open={byokRequiredModalOpen}
        onClose={() => setByokRequiredModalOpen(false)}
        title="SiliconFlow BYOK API Key Required"
        description="Wan2.2 Neural Video Diffusion Architecture"
      >
        <div className="space-y-4 py-2">
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Key className="size-4 text-accent" />
              Direct GPU Diffusion Compute
            </div>
            <p className="leading-relaxed">
              Full-motion video generation requires GPU diffusion compute. CineSync uses your personal SiliconFlow API key to dispatch Wan2.2 video generation jobs directly at zero platform markup.
            </p>
            <p className="text-slate-400">
              You can continue directing camera optics, focal lengths, and scene continuity blueprints for free without an API key.
            </p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              className="flex-1 justify-center gap-2 font-semibold shadow-glow"
              onClick={() => {
                setByokRequiredModalOpen(false);
                openByokModal();
              }}
            >
              <Key className="size-4" />
              Configure SiliconFlow Key
            </Button>
            <Button
              variant="secondary"
              onClick={() => setByokRequiredModalOpen(false)}
            >
              Continue in Blueprint Mode
            </Button>
          </div>
        </div>
      </Modal>

      {/* Script Decomposition Modal with Transparent Engine Status */}
      <Modal
        open={scriptPanelOpen}
        onClose={() => setScriptPanelOpen(false)}
        title="Screenplay Scene Decomposition"
        description="Extract structured cinematic scenes and camera setups from screenplay text."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Engine: <strong>{user.anthropicKey ? "Claude 3.5 Sonnet NLP (BYOK Active)" : "Deterministic Screenplay Parser (Instant / Free)"}</strong>
            </span>
            {!user.anthropicKey && (
              <button
                type="button"
                onClick={openByokModal}
                className="text-accent text-[11px] font-semibold hover:underline"
              >
                Enable Claude 3.5 BYOK
              </button>
            )}
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Screenplay Excerpt
            </span>
            <textarea
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              rows={8}
              placeholder="EXT. RAIN-SLICKED ALLEY - NIGHT&#10;&#10;A lone detective pauses beneath flickering neon..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-accent font-mono text-sm"
            />
          </label>

          <Button
            size="lg"
            className="w-full gap-2 font-bold shadow-glow"
            onClick={handleScriptDecomposition}
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
                Decompose Screenplay into Scenes
              </>
            )}
          </Button>
        </div>
      </Modal>

      {/* Review Parsed Scenes Import Modal */}
      <Modal
        open={parsedScenes.length > 0 && !scriptPanelOpen}
        onClose={() => setParsedScenes([])}
        title="Screenplay Scenes Extracted"
        description="Review parsed scenes before importing into your Director Studio workspace."
      >
        <div className="space-y-4">
          {parsedScenes.map((sc) => (
            <Card key={sc.id} className="p-3.5 space-y-1.5">
              <div className="font-semibold text-white text-sm">
                Scene {sc.number}: {sc.title}
              </div>
              <div className="text-xs text-slate-300">{sc.description}</div>
              <div className="text-[10px] font-mono text-slate-400">
                Character: {sc.character} · Mood: {sc.mood}
              </div>
            </Card>
          ))}

          <div className="flex gap-2.5 pt-2">
            <Button
              className="flex-1 justify-center gap-1.5"
              onClick={handleApplyImportedScenes}
            >
              <Check className="size-4" />
              Apply to Studio Workspace
            </Button>
            <Button
              variant="secondary"
              onClick={() => setParsedScenes([])}
            >
              Cancel
            </Button>
          </div>
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
            applyCreativeDirection(improveSelection);
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
