import { cn } from "@/lib/utils";

type StatusPillProps = {
  status: "Stable" | "Drift";
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]",
        status === "Stable" ? "bg-emerald/12 text-emerald" : "bg-rose/12 text-rose-200"
      )}
    >
      {status}
    </span>
  );
}
