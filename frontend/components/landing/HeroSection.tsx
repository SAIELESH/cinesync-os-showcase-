import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Film, ArrowRight, Play, Camera, ShieldCheck } from "lucide-react";
import { Button, buttonStyles } from "@/components/global/ui/Button";
import { Modal } from "@/components/global/ui/Modal";
import { VideoPlayer } from "@/components/global/ui/VideoPlayer";

type HeroSectionProps = {
  heroStats: string[][];
};

export function HeroSection({ heroStats }: HeroSectionProps) {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-xs font-mono text-accent shadow-glow"
        >
          <Sparkles className="size-3.5 text-gold" />
          <span>PRODUCTION PIPELINE · V2.2 RELEASE</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6"
        >
          <div className="font-mono text-xs uppercase tracking-director text-slate-400">
            CINEMATIC DIRECTOR OPERATING SYSTEM
          </div>
          
          <h1 className="mt-4 font-sora text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Turn screenplays into <span className="text-gradient">consistent</span> multi-shot cinema
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
            Decompose scripts into structured coverage with Claude 3.5 Sonnet. Direct lens focal lengths, camera dolly vectors, and character locks before rendering on Wan2.2.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gold">
            <span className="flex size-2 rounded-full bg-gold animate-pulse" />
            <span>Deterministic Camera Control · Multi-Shot Character Persistence</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/workflow"
              className={buttonStyles({
                size: "lg",
                className: "w-full sm:w-auto gap-2 bg-foreground text-background shadow-glow hover:bg-white"
              })}
            >
              <Film className="size-4" />
              Launch Studio Workflow
              <ArrowRight className="size-4 ml-1" />
            </Link>

            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "w-full sm:w-auto gap-2 text-white border-white/15 hover:border-accent/40"
              })}
            >
              <Play className="size-4 fill-current text-accent" />
              Watch Director Tour
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-8">
            {heroStats.map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur">
                <div className="font-sora text-xl sm:text-2xl font-bold text-white tracking-tight">{value}</div>
                <div className="mt-1 text-xs text-slate-400 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Modal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        title="CineSync Director OS — Architecture Tour"
        description="End-to-end filmmaking workflow from screenplay decomposition to consistent Wan2.2 multi-shot rendering."
      >
        <div className="space-y-5">
          <VideoPlayer
            title="Consistent Multi-Shot Sequence"
            subtitle="Demonstrating script breakdown, lens focal lock (35mm/50mm/85mm), and Wan2.2 rendering."
            aspect="wide"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { step: "01. Script Breakdown", desc: "Extract scenes, character keypoints, and lighting cues." },
              { step: "02. Shot Config", desc: "Lock 35mm/50mm/85mm primes, camera dollies, and sensor ratios." },
              { step: "03. 4K Video Generation", desc: "Render consistent video clips via Wan2.2 diffusion." }
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-semibold text-white">{item.step}</div>
                <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/workflow"
              className={buttonStyles({ className: "gap-2" })}
              onClick={() => setDemoOpen(false)}
            >
              <Film className="size-4" />
              Launch Studio Workflow
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
