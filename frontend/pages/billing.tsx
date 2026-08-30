import { AppShell } from "@/components/global/layout/AppShell";
import { CreditsPanel } from "@/components/billing/CreditsPanel";
import { UsagePanel } from "@/components/billing/UsagePanel";

export default function BillingPage() {
  return (
    <AppShell navActionLabel="Dashboard" navActionHref="/dashboard">
      <section className="px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <CreditsPanel />
          <UsagePanel />
        </div>
      </section>
    </AppShell>
  );
}
