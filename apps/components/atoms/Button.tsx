// ============================================================
// Button — Atom
// Olive primary, outline, and icon-only button variants.
// ============================================================

import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { ButtonVariant, ButtonSize } from "@/types";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-olive)] text-white hover:bg-[var(--color-dark-olive)] active:scale-[0.98]",
  outline:
    "border border-[var(--color-olive)] text-[var(--color-olive)] hover:bg-[var(--color-olive)] hover:text-white active:scale-[0.98]",
  icon: "text-[var(--color-olive)] hover:text-[var(--color-dark-olive)] p-2",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium transition-all duration-300 cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${variant !== "icon" ? SIZE_CLASSES[size] : ""} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
