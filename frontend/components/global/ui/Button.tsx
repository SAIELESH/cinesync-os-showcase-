import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-foreground text-background hover:bg-white hover:shadow-glow shadow-glow focus-visible:shadow-focus",
  secondary:
    "border border-white/10 bg-white/5 text-foreground hover:border-accent/40 hover:bg-white/10 hover:shadow-glow",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-rose/20 text-rose-200 hover:bg-rose/30"
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base"
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className
}: Pick<ButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
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
