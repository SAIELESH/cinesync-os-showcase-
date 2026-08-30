import { CreditCard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { formatCredits } from "@/lib/utils";

export function CreditsPanel() {
  return (
    <Card className="p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-accent/10 p-3 text-accent">
          <CreditCard className="size-6" />
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Billing</div>
          <h1 className="mt-2 font-[var(--font-sora)] text-4xl font-semibold text-white">Credits and usage</h1>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/8 bg-white/5 p-6">
        <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Available</div>
        <div className="mt-3 font-[var(--font-sora)] text-5xl font-semibold text-white">{formatCredits(1240)}</div>
        <p className="mt-4 max-w-xl text-sm text-slate-300">
          Credits are consumed across generation, consistency fixes, and exports. Usage refreshes live as scenes render.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald/20 bg-emerald/10 p-5">
        <div className="text-sm font-medium text-white">Plan health</div>
        <p className="mt-2 text-sm text-slate-200">
          Your current balance covers approximately 18 more standard scenes with consistency lock enabled.
        </p>
      </div>

      <Button size="lg" className="mt-6 w-full gap-2">
        <ShoppingCart className="size-4" />
        Buy Credits
      </Button>
    </Card>
  );
}
