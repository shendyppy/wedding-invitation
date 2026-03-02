// ============================================================
// Typography — Atom
// Renders text with the correct font and style based on variant.
// ============================================================

import type { ReactNode } from "react";
import type { TypographyVariant, TypographyTag } from "@/types";

/** Default HTML tag for each typography variant */
const DEFAULT_TAG_MAP: Record<TypographyVariant, TypographyTag> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
  script: "span",
  "script-lg": "span",
};

/** CSS classes for each variant */
const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  h1: "font-serif text-3xl md:text-4xl font-bold tracking-wide uppercase",
  h2: "font-serif text-2xl md:text-3xl font-semibold tracking-wide uppercase",
  h3: "font-serif text-xl md:text-2xl font-semibold tracking-wider uppercase",
  h4: "font-serif text-lg md:text-xl font-medium tracking-wider uppercase",
  body: "font-sans text-base leading-relaxed",
  "body-sm": "font-sans text-sm leading-relaxed",
  caption: "font-sans text-xs tracking-wide uppercase",
  script: "font-script text-4xl md:text-5xl font-normal",
  "script-lg": "font-script text-5xl md:text-7xl font-normal",
};

interface TypographyProps {
  variant?: TypographyVariant;
  as?: TypographyTag;
  className?: string;
  children: ReactNode;
}

export function Typography({
  variant = "body",
  as,
  className = "",
  children,
}: TypographyProps) {
  const Tag = as ?? DEFAULT_TAG_MAP[variant];
  const variantClass = VARIANT_CLASSES[variant];

  return (
    <Tag className={`${variantClass} ${className}`.trim()}>{children}</Tag>
  );
}
