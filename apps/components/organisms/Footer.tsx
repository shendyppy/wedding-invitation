// ============================================================
// Footer — Organism
// Copyright and credits.
// ============================================================

import { Typography } from "@/components/atoms";

export function Footer() {
  return (
    <footer
      id="footer"
      className="py-6 bg-[var(--color-olive)]/20! text-center"
    >
      <Typography variant="caption" className="text-white!">
        Made with ♡ for Stevana &amp; Zulfikar
      </Typography>
      <Typography variant="caption" as="p" className="text-white! mt-1">
        © 2026
      </Typography>
    </footer>
  );
}
