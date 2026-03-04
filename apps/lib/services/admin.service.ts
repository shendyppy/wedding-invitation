// ============================================================
// Admin Service — Dashboard statistics (Prisma)
// ============================================================

import { prisma } from "@/lib/prisma";

export interface AdminSummary {
  totalGuests: number;
  totalRsvps: number;
  confirmedAttendance: number;
  declinedAttendance: number;
  totalAttendees: number;
  totalWishes: number;
  openedInvitations: number;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get admin dashboard summary statistics
 */
export async function getAdminSummary(): Promise<ApiResponse<AdminSummary>> {
  try {
    const [totalGuests, totalRsvps, confirmedAttendance, declinedAttendance, rsvpsData, totalWishes, openedInvitations] =
      await Promise.all([
        prisma.guest.count(),
        prisma.rsvp.count(),
        prisma.rsvp.count({ where: { attendanceStatus: "hadir" } }),
        prisma.rsvp.count({ where: { attendanceStatus: "tidak_hadir" } }),
        prisma.rsvp.findMany({
          where: { attendanceStatus: "hadir" },
          select: { numberOfAttendees: true },
        }),
        prisma.wish.count(),
        prisma.guest.count({ where: { isOpened: true } }),
      ]);

    const totalAttendees = rsvpsData.reduce(
      (sum: number, rsvp: { numberOfAttendees: number }) => sum + rsvp.numberOfAttendees,
      0
    );

    return {
      success: true,
      data: {
        totalGuests,
        totalRsvps,
        confirmedAttendance,
        declinedAttendance,
        totalAttendees,
        totalWishes,
        openedInvitations,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch summary",
    };
  }
}

/**
 * Get guest statistics for admin dashboard
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
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return password === adminPassword;
}
