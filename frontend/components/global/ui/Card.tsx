import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function Card({ className, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-border panel-gradient relative overflow-hidden rounded-2xl border border-white/8",
        glow && "shadow-glow",
        className
      )}
      {...props}
    />
  );
}
