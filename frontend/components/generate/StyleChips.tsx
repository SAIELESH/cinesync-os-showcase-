import { cn } from "@/lib/utils";

type StyleChipsProps = {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function StyleChips({ options, value, onChange }: StyleChipsProps) {
  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const active = value.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              active
                ? "border-accent/40 bg-accent/15 text-white shadow-glow"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
