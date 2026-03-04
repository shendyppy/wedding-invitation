// ============================================================
// InvitationTemplate — Template
// Assembles all organisms into the full invitation page layout.
// Includes floating music toggle and open transition.
// ============================================================

"use client";

import { useState, useRef, useEffect } from "react";
import {
  HeroSection,
  CoupleNamesSection,
  CountdownSection,
  BrideGroomIntroSection,
  BrideGroomSection,
  OurStorySection,
  EventVenueSection,
  RsvpWishesSection,
  WeddingGiftSection,
  ThankYouSection,
  Footer,
} from "@/components/organisms";
import { MusicToggle } from "@/components/atoms";

interface InvitationTemplateProps {
  guestName?: string;
}

export function InvitationTemplate({ guestName }: InvitationTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lock scroll initially
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const audio = new Audio("/assets/music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Play music immediately — this runs inside a click handler (user gesture)
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
    setTimeout(() => {
      setShowContent(true);
      // Scroll to couple-names section after content is revealed
      setTimeout(() => {
        const coupleSection = document.getElementById("couple-names");
        if (coupleSection && containerRef.current) {
          coupleSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }, 50);
  };

  return (
    <div ref={containerRef} className="invitation-container relative">
      {/* Hero is always visible */}
      <HeroSection
        guestName={guestName}
        onOpenInvitation={handleOpenInvitation}
      />

      {/* Remaining sections revealed after "Buka Undangan" */}
      {isOpen && (
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <CoupleNamesSection />
          <CountdownSection />
          <BrideGroomIntroSection />
          <BrideGroomSection />
          <OurStorySection />
          <EventVenueSection />
          <RsvpWishesSection />
          <WeddingGiftSection />
          <ThankYouSection />
          <Footer />
        </div>
      )}

      {/* Floating music toggle — shown after opening */}
      {isOpen && (
        <MusicToggle
          audioRef={audioRef}
          isPlaying={isMusicPlaying}
          setIsPlaying={setIsMusicPlaying}
        />
      )}
    </div>
  );
}
