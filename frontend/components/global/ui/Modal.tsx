import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <Card className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-[var(--font-sora)] text-2xl font-semibold text-white">{title}</h2>
                  {description ? <p className="mt-2 max-w-xl text-sm text-slate-300">{description}</p> : null}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label={`Close ${title}`}>
                  <X className="size-4" />
                </Button>
              </div>
              {children}
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
