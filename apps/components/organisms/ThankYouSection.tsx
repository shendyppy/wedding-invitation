"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function ThankYouSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="thank-you"
      className="invitation-section bg-[var(--color-cream)] overflow-hidden flex flex-col"
    >
      <div className="relative w-full flex-shrink-0 h-[65vh] min-h-[300px]">
        <Image
          src="/assets/thank-you-image.jpeg"
          alt="Stevana & Zulfikar"
          fill
          className="object-cover object-top"
          quality={95}
          sizes="480px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-cream)]" />
      </div>

      <div ref={ref} className="flex flex-col items-center justify-center text-center px-4 py-8 flex-1">
        <h2 className={`anim-fade-up ${vis} font-serif font-semibold tracking-[0.2em] uppercase text-[var(--color-warm-gray)] text-3xl mb-4`}>
          Thank You
        </h2>
        <p className={`anim-fade-up ${vis} anim-delay-200 font-serif italic text-[var(--color-warm-gray)] text-sm leading-7 max-w-sm`}>
          As we begin this new chapter together, we are truly grateful for your love, support, and heartfelt wishes.
        </p>
        <div className={`anim-fade-in ${vis} anim-delay-400 mt-8`}>
          <div className="w-24 h-px bg-[var(--color-warm-gray)]/30" />
        </div>
      </div>
    </section>
  );
}
