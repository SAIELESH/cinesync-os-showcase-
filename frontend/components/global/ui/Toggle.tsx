import { cn } from "@/lib/utils";

type ToggleProps = {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
};

export function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2 transition hover:border-accent/30 hover:bg-white/8"
      aria-pressed={checked}
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-accent/90" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white transition",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  );
}
