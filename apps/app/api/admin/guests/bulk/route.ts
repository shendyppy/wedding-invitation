// ============================================================
// API Route: POST /api/admin/guests/bulk
// Bulk create guests (admin protected)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/services/admin.service";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return verifyAdminPassword(token);
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { guests } = body;

    if (!Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "guests array is required and must not be empty",
        },
        { status: 400 },
      );
    }

    // Validate all guests
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      if (!g.name || typeof g.name !== "string") {
        return NextResponse.json(
          { success: false, error: `Guest at index ${i} has invalid name` },
          { status: 400 },
        );
      }
      if (typeof g.maxQuota !== "number" || g.maxQuota < 1) {
        return NextResponse.json(
          {
            success: false,
            error: `Guest "${g.name}" has invalid maxQuota (must be >= 1)`,
          },
          { status: 400 },
        );
      }
    }

    // Create all guests with unique tokens
    const createdGuests = await Promise.all(
      guests.map(
        async (g: { name: string; maxQuota: number; phone?: string }) => {
          const uniqueToken = nanoid(10);
          return prisma.guest.create({
            data: {
              name: g.name.trim(),
              phone: g.phone || null,
              maxQuota: g.maxQuota,
              uniqueToken,
              isOpened: false,
              rsvpSubmitted: false,
            },
          });
        },
      ),
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const guestsWithUrls = createdGuests.map((g) => ({
      ...g,
      invitationUrl: `${appUrl}/invite/${g.uniqueToken}`,
    }));

    return NextResponse.json({
      success: true,
      data: guestsWithUrls,
      count: guestsWithUrls.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
