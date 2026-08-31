import { useState } from "react";
import { CreditCard, Key, ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { useAuth } from "@/lib/auth";
import { formatCredits } from "@/lib/utils";

export function CreditsPanel() {
  const { user } = useAuth();

  const handleOpenByok = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-byok-modal"));
    }
  };

  return (
    <Card className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="rounded-2xl bg-accent/10 p-3 text-accent border border-accent/20">
          <CreditCard className="size-6" />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Billing & Generation Routing
          </div>
          <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-bold text-white">
            Credits & Compute Architecture
          </h1>
        </div>
      </div>

      {/* Operational Generation Notice */}
      <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Key className="size-4 text-accent" />
          BYOK is the Active Operational Generation Method
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          CineSync Director OS is designed for sovereign filmmaker control. Bring Your Own Key (BYOK) via SiliconFlow or Anthropic is currently the <strong>only operational method</strong> for executing live generative video diffusions.
        </p>
        <div className="pt-1">
          <Button size="md" className="gap-2 font-semibold shadow-glow" onClick={handleOpenByok}>
            <Key className="size-4" />
            Configure BYOK API Keys
          </Button>
        </div>
      </div>

      {/* Available Balance Strip */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Platform Balance
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
            {user.plan}
          </span>
        </div>
        <div className="font-sora text-4xl font-bold text-white">
          {formatCredits(user.credits)}
        </div>
        <p className="text-xs text-slate-400 leading-snug">
          {user.siliconFlowKey
            ? "BYOK Key Active: Generating via your personal SiliconFlow key (zero platform credit deduction)."
            : "No BYOK key configured. Add your API key to render live AI video MP4s."}
        </p>
      </div>

      {/* Platform Credits Coming Soon Tier Card (Disabled) */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sora text-base font-semibold text-white">
                Platform Compute Top-Up
              </span>
              <span className="rounded-full bg-amber/20 border border-amber/40 px-2 py-0.5 text-[10px] font-mono text-amber font-semibold uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Managed platform GPU credit purchasing is currently in private preview.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { credits: "500 Credits", price: "$20", status: "Managed Compute Tier" },
            { credits: "2,000 Credits", price: "$65", status: "Studio Pro Tier" },
            { credits: "5,000 Credits", price: "$140", status: "Production Enterprise Tier" }
          ].map((tier) => (
            <div
              key={tier.credits}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 opacity-60"
            >
              <div>
                <div className="font-medium text-white text-xs">{tier.credits}</div>
                <div className="text-[10px] text-slate-400">{tier.status}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-300">{tier.price}</span>
                <span className="text-[10px] font-mono text-amber bg-amber/10 px-2 py-0.5 rounded border border-amber/20">
                  Waitlist
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disabled Action Button */}
        <Button
          size="lg"
          disabled
          className="w-full justify-center gap-2 bg-white/10 text-slate-400 cursor-not-allowed border border-white/5"
        >
          <Clock className="size-4" />
          Platform Credits (Coming Soon)
        </Button>
      </div>
    </Card>
  );
}
