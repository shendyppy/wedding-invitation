// ============================================================
// Divider — Atom
// Vertical or horizontal decorative line.
// ============================================================

import type { Orientation } from "@/types";

interface DividerProps {
  orientation?: Orientation;
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  const baseClasses =
    orientation === "vertical"
      ? "w-px bg-[var(--color-warm-gray)] opacity-50 self-stretch min-h-[40px]"
      : "h-px w-full bg-[var(--color-warm-gray)] opacity-50";

  return (
    <div className={`${baseClasses} ${className}`.trim()} role="separator" />
  );
}
