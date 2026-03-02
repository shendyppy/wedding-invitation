// ============================================================
// CountdownTimer — Molecule
// Displays Days / Hours / Minutes / Seconds countdown.
// ============================================================

"use client";

import { CountdownUnit } from "@/components/atoms";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export function CountdownTimer({
  targetDate,
  className = "",
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-4 md:gap-6 ${className}`.trim()}
    >
      {units.map((unit) => (
        <CountdownUnit key={unit.label} value={unit.value} label={unit.label} />
      ))}
    </div>
  );
}
