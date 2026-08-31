import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, ArrowRight, Camera, Film, Layers, CheckCircle2, Sliders, Radio } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
import { buttonStyles } from "@/components/global/ui/Button";
import { cn } from "@/lib/utils";

const demoShots = [
  {
    id: "shot-1",
    tag: "SHOT 01 · ESTABLISHING",
    name: "Wide Alley Reveal",
    lens: "35mm Prime f/1.4",
    movement: "Slow Push Dolly",
    framing: "2.39:1 Anamorphic",
    timecode: "00:00:00:00",
    duration: "4.5s",
    desc: "Camera tracks low across wet cobblestones as amber neon reflects through falling rain. Detective steps into the frame.",
    characterStatus: "Character Anchor: 100%",
    lightingStatus: "Neon Rim Light: Locked"
  },
  {
    id: "shot-2",
    tag: "SHOT 02 · COVERAGE",
    name: "Medium Over-Shoulder",
    lens: "50mm Master Prime",
    movement: "Tracking Pan",
    framing: "Rule of Thirds",
    timecode: "00:00:04:12",
    duration: "3.8s",
    desc: "Maintains face keypoints and wet trench coat texture while preserving background neon bokeh geometry.",
    characterStatus: "Face Identity: Persistent",
    lightingStatus: "Directional Match: 100%"
  },
  {
    id: "shot-3",
    tag: "SHOT 03 · REACTION",
    name: "Tight Character Close-up",
    lens: "85mm Telephoto T/1.5",
    movement: "Micro Push In",
    framing: "Center Subject",
    timecode: "00:00:08:06",
    duration: "3.2s",
    desc: "Extremely shallow depth of field isolating eyes; rain streak physics and color grade adhere strictly to master scene.",
    characterStatus: "Keypoint Constraint: Active",
    lightingStatus: "Atmosphere: Coherent"
  }
];

export function ExamplePanel() {
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const currentShot = demoShots[activeShotIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="lg:justify-self-end w-full"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B1017] p-5 sm:p-6 shadow-modal-elevation">
        {/* Header HUD */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Multi-Shot Consistency Engine
            </span>
          </div>
          <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
            CLAUDE 3.5 + WAN2.2
          </span>
        </div>

        {/* Screenplay Input */}
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/50 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] text-accent uppercase tracking-wider">
              Screenplay Input Beat
            </span>
            <span className="font-mono text-[10px] text-slate-400">SCENE 01 · EXT / NIGHT</span>
          </div>
          <p className="mt-2 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-white">EXT. RAIN-SLICKED ALLEY - NIGHT</strong><br />
            A lone detective pauses beneath flickering neon. Rain cascades down a worn collar as distant sirens echo through the metropolis.
          </p>
        </div>

        {/* Shot Selection Buttons */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Decomposed Shots
            </span>
            <span className="font-mono text-[11px] text-gold">3 Shots · 11.5s Total</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {demoShots.map((shot, idx) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => setActiveShotIndex(idx)}
                className={cn(
                  "rounded-xl border p-2.5 text-left transition-all duration-150",
                  activeShotIndex === idx
                    ? "border-accent bg-accent/15 text-white shadow-glow"
                    : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                )}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Shot 0{idx + 1}
                </div>
                <div className="text-xs font-semibold text-white mt-0.5 leading-snug">
                  {shot.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Shot Details Box */}
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-black/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="rounded bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              {currentShot.tag} · {currentShot.timecode}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald">
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
              className="mt-3 space-y-3"
            >
              <div>
                <h3 className="font-sora text-base font-semibold text-white">
                  {currentShot.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {currentShot.desc}
                </p>
              </div>

              {/* Technical Directives */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-mono text-gold">
                  <Camera className="size-3" /> {currentShot.lens}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-mono text-accent">
                  <Film className="size-3" /> {currentShot.movement}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  <Layers className="size-3" /> {currentShot.framing}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-1">
          <Link
            href="/app"
            className={buttonStyles({
              size: "lg",
              className: "w-full justify-between gap-2 shadow-glow group bg-foreground text-background font-semibold"
            })}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-gold" />
              Launch Director Studio Controls
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
