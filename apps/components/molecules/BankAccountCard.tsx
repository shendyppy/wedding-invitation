// ============================================================
// BankAccountCard — Molecule
// Bank logo + Account Number + Copy button.
// ============================================================

"use client";

import { useState } from "react";
import Image from "next/image";
import { Typography, Button } from "@/components/atoms";
import type { BankAccount } from "@/types";

interface BankAccountCardProps {
  account: BankAccount;
  className?: string;
}

export function BankAccountCard({
  account,
  className = "",
}: BankAccountCardProps) {
  const { bankName, bankLogoSrc, accountNumber, accountHolder } = account;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  return (
    <div
      className={`flex flex-col items-center text-center py-6 ${className}`.trim()}
    >
      {/* Bank Logo */}
      <div className="relative w-[160px] h-[60px] mb-4">
        <Image
          src={bankLogoSrc}
          alt={`Logo ${bankName}`}
          fill
          className="object-contain"
          sizes="160px"
        />
      </div>

      {/* Account Number */}
      <Typography
        variant="h4"
        className="text-[var(--color-olive)] mb-1 font-bold tracking-widest"
      >
        {accountNumber}
      </Typography>

      {/* Account Holder */}
      <Typography
        variant="body-sm"
        className="text-[var(--color-warm-gray)] mb-4"
      >
        A/N {accountHolder}
      </Typography>

      {/* Copy Button */}
      <Button variant="primary" size="sm" onClick={handleCopy}>
        {copied ? "Tersalin!" : "Salin Rekening"}
      </Button>
    </div>
  );
}
