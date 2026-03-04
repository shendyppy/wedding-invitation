"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MailOpen } from "lucide-react";
import { WEDDING_DATA } from "@/constants/wedding-data";

interface HeroSectionProps {
  guestName?: string;
  onOpenInvitation?: () => void;
}

export function HeroSection({ guestName, onOpenInvitation }: HeroSectionProps) {
  const { heroQuote, bride, groom } = WEDDING_DATA;
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="hero"
      className="invitation-section relative w-full flex flex-col items-center justify-start text-center text-white overflow-hidden pt-24!"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.webp"
          alt="Stevana & Zulfikar"
          fill
          className="object-cover object-center"
          priority
          quality={98}
          sizes="(max-width: 640px) 100vw, 480px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 px-4! sm:px-6! w-full max-w-md mx-auto">
        <div className="hero-animate hero-animate-delay-1 flex flex-col gap-0.5">
          {heroQuote.map((line, i) => (
            <p
              key={i}
              className="font-serif italic text-white/90 text-[11px] sm:text-sm leading-relaxed"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="hero-animate hero-animate-delay-2 flex flex-col items-center mt-2">
          <span
            className="text-white leading-none text-[clamp(3rem,15vw,4.5rem)]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {bride.fullName.split(" ")[0]}
          </span>
          <span
            className="text-white/70 -mt-2 text-[clamp(1.8rem,8vw,2.8rem)]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            &amp;
          </span>
          <span
            className="text-white leading-none -mt-2 text-[clamp(3rem,15vw,4.5rem)]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {groom.fullName.split(" ").pop()}
          </span>
        </div>

        <p
          style={{ fontFamily: "var(--font-hero)" }}
          className="hero-animate hero-animate-delay-3 text-white/90 text-[clamp(1rem,4.5vw,1.4rem)] tracking-[0.25em]"
        >
          11 · 04 · 26
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
            className="btn-base btn-invitation border border-white/80 text-white bg-[var(--color-dark-olive)]! backdrop-blur-sm hover:bg-[var(--color-dark-olive)]"
          >
            Buka Undangan
            {hovered ? <MailOpen size={16} /> : <Mail size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
