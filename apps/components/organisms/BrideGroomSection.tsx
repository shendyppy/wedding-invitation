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
    <section className="invitation-section relative w-full flex flex-col items-center overflow-hidden bg-[var(--color-dark-olive)]">
      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center w-full flex-1 px-6! py-16! gap-6"
      >
        <div
          className={`anim-scale-in ${vis} relative overflow-hidden w-[70vw] max-w-[280px] h-[95vw] max-h-[380px]`}
        >
          <Image
            src={profile.photoSrc}
            alt={profile.fullName}
            fill
            className="object-cover"
            quality={95}
            sizes="(max-width: 400px) 280px, 280px"
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

      <div
        className={`absolute bottom-0 ${gifPosition === "right" ? "right-0" : "left-0"} z-50! opacity-40 pointer-events-none w-1/2 h-[50vh]`}
      >
        <Image
          src={gifSrc}
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="240px"
          unoptimized
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
