import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Film, Cpu, Zap } from "lucide-react";
import { buttonStyles } from "@/components/global/ui/Button";

type TrustSectionProps = {
  trustPoints?: string[];
};

export function TrustSection({ trustPoints }: TrustSectionProps) {
  const pillars = [
    {
      title: "Consistent Multi-Shot Continuity",
      desc: "Maintain exact facial geometry, clothing textures, and color grades across multiple camera setups.",
      icon: Film
    },
    {
      title: "Studio-Grade Camera Physics",
      desc: "True focal lengths (24mm/50mm/85mm), anamorphic bokeh, and physical dolly speeds rather than random noise.",
      icon: Cpu
    },
    {
      title: "Fast Iteration Without Prompt Slop",
      desc: "Decompose any script in seconds. Change only the lens or actor emotion without re-prompting from scratch.",
      icon: Zap
    }
  ];

  return (
    <div className="mt-20 border-t border-white/10 pt-16 mb-12">
      <div className="rounded-3xl border border-white/10 bg-[#0B1017] p-6 sm:p-8 lg:p-10 shadow-modal-elevation">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="font-mono text-xs uppercase tracking-director text-accent">
              ENGINEERED FOR PRODUCTION
            </div>
            <h2 className="mt-2 font-sora text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Direct with cinematic intention. Not random seeds.
            </h2>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
              CineSync bridges screenwriting and video diffusion. By translating screenplay beats into deterministic shot geometry, you get predictable, director-controlled video output every time.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="size-4" />
                      </div>
                      <h3 className="mt-3 font-sora text-xs sm:text-sm font-semibold text-white">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold">
                <ShieldCheck className="size-4" />
                <span>DIRECTOR SUITE ACCESS</span>
              </div>
              <h3 className="mt-3 font-sora text-xl font-bold text-white">
                Ready to direct your first scene?
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Break down a 1-page screenplay in less than 30 seconds. Export full multi-shot sequences in 4K resolution.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/workflow"
                className={buttonStyles({
                  size: "lg",
                  className: "w-full justify-center gap-2 bg-foreground text-background font-semibold shadow-glow"
                })}
              >
                Launch Studio Workflow
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/app"
                className={buttonStyles({
                  variant: "secondary",
                  size: "md",
                  className: "w-full justify-center text-slate-300 hover:text-white"
                })}
              >
                Explore Director Mode
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
