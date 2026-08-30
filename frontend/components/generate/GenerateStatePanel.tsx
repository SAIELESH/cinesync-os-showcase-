import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Download, Settings2, WandSparkles, Sparkles } from "lucide-react";
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
  videoUrl?: string;
  onImprove?: () => void;
};

export function GenerateStatePanel({
  state,
  progress,
  activeStep,
  resultTitle,
  styles,
  videoUrl,
  onImprove
}: GenerateStatePanelProps) {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

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
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" disabled className="gap-2">
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
          <Button disabled className="gap-2">
            <Download className="size-4" />
            Download
          </Button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-sm font-medium text-white">Why CineSync feels different</div>
          <p className="mt-1 text-sm text-slate-300">
            It doesn't just ask for a prompt; it translates story intent into camera language, style rules, and character locks.
          </p>
        </div>
      </Card>
    );
  }

  if (state === "loading") {
    return (
      <Card className="gold-glow p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Generating</div>
          <div className="rounded-full bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-accent">
            Rendering live
          </div>
        </div>
        <div className="mt-4">
          <VideoPlayer
            title="Translating prompt into camera language"
            subtitle="Locking character keypoints, scene lighting, and camera motion before final rendering."
            aspect="wide"
          />
        </div>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>{activeStep}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </Card>
    );
  }

  if (state === "error") {
    return (
      <Card className="border-rose/20 bg-rose/10 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-rose-300">
          <AlertTriangle className="size-5" />
          <div className="font-semibold">Rendering interrupted</div>
        </div>
        <p className="mt-3 text-sm text-rose-200">
          We encountered an issue while generating this scene. Please check your prompt parameters and try again.
        </p>
        <div className="mt-6">
          <Button variant="secondary" onClick={onImprove}>
            Retry generation
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gold-glow p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Result</div>
        <div className="rounded-full bg-emerald/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald">
          Ready
        </div>
      </div>
      <div className="mt-4">
        <VideoPlayer
          src={videoUrl}
          title={resultTitle}
          subtitle={`Style blend: ${styles.join(" · ")}. Cinematic consistency and camera parameters locked.`}
          aspect="wide"
        />
      </div>

      {downloadNotice && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs text-slate-200">
          <Sparkles className="size-4 shrink-0 text-accent mt-0.5" />
          <div className="flex-1">{downloadNotice}</div>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" className="gap-2" onClick={onImprove}>
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
        <Button
          className="gap-2"
          onClick={() => {
            if (videoUrl) {
              window.open(videoUrl, "_blank");
            } else {
              setDownloadNotice("Cinematic prompt and shot parameters compiled. Add your SiliconFlow API Key via the BYOK button in the top navigation to render and download live MP4 videos.");
            }
          }}
        >
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
