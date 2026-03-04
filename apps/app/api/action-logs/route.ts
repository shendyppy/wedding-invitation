// ============================================================
// API Route: POST/GET /api/action-logs
// General action logging for all user interactions
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  logAction,
  getActionLogs,
  getActionStats,
} from "@/lib/services/action-log.service";
import { verifyAdminPassword } from "@/lib/services/admin.service";
import type { ActionType } from "@prisma/client";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return verifyAdminPassword(token);
}

const VALID_ACTION_TYPES = [
  "BANK_COPY",
  "SEE_LOCATION",
  "SAVE_THE_DATE",
  "OPEN_INVITATION",
  "COPY_LINK",
  "SUBMIT_RSVP",
  "SUBMIT_WISH",
  "OTHER",
];

/**
 * POST — public endpoint for frontend to log actions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestName, guestId, actionType, metadata } = body;

    if (!guestName || !actionType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: guestName, actionType",
        },
        { status: 400 },
      );
    }

    if (!VALID_ACTION_TYPES.includes(actionType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid actionType. Must be one of: ${VALID_ACTION_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await logAction({
      guestId,
      guestName,
      actionType: actionType as ActionType,
      metadata,
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
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
      { status: 500 },
    );
  }
}

/**
 * GET — admin-protected endpoint for viewing logs
 * Query params:
 *   ?stats=true  → returns aggregated stats
 *   ?type=BANK_COPY → filter by action type
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats") === "true";
    const typeFilter = searchParams.get("type") as ActionType | null;

    // Stats endpoint can be public (for dashboard widgets)
    if (stats) {
      const result = await getActionStats();
      return NextResponse.json(result);
    }

    // Logs endpoint requires admin auth
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const result = await getActionLogs(typeFilter || undefined);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
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
      { status: 500 },
    );
  }
}
