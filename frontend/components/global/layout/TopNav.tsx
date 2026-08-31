import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, Key, User, Check, Sparkles, LogOut, Coins, ShieldCheck, Command, Search } from "lucide-react";
import { Button, buttonStyles } from "@/components/global/ui/Button";
import { Modal } from "@/components/global/ui/Modal";
import { CommandPalette } from "@/components/global/ui/CommandPalette";
import { useAuth } from "@/lib/auth";
import { formatCredits, cn } from "@/lib/utils";

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

export function TopNav({ actionLabel = "Dashboard", actionHref = "/dashboard" }: TopNavProps) {
  const router = useRouter();
  const { user, login, logout, saveApiKeys } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputName, setInputName] = useState("");
  const [siliconKey, setSiliconKey] = useState(user.siliconFlowKey || "");
  const [anthropicKey, setAnthropicKey] = useState(user.anthropicKey || "");
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKeys(siliconKey, anthropicKey);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setKeyModalOpen(false);
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    login(inputEmail, inputName);
    setAuthModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#05070B]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 border border-accent/30 text-accent group-hover:scale-105 transition">
                <span className="text-xs font-bold font-mono">CS</span>
              </div>
              <span className="font-sora text-base font-bold uppercase tracking-[0.25em] text-white">
                CineSync<span className="text-accent text-xs ml-1">OS</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      active
                        ? "bg-white/10 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Command Palette Button */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 hover:border-accent/30 hover:text-white transition"
              title="Open Director Command Palette (Cmd+K)"
            >
              <Search className="size-3.5 text-accent" />
              <span>Search commands...</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* BYOK API Key Button */}
            <button
              type="button"
              onClick={() => {
                setSiliconKey(user.siliconFlowKey || "");
                setAnthropicKey(user.anthropicKey || "");
                setKeyModalOpen(true);
              }}
              title="Configure Bring Your Own Key (BYOK)"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                user.siliconFlowKey || user.anthropicKey
                  ? "border-emerald/30 bg-emerald/10 text-emerald"
                  : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
              )}
            >
              <Key className="size-3.5" />
              <span className="text-[11px] font-medium">
                {user.siliconFlowKey ? "BYOK Active" : "BYOK"}
              </span>
            </button>

            {/* Live Credits Badge */}
            <Link
              href="/billing"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-accent/30 transition"
              title="View credits & billing"
            >
              <Coins className="size-3.5 text-gold" />
              <span>{formatCredits(user.credits)}</span>
            </Link>

            {/* Auth / Profile Button */}
            {user.isLoggedIn ? (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition"
              >
                <div className="size-5 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Hamburger Toggle */}
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
          <div className="border-t border-white/8 bg-[#05070B]/98 px-6 py-4 backdrop-blur-2xl md:hidden">
            <div className="mb-3 flex items-center justify-between border-b border-white/8 pb-3 text-xs text-slate-300">
              <span>Director: {user.name}</span>
              <span className="text-gold font-medium">{formatCredits(user.credits)}</span>
            </div>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPaletteOpen(true);
                }}
                className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/10 px-4 py-2.5 text-sm text-accent text-left font-medium"
              >
                <span className="flex items-center gap-2">
                  <Command className="size-4" />
                  Quick Command Palette
                </span>
                <span className="text-xs font-mono">⌘K</span>
              </button>
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
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setKeyModalOpen(true);
                  }}
                >
                  <Key className="size-4" />
                  BYOK API Key Settings
                </Button>
                <Button
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                >
                  {user.isLoggedIn ? "Account Profile" : "Sign In"}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Embedded Command Palette Controller */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* BYOK API Key Modal */}
      <Modal
        open={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        title="Bring Your Own Key (BYOK) Configuration"
        description="Enter your private API keys below. Keys are stored locally in your browser and used securely for live AI generation."
      >
        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              SiliconFlow API Key (Wan2.2 AI Video Generation)
            </label>
            <input
              type="password"
              value={siliconKey}
              onChange={(e) => setSiliconKey(e.target.value)}
              placeholder="sk-..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/40"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Used to render live high-definition AI video MP4s directly via Wan-AI diffusion models.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Anthropic API Key (Claude 3.5 Sonnet Screenplay Analysis)
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/40"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Used for intelligent multi-scene screenplay breakdown and dynamic camera vector assignment.
            </p>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/10 p-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-medium text-white mb-1">
              <ShieldCheck className="size-4 text-accent" />
              Zero-Config Blueprint Fallback
            </div>
            If no key is entered, CineSync automatically generates complete cinematography prompt blueprints without failing.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setKeyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              {keySaved ? <Check className="size-4 text-emerald" /> : <Key className="size-4" />}
              {keySaved ? "Keys Saved!" : "Save Keys"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Account / Login Modal */}
      <Modal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={user.isLoggedIn ? "Account Profile" : "Director Sign In"}
        description={
          user.isLoggedIn
            ? "Manage your director profile, active tier plan, and available balance."
            : "Sign in or create an account to persist multi-shot sequences and project timelines."
        }
      >
        {user.isLoggedIn ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email || "director@cinesync.ai"}</div>
                </div>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                {user.plan}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/8 bg-black/30 p-3.5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Balance</div>
                <div className="mt-1 text-xl font-semibold text-white">{formatCredits(user.credits)}</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/30 p-3.5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">BYOK Status</div>
                <div className="mt-1 text-sm font-medium text-emerald">
                  {user.siliconFlowKey ? "Active (SiliconFlow)" : "Blueprint Mode"}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="danger"
                size="sm"
                className="gap-2"
                onClick={() => {
                  logout();
                  setAuthModalOpen(false);
                }}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
              <Link
                href="/billing"
                className={buttonStyles({ size: "sm" })}
                onClick={() => setAuthModalOpen(false)}
              >
                Manage Subscription
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Director Name
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="director@studio.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/40"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAuthModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Continue to Studio
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
