"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { WEDDING_DATA } from "@/constants/wedding-data";

export function EventVenueSection() {
  const { venue, schedule } = WEDDING_DATA;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="event-venue"
      className="invitation-section relative flex flex-col overflow-hidden bg-[var(--color-soft-beige)]"
    >
      <div className="absolute bottom-0 left-0 right-0 h-[55vh] z-0">
        <Image src="/assets/event-and-venue-background.png" alt="" fill className="object-cover object-top" sizes="480px" aria-hidden="true" />
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[var(--color-soft-beige)] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 flex flex-col items-center justify-center flex-1 p-6!">
        <div className={`anim-scale-in ${vis} w-full max-w-md border-2 border-[var(--color-warm-gray)]/40 rounded-2xl px-6! py-16! space-y-5 bg-white/60 backdrop-blur-sm shadow-sm h-full!`}>
          <p className={`anim-fade-up ${vis} font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--color-warm-gray)] text-center`}>
            Event &amp; Venue
          </p>

          <div className={`anim-fade-up ${vis} anim-delay-100 text-center`}>
            <p className="font-serif font-semibold text-[var(--color-dark-olive)] tracking-[0.18em] uppercase text-xl">Minggu</p>
            <p className="font-serif font-bold text-[var(--color-olive)] leading-none my-2 text-[clamp(5rem,22vw,7rem)]">11</p>
            <p className="font-serif font-semibold text-[var(--color-dark-olive)] tracking-[0.5em] uppercase text-xl">April</p>
            <p className="font-serif text-[var(--color-warm-gray)] tracking-[0.2em] text-lg mt-1">2026</p>
          </div>

          <div className={`anim-fade-up ${vis} anim-delay-200 flex items-start justify-center gap-6`}>
            {schedule.map((item, i) => (
              <div key={item.name} className="flex items-start gap-6">
                <div className="flex flex-col items-center text-center gap-1">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] font-semibold">{item.name}</p>
                  <p className="font-serif font-semibold text-[var(--color-dark-olive)] text-xl">{item.startTime}</p>
                  <p className="font-sans text-[var(--color-warm-gray)] text-sm">—</p>
                  <p className="font-serif font-semibold text-[var(--color-dark-olive)] text-xl">{item.endTime}</p>
                </div>
                {i < schedule.length - 1 && <div className="w-0.5 h-20 bg-[var(--color-warm-gray)]/30 self-center" />}
              </div>
            ))}
          </div>

          <div className={`anim-fade-up ${vis} anim-delay-300 flex flex-col items-center text-center gap-2`}>
            <svg className="w-7 h-7 text-[var(--color-olive)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="font-serif font-bold text-[var(--color-dark-olive)] tracking-[0.1em] uppercase text-base">{venue.name}</p>
            <p className="font-sans text-[var(--color-warm-gray)] text-sm leading-relaxed max-w-[220px]">{venue.address}</p>
            <button onClick={() => window.open(venue.mapsUrl, "_blank")} className="btn-base btn-olive mt-3">
              See Location
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
