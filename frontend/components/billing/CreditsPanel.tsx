import { useState } from "react";
import { CreditCard, ShoppingCart, Check, Zap } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { Modal } from "@/components/global/ui/Modal";
import { formatCredits } from "@/lib/utils";

export function CreditsPanel() {
  const [credits, setCredits] = useState(1240);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleBuy = (amount: number) => {
    setCredits((prev) => prev + amount);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setModalOpen(false);
    }, 1500);
  };

  return (
    <>
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
          <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Available Balance</div>
          <div className="mt-3 font-[var(--font-sora)] text-5xl font-semibold text-white">{formatCredits(credits)}</div>
          <p className="mt-4 max-w-xl text-sm text-slate-300">
            Credits are consumed across generation, consistency passes, and high-res video rendering.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald/20 bg-emerald/10 p-5">
          <div className="text-sm font-medium text-white">Plan health: Studio Pro</div>
          <p className="mt-2 text-sm text-slate-200">
            Your current balance covers approximately {Math.floor(credits / 65)} more standard multi-shot scenes.
          </p>
        </div>

        <Button size="lg" className="mt-6 w-full gap-2" onClick={() => setModalOpen(true)}>
          <ShoppingCart className="size-4" />
          Top Up Credits
        </Button>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Purchase Production Credits"
        description="Select a credit tier to instantly expand your rendering quota."
      >
        <div className="space-y-4">
          {[
            { credits: 500, price: "$20", scenes: "~8 full scenes" },
            { credits: 2000, price: "$65", scenes: "~30 full scenes", popular: true },
            { credits: 5000, price: "$140", scenes: "~80 full scenes" }
          ].map((tier) => (
            <div
              key={tier.credits}
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                tier.popular ? "border-accent/40 bg-accent/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">+{tier.credits} Credits</span>
                  {tier.popular && (
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs text-accent">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{tier.scenes}</div>
              </div>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => handleBuy(tier.credits)}
              >
                {addedSuccess ? <Check className="size-4 text-emerald" /> : <Zap className="size-4" />}
                {tier.price}
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
