import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Sparkles, Camera, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
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
  continuityStatus = { character: true, lighting: true, style: true }
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const body = (
    <Card
      glow
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-[#070A0F] p-4 sm:p-5 shadow-modal-elevation min-h-[320px] w-full"
      )}
    >
      {src ? (
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
                ● RENDERED MP4 (WAN2.2)
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Viewport Ambient Studio Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 opacity-90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />

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
                    : "border-emerald/40 bg-emerald/10 text-emerald"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isDraft ? "bg-amber" : "bg-emerald animate-pulse"
                  )}
                />
                {isDraft ? "UNSAVED DRAFT DIRECTION" : "RENDERED BLUEPRINT"}
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

          {/* Center Play Button Simulator */}
          <div className="relative z-20 my-auto flex items-center justify-center py-4">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="group/btn flex size-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-glow backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent hover:text-background"
              aria-label={isPlaying ? "Pause Preview Timing" : "Preview Sequence Timing"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="ml-1 size-5 fill-current" />
              )}
            </button>
          </div>

          {/* Bottom HUD: Scene Metadata & Locks */}
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
