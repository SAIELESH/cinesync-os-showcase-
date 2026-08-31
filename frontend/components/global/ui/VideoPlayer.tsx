import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Sparkles, Camera, Eye, CheckCircle2, AlertCircle, Film, Key, Lock } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  title: string;
  subtitle: string;
  src?: string;
  aspect?: "video" | "wide" | "anamorphic";
  animated?: boolean;
  showMeta?: boolean;
  focalLength?: string;
  fps?: number;
  isDraft?: boolean;
  version?: number;
  shotTheme?: string;
  continuityStatus?: {
    character: boolean;
    lighting: boolean;
    style: boolean;
  };
};

export function VideoPlayer({
  title,
  subtitle,
  src,
  aspect = "wide",
  animated = true,
  showMeta = true,
  focalLength = "50mm Normal Prime",
  fps = 24,
  isDraft = false,
  version = 1,
  shotTheme,
  continuityStatus = { character: true, lighting: true, style: true }
}: VideoPlayerProps) {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [byokNoticeOpen, setByokNoticeOpen] = useState(false);

  const canPlayLiveVideo = Boolean(user.isLoggedIn || user.siliconFlowKey);

  const handlePlayClick = () => {
    if (!canPlayLiveVideo) {
      setByokNoticeOpen(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const openByokModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-byok-modal"));
    }
  };

  // Dynamic Storyboard Theme Background
  const getThemeBackground = () => {
    const t = (shotTheme || title).toLowerCase();
    if (t.includes("rain") || t.includes("street") || t.includes("establishing")) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#060D1A] to-[#0A1628] opacity-95" />
          <div className="absolute top-1/4 left-1/3 size-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 size-48 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15),transparent_60%)]" />
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(105deg,transparent,transparent_15px,rgba(255,255,255,0.06)_16px,transparent_17px)]" />
        </div>
      );
    } else if (t.includes("profile") || t.includes("reaction") || t.includes("close")) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#140D07] to-[#1F1206] opacity-95" />
          <div className="absolute top-1/3 right-1/3 size-56 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 size-48 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(245,158,11,0.18),transparent_65%)]" />
        </div>
      );
    } else if (t.includes("safehouse") || t.includes("doorway") || t.includes("ledger") || t.includes("table")) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#120E0A] to-[#1C140D] opacity-95" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-60 rounded-full bg-amber-600/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.15),transparent_70%)]" />
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0B1017] to-[#121824] opacity-95" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-72 rounded-full bg-sky-500/12 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.14),transparent_60%)]" />
        </div>
      );
    }
  };

  const body = (
    <Card
      glow
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-[#070A0F] p-4 sm:p-5 shadow-modal-elevation min-h-[320px] w-full"
      )}
    >
      {src && canPlayLiveVideo ? (
        <div className="relative -m-4 sm:-m-5 aspect-video w-[calc(100%+2rem)] sm:w-[calc(100%+2.5rem)] overflow-hidden rounded-2xl bg-black">
          <video
            src={src}
            controls
            autoPlay
            loop
            className="h-full w-full object-cover"
          />
          {showMeta && (
            <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2">
              <span className="rounded-full border border-emerald/30 bg-black/80 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald backdrop-blur">
                ● VIDEO RENDER V{version}
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Dynamic Living Storyboard Atmosphere Background */}
          {getThemeBackground()}

          {/* Rule of Thirds Sensor Grid Overlay */}
          {showGrid && (
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 border border-white/15 opacity-40">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div />
            </div>
          )}

          {/* Top HUD: Status Bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 pb-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider shrink-0",
                  isDraft
                    ? "border-amber/40 bg-amber/10 text-amber"
                    : "border-cyan-400/40 bg-cyan-950/40 text-cyan-300"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isDraft ? "bg-amber" : "bg-cyan-400 animate-pulse"
                  )}
                />
                {isDraft ? "UNRENDERED CHANGES" : `DIRECTING BLUEPRINT V${version}`}
              </div>
              <span className="rounded-full border border-white/10 bg-black/70 px-2.5 py-0.5 text-[10px] font-mono text-slate-200 backdrop-blur whitespace-nowrap">
                {focalLength}
              </span>
              <span className="rounded-full border border-white/10 bg-black/70 px-2 py-0.5 text-[10px] font-mono text-slate-400 backdrop-blur whitespace-nowrap">
                {fps} FPS
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`rounded-lg border p-1.5 text-xs transition ${
                  showGrid
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-white/10 bg-black/50 text-slate-400 hover:text-white"
                }`}
                title="Toggle Sensor Framing Grid (Rule of Thirds)"
                aria-label="Toggle Sensor Framing Grid"
                aria-pressed={showGrid}
              >
                <Eye className="size-3.5" />
              </button>
              <Sparkles className="size-4 text-gold" />
            </div>
          </div>

          {/* Center Play / Preview Transport or BYOK Gate */}
          <div className="relative z-20 my-auto flex flex-col items-center justify-center py-4">
            {byokNoticeOpen && !canPlayLiveVideo ? (
              <div className="max-w-xs rounded-2xl border border-accent/30 bg-[#0c121c]/95 p-3.5 text-center shadow-2xl backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white">
                  <Key className="size-4 text-accent" />
                  BYOK Required for Video Playback
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Live AI video rendering requires a BYOK API key. Add your personal SiliconFlow key to render and play full-motion video sequences.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={openByokModal}
                    className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-background hover:bg-white transition"
                  >
                    Configure BYOK Key
                  </button>
                  <button
                    type="button"
                    onClick={() => setByokNoticeOpen(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePlayClick}
                  className="group/btn flex size-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-glow backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent hover:text-background"
                  aria-label={canPlayLiveVideo ? (isPlaying ? "Pause Sequence Timing" : "Preview Sequence Timing") : "Configure BYOK for Live Playback"}
                  title={canPlayLiveVideo ? (isPlaying ? "Pause Sequence Timing" : "Preview Sequence Timing") : "Configure BYOK for Live Playback"}
                >
                  {!canPlayLiveVideo ? (
                    <Key className="size-5 text-accent" />
                  ) : isPlaying ? (
                    <Pause className="size-5 fill-current" />
                  ) : (
                    <Play className="ml-1 size-5 fill-current" />
                  )}
                </button>
                <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {!canPlayLiveVideo ? "BYOK Mode · Click to Configure Key" : isPlaying ? "Pause Sequence Timing" : "Preview Sequence Timing"}
                </span>
              </>
            )}
          </div>

          {/* Bottom HUD: Scene Metadata & Continuity Chips */}
          <div className="relative z-20 space-y-2.5 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="size-3.5 text-accent shrink-0" />
                <h3 className="font-sora text-base sm:text-lg font-semibold text-white leading-snug break-words">
                  {title}
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed break-words">
                {subtitle}
              </p>
            </div>

            {showMeta && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider backdrop-blur whitespace-nowrap",
                    continuityStatus.character
                      ? "border-emerald/30 bg-emerald/10 text-emerald"
                      : "border-rose/30 bg-rose/10 text-rose"
                  )}
                >
                  {continuityStatus.character ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                  {continuityStatus.character ? "Character Anchor" : "Character Drift Risk"}
                </span>

                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider backdrop-blur whitespace-nowrap",
                    continuityStatus.style
                      ? "border-emerald/30 bg-emerald/10 text-emerald"
                      : "border-white/10 bg-black/60 text-slate-400"
                  )}
                >
                  {continuityStatus.style ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                  {continuityStatus.style ? "Palette Locked" : "Free Palette"}
                </span>

                <span className="rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-300 backdrop-blur whitespace-nowrap">
                  2.39:1 Anamorphic
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );

  if (!animated) {
    return body;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {body}
    </motion.div>
  );
}
