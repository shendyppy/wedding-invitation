// ============================================================
// Wishes Service — Wedding wishes operations (Prisma)
// ============================================================

import type { Wish, AttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type { Wish, AttendanceStatus };

export interface SubmitWishInput {
  guestId?: string;
  name: string;
  message: string;
  attendanceStatus?: AttendanceStatus | null;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Submit a wedding wish
 */
export async function submitWish(
  input: SubmitWishInput
): Promise<ApiResponse<Wish>> {
  try {
    const wish = await prisma.wish.create({
      data: {
        guestId: input.guestId || null,
        name: input.name,
        message: input.message,
        attendanceStatus: input.attendanceStatus,
      },
    });

    return { success: true, data: wish };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit wish",
    };
  }
}

/**
 * Get all wishes (public)
 */
export async function getWishes(): Promise<ApiResponse<Wish[]>> {
  try {
    const wishes = await prisma.wish.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: wishes };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch wishes",
    };
  }
}

/**
 * Get all wishes (admin only - no limit)
 */
export async function getAllWishes(): Promise<
  ApiResponse<(Wish & { guest?: { name: string } | null })[]>
> {
  try {
    const wishes = await prisma.wish.findMany({
      include: {
        guest: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: wishes };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch wishes",
    };
  }
}

/**
 * Delete a wish (admin only)
 */
export async function deleteWish(id: string): Promise<ApiResponse<void>> {
  try {
    await prisma.wish.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete wish",
    };
  }
}
