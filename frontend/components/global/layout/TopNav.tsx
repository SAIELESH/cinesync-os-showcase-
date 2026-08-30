import Link from "next/link";
import { buttonStyles } from "@/components/global/ui/Button";

type TopNavProps = {
  actionLabel?: string;
  actionHref?: string;
};

export function TopNav({ actionLabel = "Login", actionHref = "/dashboard" }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="font-[var(--font-sora)] text-lg font-semibold tracking-[0.24em] text-white">
          CineSync
        </Link>
        <Link href={actionHref} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          {actionLabel}
        </Link>
      </div>
    </header>
  );
}
