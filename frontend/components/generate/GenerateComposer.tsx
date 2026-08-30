import { WandSparkles } from "lucide-react";
import { StyleChips } from "@/components/generate/StyleChips";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { styleOptions } from "@/lib/data";

const instantSignals = [
  "Single-input generation with no prompting UI",
  "Visual style selection that keeps iteration fast",
  "Signup only appears after the result delivers value"
];

type GenerateComposerProps = {
  concept: string;
  styles: string[];
  loading: boolean;
  onConceptChange: (value: string) => void;
  onStylesChange: (value: string[]) => void;
  onGenerate: () => void;
  onReset: () => void;
};

export function GenerateComposer({
  concept,
  styles,
  loading,
  onConceptChange,
  onStylesChange,
  onGenerate,
  onReset
}: GenerateComposerProps) {
  return (
    <Card className="spotlight p-6 lg:p-8">
      <div className="mb-8 space-y-3">
        <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Quick Generate</div>
        <h1 className="font-[var(--font-sora)] text-4xl font-semibold text-white">
          Instant cinematic output without login
        </h1>
        <p className="max-w-2xl text-slate-300">
          Give CineSync a scene idea and get a polished preview before committing to a project.
        </p>
      </div>

      <label className="block">
        <span className="mb-3 block text-sm font-medium text-white">Scene Idea</span>
        <textarea
          value={concept}
          onChange={(event) => onConceptChange(event.target.value)}
          rows={8}
          placeholder="A man walking in rain..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-accent/35"
        />
      </label>

      <div className="mt-6 space-y-3">
        <span className="block text-sm font-medium text-white">Style Direction</span>
        <StyleChips options={styleOptions} value={styles} onChange={onStylesChange} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="w-full gap-2 sm:w-auto" onClick={onGenerate} disabled={loading}>
          <WandSparkles className="size-4" />
          Generate Video
        </Button>
        <Button variant="ghost" size="lg" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
      <div className="mt-8 grid gap-3">
        {instantSignals.map((signal) => (
          <div key={signal} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">
            {signal}
          </div>
        ))}
      </div>
    </Card>
  );
}
