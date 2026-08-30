import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { Button, buttonStyles } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { projects } from "@/lib/data";

export function ProjectGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="p-5">
          <div className="rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,200,106,0.18),transparent_26%),linear-gradient(180deg,rgba(12,18,28,0.85),rgba(5,8,12,1))] p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-white/10 p-2 text-accent">
                <Sparkles className="size-4" />
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                {project.state}
              </div>
            </div>
            <div className="mt-16 text-sm uppercase tracking-[0.3em] text-slate-400">Thumbnail</div>
            <div className="mt-2 font-[var(--font-sora)] text-2xl text-white">{project.thumbnailLabel}</div>
          </div>
          <div className="mt-5">
            <div className="font-[var(--font-sora)] text-xl text-white">{project.name}</div>
            <div className="mt-2 text-sm text-slate-400">{project.updatedAt}</div>
          </div>
          <div className="mt-5 flex gap-3">
            <Link href="/app" className={buttonStyles({ className: "gap-2" })}>
              <Play className="size-4" />
              Open
            </Link>
            <Button variant="secondary">Share</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
