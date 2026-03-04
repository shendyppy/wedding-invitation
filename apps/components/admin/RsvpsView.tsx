// ============================================================
// RSVPs View Component
// Display and manage RSVP submissions with dark theme styling
// ============================================================

"use client";

import { Check, X, Clock, Users } from "lucide-react";
import { Badge } from "./ui";
import { cn } from "@/lib/utils";

export interface RsvpData {
  id: string;
  guest: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  status: "confirmed" | "declined" | "pending";
  attendees: number;
  message?: string | null;
  submittedAt: Date | null;
}

interface RsvpsViewProps {
  rsvps: RsvpData[];
}

export function RsvpsView({ rsvps }: RsvpsViewProps) {
  const confirmedCount = rsvps.filter((r) => r.status === "confirmed").length;
  const declinedCount = rsvps.filter((r) => r.status === "declined").length;
  const pendingCount = rsvps.filter((r) => r.status === "pending").length;
  const totalAttendees = rsvps
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.attendees, 0);

  const getStatusBadge = (status: RsvpData["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: RsvpData["status"]) => {
    switch (status) {
      case "confirmed":
        return <Check className="w-4 h-4 text-emerald-500" />;
      case "declined":
        return <X className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-admin-text font-display">
          RSVPs
        </h2>
        <p className="text-sm text-admin-text-muted">
          {rsvps.length} total RSVPs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {rsvps.length}
              </p>
              <p className="text-xs text-admin-text-muted">Total RSVPs</p>
            </div>
          </div>
        </div>
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {confirmedCount}
              </p>
              <p className="text-xs text-admin-text-muted">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {declinedCount}
              </p>
              <p className="text-xs text-admin-text-muted">Declined</p>
            </div>
          </div>
        </div>
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {totalAttendees}
              </p>
              <p className="text-xs text-admin-text-muted">Expected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Guest
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Attendees
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Message
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {rsvps.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-admin-text-muted"
                  >
                    No RSVPs submitted yet.
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp) => (
                  <tr
                    key={rsvp.id}
                    className="border-b border-admin-border hover:bg-admin-surface-hover/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-admin-text">
                          {rsvp.guest.name}
                        </p>
                        {(rsvp.guest.email || rsvp.guest.phone) && (
                          <p className="text-xs text-admin-text-muted mt-1">
                            {rsvp.guest.email || rsvp.guest.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(rsvp.status)}
                        {getStatusBadge(rsvp.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-admin-text">
                        {rsvp.attendees}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-admin-text max-w-xs truncate">
                        {rsvp.message || "—"}
                      </p>
                    </td>
                    <td className="p-4">
                      {rsvp.submittedAt ? (
                        <span className="text-sm text-admin-text-muted">
                          {new Date(rsvp.submittedAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-sm text-admin-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
