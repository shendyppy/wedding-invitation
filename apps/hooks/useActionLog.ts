// ============================================================
// useActionLog — Hook for logging user actions to the API
// ============================================================

import { useCallback } from "react";

interface ActionLogParams {
  guestId?: string;
  guestName?: string;
}

export function useActionLog({ guestId, guestName }: ActionLogParams) {
  const logAction = useCallback(
    (actionType: string, metadata?: Record<string, unknown>) => {
      fetch("/api/action-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guestId || undefined,
          guestName: guestName || "Anonymous",
          actionType,
          metadata,
        }),
      }).catch(() => {
        // Silently fail — action logging should never block user experience
      });
    },
    [guestId, guestName],
  );

  return { logAction };
}
