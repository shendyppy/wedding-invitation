"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { WEDDING_DATA } from "@/constants/wedding-data";

export function WeddingGiftSection() {
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
              <BankCard account={account} isVisible={isVisible} delayIndex={i} />
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
}: {
  account: (typeof WEDDING_DATA.bankAccounts)[number];
  isVisible: boolean;
  delayIndex: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
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
      <button onClick={handleCopy} className="btn-base btn-olive mt-2">
        {copied ? "Tersalin!" : "Salin Rekening"}
      </button>
    </div>
  );
}
