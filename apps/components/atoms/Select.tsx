// ============================================================
// Select — Atom
// Custom dropdown select with styled options panel.
// Replaces native <select> for consistent look across devices.
// ============================================================

"use client";

import { useState, useRef, useEffect } from "react";
import type { HTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

export function Select({
  label,
  options,
  placeholder = "Pilih...",
  className = "",
  value,
  onChange,
  required,
  disabled,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange?.({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`w-full relative ${className}`.trim()}>
      {label && (
        <label className="sr-only">{label}</label>
      )}

      {/* Hidden native select for form validation */}
      {required && (
        <select
          name={name}
          value={value ?? ""}
          required
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 pointer-events-none"
          onChange={() => {}}
        >
          <option value="" disabled />
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between
          px-5 py-3.5
          bg-[var(--color-soft-beige)] text-left
          border rounded-xl font-sans text-sm
          outline-none cursor-pointer
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen
            ? "border-[var(--color-olive)] ring-2 ring-[var(--color-olive)]/20"
            : "border-[var(--color-warm-gray)]/20 hover:border-[var(--color-warm-gray)]/30"
          }
          ${selectedOption
            ? "text-[var(--color-dark-olive)]"
            : "text-[var(--color-warm-gray)]"
          }
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-[var(--color-warm-gray)] shrink-0 ml-2 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className="
            absolute z-50 left-0 right-0
            mt-1.5 py-1.5
            bg-[var(--color-soft-beige)]
            border border-[var(--color-warm-gray)]/20
            rounded-xl
            shadow-lg shadow-black/8
            overflow-hidden
            animate-in fade-in slide-in-from-top-1
          "
          style={{
            animation: "selectDropIn 0.2s ease-out",
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center gap-3
                  px-5 py-3 text-left text-sm font-sans
                  transition-colors duration-150
                  ${isSelected
                    ? "bg-[var(--color-olive)]/10 text-[var(--color-olive)] font-medium"
                    : "text-[var(--color-dark-olive)] hover:bg-[var(--color-olive)]/5"
                  }
                `}
              >
                {/* Check indicator */}
                <span
                  className={`
                    w-4 h-4 shrink-0 rounded-full border-2
                    flex items-center justify-center
                    transition-all duration-200
                    ${isSelected
                      ? "border-[var(--color-olive)] bg-[var(--color-olive)]"
                      : "border-[var(--color-warm-gray)]/30"
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>

                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
