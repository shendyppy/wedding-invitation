// ============================================================
// API Route: GET /api/guest/[token]
// Fetch guest by unique token
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getGuestByToken, markInvitationOpened } from "@/lib/services/guest.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Validate token
    const guestResult = await getGuestByToken(token);

    if (!guestResult.success || !guestResult.data) {
      return NextResponse.json(
        { success: false, error: guestResult.error || "Guest not found" },
        { status: 404 }
      );
    }

    // Mark invitation as opened (async, don't wait)
    markInvitationOpened(token).catch(() => {
      // Silently fail - this is just tracking
    });

    return NextResponse.json({
      success: true,
      data: {
        id: guestResult.data.id,
        name: guestResult.data.name,
        maxQuota: guestResult.data.maxQuota,
        rsvp: guestResult.data.rsvp,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
