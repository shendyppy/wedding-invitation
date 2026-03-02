// ============================================================
// InvitationTemplate — Template
// Assembles all organisms into the full invitation page layout.
// Includes floating music toggle and open transition.
// Each section snaps to full screen on scroll.
// ============================================================

"use client";

import { useState, useRef } from "react";
import {
  HeroSection,
  CoupleNamesSection,
  CountdownSection,
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        const coupleSection = document.getElementById("couple-names");
        if (coupleSection && containerRef.current) {
          containerRef.current.scrollTo({
            top: coupleSection.offsetTop,
            behavior: "smooth",
          });
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
      {isOpen && <MusicToggle />}
    </div>
  );
}
