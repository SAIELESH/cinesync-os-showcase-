import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Sparkles, Maximize2, Camera, Eye, Radio } from "lucide-react";
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
};

export function VideoPlayer({
  title,
  subtitle,
  src,
  aspect = "wide",
  animated = true,
  showMeta = true,
  focalLength = "50mm Prime",
  fps = 24
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const aspectClass =
    aspect === "anamorphic"
      ? "aspect-[2.39/1] min-h-[220px]"
      : aspect === "wide"
      ? "aspect-[16/9] min-h-[260px]"
      : "aspect-[16/10] min-h-[290px]";

  const body = (
    <Card
      glow
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-[#070A0F] p-4 sm:p-5 shadow-modal-elevation",
        aspectClass
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
                ● RENDERED 4K
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Cinematic Viewport Ambient Lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_70%)]" />

          {/* Rule of Thirds Sensor Grid Overlay */}
          {showGrid && (
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 border border-white/15 opacity-40">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div />
            </div>
          )}

          {/* Top HUD: Status Bar */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-rose">
                <span className="size-1.5 rounded-full bg-rose animate-pulse" />
                REC 4K
              </div>
              <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur">
                {focalLength}
              </span>
              <span className="hidden sm:inline-block rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-mono text-slate-400 backdrop-blur">
                {fps} FPS
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`rounded-lg border p-1.5 text-xs transition ${
                  showGrid
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-white/10 bg-black/40 text-slate-400 hover:text-white"
                }`}
                title="Toggle Sensor Framing Grid"
              >
                <Eye className="size-3.5" />
              </button>
              <Sparkles className="size-4 text-gold" />
            </div>
          </div>

          {/* Center Play Button Simulator */}
          <div className="relative z-20 my-auto flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="group/btn flex size-14 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-glow backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent hover:text-background"
              aria-label={isPlaying ? "Pause Preview" : "Play Preview"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="ml-1 size-5 fill-current" />
              )}
            </button>
          </div>

          {/* Bottom HUD: Scene Metadata & Locks */}
          <div className="relative z-20 space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                <h3 className="font-sora text-base sm:text-lg font-semibold text-white leading-snug">
                  {title}
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">
                {subtitle}
              </p>
            </div>

            {showMeta && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {["Character Lock", "Lighting Coherent", "Anamorphic 2.39"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-slate-300 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {body}
    </motion.div>
  );
}
