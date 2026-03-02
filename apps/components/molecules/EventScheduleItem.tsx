// ============================================================
// EventScheduleItem — Molecule
// Event name with start–end time, divided by a vertical line.
// ============================================================

import { Typography, Divider } from "@/components/atoms";
import type { EventSchedule } from "@/types";

interface EventScheduleItemProps {
  schedule: EventSchedule;
  className?: string;
}

export function EventScheduleItem({
  schedule,
  className = "",
}: EventScheduleItemProps) {
  const { name, startTime, endTime } = schedule;

  return (
    <div
      className={`flex flex-col items-center gap-1 text-center ${className}`.trim()}
    >
      <Typography
        variant="caption"
        className="text-[var(--color-warm-gray)] tracking-[0.2em]"
      >
        {name}
      </Typography>
      <Typography
        variant="h4"
        as="p"
        className="text-[var(--color-dark-olive)]"
      >
        {startTime}
      </Typography>
      <Divider orientation="horizontal" className="w-4 mx-auto" />
      <Typography
        variant="h4"
        as="p"
        className="text-[var(--color-dark-olive)]"
      >
        {endTime}
      </Typography>
    </div>
  );
}
