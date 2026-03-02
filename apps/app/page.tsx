// ============================================================
// Root Page — Landing / Preview
// Redirects to the invite page or shows a preview.
// ============================================================

import { InvitationTemplate } from "@/components/templates";

/**
 * Root page serves as a preview (no specific guest).
 * In production, guests will access /invite/[token] instead.
 */
export default function HomePage() {
  return <InvitationTemplate />;
}
