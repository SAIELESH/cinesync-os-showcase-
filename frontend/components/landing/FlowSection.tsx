import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Sparkles, Sliders, Play, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/global/ui/Card";

const detailedSteps = [
  {
    num: "01",
    title: "Paste Screenplay",
    desc: "Ingest industry-standard sluglines, character dialogue, and stage action.",
    icon: Film
  },
  {
    num: "02",
    title: "AI Scene Breakdown",
    desc: "Claude 3.5 extracts characters, lighting conditions, and mood vectors.",
    icon: Sparkles
  },
  {
    num: "03",
    title: "Direct Lens & Camera",
    desc: "Specify focal lengths (24mm/50mm/85mm), dollies, and sensor aspect ratios.",
    icon: Sliders
  },
  {
    num: "04",
    title: "Multi-Shot Lock",
    desc: "Anchor facial identity and world lighting across all consecutive cuts.",
    icon: CheckCircle2
  },
  {
    num: "05",
    title: "Wan2.2 4K Export",
    desc: "Render high-definition MP4 clips ready for timeline assembly.",
    icon: Play
  }
];

export function FlowSection({ steps }: { steps?: string[] }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="mt-20 border-t border-white/10 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-director text-accent">
            THE PIPELINE
          </div>
          <h2 className="mt-2 font-sora text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Screenplays Become Films
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400">
          5-Stage Deterministic Workflow
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {detailedSteps.map((step, index) => {
          const Icon = step.icon;
          const isSelected = activeStep === index;
          return (
            <motion.div
              key={step.num}
              onClick={() => setActiveStep(index)}
              className="cursor-pointer h-full"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
            >
              <div
                className={`h-full rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-accent/40 bg-accent/10 shadow-glow"
                    : "border-white/[0.08] bg-[#0B1017]/80 hover:border-white/20 hover:bg-[#0B1017]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-accent">
                      {step.num}
                    </span>
                    <Icon className="size-4 text-slate-400" />
                  </div>
                  <h3 className="mt-3 font-sora text-sm font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>STAGE {index + 1} OF 5</span>
                  {isSelected && <span className="text-accent font-semibold">● ACTIVE</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
