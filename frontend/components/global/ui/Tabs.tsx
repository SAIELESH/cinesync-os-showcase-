import { cn } from "@/lib/utils";

type TabsProps<T extends string> = {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

export function Tabs<T extends string>({ items, value, onChange, ariaLabel }: TabsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex w-full rounded-2xl border border-white/8 bg-white/5 p-1"
    >
      {items.map((item) => {
        const isSelected = value === item;
        return (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-pressed={isSelected}
            onClick={() => onChange(item)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition text-center",
              isSelected
                ? "bg-white text-background shadow-glow font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
