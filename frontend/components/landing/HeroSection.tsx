import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles } from "lucide-react";
import { Button, buttonStyles } from "@/components/global/ui/Button";

type HeroSectionProps = {
  heroStats: string[][];
};

export function HeroSection({ heroStats }: HeroSectionProps) {
  return (
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
          <Button variant="secondary" size="lg" className="w-full gap-2 sm:w-auto">
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
        <p className="mt-3 text-xs text-slate-500">*Based on internal testing</p>
      </motion.div>
    </div>
  );
}
