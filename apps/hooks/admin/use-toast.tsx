// ============================================================
// useToast Hook
// Simple toast notification system for admin panel
// ============================================================

"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant?: "default" | "destructive" | "success";
}

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, message, variant = "default" }: Omit<Toast, "id">) => {
      const id = `toast-${toastCount++}`;
      const newToast: Toast = { id, title, message, variant };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}

// Toast component for rendering
export function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto min-w-[300px] max-w-md p-4 rounded-lg shadow-lg
            flex items-start gap-3 animate-slide-in
            ${
              t.variant === "destructive"
                ? "bg-red-500 text-white"
                : t.variant === "success"
                ? "bg-emerald-500 text-white"
                : "admin-surface admin-text border"
            }
          `}
        >
          <div className="flex-1">
            {t.title && <p className="font-semibold mb-1">{t.title}</p>}
            <p className="text-sm opacity-90">{t.message}</p>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
