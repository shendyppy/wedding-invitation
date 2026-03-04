// ============================================================
// API Route: POST /api/rsvp
// Submit RSVP
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { submitRsvp } from "@/lib/services/rsvp.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { guestToken, attendanceStatus, numberOfAttendees } = body;

    if (!guestToken) {
      return NextResponse.json(
        { success: false, error: "Guest token is required" },
        { status: 400 }
      );
    }

    if (!attendanceStatus || !["hadir", "tidak_hadir"].includes(attendanceStatus)) {
      return NextResponse.json(
        { success: false, error: "Valid attendance status is required" },
        { status: 400 }
      );
    }

    if (typeof numberOfAttendees !== "number" || numberOfAttendees < 0) {
      return NextResponse.json(
        { success: false, error: "Valid number of attendees is required" },
        { status: 400 }
      );
    }

    const result = await submitRsvp({
      guestToken,
      attendanceStatus,
      numberOfAttendees,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
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
