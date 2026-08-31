import type { ReactNode } from "react";
import { TopNav } from "@/components/global/layout/TopNav";

type AppShellProps = {
  children: ReactNode;
  navActionLabel?: string;
  navActionHref?: string;
};

export function AppShell({ children, navActionLabel, navActionHref }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background matrix-grid film-grain relative selection:bg-accent/30 selection:text-white">
      <TopNav actionLabel={navActionLabel} actionHref={navActionHref} />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
