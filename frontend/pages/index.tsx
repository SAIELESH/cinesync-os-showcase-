import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Film, Camera, Sliders, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/global/layout/AppShell";
import { Card } from "@/components/global/ui/Card";
import { Button, buttonStyles } from "@/components/global/ui/Button";
import { ExamplePanel } from "@/components/landing/ExamplePanel";
import { FlowSection } from "@/components/landing/FlowSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { landingBullets } from "@/lib/data";

const heroStats = [
  ["10x", "Faster first screenplay drafts"],
  ["92%", "Less prompt trial-and-error"],
  ["1 Flow", "From slugline to 4K Wan2.2 export"]
];

const flowSteps = [
  "1. Describe your idea",
  "2. Get a full scene instantly",
  "3. Refine only what matters",
  "4. Take control if needed",
  "5. Export final video"
];

const trustPoints = [
  "Consistent multi-shot character identity",
  "Precise 24mm/50mm/85mm focal geometry",
  "Built for actual narrative filmmaking workflows"
];

export default function LandingPage() {
  const [selectedComparison, setSelectedComparison] = useState<"standard" | "cinesync">("cinesync");

  return (
    <AppShell navActionLabel="Login" navActionHref="/dashboard">
      <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          {/* Hero Row */}
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <HeroSection heroStats={heroStats} />
            <ExamplePanel />
          </div>

          {/* Prompt Slop vs CineSync Directing Interactive Comparison Bento */}
          <div className="mt-24 border-t border-white/10 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="font-mono text-xs uppercase tracking-director text-accent">
                TECHNICAL BENCHMARK
              </div>
              <h2 className="mt-2 font-sora text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Prompt Guesswork vs. CineSync Directing
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Why standard text-to-video prompts fail multi-shot narrative continuity, and how CineSync solves it.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* The Old Way: Prompt Slop */}
              <div className="rounded-3xl border border-rose/20 bg-rose/[0.02] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-rose/15 pb-4">
                    <div className="flex items-center gap-2 text-rose font-mono text-xs uppercase font-semibold">
                      <X className="size-4" />
                      Standard Multi-Prompt Iteration
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">UNCONTROLLED</span>
                  </div>

                  <div className="mt-6 space-y-4 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-rose/10 p-1 text-rose mt-0.5 shrink-0">
                        <X className="size-3.5" />
                      </div>
                      <div>
                        <strong className="text-white">Face & Character Mutation:</strong> Every new prompt re-randomizes facial structures and costume details across shots.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-rose/10 p-1 text-rose mt-0.5 shrink-0">
                        <X className="size-3.5" />
                      </div>
                      <div>
                        <strong className="text-white">Random Camera Drift:</strong> Lens distortion, camera heights, and background parallax fluctuate wildly.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-rose/10 p-1 text-rose mt-0.5 shrink-0">
                        <X className="size-3.5" />
                      </div>
                      <div>
                        <strong className="text-white">Costly Trial & Error:</strong> Hundreds of wasted GPU credits trying to &ldquo;re-roll&rdquo; a coherent angle.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-rose/15 bg-black/40 p-4 font-mono text-[11px] text-rose-300">
                  ⚠️ Result: Disconnected disjointed clips that cannot be cut together in a timeline.
                </div>
              </div>

              {/* The CineSync Way: Directed Multi-Shot */}
              <div className="rounded-3xl border border-accent/40 bg-accent/[0.04] p-6 sm:p-8 flex flex-col justify-between shadow-glow relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                    <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-semibold">
                      <Check className="size-4" />
                      CineSync Directed Coverage
                    </div>
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-mono text-accent">
                      STUDIO STANDARD
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-emerald/10 p-1 text-emerald mt-0.5 shrink-0">
                        <Check className="size-3.5" />
                      </div>
                      <div>
                        <strong className="text-white">Persistent Actor Anchor:</strong> Facial keypoints and costume textures are locked deterministically across the scene.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-emerald/10 p-1 text-emerald mt-0.5 shrink-0">
                        <Check className="size-3.5" />
                      </div>
                      <div>
                        <strong className="text-white">Precise Optics:</strong> Real cinematographic lenses (35mm Wide / 50mm Normal / 85mm Tele) with physically accurate depth of field.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-emerald/10 p-1 text-emerald mt-0.5 shrink-0">
                        <Check className="size-3.5" />
                      </div>
                      <div>
                        <strong className="text-white">Seamless Timeline Assembly:</strong> Exported cuts align naturally in premiere, DaVinci, or final output reels.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-emerald/20 bg-black/40 p-4 font-mono text-[11px] text-emerald">
                  ✓ Result: Continuous cinematic multi-shot scene coverage ready for film production.
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {landingBullets.map((bullet, index) => (
              <motion.div
                key={bullet}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
              >
                <div className="flex h-full items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-[#0B1017] p-5 shadow-sm">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                    <Check className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{bullet}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 5-Step Pipeline Flow */}
          <FlowSection steps={flowSteps} />

          {/* Trust & Conversion Section */}
          <TrustSection trustPoints={trustPoints} />

          {/* Official Showcase Footer */}
          <footer className="mt-20 border-t border-white/10 pt-10 pb-16 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="font-sora text-sm font-semibold text-white">
                CineSync Director OS
              </div>
              <p className="text-xs text-slate-400">
                A project designed and developed by <strong className="text-slate-200">Sailesh Krishnan</strong>
              </p>
              <a
                href="https://github.com/SAIELESH/cinesync-os-showcase-"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-accent transition hover:border-accent/40 hover:bg-accent/10 hover:text-white"
              >
                <span>View source and technical case study on GitHub</span>
                <span className="text-[11px]">↗</span>
              </a>
            </div>
          </footer>
        </div>
      </section>
    </AppShell>
  );
}
