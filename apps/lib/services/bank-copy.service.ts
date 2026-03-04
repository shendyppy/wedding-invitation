// ============================================================
// Bank Copy Log Service — Track bank account copies
// ============================================================

import { prisma } from "@/lib/prisma";
import type { BankCopyLog } from "@prisma/client";

export interface LogBankCopyInput {
  guestId?: string;
  guestName: string;
  bankName: string;
  accountNumber: string;
  ipAddress?: string;
  userAgent?: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Log bank account copy action
 */
export async function logBankCopy(
  input: LogBankCopyInput
): Promise<ApiResponse<BankCopyLog>> {
  try {
    const log = await prisma.bankCopyLog.create({
      data: {
        guestId: input.guestId || null,
        guestName: input.guestName,
        bankName: input.bankName,
        accountNumber: input.accountNumber,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      },
    });

    return { success: true, data: log };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to log bank copy",
    };
  }
}

/**
 * Get all bank copy logs (admin only)
 */
export async function getBankCopyLogs(): Promise<
  ApiResponse<(BankCopyLog & { guest?: { name: string } | null })[]>
> {
  try {
    const logs = await prisma.bankCopyLog.findMany({
      include: {
        guest: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { success: true, data: logs };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch logs",
    };
  }
}

/**
 * Get bank copy statistics (admin only)
 */
export async function getBankCopyStats(): Promise<
  ApiResponse<{ byBank: { bankName: string; count: number }[]; total: number }>
> {
  try {
    const logs = await prisma.bankCopyLog.findMany({
      select: { bankName: true },
    });

    const byBank = logs.reduce((acc, log) => {
      acc[log.bankName] = (acc[log.bankName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        byBank: Object.entries(byBank).map(([bankName, count]) => ({
          bankName,
          count,
        })),
        total: logs.length,
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
