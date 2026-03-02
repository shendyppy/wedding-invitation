// ============================================================
// Input — Atom
// Styled text input with soft rounded border.
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
        className={`w-full px-5! py-3.5! bg-[var(--color-soft-beige)]! text-[var(--color-dark-olive)] placeholder:text-[var(--color-warm-gray)] border border-[var(--color-warm-gray)]/20 rounded-xl! font-sans text-sm outline-none focus:border-[var(--color-olive)] transition-all duration-300 ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
