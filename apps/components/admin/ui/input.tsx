// ============================================================
// Admin Input Component
// Styled input for dark admin theme
// ============================================================

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[var(--color-warm-gray)]/30 bg-white px-3 py-2 text-sm text-[var(--color-dark-olive)] ring-offset-[var(--color-beige)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-warm-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-olive)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
