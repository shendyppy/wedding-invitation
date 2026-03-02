"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { WEDDING_DATA } from "@/constants/wedding-data";

export function OurStorySection() {
  const { story } = WEDDING_DATA;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="our-story"
      className="invitation-section relative w-full flex flex-col items-center justify-center overflow-hidden bg-[var(--color-dark-olive)]/80 p-6!"
    >
      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center w-full flex-1"
      >
        <div
          className={`anim-scale-in ${vis} w-full max-w-md rounded-2xl px-6! py-10! flex flex-col items-center justify-center border-4 border-white/70 gap-4`}
        >
          <h2
            className={`anim-fade-up ${vis} font-serif font-semibold text-white tracking-[0.2em] uppercase text-3xl! text-center mb-4`}
          >
            Our Story
          </h2>

          {story.map((paragraph, i) => (
            <p
              key={i}
              className={`anim-fade-up ${vis} anim-delay-${(i + 1) * 100} font-serif italic text-white/90 text-sm! leading-7 text-center px-2`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
