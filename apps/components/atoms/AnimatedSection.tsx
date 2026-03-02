// ============================================================
// AnimatedSection — Atom
// Wraps any section with scroll-triggered animation.
// ============================================================

"use client";

import type { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
  delay?: 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;
  threshold?: number;
  id?: string;
}

const ANIM_CLASS: Record<
  NonNullable<AnimatedSectionProps["animation"]>,
  string
> = {
  "fade-up": "anim-fade-up",
  "fade-in": "anim-fade-in",
  "scale-in": "anim-scale-in",
  "slide-left": "anim-slide-left",
  "slide-right": "anim-slide-right",
};

export function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
  id,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const delayClass = delay > 0 ? `anim-delay-${delay}` : "";
  const animClass = ANIM_CLASS[animation];
  const visibleClass = isVisible ? "is-visible" : "";

  return (
    <div
      ref={ref}
      id={id}
      className={`${animClass} ${delayClass} ${visibleClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
