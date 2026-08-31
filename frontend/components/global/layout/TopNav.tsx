import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Clapperboard,
  Sparkles,
  Command,
  Key,
  Coins,
  ShieldAlert,
  ShieldCheck,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Modal } from "@/components/global/ui/Modal";
import { CommandPalette } from "@/components/global/ui/CommandPalette";
import { useAuth } from "@/lib/auth";
import { cn, formatCredits } from "@/lib/utils";

type TopNavProps = {
  actionLabel?: string;
  actionHref?: string;
};

export function TopNav({ actionLabel, actionHref }: TopNavProps = {}) {
  const router = useRouter();
  const { user, login, logout, saveApiKeys } = useAuth();
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states
  const [siliconKey, setSiliconKey] = useState(user.siliconFlowKey || "");
  const [anthropicKey, setAnthropicKey] = useState(user.anthropicKey || "");
  const [showSiliconKey, setShowSiliconKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0);

    const handleOpenByok = () => {
      setSiliconKey(user.siliconFlowKey || "");
      setAnthropicKey(user.anthropicKey || "");
      setTestResult(null);
      setKeyModalOpen(true);
    };

    const handleOpenAuth = () => {
      setAuthModalOpen(true);
    };

    window.addEventListener("open-byok-modal", handleOpenByok);
    window.addEventListener("open-auth-modal", handleOpenAuth);

    return () => {
      window.removeEventListener("open-byok-modal", handleOpenByok);
      window.removeEventListener("open-auth-modal", handleOpenAuth);
    };
  }, [user.anthropicKey, user.siliconFlowKey]);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKeys(siliconKey, anthropicKey);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setKeyModalOpen(false);
    }, 1200);
  };

  const handleClearKeys = () => {
    setSiliconKey("");
    setAnthropicKey("");
    saveApiKeys("", "");
    setTestResult("All API keys removed from browser storage.");
  };

  const handleTestKey = () => {
    setIsTestingKey(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingKey(false);
      if (siliconKey.startsWith("sk-") && siliconKey.length > 20) {
        setTestResult("SiliconFlow Key format valid (Bearer token prefix verified).");
      } else if (!siliconKey) {
        setTestResult("No SiliconFlow key provided. Blueprint Mode will be used.");
      } else {
        setTestResult("Invalid key format: SiliconFlow keys typically begin with sk-");
      }
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    login(loginEmail, loginName || undefined);
    setAuthModalOpen(false);
  };

  const navItems = [
    { label: "Studio", href: "/app" },
    { label: "Pipeline", href: "/workflow" },
    { label: "Projects", href: "/dashboard" },
    { label: "Billing", href: "/billing" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#05070B]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-background shadow-glow transition group-hover:scale-105">
                <Clapperboard className="size-5 font-bold" />
              </div>
              <div>
                <span className="font-sora text-base font-bold tracking-tight text-white">
                  CineSync
                </span>
                <span className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-accent border border-accent/20">
                  Director OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
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
                        ? "bg-white/10 text-white font-semibold"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Command Palette Button */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 hover:border-accent/30 hover:text-white transition"
              title={`Open Command Palette (${isMac ? "⌘K" : "Ctrl+K"})`}
              aria-label="Open Command Palette"
            >
              <Search className="size-3.5 text-accent" />
              <span>Command Palette...</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                {isMac ? "⌘K" : "Ctrl+K"}
              </kbd>
            </button>

            {/* BYOK API Key Button */}
            <button
              type="button"
              onClick={() => {
                setSiliconKey(user.siliconFlowKey || "");
                setAnthropicKey(user.anthropicKey || "");
                setTestResult(null);
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
                {user.siliconFlowKey ? "BYOK Active" : "BYOK Key"}
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

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/8 bg-[#05070B]/98 px-6 py-4 backdrop-blur-2xl md:hidden">
            <div className="mb-3 flex items-center justify-between border-b border-white/8 pb-3 text-xs text-slate-300">
              <span>Director: {user.name}</span>
              <span className="text-gold font-medium">{formatCredits(user.credits)}</span>
            </div>
            <nav className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPaletteOpen(true);
                }}
                className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/10 px-4 py-2.5 text-sm text-accent text-left font-medium"
              >
                <span className="flex items-center gap-2">
                  <Command className="size-4" />
                  Command Palette
                </span>
                <span className="text-xs font-mono">{isMac ? "⌘K" : "Ctrl+K"}</span>
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
        title="Bring Your Own Key (BYOK) Management"
        description="Configure your personal AI provider keys. Keys are stored unencrypted in browser localStorage."
      >
        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div className="rounded-xl border border-amber/30 bg-amber/10 p-3 text-xs text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="size-4 shrink-0 text-amber mt-0.5" />
            <div>
              <strong>Client-Side Storage Disclaimer:</strong> Keys reside in your browser&apos;s localStorage to allow direct communication with model APIs. For shared workstations, clear keys after finishing your session.
            </div>
          </div>

          <div>
            <label htmlFor="silicon-key-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              SiliconFlow API Key (Wan2.2 AI Video Provider)
            </label>
            <div className="relative mt-1.5">
              <input
                id="silicon-key-input"
                type={showSiliconKey ? "text" : "password"}
                value={siliconKey}
                onChange={(e) => setSiliconKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxx"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white font-mono outline-none transition focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowSiliconKey(!showSiliconKey)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                title={showSiliconKey ? "Mask Key" : "Reveal Key"}
                aria-label={showSiliconKey ? "Mask Key" : "Reveal Key"}
              >
                {showSiliconKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Used to render live high-definition AI video MP4s via Wan2.2 diffusion models.
            </p>
          </div>

          <div>
            <label htmlFor="anthropic-key-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Anthropic API Key (Claude 3.5 Screenplay Parsing)
            </label>
            <div className="relative mt-1.5">
              <input
                id="anthropic-key-input"
                type={showAnthropicKey ? "text" : "password"}
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-xxxxxxxxxxxxxxxx"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white font-mono outline-none transition focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                title={showAnthropicKey ? "Mask Key" : "Reveal Key"}
                aria-label={showAnthropicKey ? "Mask Key" : "Reveal Key"}
              >
                {showAnthropicKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Used for intelligent multi-scene screenplay breakdown and dynamic camera vector assignment.
            </p>
          </div>

          {testResult && (
            <div className="rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-slate-200 font-mono">
              {testResult}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleTestKey}
                disabled={isTestingKey}
              >
                {isTestingKey ? "Checking..." : "Verify Format"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-rose hover:bg-rose/10 gap-1.5"
                onClick={handleClearKeys}
              >
                <Trash2 className="size-3.5" />
                Remove Keys
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setKeyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                {keySaved ? <Check className="size-4 text-emerald" /> : <Key className="size-4" />}
                {keySaved ? "Saved!" : "Save Keys"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Account / Login Modal */}
      <Modal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={user.isLoggedIn ? "Director Profile" : "Director Authentication"}
        description={
          user.isLoggedIn
            ? "Manage your active session, plan tier, and available credit balances."
            : "Sign in to persist your screenplay sequences and multi-shot blueprints."
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
                <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">Balance</div>
                <div className="mt-1 text-xl font-semibold text-white">{formatCredits(user.credits)}</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/30 p-3.5">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">BYOK Status</div>
                <div className="mt-1 text-sm font-medium text-emerald">
                  {user.siliconFlowKey ? "Active (SiliconFlow)" : "Blueprint Mode"}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-rose hover:bg-rose/10"
                onClick={() => {
                  logout();
                  setAuthModalOpen(false);
                }}
              >
                Sign Out
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAuthModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                id="login-email-input"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="director@studio.com"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="login-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Director Name (Optional)
              </label>
              <input
                id="login-name-input"
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                placeholder="Jane Campion"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent"
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
                Sign In
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
