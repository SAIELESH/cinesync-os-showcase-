import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { AppShell } from "@/components/global/layout/AppShell";
import { Card } from "@/components/global/ui/Card";
import { ExamplePanel } from "@/components/landing/ExamplePanel";
import { FlowSection } from "@/components/landing/FlowSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { landingBullets } from "@/lib/data";

const heroStats = [
  ["10x", "faster first drafts"],
  ["92%", "less prompt iteration"],
  ["1 flow", "from concept to export"]
];

const flowSteps = [
  "1. Describe your idea",
  "2. Get a full scene instantly",
  "3. Refine only what matters",
  "4. Take control if needed",
  "5. Export final video"
];

const trustPoints = [
  "Consistent multi-shot outputs",
  "Reduced iteration cycles",
  "Built for real production workflows"
];

export default function LandingPage() {
  return (
    <AppShell navActionLabel="Login" navActionHref="/dashboard">
      <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-10 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <HeroSection heroStats={heroStats} />
            <ExamplePanel />
          </div>

          <FlowSection steps={flowSteps} />

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {landingBullets.map((bullet, index) => (
              <motion.div
                key={bullet}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
              >
                <Card className="flex h-full items-center gap-4 p-5">
                  <div className="rounded-full bg-emerald/10 p-2 text-emerald">
                    <Check className="size-4" />
                  </div>
                  <p className="text-sm text-slate-200">{bullet}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <TrustSection trustPoints={trustPoints} />
        </div>
      </section>
    </AppShell>
  );
}
