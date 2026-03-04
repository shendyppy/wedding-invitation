// ============================================================
// Select — Atom
// Dropdown select with beige/cream background.
// ============================================================

import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
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
  value,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full relative group">
      {label && (
        <label htmlFor={selectId} className="sr-only">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-5! py-3.5! bg-[var(--color-soft-beige)]! text-[var(--color-dark-olive)] border border-[var(--color-warm-gray)]/20 rounded-xl! font-sans text-sm outline-none appearance-none cursor-pointer transition-all duration-300 focus:border-[var(--color-olive)] focus:ring-2 focus:ring-[var(--color-olive)]/20 hover:border-[var(--color-warm-gray)]/30 ${className}`.trim()}
        value={value ?? ""}
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
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-warm-gray)] pointer-events-none transition-transform duration-300 group-focus-within:-rotate-180"
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
