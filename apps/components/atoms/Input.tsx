// ============================================================
// Input — Atom
// Styled text input with soft rounded border.
// ============================================================

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, readOnly, ...props }: InputProps) {
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
        readOnly={readOnly}
        className={`w-full px-5! py-3.5! bg-[var(--color-soft-beige)]! text-[var(--color-dark-olive)] placeholder:text-[var(--color-warm-gray)] border border-[var(--color-warm-gray)]/20 rounded-xl! font-serif text-sm outline-none focus:border-[var(--color-olive)] transition-all duration-300 ${readOnly ? "cursor-not-allowed opacity-70" : ""} ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
