// ============================================================
// API Route: GET /api/admin/rsvps
// Get all RSVPs (protected)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAllRsvps } from "@/lib/services/rsvp.service";
import { verifyAdminPassword } from "@/lib/services/admin.service";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return verifyAdminPassword(token);
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await getAllRsvps();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
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
