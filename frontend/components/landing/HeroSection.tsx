import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles, Film, ArrowRight } from "lucide-react";
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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
        >
          <Sparkles className="size-4 text-gold" />
          Built for cinematic storytelling
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-8"
        >
          <div className="font-[var(--font-sora)] text-lg uppercase tracking-[0.5em] text-slate-400">CineSync</div>
          <h1 className="mt-6 font-[var(--font-sora)] text-5xl font-semibold leading-tight text-white md:text-6xl">
            Create <span className="text-gradient">consistent</span> cinematic videos without{" "}
            <span className="text-gradient">prompt bottlenecks</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Generate instantly, refine precisely, and take full control when it matters{" "}
            <span aria-hidden="true">&mdash;</span> without prompt engineering.
          </p>
          <p className="mt-4 text-sm font-medium text-gold">
            <span aria-hidden="true">&#9889;</span> Get your first cinematic scene in under 30 seconds
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/generate" className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>
              <span aria-hidden="true">&#9889;</span> Generate Your First Scene
            </Link>
            <Button
              variant="secondary"
              size="lg"
              className="w-full gap-2 sm:w-auto"
              onClick={() => setDemoOpen(true)}
            >
              <PlayCircle className="size-4" />
              Watch Demo
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-slate-400 sm:text-left">
            Stop fighting prompts. Start directing.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur">
                <div className="font-[var(--font-sora)] text-2xl text-white">{value}</div>
                <div className="mt-1 text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">*Benchmarked against standard multi-prompt iteration workflows</p>
        </motion.div>
      </div>

      <Modal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        title="CineSync Director OS — Product Tour"
        description="Experience the end-to-end AI filmmaking workflow from raw screenplay parsing to multi-shot video generation."
      >
        <div className="space-y-5">
          <VideoPlayer
            title="End-to-End Filmmaking Pipeline"
            subtitle="Demonstrating script parsing, shot decomposition, camera movement physics, and Wan2.2 AI video rendering."
            aspect="wide"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { step: "01. Script Breakdown", desc: "Extract scenes, moods, and character locks." },
              { step: "02. Shot Config", desc: "Select 35mm/50mm/85mm lenses & camera dolly." },
              { step: "03. Render & Polish", desc: "Generate live video or cinematic blueprints." }
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-white/8 bg-white/5 p-3">
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
