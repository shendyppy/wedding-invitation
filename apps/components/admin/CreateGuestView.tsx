// ============================================================
// Create Guest View Component
// Form to add a single guest with styled components
// ============================================================

"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, UserPlus, Loader2, Copy } from "lucide-react";
import { Input } from "./ui";
import { Button } from "./ui";
import { Select } from "@/components/atoms";

interface Guest {
  id: string;
  name: string;
  phone: string | null;
  maxQuota: number;
  uniqueToken: string;
  isOpened: boolean;
  createdAt: string;
}

interface CreateGuestViewProps {
  onBack: () => void;
  onGuestCreated: (guest: Guest) => void;
  authToken: string;
}

export function CreateGuestView({
  onBack,
  onGuestCreated,
  authToken,
}: CreateGuestViewProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [maxQuota, setMaxQuota] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<Guest | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          maxQuota,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create guest");
      }

      setSuccess(data.data);
      onGuestCreated(data.data);

      // Reset form
      setName("");
      setPhone("");
      setMaxQuota(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create guest");
    } finally {
      setLoading(false);
    }
  };

  const invitationUrl = success?.uniqueToken
    ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/invite/${success.uniqueToken}`
    : "";

  const handleCopyLink = () => {
    if (invitationUrl) {
      navigator.clipboard.writeText(invitationUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-admin-text font-display">
            Add Guest
          </h2>
          <p className="text-sm text-admin-text-muted">
            Create a new guest invitation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="admin-fade-in admin-surface rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="Guest name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
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
              <label className="block text-sm font-medium text-admin-text mb-2">
                Max Quota <span className="text-red-400">*</span>
              </label>
              <Select
                placeholder="Select quota..."
                options={[
                  { value: "1", label: "1 person" },
                  { value: "2", label: "2 people" },
                  { value: "3", label: "3 people" },
                  { value: "4", label: "4 people" },
                ]}
                value={String(maxQuota)}
                onChange={(e) => setMaxQuota(parseInt(e.target.value))}
                disabled={loading}
                required
              />
              <p className="text-xs text-admin-text-muted mt-1">
                Maximum number of attendees this guest can bring
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Guest
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Success Result */}
        {success && (
          <div className="admin-fade-in admin-surface rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-admin-text">
                Guest Created!
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-admin-text-muted">Name</p>
                <p className="text-sm font-medium text-admin-text">
                  {success.name}
                </p>
              </div>

              {success.phone && (
                <div>
                  <p className="text-xs text-admin-text-muted">Phone</p>
                  <p className="text-sm text-admin-text">{success.phone}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-admin-text-muted">Max Quota</p>
                <p className="text-sm text-admin-text">{success.maxQuota}</p>
              </div>

              <div>
                <p className="text-xs text-admin-text-muted mb-1">
                  Invitation Link
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-admin-primary bg-admin-surface-hover px-3 py-2 rounded-lg break-all">
                    {invitationUrl}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopyLink}
                    className="h-8 w-8 shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
