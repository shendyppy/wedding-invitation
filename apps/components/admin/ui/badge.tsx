// ============================================================
// Admin Badge Component
// Styled badges for dark admin theme
// ============================================================

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-olive)] text-white hover:bg-[var(--color-olive)]/80",
        secondary:
          "border-transparent bg-[var(--color-warm-gray)]/20 text-[var(--color-dark-olive)] hover:bg-[var(--color-warm-gray)]/30",
        destructive:
          "border-transparent bg-red-400 text-white hover:bg-red-500",
        outline: "border border-[var(--color-warm-gray)]/30 text-[var(--color-warm-gray)]",
        success:
          "border-transparent bg-[var(--color-olive)] text-white hover:bg-[var(--color-dark-olive)]",
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        info: "border-transparent bg-[var(--color-warm-gray)] text-white hover:bg-[var(--color-dark-olive)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
