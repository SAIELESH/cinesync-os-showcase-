import Link from "next/link";
import { AlertTriangle, ArrowRight, Download, Settings2, WandSparkles } from "lucide-react";
import { Button, buttonStyles } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { ProgressBar } from "@/components/global/ui/ProgressBar";
import { VideoPlayer } from "@/components/global/ui/VideoPlayer";

type GenerateStatePanelProps = {
  state: "idle" | "loading" | "success" | "error";
  progress: number;
  activeStep: string;
  resultTitle: string;
  styles: string[];
};

export function GenerateStatePanel({
  state,
  progress,
  activeStep,
  resultTitle,
  styles
}: GenerateStatePanelProps) {
  if (state === "idle") {
    return (
      <Card className="gold-glow p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Result</div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            Instant value
          </div>
        </div>
        <div className="mt-4">
          <VideoPlayer
            title="Preview waits here"
            subtitle="Your generated result appears with improve, control, and export actions as soon as rendering completes."
            aspect="wide"
          />
        </div>
      </Card>
    );
  }

  if (state === "loading") {
    return (
      <Card className="gold-glow p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Generating</div>
            <h2 className="mt-2 font-[var(--font-sora)] text-2xl font-semibold text-white">
              Building your first cut
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
            {progress}%
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <ProgressBar value={progress} />
          <div className="space-y-2">
            <p className="text-base text-white">{activeStep}</p>
            <p className="text-sm text-slate-400">
              Maintaining character, style, and lighting continuity across generated shots.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {["Generating shots...", "Applying consistency...", "Rendering video..."].map((step) => (
            <div
              key={step}
              className={`rounded-2xl border px-4 py-3 text-sm ${
                activeStep === step
                  ? "border-accent/35 bg-accent/10 text-white shadow-glow"
                  : "border-white/8 bg-white/5 text-slate-400"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (state === "error") {
    return (
      <Card className="p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-rose/12 p-3 text-rose-200">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 className="font-[var(--font-sora)] text-2xl font-semibold text-white">Need a scene description</h2>
            <p className="mt-2 text-sm text-slate-300">
              Add a direction like "A man walking in rain..." and run generation again.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gold-glow p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Generated Result</div>
          <h2 className="mt-2 font-[var(--font-sora)] text-2xl font-semibold text-white">Ready to refine</h2>
        </div>
        <div className="rounded-full bg-emerald/12 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald">
          Success
        </div>
      </div>
      <div className="mt-6">
        <VideoPlayer
          title={resultTitle}
          subtitle={`Style blend: ${styles.join(" · ")}. Cinematic consistency and camera parameters locked.`}
          aspect="wide"
        />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" className="gap-2">
          <WandSparkles className="size-4" />
          Improve
        </Button>
        <Link
          href="/app"
          className={buttonStyles({ variant: "secondary", className: "w-full gap-2 sm:w-auto" })}
        >
          <Settings2 className="size-4" />
          Advanced Control
        </Link>
        <Button className="gap-2">
          <Download className="size-4" />
          Download
        </Button>
      </div>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium text-white">Sign up to save & edit your project</div>
            <p className="mt-1 text-sm text-slate-300">
              Move this draft into Director Mode, preserve versions, and keep every scene editable.
            </p>
          </div>
          <Link href="/dashboard" className={buttonStyles({ size: "sm", className: "gap-2" })}>
            Create account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
