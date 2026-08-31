import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-foreground text-background font-semibold hover:bg-white hover:shadow-glow shadow-glow active:scale-[0.98] focus-visible:shadow-focus",
  secondary:
    "border border-white/10 bg-white/[0.04] text-foreground hover:border-accent/40 hover:bg-white/10 hover:shadow-glow active:scale-[0.98]",
  gold:
    "bg-gold text-background font-semibold hover:bg-gold-muted hover:shadow-gold-glow shadow-gold-glow active:scale-[0.98]",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white active:scale-[0.98]",
  danger: "bg-rose/20 text-rose border border-rose/30 hover:bg-rose/30 active:scale-[0.98]"
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs tracking-wide",
  md: "h-11 px-4 text-sm font-medium",
  lg: "h-12 px-6 text-base font-medium"
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className
}: Pick<ButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 select-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return <button ref={ref} className={buttonStyles({ variant, size, className })} {...props} />;
});
