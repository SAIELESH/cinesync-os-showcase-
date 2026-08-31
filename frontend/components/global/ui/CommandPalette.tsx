import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Clapperboard,
  Film,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  Play,
  ArrowRight,
  Command,
  X
} from "lucide-react";

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Director Presets" | "Camera Physics" | "Pipeline Actions";
  icon: typeof Film;
  action: () => void;
  shortcut?: string;
};

type CommandPaletteProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function CommandPalette({ isOpen: controlledOpen, onClose: controlledClose }: CommandPaletteProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onClose = controlledClose || (() => setInternalOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (controlledOpen === undefined) {
          setInternalOpen((prev) => !prev);
        } else if (isOpen) {
          controlledClose?.();
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [controlledClose, controlledOpen, isOpen, onClose]);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-studio",
        title: "Director Studio Mode",
        subtitle: "Jump into interactive scene and camera direct controls",
        category: "Navigation",
        icon: Clapperboard,
        shortcut: "G S",
        action: () => {
          router.push("/app");
          onClose();
        }
      },
      {
        id: "nav-workflow",
        title: "Studio Pipeline Workflow",
        subtitle: "Script breakdown, multi-shot decomposition, and rendering",
        category: "Navigation",
        icon: Film,
        shortcut: "G W",
        action: () => {
          router.push("/workflow");
          onClose();
        }
      },
      {
        id: "nav-generate",
        title: "Generate Scene",
        subtitle: "Direct video generation composer",
        category: "Navigation",
        icon: Sparkles,
        shortcut: "G G",
        action: () => {
          router.push("/generate");
          onClose();
        }
      },
      {
        id: "preset-24mm",
        title: "Lens Preset: 24mm Anamorphic Wide",
        subtitle: "Expansive cinematic establishing framing with subtle edge distortion",
        category: "Director Presets",
        icon: Camera,
        action: () => {
          router.push("/app?lens=Wide&ratio=2.39");
          onClose();
        }
      },
      {
        id: "preset-50mm",
        title: "Lens Preset: 50mm Prime Natural",
        subtitle: "Human-eye perspective, standard cinematic dialogue coverage",
        category: "Director Presets",
        icon: Camera,
        action: () => {
          router.push("/app?lens=Natural&ratio=16:9");
          onClose();
        }
      },
      {
        id: "preset-85mm",
        title: "Lens Preset: 85mm Telephoto Portrait",
        subtitle: "Shallow depth of field, compressed background, intense character focus",
        category: "Director Presets",
        icon: Camera,
        action: () => {
          router.push("/app?lens=Close&ratio=2.39");
          onClose();
        }
      },
      {
        id: "cam-dolly",
        title: "Camera Move: Slow Push Dolly",
        subtitle: "Tension builder, optical zoom parallax toward character subject",
        category: "Camera Physics",
        icon: Sliders,
        action: () => {
          router.push("/app?move=Dolly");
          onClose();
        }
      },
      {
        id: "cam-tracking",
        title: "Camera Move: Lateral Tracking",
        subtitle: "Follow subject motion across dynamic production environments",
        category: "Camera Physics",
        icon: Sliders,
        action: () => {
          router.push("/app?move=Tracking");
          onClose();
        }
      },
      {
        id: "action-pipeline",
        title: "Execute Multi-Shot Wan2.2 Pipeline",
        subtitle: "Run deterministic multi-shot generative render queue",
        category: "Pipeline Actions",
        icon: Play,
        action: () => {
          router.push("/workflow");
          onClose();
        }
      }
    ],
    [onClose, router]
  );

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const q = search.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [commands, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B1017] shadow-modal-elevation"
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-white/10 px-4 py-3.5">
              <Search className="size-5 text-accent" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command, lens preset, or search scenes... (e.g. 50mm, dolly, studio)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="ml-3 flex-1 bg-transparent text-base text-white placeholder-slate-400 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-400">
                <span>ESC</span>
              </div>
            </div>

            {/* Command List */}
            <div className="max-h-[380px] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No matching director commands found for &ldquo;{search}&rdquo;
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                          isSelected
                            ? "bg-accent/10 text-white border border-accent/30"
                            : "text-slate-300 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                              isSelected ? "bg-accent text-background" : "bg-white/5 text-slate-400"
                            }`}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-white">{cmd.title}</div>
                            <div className="truncate text-xs text-slate-400">{cmd.subtitle}</div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 pl-3">
                          <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                            {cmd.category}
                          </span>
                          {cmd.shortcut && (
                            <span className="text-xs font-mono text-slate-400">{cmd.shortcut}</span>
                          )}
                          {isSelected && <ArrowRight className="size-4 text-accent" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">↑</kbd>
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">↵</kbd> to select
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Command className="size-3.5 text-accent" />
                <span>Director OS Quick Engine</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
