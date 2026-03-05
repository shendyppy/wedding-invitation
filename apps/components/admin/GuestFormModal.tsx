// ============================================================
// Guest Form Modal Component
// Reusable modal for Add / Edit guest
// ============================================================

"use client";

import { useState, useEffect, type FormEvent } from "react";
import { UserPlus, Pencil, Loader2 } from "lucide-react";
import { Modal } from "./ui/modal";
import { Input, Button } from "./ui";

export interface GuestFormData {
  id?: string;
  name: string;
  phone: string;
  maxQuota: number;
}

interface GuestFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GuestFormData) => Promise<void>;
  /** If provided, modal is in edit mode */
  guest?: GuestFormData | null;
}

export function GuestFormModal({
  open,
  onClose,
  onSubmit,
  guest,
}: GuestFormModalProps) {
  const isEdit = !!guest?.id;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [maxQuota, setMaxQuota] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens / changes mode
  useEffect(() => {
    if (open) {
      if (guest) {
        setName(guest.name || "");
        setPhone(guest.phone || "");
        setMaxQuota(guest.maxQuota || 2);
      } else {
        setName("");
        setPhone("");
        setMaxQuota(2);
      }
      setError("");
      setLoading(false);
    }
  }, [open, guest]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit({
        id: guest?.id,
        name: name.trim(),
        phone: phone.trim(),
        maxQuota,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isEdit
                ? "bg-[var(--color-olive)]/15"
                : "bg-[var(--color-olive)]/15"
            }`}
          >
            {isEdit ? (
              <Pencil className="w-5 h-5 text-[var(--color-olive)]" />
            ) : (
              <UserPlus className="w-5 h-5 text-[var(--color-olive)]" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-dark-olive)] font-display">
              {isEdit ? "Edit Guest" : "Add Guest"}
            </h3>
            <p className="text-xs text-[var(--color-warm-gray)]">
              {isEdit
                ? "Update guest information"
                : "Create a new guest invitation"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-dark-olive)] mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="Guest name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-dark-olive)] mb-1.5">
              Phone
            </label>
            <Input
              type="text"
              placeholder="Phone number (optional)..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-dark-olive)] mb-1.5">
              Max Quota <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setMaxQuota(q)}
                  disabled={loading}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    maxQuota === q
                      ? "bg-[var(--color-olive)] text-white shadow-lg shadow-[var(--color-olive)]/25"
                      : "bg-[var(--color-soft-beige)] text-[var(--color-warm-gray)] hover:text-[var(--color-dark-olive)] hover:bg-[var(--color-warm-gray)]/10 border border-[var(--color-warm-gray)]/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-warm-gray)] mt-1.5">
              Maximum number of attendees this guest can bring
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <Pencil className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isEdit ? "Save Changes" : "Add Guest"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
