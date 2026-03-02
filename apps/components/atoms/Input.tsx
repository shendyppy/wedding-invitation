// ============================================================
// Input — Atom
// Styled text input with beige/cream background.
// ============================================================

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-[var(--color-soft-beige)] text-[var(--color-dark-olive)] placeholder:text-[var(--color-warm-gray)] border border-transparent rounded-[var(--radius-sm)] font-sans text-sm outline-none focus:border-[var(--color-olive)] transition-colors duration-300 ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
