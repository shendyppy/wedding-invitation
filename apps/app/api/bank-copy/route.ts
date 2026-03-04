// ============================================================
// API Route: POST/GET /api/bank-copy
// Log bank account copy actions
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { logBankCopy, getBankCopyLogs, getBankCopyStats } from "@/lib/services/bank-copy.service";
import { verifyAdminPassword } from "@/lib/services/admin.service";

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
    const body = await request.json();

    // Validate required fields
    const { guestName, bankName, accountNumber, guestId } = body;

    if (!guestName || !bankName || !accountNumber) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await logBankCopy({
      guestId,
      guestName,
      bankName,
      accountNumber,
      ipAddress,
      userAgent,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats") === "true";

    // Verify admin authentication for logs endpoint
    if (!stats && !verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (stats) {
      // Stats endpoint is public (for showing counts on frontend)
      const result = await getBankCopyStats();
      return NextResponse.json(result);
    }

    const result = await getBankCopyLogs();

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
