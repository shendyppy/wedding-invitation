// ============================================================
// WishCard — Molecule
// Avatar + Name + Attendance Status + Message.
// ============================================================

import { Avatar, Typography } from "@/components/atoms";
import type { WishEntry } from "@/types";

interface WishCardProps {
  wish: WishEntry;
  className?: string;
}

const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
};

export function WishCard({ wish, className = "" }: WishCardProps) {
  const { name, attendance, message } = wish;

  return (
    <div className={`flex gap-3 ${className}`.trim()}>
      <Avatar name={name} size="md" />
      <div className="flex-1 bg-[var(--color-soft-beige)] rounded-lg p-3 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <Typography
            variant="body-sm"
            as="span"
            className="font-semibold text-[var(--color-dark-olive)]"
          >
            {name}
          </Typography>
          {attendance && (
            <Typography
              variant="caption"
              as="span"
              className="text-[var(--color-olive)]"
            >
              {STATUS_LABEL[attendance] ?? attendance}
            </Typography>
          )}
        </div>
        {message && (
          <Typography
            variant="body-sm"
            className="text-[var(--color-dark-olive)]/80"
          >
            {message}
          </Typography>
        )}
      </div>
    </div>
  );
}
