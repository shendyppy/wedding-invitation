"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { WEDDING_DATA } from "@/constants/wedding-data";

interface WeddingGiftSectionProps {
  guestId?: string;
  guestName?: string;
}

export function WeddingGiftSection({ guestId, guestName = "Guest" }: WeddingGiftSectionProps) {
  const { bankAccounts } = WEDDING_DATA;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const vis = isVisible ? "is-visible" : "";

  return (
    <section
      id="wedding-gift"
      className="invitation-section relative w-full flex flex-col items-center justify-center overflow-hidden bg-[var(--color-soft-beige)]"
    >
      <div className="absolute inset-0 z-0">
        <Image src="/assets/core-background.webp" alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 480px" quality={92} aria-hidden="true" />
      </div>

      <div ref={ref} className="relative z-10 flex flex-col items-center justify-center w-full flex-1 px-6!">
        <div className={`anim-scale-in ${vis} w-full max-w-md border-2 border-[var(--color-warm-gray)]/30 rounded-2xl px-6! py-10! space-y-6! backdrop-blur-sm shadow-sm`}>
          <h2 className={`anim-fade-up ${vis} font-serif font-semibold text-[var(--color-olive)] tracking-[0.2em] uppercase text-2xl text-center mb-6`}>
            Wedding Gift
          </h2>

          <p className={`anim-fade-up ${vis} anim-delay-100 font-serif font-semibold text-[var(--color-warm-gray)] text-sm text-center leading-relaxed mb-10`}>
            Your presence at our wedding is the greatest gift of all. However, if you wish to bless us with a token of love, you may find our details below.
          </p>

          {bankAccounts.map((account, i) => (
            <div key={account.bankName}>
              <BankCard
                account={account}
                isVisible={isVisible}
                delayIndex={i}
                guestId={guestId}
                guestName={guestName}
              />
              {i < bankAccounts.length - 1 && (
                <div className="flex justify-center my-6!">
                  <div className="w-3/4 h-px bg-[var(--color-warm-gray)]/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BankCard({
  account,
  isVisible,
  delayIndex,
  guestId,
  guestName,
}: {
  account: (typeof WEDDING_DATA.bankAccounts)[number];
  isVisible: boolean;
  delayIndex: number;
  guestId?: string;
  guestName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);

      // Log the copy action
      await fetch("/api/bank-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId,
          guestName,
          bankName: account.bankName,
          accountNumber: account.accountNumber,
        }),
      }).catch(() => {
        // Silently fail if logging fails
      });

      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const delayClass = delayIndex === 0 ? "anim-delay-300" : "anim-delay-500";

  return (
    <div
      className={`anim-fade-up ${isVisible ? "is-visible" : ""} ${delayClass} flex flex-col items-center text-center py-3! gap-3`}
    >
      <div className="relative w-[140px] h-[90px] sm:w-[160px] sm:h-[100px]">
        <Image src={account.bankLogoSrc} alt={`Logo ${account.bankName}`} fill className="object-contain" sizes="(max-width: 400px) 140px, 160px" quality={98} unoptimized />
      </div>
      <p className="font-serif font-bold text-[var(--color-olive)] tracking-widest text-2xl">{account.accountNumber}</p>
      <p className="font-sans text-[var(--color-warm-gray)] text-sm">A/N {account.accountHolder}</p>
      <button
        onClick={handleCopy}
        className={`btn-base mt-2 transition-all ${
          copied
            ? "bg-green-600 text-white"
            : "btn-olive"
        }`}
      >
        {copied ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tersalin!
          </span>
        ) : (
          "Salin Rekening"
        )}
      </button>
    </div>
  );
}
