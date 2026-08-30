import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, ArrowRight, Camera, Film, Layers, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
import { buttonStyles } from "@/components/global/ui/Button";
import { cn } from "@/lib/utils";

const demoShots = [
  {
    id: "shot-1",
    tag: "Shot 1 · Establishing",
    name: "Wide Street Reveal",
    lens: "35mm Prime",
    movement: "Slow Dolly In",
    framing: "Rule of Thirds",
    duration: "4.5s",
    desc: "Camera tracks low across rain reflections on asphalt as the detective steps beneath flickering amber neon.",
    characterStatus: "Character Anchor: 100%",
    lightingStatus: "Neon Rim Light Locked"
  },
  {
    id: "shot-2",
    tag: "Shot 2 · Coverage",
    name: "Medium Over-Shoulder",
    lens: "50mm Master",
    movement: "Tracking Pan",
    framing: "Golden Ratio",
    duration: "3.8s",
    desc: "Maintains facial keypoints and trench coat fabric texture while keeping background neon bokeh consistent.",
    characterStatus: "Face Identity: Persistent",
    lightingStatus: "Directional Match: 100%"
  },
  {
    id: "shot-3",
    tag: "Shot 3 · Reaction",
    name: "Close-up Intensity",
    lens: "85mm Anamorphic",
    movement: "Subtle Push In",
    framing: "Center Subject",
    duration: "3.2s",
    desc: "Shallow depth of field isolating eyes; rain streak physics and color grading adhere strictly to master scene.",
    characterStatus: "Keypoint Constraint: Active",
    lightingStatus: "Atmosphere: Consistent"
  }
];

export function ExamplePanel() {
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const currentShot = demoShots[activeShotIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="lg:justify-self-end w-full"
    >
      <Card className="noise spotlight gold-glow relative overflow-hidden rounded-[28px] p-5 sm:p-6 shadow-glow border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-xs uppercase tracking-[0.28em] text-slate-300 font-medium">Live Studio Breakdown</span>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-slate-400">
            Claude 3.5 + Wan2.2
          </span>
        </div>

        {/* Screenplay Input Beat */}
        <div className="mt-4 rounded-2xl border border-white/8 bg-black/40 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-[0.24em] font-mono text-accent">Scene 01 · Script Input</span>
            <span className="font-mono text-[11px]">Night / Exterior</span>
          </div>
          <p className="mt-2 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-white">EXT. RAIN-SLICKED ALLEY - NIGHT</strong><br />
            A lone detective pauses beneath flickering neon. Rain cascades down a worn collar as distant sirens echo through the metropolis.
          </p>
        </div>

        {/* Interactive Multi-Shot Selector */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-[0.24em]">Decomposed Shots (Click to preview)</span>
            <span className="text-gold font-medium">3 Shots Generated</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {demoShots.map((shot, idx) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => setActiveShotIndex(idx)}
                className={cn(
                  "rounded-xl border p-2 text-left transition-all",
                  activeShotIndex === idx
                    ? "border-accent/50 bg-accent/15 text-white shadow-glow"
                    : "border-white/8 bg-white/5 text-slate-400 hover:border-white/15 hover:bg-white/8"
                )}
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Shot {idx + 1}</div>
                <div className="text-xs font-semibold truncate text-white mt-0.5">{shot.lens}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Shot Preview Card */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.18),transparent_32%),radial-gradient(circle_at_75%_20%,rgba(245,200,106,0.15),transparent_28%),linear-gradient(180deg,rgba(12,18,28,0.9),rgba(4,6,10,0.98))] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-300 backdrop-blur">
              {currentShot.tag}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald font-medium">
              <CheckCircle2 className="size-3.5" />
              <span>{currentShot.characterStatus}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentShot.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-[var(--font-sora)] text-lg font-semibold text-white">{currentShot.name}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">{currentShot.desc}</p>
                </div>
                <Link
                  href="/app"
                  className="shrink-0 inline-flex size-10 items-center justify-center rounded-full border border-accent/40 bg-accent/20 text-white shadow-glow transition hover:scale-110 hover:bg-accent/30"
                  title="Open in Director Studio"
                >
                  <Play className="ml-0.5 size-4 fill-current text-accent" />
                </Link>
              </div>

              {/* Camera Directives Pill Matrix */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
                  <Camera className="size-3 text-gold" /> {currentShot.lens}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
                  <Film className="size-3 text-accent" /> {currentShot.movement}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
                  <Layers className="size-3 text-emerald" /> {currentShot.framing}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button to Open Studio */}
        <div className="mt-4 pt-1">
          <Link
            href="/app"
            className={buttonStyles({
              size: "lg",
              className: "w-full justify-between gap-2 shadow-glow group"
            })}
          >
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-gold" />
              Open Interactive Director Studio
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
