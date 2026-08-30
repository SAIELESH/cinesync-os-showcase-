import { Card } from "@/components/global/ui/Card";
import { useAuth } from "@/lib/auth";

export function UsagePanel() {
  const { user } = useAuth();
  const hasCredits = user.credits > 0;

  const dynamicUsage = hasCredits
    ? [
        { label: "Director Studio rendering", value: Math.round(user.credits * 0.45), percent: 45 },
        { label: "Wan2.2 video generation", value: Math.round(user.credits * 0.35), percent: 35 },
        { label: "Script to shot parsing", value: Math.round(user.credits * 0.15), percent: 15 },
        { label: "Consistency locking", value: Math.round(user.credits * 0.05), percent: 5 }
      ]
    : [
        { label: "Director Studio rendering", value: 0, percent: 0 },
        { label: "Wan2.2 video generation", value: 0, percent: 0 },
        { label: "Script to shot parsing", value: 0, percent: 0 },
        { label: "Consistency locking", value: 0, percent: 0 }
      ];

  return (
    <Card className="p-6 lg:p-8">
      <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Usage Breakdown</div>
      <div className="mt-3 font-[var(--font-sora)] text-3xl font-semibold text-white">Where credits went this cycle</div>
      
      {!hasCredits && (
        <div className="mt-4 rounded-xl border border-white/8 bg-white/5 p-3 text-xs text-slate-400">
          No usage recorded for this cycle. Sign in or add your BYOK key to begin producing.
        </div>
      )}

      <div className="mt-8 space-y-5">
        {dynamicUsage.map((item) => (
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
                style={{ width: `${Math.max(item.percent, 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
