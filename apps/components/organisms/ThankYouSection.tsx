"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function ThankYouSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="thank-you"
      className="invitation-section relative overflow-hidden flex flex-col items-center justify-center px-6! py-10!"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/core-background.webp"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 480px"
          quality={92}
          aria-hidden="true"
        />
      </div>

      <div
        ref={ref}
        className="relative z-10 w-full max-w-sm flex flex-col items-center gap-7"
      >
        {/* Photo — sharp corners */}
        <div
          className={`anim-scale-in ${vis} relative w-full overflow-hidden shadow-md`}
          style={{ aspectRatio: "3/4" }}
        >
          <Image
            src="/assets/thank-you-image.webp"
            alt="Stevana & Zulfikar"
            fill
            className="object-cover object-center"
            quality={98}
            sizes="(max-width: 640px) 100vw, 380px"
            priority
          />
        </div>

        {/* Text */}
        <div
          className={`anim-fade-up ${vis} anim-delay-200 text-center flex flex-col items-center gap-4`}
        >
          <h2 className="font-serif font-bold tracking-[0.25em] uppercase text-[var(--color-dark-olive)] text-3xl">
            Thank You
          </h2>
          <p className="font-serif text-[var(--color-warm-gray)] text-sm leading-7 max-w-[280px]">
            As we begin this new chapter together, we are truly grateful for
            your love, support, and heartfelt wishes.
          </p>
          <div className="w-full h-px bg-[var(--color-warm-gray)]/30 mt-2" />
        </div>
      </div>
    </section>
  );
}
