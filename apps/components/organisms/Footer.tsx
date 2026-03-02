// ============================================================
// Footer — Organism
// Copyright and credits.
// ============================================================

import { Typography } from "@/components/atoms";

export function Footer() {
  return (
    <footer id="footer" className="py-6 bg-[var(--color-cream)] text-center">
      <Typography variant="caption" className="text-[var(--color-warm-gray)]">
        Made with ♡ for Stevana &amp; Zulfikar
      </Typography>
      <Typography
        variant="caption"
        as="p"
        className="text-[var(--color-warm-gray)]/60 mt-1"
      >
        © 2026
      </Typography>
    </footer>
  );
}
