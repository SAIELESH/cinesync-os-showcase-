import Link from "next/link";
import { useRouter } from "next/router";
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

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-background/70 backdrop-blur-xl">
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
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Link href={actionHref} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          {actionLabel}
        </Link>
      </div>
    </header>
  );
}
