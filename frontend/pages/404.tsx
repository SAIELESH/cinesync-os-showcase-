import Link from "next/link";
import { Film, Clapperboard, Home } from "lucide-react";
import { AppShell } from "@/components/global/layout/AppShell";
import { Card } from "@/components/global/ui/Card";
import { buttonStyles } from "@/components/global/ui/Button";

export default function Custom404Page() {
  return (
    <AppShell navActionLabel="Open Studio" navActionHref="/app">
      <section className="flex min-h-[75vh] items-center justify-center px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <Card className="gold-glow p-8 lg:p-12">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent">
              <Clapperboard className="size-8" />
            </div>

            <div className="text-xs uppercase tracking-[0.38em] text-accent">
              404 · Scene Missing
            </div>

            <h1 className="mt-4 font-[var(--font-sora)] text-3xl font-semibold text-white sm:text-4xl">
              Lost on the cutting room floor
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              The sequence or take you are looking for has not been filmed yet. Return to the director studio or launch the workflow pipeline.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/app" className={buttonStyles({ size: "lg", className: "gap-2" })}>
                <Clapperboard className="size-4" />
                Director Studio
              </Link>
              <Link href="/workflow" className={buttonStyles({ variant: "secondary", size: "lg", className: "gap-2" })}>
                <Film className="size-4" />
                Workflow Pipeline
              </Link>
              <Link href="/" className={buttonStyles({ variant: "ghost", size: "lg", className: "gap-2" })}>
                <Home className="size-4" />
                Home
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
