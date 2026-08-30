import type { ReactNode } from "react";
import { TopNav } from "@/components/global/layout/TopNav";

type AppShellProps = {
  children: ReactNode;
  navActionLabel?: string;
  navActionHref?: string;
};

export function AppShell({ children, navActionLabel, navActionHref }: AppShellProps) {
  return (
    <div className="min-h-screen bg-hero-radial">
      <TopNav actionLabel={navActionLabel} actionHref={navActionHref} />
      <main>{children}</main>
    </div>
  );
}
