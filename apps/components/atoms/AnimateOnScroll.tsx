// ============================================================
// AnimateOnScroll — Wrapper component for scroll animations
// ============================================================

"use client";

import type { ReactNode, CSSProperties } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade"
  | "zoom-in"
  | "zoom-out";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const ANIMATION_STYLES: Record<
  AnimationType,
  { hidden: CSSProperties; visible: CSSProperties }
> = {
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(60px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-down": {
    hidden: { opacity: 0, transform: "translateY(-60px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    hidden: { opacity: 0, transform: "translateX(-60px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    hidden: { opacity: 0, transform: "translateX(60px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "zoom-in": {
    hidden: { opacity: 0, transform: "scale(0.8)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
  "zoom-out": {
    hidden: { opacity: 0, transform: "scale(1.2)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
};

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 800,
  className = "",
  threshold = 0.15,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const styles = ANIMATION_STYLES[animation];

  const currentStyle: CSSProperties = {
    ...(isVisible ? styles.visible : styles.hidden),
    transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} style={currentStyle} className={className}>
      {children}
    </div>
  );
}
