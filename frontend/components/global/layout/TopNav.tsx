import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import { buttonStyles } from "@/components/global/ui/Button";
import { cn } from "@/lib/utils";

type TopNavProps = {
  actionLabel?: string;
  actionHref?: string;
};

const navItems = [
  { label: "Workflow", href: "/workflow" },
  { label: "Director Studio", href: "/app" },
  { label: "Quick Generate", href: "/generate" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Billing", href: "/billing" },
];

export function TopNav({ actionLabel = "Login", actionHref = "/dashboard" }: TopNavProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-[var(--font-sora)] text-lg font-semibold tracking-[0.24em] text-white">
            CineSync
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                    active
                      ? "bg-white/10 text-white shadow-glow"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href={actionHref} className={buttonStyles({ variant: "secondary", size: "sm", className: "hidden sm:inline-flex" })}>
            {actionLabel}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/8 bg-background/95 px-6 py-4 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-white font-semibold"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href={actionHref}
                onClick={() => setMobileMenuOpen(false)}
                className={buttonStyles({ variant: "secondary", size: "sm", className: "w-full" })}
              >
                {actionLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
