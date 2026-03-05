// ============================================================
// Admin Modal Component
// Reusable modal/dialog with backdrop blur and dark theme
// ============================================================

"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** Max-width class, defaults to max-w-lg */
  maxWidth?: string;
}

import { createPortal } from "react-dom";

export function Modal({
  open,
  onClose,
  children,
  className,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !mounted) return null;

  const modalContent = (
    <>
      {/* Inline keyframes for modal animation */}
      <style>{`
        @keyframes modal-content-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -75%) scale(1); }
        }
      `}</style>

      {/* Backdrop — invisible click-catcher (removed dark color & blur as requested) */}
      <div className="fixed inset-0 z-[100]" onClick={onClose} />

      {/* Modal content — truly fixed center of viewport via portal */}
      <div
        className={cn(
          "fixed z-[101] top-1/2 left-1/2 w-[calc(100%-2rem)]",
          "bg-[var(--color-beige)] rounded-2xl shadow-2xl border border-[var(--color-warm-gray)]/20",
          maxWidth,
          className,
        )}
        style={{
          transform: "translate(-50%, -75%)",
          animation: "modal-content-in 0.2s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--color-warm-gray)] hover:text-[var(--color-dark-olive)] hover:bg-[var(--color-soft-beige)] transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {children}
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

// ============================================================
// Confirm Dialog — small modal for confirmation actions
// ============================================================

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[var(--color-dark-olive)] font-display mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-warm-gray)] mb-6">
            {description}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-warm-gray)] hover:text-[var(--color-dark-olive)] hover:bg-[var(--color-soft-beige)] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
                : "bg-[var(--color-olive)] hover:bg-[var(--color-dark-olive)] shadow-lg shadow-[var(--color-olive)]/25",
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
