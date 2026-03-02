"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { RsvpForm, WishCard } from "@/components/molecules";
import { SAMPLE_WISHES } from "@/constants/wedding-data";
import type { RsvpFormData, WishEntry } from "@/types";

export function RsvpWishesSection() {
  const [wishes, setWishes] = useState<WishEntry[]>(SAMPLE_WISHES);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const vis = isVisible ? "is-visible" : "";

  const handleSubmit = (data: RsvpFormData) => {
    setWishes((prev) => [
      {
        id: Date.now().toString(),
        name: data.name,
        attendance: data.attendance,
        message: data.message,
      },
      ...prev,
    ]);
  };

  return (
    <section
      id="rsvp-wishes"
      className="invitation-section bg-[var(--color-dark-olive)] flex flex-col items-center overflow-hidden"
    >
      <div
        ref={ref}
        className="w-full max-w-md mx-auto flex flex-col flex-1 px-6! py-14! gap-8"
      >
        {/* Header */}
        <div className={`anim-fade-up ${vis} text-center`}>
          <h2 className="font-serif font-bold text-white tracking-[0.18em] uppercase text-2xl">
            RSVP &amp; Wedding Wishes
          </h2>
        </div>

        {/* Form */}
        <div className={`anim-fade-up ${vis} anim-delay-200`}>
          <RsvpForm onSubmit={handleSubmit} />
        </div>

        {/* Divider */}
        <div
          className={`anim-fade-in ${vis} anim-delay-300 flex items-center gap-3`}
        >
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-white/40 text-[10px] tracking-widest uppercase font-sans shrink-0">
            Messages
          </span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        {/* Wish list */}
        <div
          className={`anim-fade-up ${vis} anim-delay-400 flex flex-col gap-4 flex-1 overflow-y-auto max-h-[35vh] scrollbar-pretty pr-1!`}
        >
          {wishes.map((wish) => (
            <WishCard key={wish.id} wish={wish} />
          ))}
        </div>
      </div>
    </section>
  );
}
