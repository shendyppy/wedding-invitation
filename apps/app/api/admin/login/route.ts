// ============================================================
// API Route: POST /api/admin/login
// Server-side admin authentication
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/services/admin.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 },
      );
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      token: password, // The password itself acts as the bearer token for subsequent API calls
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
