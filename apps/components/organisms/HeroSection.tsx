"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MailOpen } from "lucide-react";
import { WEDDING_DATA } from "@/constants/wedding-data";

interface HeroSectionProps {
  guestName?: string;
  onOpenInvitation?: () => void;
}

export function HeroSection({
  guestName,
  onOpenInvitation,
}: HeroSectionProps) {
  const { heroQuote, bride, groom } = WEDDING_DATA;
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="hero"
      className="invitation-section relative w-full flex flex-col items-center justify-center text-center text-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-background.jpeg"
          alt="Stevana & Zulfikar"
          fill
          className="object-cover object-center"
          priority
          quality={95}
          sizes="480px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 w-full max-w-md mx-auto">
        <div className="hero-animate hero-animate-delay-1 flex flex-col gap-0.5">
          {heroQuote.map((line, i) => (
            <p key={i} className="font-serif italic text-white/90 text-sm leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        <div className="hero-animate hero-animate-delay-2 flex flex-col items-center mt-2">
          <span className="font-script text-white leading-none text-[clamp(3rem,15vw,4.5rem)]">
            {bride.fullName.split(" ")[0]}
          </span>
          <span className="font-script text-white/70 -mt-2 text-[clamp(1.8rem,8vw,2.8rem)]">
            &amp;
          </span>
          <span className="font-script text-white leading-none -mt-2 text-[clamp(3rem,15vw,4.5rem)]">
            {groom.fullName.split(" ").pop()}
          </span>
        </div>

        <p className="hero-animate hero-animate-delay-3 font-script text-white text-[clamp(1.2rem,5vw,1.6rem)]">
          11.04.26
        </p>

        {guestName && (
          <div className="hero-animate hero-animate-delay-3">
            <p className="text-white/75 tracking-widest uppercase font-sans text-xs">
              Dear {guestName},
            </p>
          </div>
        )}

        <div className="hero-animate hero-animate-delay-4 mt-2">
          <button
            onClick={onOpenInvitation}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="btn-base border border-white/80 text-white bg-[var(--color-dark-olive)]/20 backdrop-blur-sm hover:bg-[var(--color-dark-olive)]"
          >
            Buka Undangan
            {hovered ? <MailOpen size={16} /> : <Mail size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
