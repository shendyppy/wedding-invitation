// ============================================================
// Select — Atom
// Dropdown select with beige/cream background.
// ============================================================

import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder = "Pilih...",
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={selectId} className="sr-only">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-3 bg-[var(--color-soft-beige)] text-[var(--color-dark-olive)] border border-transparent rounded-[var(--radius-sm)] font-sans text-sm outline-none focus:border-[var(--color-olive)] transition-colors duration-300 appearance-none cursor-pointer ${className}`.trim()}
        defaultValue=""
        {...props}
      >
        <option value="" disabled className="text-[var(--color-warm-gray)]">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Dropdown arrow */}
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-warm-gray)] pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
