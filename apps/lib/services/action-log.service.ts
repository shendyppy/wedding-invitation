// ============================================================
// Action Log Service — Track all user interactions
// ============================================================

import { prisma } from "@/lib/prisma";
import type { ActionLog, ActionType, Prisma } from "@prisma/client";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface LogActionInput {
  guestId?: string;
  guestName: string;
  actionType: ActionType;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log a user action
 */
export async function logAction(
  input: LogActionInput,
): Promise<ApiResponse<ActionLog>> {
  try {
    const log = await prisma.actionLog.create({
      data: {
        guestId: input.guestId || null,
        guestName: input.guestName,
        actionType: input.actionType,
        metadata: (input.metadata as Prisma.InputJsonValue) || undefined,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      },
    });

    return { success: true, data: log };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to log action",
    };
  }
}

/**
 * Get all action logs (admin only), optionally filter by type
 */
export async function getActionLogs(
  actionType?: ActionType,
): Promise<ApiResponse<(ActionLog & { guest?: { name: string } | null })[]>> {
  try {
    const logs = await prisma.actionLog.findMany({
      where: actionType ? { actionType } : undefined,
      include: {
        guest: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return { success: true, data: logs };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch logs",
    };
  }
}

/**
 * Get action stats grouped by action type (admin only)
 */
export async function getActionStats(): Promise<
  ApiResponse<{
    byType: { actionType: string; count: number; label: string }[];
    total: number;
    recentActivity: { date: string; count: number }[];
  }>
> {
  try {
    const logs = await prisma.actionLog.findMany({
      select: { actionType: true, createdAt: true },
    });

    // Group by action type
    const byTypeMap = logs.reduce(
      (acc, log) => {
        acc[log.actionType] = (acc[log.actionType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const typeLabels: Record<string, string> = {
      BANK_COPY: "Bank Account Copied",
      SEE_LOCATION: "Viewed Location",
      SAVE_THE_DATE: "Saved the Date",
      OPEN_INVITATION: "Opened Invitation",
      COPY_LINK: "Copied Link",
      SUBMIT_RSVP: "Submitted RSVP",
      SUBMIT_WISH: "Sent Wish",
      OTHER: "Other",
    };

    const byType = Object.entries(byTypeMap).map(([actionType, count]) => ({
      actionType,
      count,
      label: typeLabels[actionType] || actionType,
    }));

    // Group by date (last 7 days)
    const dateMap = logs.reduce(
      (acc, log) => {
        const date = log.createdAt.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentActivity = Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);

    return {
      success: true,
      data: {
        byType,
        total: logs.length,
        recentActivity,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}
