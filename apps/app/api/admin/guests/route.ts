// ============================================================
// API Route: GET/POST /api/admin/guests
// Get all guests or create a new guest (protected)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAllGuests, createGuest } from "@/lib/services/guest.service";
import { verifyAdminPassword } from "@/lib/services/admin.service";
import { nanoid } from "nanoid";

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

    const result = await getAllGuests();

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

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { name, phone, maxQuota } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (typeof maxQuota !== "number" || maxQuota < 1) {
      return NextResponse.json(
        { success: false, error: "Valid max quota is required" },
        { status: 400 }
      );
    }

    // Generate unique token
    const uniqueToken = nanoid(10);

    const result = await createGuest({
      name,
      phone: phone || null,
      maxQuota,
      uniqueToken,
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
