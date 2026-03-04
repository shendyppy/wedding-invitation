// ============================================================
// Guest Service — Guest CRUD operations (Prisma)
// ============================================================

import type { Guest, Rsvp, AttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type GuestWithRsvp = Guest & {
  rsvp: Rsvp | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch guest by unique token
 */
export async function getGuestByToken(
  token: string
): Promise<ApiResponse<GuestWithRsvp>> {
  try {
    const guest = await prisma.guest.findUnique({
      where: { uniqueToken: token },
      include: { rsvp: true },
    });

    if (!guest) {
      return { success: false, error: "Invalid invitation token" };
    }

    return { success: true, data: guest };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch guest",
    };
  }
}

/**
 * Mark invitation as opened
 */
export async function markInvitationOpened(
  token: string
): Promise<ApiResponse<void>> {
  try {
    await prisma.guest.update({
      where: { uniqueToken: token },
      data: { isOpened: true },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update guest",
    };
  }
}

/**
 * Mark RSVP as submitted for a guest
 */
export async function markRsvpSubmitted(
  guestId: string
): Promise<ApiResponse<void>> {
  try {
    await prisma.guest.update({
      where: { id: guestId },
      data: {
        rsvpSubmitted: true,
        rsvpSubmittedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update guest",
    };
  }
}

/**
 * Get guest statistics
 */
export async function getGuestStats(): Promise<
  ApiResponse<{
    total: number;
    opened: number;
    rsvpSubmitted: number;
    withRsvp: number;
    withoutRsvp: number;
  }>
> {
  try {
    const [total, opened, rsvpSubmitted, withRsvp] = await Promise.all([
      prisma.guest.count(),
      prisma.guest.count({ where: { isOpened: true } }),
      prisma.guest.count({ where: { rsvpSubmitted: true } }),
      prisma.rsvp.count(),
    ]);

    return {
      success: true,
      data: {
        total,
        opened,
        rsvpSubmitted,
        withRsvp,
        withoutRsvp: total - withRsvp,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}

/**
 * Get all guests (admin only)
 */
export async function getAllGuests(): Promise<ApiResponse<GuestWithRsvp[]>> {
  try {
    const guests = await prisma.guest.findMany({
      include: { rsvp: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: guests };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch guests",
    };
  }
}

/**
 * Create a new guest (admin only)
 */
export async function createGuest(
  guest: {
    name: string;
    phone: string | null;
    maxQuota: number;
    uniqueToken: string;
  }
): Promise<ApiResponse<Guest>> {
  try {
    const newGuest = await prisma.guest.create({
      data: {
        name: guest.name,
        phone: guest.phone,
        maxQuota: guest.maxQuota,
        uniqueToken: guest.uniqueToken,
        // Default values
        isOpened: false,
        rsvpSubmitted: false,
      },
    });

    return { success: true, data: newGuest };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create guest",
    };
  }
}
