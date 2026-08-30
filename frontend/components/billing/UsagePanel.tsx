import { Card } from "@/components/global/ui/Card";
import { usageBreakdown } from "@/lib/data";

export function UsagePanel() {
  return (
    <Card className="p-6 lg:p-8">
      <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Usage Breakdown</div>
      <div className="mt-3 font-[var(--font-sora)] text-3xl font-semibold text-white">Where credits went this cycle</div>
      <div className="mt-8 space-y-5">
        {usageBreakdown.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm text-white">{item.label}</div>
              <div className="text-sm text-slate-400">
                {item.value} credits · {item.percent}%
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent via-gold to-emerald"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
