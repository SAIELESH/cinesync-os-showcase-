import { motion } from "framer-motion";
import { Card } from "@/components/global/ui/Card";
import { VideoPlayer } from "@/components/global/ui/VideoPlayer";

export function ExamplePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="lg:justify-self-end"
      whileHover={{ y: -4 }}
    >
      <Card className="noise spotlight gold-glow relative overflow-hidden rounded-[28px] p-4 shadow-glow">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Real Example</div>
          <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Input</div>
            <p className="mt-2 text-base text-white">"A scientist walking through a dark biotech lab"</p>
          </div>
          <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Output</div>
            <div className="mt-3">
              <VideoPlayer
                title="Generated cinematic scene"
                subtitle="A stable lead character moves through a moody biotech environment with continuity preserved across every shot."
                aspect="wide"
                showMeta={false}
              />
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Consistent character across shots. No prompt iteration.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
