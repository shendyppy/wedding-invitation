"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { WEDDING_DATA } from "@/constants/wedding-data";
import { MapPin } from "lucide-react";

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
        <Image
          src="/assets/event-and-venue-background.webp"
          alt=""
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 100vw, 480px"
          priority
          quality={85}
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[var(--color-soft-beige)] to-transparent" />
      </div>

      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-start flex-1 p-6!"
      >
        <div
          className={`anim-scale-in ${vis} w-full max-w-md border-2 border-black rounded-2xl px-6! py-10! space-y-6 backdrop-blur-sm shadow-sm flex flex-col items-center`}
        >
          <p
            className={`anim-fade-up ${vis} font-sans text-base sm:text-xl tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[var(--color-warm-gray)] text-center`}
          >
            Event &amp; Venue
          </p>

          <div
            className={`anim-fade-up ${vis} anim-delay-100 text-center w-full`}
          >
            <p className="font-serif font-semibold text-[var(--color-dark-olive)] tracking-[0.15em] sm:tracking-[0.18em] uppercase text-lg sm:text-xl">
              Sabtu
            </p>
            <p className="font-serif font-bold text-[var(--color-olive)] leading-none my-1 sm:my-2 text-[clamp(4rem,20vw,6rem)]">
              11
            </p>
            <p className="font-serif font-bold text-[var(--color-dark-olive)] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xl sm:text-2xl">
              April
            </p>
            <p className="font-serif text-[var(--color-warm-gray)] tracking-[0.15em] sm:tracking-[0.2em] text-base sm:text-lg mt-1">
              2026
            </p>
          </div>

          {/* Schedule grid — equal columns with centered divider */}
          <div
            className={`anim-fade-up ${vis} anim-delay-200 w-full py-6!`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "start",
              gap: "0.25rem",
            }}
          >
            {schedule.map((item, i) => {
              const isLastItem = i === schedule.length - 1;

              return (
                <div key={item.name} className="contents">
                  {/* Left/Right column content */}
                  <div className="flex flex-col items-center text-center gap-1 px-1 sm:px-2">
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] font-semibold">
                      {item.name}
                    </p>
                    <p className="font-serif font-semibold text-[var(--color-dark-olive)] text-xl">
                      {item.startTime}
                    </p>
                    <p className="font-sans text-[var(--color-warm-gray)] text-sm">
                      —
                    </p>
                    <p className="font-serif font-semibold text-[var(--color-dark-olive)] text-xl">
                      {item.endTime}
                    </p>
                  </div>
                  {/* Center divider (only between items) */}
                  {!isLastItem && (
                    <div className="w-px h-full bg-[var(--color-warm-gray)]/30 self-stretch mx-2" />
                  )}
                  {/* Empty slot for last item or placeholder for first item */}
                  {isLastItem && <div />}
                </div>
              );
            })}
          </div>

          <div
            className={`anim-fade-up ${vis} anim-delay-300 flex flex-col items-center text-center gap-2 w-full`}
          >
            <MapPin size={40} className="text-[var(--color-olive)]/50" />
            <p className="font-serif font-bold text-[var(--color-dark-olive)] tracking-[0.1em] uppercase text-base">
              {venue.name}
            </p>
            <p className="font-sans text-[var(--color-warm-gray)] text-sm leading-relaxed max-w-[220px]">
              {venue.address}
            </p>
            <button
              onClick={() => window.open(venue.mapsUrl, "_blank")}
              className="btn-base btn-olive mt-3"
            >
              See Location
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
