"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function BrideGroomIntroSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="bride-groom-intro"
      className="invitation-section relative flex flex-col overflow-hidden bg-[var(--color-dark-olive)]"
    >
      {/* Photo — ~70% of the section */}
      <div className="relative w-full flex-1" style={{ flexBasis: "70%" }}>
        <Image
          src="/assets/the-bride-and-groom-bg.jpeg"
          alt="Stevana & Zulfikar"
          fill
          className="object-cover object-center"
          quality={95}
          sizes="480px"
        />
        {/* subtle gradient at bottom to blend into banner */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[var(--color-dark-olive)]/80" />
      </div>

      {/* "THE BRIDE AND GROOM" banner — ~30% */}
      <div
        ref={ref}
        className="flex-shrink-0 flex flex-col items-center justify-center bg-[var(--color-dark-olive)] px-6! py-10!"
      >
        <p
          className={`anim-fade-up ${vis} font-sans text-[10px] tracking-[0.35em] uppercase text-white! mb-3`}
        >
          Meet
        </p>
        <h2
          className={`anim-fade-up ${vis} anim-delay-100 font-serif font-bold text-white tracking-[0.22em] uppercase text-[clamp(1.1rem,5vw,1.5rem)] text-center`}
        >
          The Bride &amp; Groom
        </h2>
        <div
          className={`anim-fade-in ${vis} anim-delay-300 mt-4 w-16 h-px bg-white/25`}
        />
      </div>
    </section>
  );
}
