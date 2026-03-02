// ============================================================
// Textarea — Atom
// Multi-line text area with beige/cream background.
// ============================================================

import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({
  label,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="sr-only">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-3 bg-[var(--color-soft-beige)] text-[var(--color-dark-olive)] placeholder:text-[var(--color-warm-gray)] border border-transparent rounded-[var(--radius-sm)] font-sans text-sm outline-none focus:border-[var(--color-olive)] transition-colors duration-300 resize-none min-h-[120px] ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
