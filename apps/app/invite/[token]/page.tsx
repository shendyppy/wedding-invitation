// ============================================================
// /invite/[token] — Dynamic Invitation Page
// Each guest has a unique token that maps to their name.
// ============================================================

import { InvitationTemplate } from "@/components/templates";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

/**
 * Dynamic invite page.
 * In future, the token will be looked up from Supabase to fetch
 * the guest name and quota. For now, we use a placeholder.
 */
export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  // TODO: Replace with Supabase lookup
  // const guest = await supabase.from('guests').select('*').eq('unique_token', token).single();
  const guestName = decodeURIComponent(token).replace(/-/g, " ");

  return <InvitationTemplate guestName={guestName} />;
}

/**
 * Generate metadata for the invite page.
 */
export async function generateMetadata({ params }: InvitePageProps) {
  const { token } = await params;
  const guestName = decodeURIComponent(token).replace(/-/g, " ");

  return {
    title: `Wedding Invitation — ${guestName}`,
    description:
      "You are invited to the wedding of Stevana & Zulfikar on April 11, 2026.",
    openGraph: {
      title: `Stevana & Zulfikar Wedding — ${guestName}`,
      description: "You are invited to witness the beginning of our forever.",
      type: "website",
    },
  };
}
