import { Button } from "@/components/global/ui/Button";
import { Slider } from "@/components/global/ui/Slider";
import { cn } from "@/lib/utils";

type ImprovePanelContentProps = {
  options: string[];
  selected: string;
  intensity: number;
  onSelect: (value: string) => void;
  onIntensityChange: (value: number) => void;
  onRegenerate: () => void;
};

export function ImprovePanelContent({
  options,
  selected,
  intensity,
  onSelect,
  onIntensityChange,
  onRegenerate
}: ImprovePanelContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              selected === option
                ? "border-accent/35 bg-accent/10 text-white shadow-glow"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8"
            )}
          >
            <div className="font-medium">{option}</div>
            <div className="mt-2 text-sm text-slate-400">
              Refine the current shot without exposing prompts or breaking sequence continuity.
            </div>
          </button>
        ))}
      </div>
      <Slider
        label="Intensity"
        value={intensity}
        onChange={onIntensityChange}
        markers={["Soft", "Balanced", "Bold"]}
      />
      <Button className="w-full" size="lg" onClick={onRegenerate}>
        Regenerate
      </Button>
    </div>
  );
}
