// ============================================================
// RSVP Service — RSVP operations with validation (Prisma)
// ============================================================

import type { Rsvp, AttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type { Rsvp, AttendanceStatus };

export interface SubmitRsvpInput {
  guestToken: string;
  attendanceStatus: AttendanceStatus;
  numberOfAttendees: number;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Submit RSVP for a guest
 */
export async function submitRsvp(
  input: SubmitRsvpInput
): Promise<ApiResponse<Rsvp>> {
  try {
    // Get the guest to validate quota
    const guest = await prisma.guest.findUnique({
      where: { uniqueToken: input.guestToken },
    });

    if (!guest) {
      return { success: false, error: "Invalid invitation token" };
    }

    // Validate number of attendees
    if (input.numberOfAttendees > guest.maxQuota) {
      return {
        success: false,
        error: `Jumlah tamu melebihi kuota maksimal (${guest.maxQuota})`,
      };
    }

    if (input.numberOfAttendees < 0) {
      return { success: false, error: "Jumlah tamu tidak valid" };
    }

    // Upsert RSVP (update if exists, create if not)
    const result = await prisma.rsvp.upsert({
      where: { guestId: guest.id },
      update: {
        attendanceStatus: input.attendanceStatus,
        numberOfAttendees: input.numberOfAttendees,
      },
      create: {
        guestId: guest.id,
        attendanceStatus: input.attendanceStatus,
        numberOfAttendees: input.numberOfAttendees,
      },
    });

    // Mark RSVP as submitted for the guest
    await prisma.guest.update({
      where: { id: guest.id },
      data: {
        rsvpSubmitted: true,
        rsvpSubmittedAt: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit RSVP",
    };
  }
}

/**
 * Get all RSVPs (admin only)
 */
export async function getAllRsvps(): Promise<ApiResponse<(Rsvp & { guest: { name: string; phone: string | null } })[]>> {
  try {
    const rsvps = await prisma.rsvp.findMany({
      include: {
        guest: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: rsvps };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch RSVPs",
    };
  }
}
