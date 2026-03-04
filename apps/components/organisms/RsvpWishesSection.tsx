"use client";

import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { RsvpForm, WishCard } from "@/components/molecules";
import type { RsvpFormData, WishEntry, Wish } from "@/types";

interface RsvpWishesSectionProps {
  guestToken?: string;
  guestId?: string;
  maxQuota?: number;
  existingRsvp?: {
    attendanceStatus: "hadir" | "tidak_hadir";
    numberOfAttendees: number;
  } | null;
}

function mapDbWishToWishEntry(wish: Wish): WishEntry {
  return {
    id: wish.id,
    name: wish.name,
    attendance: wish.attendanceStatus || "",
    message: wish.message,
  };
}

export function RsvpWishesSection({
  guestToken,
  guestId,
  maxQuota = 2,
  existingRsvp = null,
}: RsvpWishesSectionProps) {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const vis = isVisible ? "is-visible" : "";

  // Fetch wishes on mount
  useEffect(() => {
    async function fetchWishes() {
      try {
        const response = await fetch("/api/wishes");
        const result = await response.json();

        if (result.success) {
          setWishes(result.data.map(mapDbWishToWishEntry));
        }
      } catch (error) {
        console.error("Failed to fetch wishes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWishes();
  }, []);

  const handleRsvpSubmit = (data: RsvpFormData) => {
    // Optionally refresh wishes after RSVP submission
    // The wish is submitted in the form, so we can fetch again
    async function refreshWishes() {
      try {
        const response = await fetch("/api/wishes");
        const result = await response.json();

        if (result.success) {
          setWishes(result.data.map(mapDbWishToWishEntry));
        }
      } catch (error) {
        console.error("Failed to refresh wishes:", error);
      }
    }

    refreshWishes();
  };

  const handleRsvpSuccess = () => {
    // Trigger wish refresh after successful RSVP
    handleRsvpSubmit({
      name: "",
      guestCount: "",
      attendance: "",
      message: "",
    });
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
          <RsvpForm
            guestToken={guestToken}
            guestId={guestId}
            maxQuota={maxQuota}
            existingRsvp={existingRsvp}
            onSubmit={handleRsvpSubmit}
            onSuccess={handleRsvpSuccess}
          />
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
          {isLoading ? (
            <p className="text-white/60 text-center text-sm">Loading...</p>
          ) : wishes.length === 0 ? (
            <p className="text-white/60 text-center text-sm">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          ) : (
            wishes.map((wish) => <WishCard key={wish.id} wish={wish} />)
          )}
        </div>
      </div>
    </section>
  );
}
