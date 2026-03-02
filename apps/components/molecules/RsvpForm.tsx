// ============================================================
// RsvpForm — Molecule
// Name + Guest Count + Attendance + Message + Submit.
// ============================================================

"use client";

import { useState, type FormEvent } from "react";
import { Input, Textarea, Select, Button } from "@/components/atoms";
import type { RsvpFormData } from "@/types";

interface RsvpFormProps {
  onSubmit?: (data: RsvpFormData) => void;
  className?: string;
}

const ATTENDANCE_OPTIONS = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
];

export function RsvpForm({ onSubmit, className = "" }: RsvpFormProps) {
  const [formData, setFormData] = useState<RsvpFormData>({
    name: "",
    guestCount: "",
    attendance: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 w-full ${className}`.trim()}
    >
      <Input
        label="Nama"
        placeholder="Nama"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        required
      />

      <Input
        label="Jumlah Tamu"
        placeholder="Jumlah Tamu"
        type="number"
        min="1"
        value={formData.guestCount}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, guestCount: e.target.value }))
        }
        required
      />

      <Select
        label="Konfirmasi Kehadiran"
        placeholder="Konfirmasi Kehadiran"
        options={ATTENDANCE_OPTIONS}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            attendance: e.target.value as RsvpFormData["attendance"],
          }))
        }
        required
      />

      <Textarea
        label="Kirim Ucapan"
        placeholder="Kirim Ucapan"
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-1 bg-[var(--color-cream)]/50! text-white! h-9! text-sm sm:text-base"
      >
        Confirm
      </Button>
    </form>
  );
}
