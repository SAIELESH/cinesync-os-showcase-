import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  title: string;
  subtitle: string;
  aspect?: "video" | "wide";
  animated?: boolean;
  showMeta?: boolean;
};

export function VideoPlayer({
  title,
  subtitle,
  aspect = "video",
  animated = true,
  showMeta = true
}: VideoPlayerProps) {
  const body = (
    <Card
      glow
      className={cn(
        "noise spotlight gold-glow relative overflow-hidden",
        aspect === "wide" ? "aspect-[16/7]" : "aspect-video"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.26),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(245,200,106,0.2),transparent_24%),linear-gradient(180deg,rgba(12,18,28,0.8),rgba(4,6,10,0.96))]" />
      <div className="grid-overlay absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.03),transparent)]" />
      <div className="relative flex h-full flex-col justify-between p-6">
        {showMeta ? (
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300">
              Live Preview
            </span>
            <Sparkles className="size-4 text-gold" />
          </div>
        ) : (
          <div />
        )}
        <div className="space-y-3">
          <div className="inline-flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur">
            <Play className="ml-1 size-5 fill-current" />
          </div>
          <div>
            <h3 className="font-[var(--font-sora)] text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-2 max-w-lg text-sm text-slate-300">{subtitle}</p>
          </div>
          {showMeta ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {["Character lock", "Style lock", "Lighting aware"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );

  if (!animated) {
    return body;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {body}
    </motion.div>
  );
}
