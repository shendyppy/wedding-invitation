// ============================================================
// useCountdown — Countdown timer hook
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import type { CountdownValues } from "@/types";

/**
 * Calculates remaining time between now and the target date.
 */
function calculateTimeLeft(targetDate: Date): CountdownValues {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

/**
 * Custom hook that provides a live countdown to a target date.
 * Updates every second.
 *
 * @param targetDateString - ISO date string for the target date
 * @returns CountdownValues with days, hours, minutes, seconds
 */
export function useCountdown(targetDateString: string): CountdownValues {
  const targetDate = new Date(targetDateString);

  const getTimeLeft = useCallback(
    () => calculateTimeLeft(targetDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [targetDateString],
  );

  const [timeLeft, setTimeLeft] = useState<CountdownValues>(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [getTimeLeft]);

  return timeLeft;
}
