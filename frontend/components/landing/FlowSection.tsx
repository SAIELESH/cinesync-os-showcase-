import { motion } from "framer-motion";
import { Card } from "@/components/global/ui/Card";

type FlowSectionProps = {
  steps: string[];
};

export function FlowSection({ steps }: FlowSectionProps) {
  return (
    <div className="mt-14">
      <div className="mb-5 text-sm uppercase tracking-[0.32em] text-slate-400">How It Works</div>
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <Card className="h-full p-4">
              <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Step {index + 1}</div>
              <p className="mt-3 text-sm text-slate-200">{step.replace(/^\d+\.\s/, "")}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
