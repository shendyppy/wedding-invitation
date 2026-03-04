"use client";

import Image from "next/image";
import { CalendarHeart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CountdownTimer } from "@/components/molecules";
import { WEDDING_DATA } from "@/constants/wedding-data";

export function CountdownSection() {
  const { weddingDate } = WEDDING_DATA;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const vis = isVisible ? "is-visible" : "";

  const handleSaveTheDate = () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Stevana & Zulfikar Wedding")}&dates=20260411T013000Z/20260411T070000Z&location=${encodeURIComponent("Villa Lagenta Lembang, Jl. Kolonel Masturi No. 8, Kec. Lembang, Kab. Bandung Barat")}`;
    window.open(url, "_blank");
  };

  return (
    <section
      id="countdown"
      className="invitation-section relative w-full flex flex-col items-center justify-center overflow-hidden"
    >
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
        className="relative z-10 flex flex-col items-center justify-between w-full flex-1 px-4 py-16"
      >
        <div />

        <p
          className={`anim-fade-up ${vis} font-serif italic text-[var(--color-warm-gray)] text-lg`}
        >
          Are getting married!
        </p>

        <div
          className={`${vis ? "line-grow" : ""} w-px bg-[var(--color-warm-gray)]/40`}
          style={
            {
              "--line-height": "clamp(25vh, 35vh, 40vh)",
              height: isVisible ? "clamp(30vh, 35vh, 40vh)" : "0",
              opacity: isVisible ? 1 : 0,
            } as React.CSSProperties
          }
        />

        <p
          className={`anim-fade-up ${vis} anim-delay-200 font-serif italic text-[var(--color-warm-gray)] text-lg`}
        >
          Counting down
          <span className="animated-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>

        <div className={`anim-fade-up ${vis} anim-delay-300`}>
          <CountdownTimer targetDate={weddingDate} />
        </div>

        <div className={`anim-fade-up ${vis} anim-delay-400`}>
          <button onClick={handleSaveTheDate} className="btn-base btn-olive">
            <CalendarHeart size={16} />
            Save The Date!
          </button>
        </div>

        <div />
      </div>
    </section>
  );
}
