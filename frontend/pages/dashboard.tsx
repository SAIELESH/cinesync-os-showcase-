import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { AppShell } from "@/components/global/layout/AppShell";
import { buttonStyles } from "@/components/global/ui/Button";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";

export default function DashboardPage() {
  return (
    <AppShell navActionLabel="Billing" navActionHref="/billing">
      <section className="px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.34em] text-slate-400">Project Dashboard</div>
              <h1 className="mt-3 font-[var(--font-sora)] text-4xl font-semibold text-white">Your productions</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Track live projects, revisit previews, and move directly back into Director Mode.
              </p>
            </div>
            <Link href="/app" className={buttonStyles({ size: "lg", className: "gap-2" })}>
              <FolderPlus className="size-4" />
              New Project
            </Link>
          </div>

          <ProjectGrid />
        </div>
      </section>
    </AppShell>
  );
}
