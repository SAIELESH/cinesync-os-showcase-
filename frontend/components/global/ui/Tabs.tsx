import { cn } from "@/lib/utils";

type TabsProps<T extends string> = {
  items: T[];
  value: T;
  onChange: (value: T) => void;
};

export function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex rounded-2xl border border-white/8 bg-white/5 p-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm transition",
            value === item ? "bg-white text-background shadow-glow" : "text-slate-300 hover:text-white"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
