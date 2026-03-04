// ============================================================
// RsvpForm — Molecule
// Name + Guest Count + Attendance + Message + Submit.
// ============================================================

"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Input, Textarea, Select, Button } from "@/components/atoms";
import type { RsvpFormData } from "@/types";

interface RsvpFormProps {
  guestToken?: string;
  guestId?: string;
  maxQuota?: number;
  existingRsvp?: {
    attendanceStatus: "hadir" | "tidak_hadir";
    numberOfAttendees: number;
  } | null;
  onSubmit?: (data: RsvpFormData) => void;
  onSuccess?: () => void;
  className?: string;
}

const ATTENDANCE_OPTIONS = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
];

const GUEST_COUNT_OPTIONS = [
  { value: "1", label: "1 Orang" },
  { value: "2", label: "2 Orang" },
  { value: "3", label: "3 Orang" },
  { value: "4", label: "4 Orang" },
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export function RsvpForm({
  guestToken,
  guestId,
  maxQuota = 2,
  existingRsvp = null,
  onSubmit,
  onSuccess,
  className = "",
}: RsvpFormProps) {
  const [formData, setFormData] = useState<RsvpFormData>({
    name: "",
    guestCount: "",
    attendance: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Populate form with existing RSVP data if available
  useEffect(() => {
    if (existingRsvp) {
      setFormData((prev) => ({
        ...prev,
        attendance: existingRsvp.attendanceStatus,
        guestCount: existingRsvp.numberOfAttendees.toString(),
      }));
    }
  }, [existingRsvp]);

  // Generate guest count options based on maxQuota
  const guestCountOptions = GUEST_COUNT_OPTIONS.filter(
    (option) => parseInt(option.value) <= maxQuota
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    try {
      if (!guestToken) {
        throw new Error("Invalid invitation token");
      }

      const numberOfAttendees = parseInt(formData.guestCount) || 0;

      // Submit RSVP to API
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestToken,
          attendanceStatus: formData.attendance,
          numberOfAttendees,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to submit RSVP");
      }

      setSubmitState("success");
      onSuccess?.();

      // Also submit wish if message is provided
      if (formData.message.trim()) {
        await fetch("/api/wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestId,
            name: formData.name,
            message: formData.message,
            attendanceStatus: formData.attendance,
          }),
        });
      }

      onSubmit?.(formData);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitState("idle");
      }, 3000);
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit RSVP"
      );
    }
  };

  const isDisabled = submitState === "submitting" || submitState === "success";

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
        disabled={isDisabled}
      />

      <Select
        label="Jumlah Tamu"
        placeholder="Pilih Jumlah Tamu"
        options={guestCountOptions}
        value={formData.guestCount}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, guestCount: e.target.value }))
        }
        required
        disabled={isDisabled}
      />

      <Select
        label="Konfirmasi Kehadiran"
        placeholder="Konfirmasi Kehadiran"
        options={ATTENDANCE_OPTIONS}
        value={formData.attendance}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            attendance: e.target.value as RsvpFormData["attendance"],
          }))
        }
        required
        disabled={isDisabled}
      />

      <Textarea
        label="Kirim Ucapan"
        placeholder="Kirim Ucapan"
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
        disabled={isDisabled}
      />

      {submitState === "error" && (
        <p className="text-red-300 text-sm">{errorMessage}</p>
      )}

      {submitState === "success" && (
        <p className="text-green-300 text-sm">
          RSVP berhasil dikirim! Terima kasih atas konfirmasi Anda.
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isDisabled}
        className="w-full mt-1 bg-[var(--color-cream)]/50! text-white! h-9! text-sm sm:text-base"
      >
        {submitState === "submitting"
          ? "Mengirim..."
          : submitState === "success"
          ? "Terkirim ✓"
          : existingRsvp
          ? "Update Konfirmasi"
          : "Confirm"}
      </Button>
    </form>
  );
}
