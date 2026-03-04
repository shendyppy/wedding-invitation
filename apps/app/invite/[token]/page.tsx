// ============================================================
// /invite/[token] — Dynamic Invitation Page
// Each guest has a unique token that maps to their data in Supabase.
// ============================================================

import { notFound } from "next/navigation";
import { InvitationTemplate } from "@/components/templates";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

/**
 * Dynamic invite page.
 * Fetches guest data from Supabase by unique token.
 */
export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  // Fetch guest from Supabase
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/guest/${token}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();

  if (!result.success) {
    notFound();
  }

  const { id, name, maxQuota, rsvp } = result.data;

  return (
    <InvitationTemplate
      guestName={name}
      guestToken={token}
      guestId={id}
      maxQuota={maxQuota}
      existingRsvp={rsvp}
    />
  );
}

/**
 * Generate metadata for the invite page.
 */
export async function generateMetadata({ params }: InvitePageProps) {
  const { token } = await params;

  // Fetch guest for metadata
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/guest/${token}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return {
      title: "Wedding Invitation",
      description: "You are invited to a wedding celebration.",
    };
  }

  const result = await response.json();
  const guestName = result.success ? result.data.name : "Guest";

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
