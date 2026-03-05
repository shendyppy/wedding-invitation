// ============================================================
// API Route: PUT/DELETE /api/admin/guests/[id]
// Update or delete a single guest (protected)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { updateGuest, deleteGuest } from "@/lib/services/guest.service";
import { verifyAdminPassword } from "@/lib/services/admin.service";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return verifyAdminPassword(token);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, phone, maxQuota } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name cannot be empty" },
        { status: 400 },
      );
    }

    if (
      maxQuota !== undefined &&
      (typeof maxQuota !== "number" || maxQuota < 1)
    ) {
      return NextResponse.json(
        { success: false, error: "Valid max quota is required" },
        { status: 400 },
      );
    }

    const result = await updateGuest(id, {
      name: name?.trim(),
      phone: phone?.trim() || null,
      maxQuota,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const result = await deleteGuest(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
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
