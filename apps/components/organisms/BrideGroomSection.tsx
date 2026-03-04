"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { WEDDING_DATA } from "@/constants/wedding-data";

export function BrideGroomSection() {
  const { bride, groom } = WEDDING_DATA;

  return (
    <>
      <BrideGroomPanel
        profile={bride}
        gifSrc="/assets/bride.GIF"
        gifPosition="right"
      />
      <BrideGroomPanel
        profile={groom}
        gifSrc="/assets/grooms.GIF"
        gifPosition="left"
      />
    </>
  );
}

interface PanelProps {
  profile: typeof WEDDING_DATA.bride;
  gifSrc: string;
  gifPosition: "left" | "right";
}

function BrideGroomPanel({ profile, gifSrc, gifPosition }: PanelProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section className="invitation-section relative w-full flex flex-col items-center overflow-visible bg-[var(--color-dark-olive)]">
      <div
        ref={ref}
        className="flex flex-col items-center justify-center w-full flex-1 px-6! py-16! gap-6"
      >
        <div
          className={`anim-scale-in ${vis} relative overflow-hidden w-[70vw] max-w-[280px] h-[95vw] max-h-[380px]`}
        >
          <Image
            src={profile.photoSrc}
            alt={profile.fullName}
            fill
            className="object-cover"
            quality={98}
            sizes="(max-width: 400px) 280px, 280px"
            priority
          />
        </div>

        <h3
          className={`anim-fade-up ${vis} anim-delay-200 font-serif font-bold text-white tracking-[0.1em] uppercase text-2xl text-center mt-4`}
        >
          {profile.fullName}
        </h3>

        <div
          className={`anim-fade-up ${vis} anim-delay-300 flex flex-col items-center gap-0.5 mt-2`}
        >
          <p className="font-serif italic text-white/80 text-base">
            {profile.description}
          </p>
          <p className="font-serif italic text-white/80 text-base">
            {profile.fatherName} &amp;
          </p>
          <p className="font-serif italic text-white/80 text-base">
            {profile.motherName}
          </p>
        </div>
      </div>

      {/* GIF illustration - positioned outside section to overflow properly */}
      <div
        className={`absolute ${gifPosition === "right" ? "-right-15 bottom-0" : "-left-15 -bottom-7"} z-[1000]! pointer-events-none w-[60%] h-[50%]`}
      >
        <Image
          src={gifSrc}
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 640px) 60vw, 300px"
          unoptimized
          priority
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
