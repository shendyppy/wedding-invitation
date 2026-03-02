// ============================================================
// CoupleCard — Molecule
// Photo + Name + Parents info for Bride or Groom.
// ============================================================

import Image from "next/image";
import { Typography } from "@/components/atoms";
import type { CoupleProfile } from "@/types";

interface CoupleCardProps {
  profile: CoupleProfile;
  className?: string;
}

export function CoupleCard({ profile, className = "" }: CoupleCardProps) {
  const { fullName, photoSrc, sketchSrc, description, fatherName, motherName } =
    profile;

  return (
    <div
      className={`flex flex-col items-center text-center ${className}`.trim()}
    >
      {/* Photo */}
      <div className="relative w-[240px] h-[320px] mb-6 overflow-hidden">
        <Image
          src={photoSrc}
          alt={fullName}
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>

      {/* Name */}
      <div className="relative">
        <Typography variant="h3" className="text-white mb-3">
          {fullName}
        </Typography>

        {/* Line art sketch — decorative */}
        <div className="absolute -right-16 -bottom-8 w-[120px] h-[180px] opacity-30 pointer-events-none hidden md:block">
          <Image
            src={sketchSrc}
            alt=""
            fill
            className="object-contain"
            sizes="120px"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Parents */}
      <Typography variant="body" as="p" className="text-white/80 italic mt-2">
        {description}
      </Typography>
      <Typography variant="body" as="p" className="text-white/80 italic">
        {fatherName} &amp;
      </Typography>
      <Typography variant="body" as="p" className="text-white/80 italic">
        {motherName}
      </Typography>
    </div>
  );
}
