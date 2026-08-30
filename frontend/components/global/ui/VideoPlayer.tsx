import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  title: string;
  subtitle: string;
  src?: string;
  aspect?: "video" | "wide";
  animated?: boolean;
  showMeta?: boolean;
};

export function VideoPlayer({
  title,
  subtitle,
  src,
  aspect = "video",
  animated = true,
  showMeta = true
}: VideoPlayerProps) {
  const body = (
    <Card
      glow
      className={cn(
        "noise spotlight gold-glow relative overflow-hidden flex flex-col justify-between p-5 sm:p-6",
        aspect === "wide" ? "min-h-[260px]" : "min-h-[290px]"
      )}
    >
      {src ? (
        <div className="relative -m-5 sm:-m-6 aspect-video w-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] overflow-hidden rounded-2xl bg-black">
          <video
            src={src}
            controls
            autoPlay
            loop
            className="h-full w-full object-cover"
          />
          {showMeta && (
            <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald backdrop-blur">
                Generated Asset
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_32%),radial-gradient(circle_at_75%_20%,rgba(245,200,106,0.18),transparent_28%),linear-gradient(180deg,rgba(12,18,28,0.85),rgba(4,6,10,0.98))]" />
          <div className="grid-overlay absolute inset-0 opacity-25" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.03),transparent)]" />
          
          <div className="relative z-10 flex items-center justify-between">
            {showMeta ? (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300 backdrop-blur">
                Live Preview
              </span>
            ) : (
              <div />
            )}
            <Sparkles className="size-4 text-gold" />
          </div>

          <div className="relative z-10 my-3 flex items-center">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur transition hover:scale-105">
              <Play className="ml-0.5 size-4 fill-current" />
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <div>
              <h3 className="font-[var(--font-sora)] text-lg sm:text-xl font-semibold text-white leading-snug">{title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">{subtitle}</p>
            </div>
            {showMeta ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Character lock", "Style lock", "Lighting aware"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </>
      )}
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
