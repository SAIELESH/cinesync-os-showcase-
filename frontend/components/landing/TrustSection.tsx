import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/global/ui/Card";
import { buttonStyles } from "@/components/global/ui/Button";

type TrustSectionProps = {
  trustPoints: string[];
};

export function TrustSection({ trustPoints }: TrustSectionProps) {
  return (
    <div className="mt-16">
      <Card className="overflow-hidden p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="text-sm uppercase tracking-[0.32em] text-slate-400">Designed for creators and teams</div>
            <h2 className="mt-3 font-[var(--font-sora)] text-3xl font-semibold text-white">
              Clear enough for speed. Precise enough for production.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              CineSync is built to help individuals and teams move from concept to final output with fewer loops, stronger consistency, and less friction in the creative process.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Link href="/app" className={buttonStyles({ variant: "secondary", size: "lg", className: "gap-2" })}>
            Explore Director Mode
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
