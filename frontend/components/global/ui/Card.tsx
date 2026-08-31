import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  hoverEffect?: boolean;
};

export function Card({ className, glow = false, hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B1017] shadow-card-elevation backdrop-blur-xl",
        hoverEffect && "studio-panel-hover transition duration-200 hover:border-accent/30",
        glow && "shadow-glow border-accent/25",
        className
      )}
      {...props}
    />
  );
}
