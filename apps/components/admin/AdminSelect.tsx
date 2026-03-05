// ============================================================
// Admin Select — Custom dropdown with admin dark theme
// Smooth animations with admin colors
// ============================================================

"use client";

import { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

// Inject custom keyframes
if (typeof document !== "undefined") {
  const styleId = "admin-select-animations";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes adminSelectDropdownIn {
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes adminSelectOptionIn {
        from {
          opacity: 0;
          transform: translateX(-8px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .admin-select-dropdown {
        animation: adminSelectDropdownIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .admin-select-option {
        animation: adminSelectOptionIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  }
}

export function AdminSelect({
  label,
  options,
  placeholder = "Select...",
  value,
  onChange,
  className = "",
}: AdminSelectProps) {
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
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`w-full relative ${className}`.trim()}>
      {label && <label className="sr-only">{label}</label>}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between
          px-4 py-3
          bg-admin-surface-hover text-admin-text text-left
          border border-admin-border/60 rounded-2xl text-sm
          outline-none cursor-pointer
          transition-all duration-300 ease-out
          ${
            isOpen
              ? "border-admin-primary/80 shadow-lg shadow-admin-primary/10"
              : "hover:border-admin-border hover:shadow-md"
          }
        `}
      >
        <span className="truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron with smooth rotation */}
        <svg
          className={`w-4 h-4 text-admin-text-muted shrink-0 ml-3 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown panel with smooth animation */}
      {isOpen && (
        <div
          className="
            relative z-50 left-0 right-0
            mt-3 py-2
            bg-admin-surface
            border border-admin-border/80
            rounded-2xl
            shadow-2xl shadow-black/20
            overflow-hidden
            admin-select-dropdown
          "
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                style={{ animationDelay: `${idx * 30}ms` }}
                className={`
                  w-full flex items-center gap-3
                  px-4 py-3 text-left text-sm
                  transition-all duration-200 ease-out
                  admin-select-option
                  ${
                    isSelected
                      ? "bg-admin-primary/15 text-admin-primary font-semibold"
                      : "text-admin-text hover:bg-admin-surface-hover"
                  }
                  rounded-xl mx-1 my-0.5
                `}
              >
                {/* Check indicator with smooth scale */}
                <span
                  className={`
                    w-5 h-5 shrink-0 rounded-full border-2
                    flex items-center justify-center
                    transition-all duration-200 ease-out
                    ${
                      isSelected
                        ? "border-admin-primary bg-admin-primary scale-110"
                        : "border-admin-border/60 scale-100"
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white animate-in zoom-in duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>

                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
