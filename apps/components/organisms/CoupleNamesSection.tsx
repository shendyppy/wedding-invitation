"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function CoupleNamesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="couple-names"
      className="invitation-section relative w-full flex flex-col items-center justify-center overflow-hidden p-6!"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/core-background.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="480px"
          aria-hidden="true"
        />
      </div>

      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center w-full flex-1 px-4"
      >
        <div className="flex items-stretch justify-center w-full h-[35vh] sm:h-[40vh]">
          <div
            className={`anim-slide-left ${vis} flex-1 flex flex-col items-center justify-start pr-3! sm:pr-5! pt-[8%]`}
          >
            <p className="font-serif font-semibold text-[var(--color-warm-gray)] tracking-[0.2em] uppercase text-2xl leading-tight text-right">
              Stevana
            </p>
            <p className="font-serif font-semibold text-[var(--color-warm-gray)] tracking-[0.2em] uppercase text-2xl leading-tight text-right">
              Oktavia
            </p>
          </div>

          <div
            className={`${vis ? "line-grow" : ""} w-px bg-[var(--color-warm-gray)]/50 shrink-0`}
            style={
              {
                "--line-height": "50vh",
                height: isVisible ? "55vh" : "0",
                opacity: isVisible ? 1 : 0,
              } as React.CSSProperties
            }
          />

          <div
            className={`anim-slide-right ${vis} flex-1 flex flex-col items-center justify-end pl-3! sm:pl-5! pb-[15%]`}
          >
            <p className="font-serif font-semibold text-[var(--color-warm-gray)] tracking-[0.2em] uppercase text-2xl leading-tight">
              Muchamad
            </p>
            <p className="font-serif font-semibold text-[var(--color-warm-gray)] tracking-[0.2em] uppercase text-2xl leading-tight">
              Zulfikar
            </p>
          </div>
        </div>

        <div
          className={`anim-fade-up ${vis} anim-delay-400 relative mt-auto w-full max-w-100 h-120 z-50`}
        >
          <Image
            src="/assets/together-to-be.gif"
            alt="Stevana & Zulfikar"
            fill
            className="object-contain"
            sizes="400px"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
