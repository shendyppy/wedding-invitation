// ============================================================
// WishCard — Molecule
// Avatar + Name + Attendance Status + Message.
// ============================================================

import { Avatar, Typography } from "@/components/atoms";
import { CheckCircle2, XCircle } from "lucide-react";
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
    <div className={`flex gap-2 sm:gap-3 w-full min-w-0 ${className}`.trim()}>
      <div className="shrink-0">
        <Avatar name={name} size="md" />
      </div>
      <div className="flex-1 min-w-0 bg-[var(--color-soft-beige)] rounded-lg p-2.5! sm:p-3! overflow-hidden">
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1 flex-wrap">
          <Typography
            variant="body-sm"
            as="span"
            className="font-semibold text-[var(--color-dark-olive)] text-xs sm:text-sm"
          >
            {name}
          </Typography>
          {attendance && (
            <div
              className="flex items-center self-center"
              title={STATUS_LABEL[attendance] ?? attendance}
            >
              {attendance === "hadir" ? (
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600/90" />
              ) : attendance === "tidak_hadir" ? (
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600/90" />
              ) : null}
            </div>
          )}
        </div>
        {message && (
          <Typography
            variant="body-sm"
            className="text-[var(--color-dark-olive)]/80 break-words overflow-wrap-anywhere text-xs sm:text-sm leading-relaxed"
          >
            {message}
          </Typography>
        )}
      </div>
    </div>
  );
}
