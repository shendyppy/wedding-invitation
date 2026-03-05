// ============================================================
// RSVPs View Component
// Display and manage RSVP submissions with dark theme styling
// ============================================================

"use client";

import { useState } from "react";
import {
  Check,
  X,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui";

export interface RsvpData {
  id: string;
  guest: {
    id: string;
    name: string;
    phone?: string | null;
  };
  attendanceStatus: "ATTENDING" | "NOT_ATTENDING";
  numberOfAttendees: number;
  createdAt: Date;
}

interface RsvpsViewProps {
  rsvps: RsvpData[];
}

export function RsvpsView({ rsvps }: RsvpsViewProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  const confirmedCount = rsvps.filter(
    (r) => r.attendanceStatus === "ATTENDING",
  ).length;
  const declinedCount = rsvps.filter(
    (r) => r.attendanceStatus === "NOT_ATTENDING",
  ).length;
  const totalAttendees = rsvps
    .filter((r) => r.attendanceStatus === "ATTENDING")
    .reduce((sum, r) => sum + r.numberOfAttendees, 0);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(rsvps.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRsvps = rsvps.slice(startIndex, endIndex);

  // Generate page numbers to show
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (safePage > 3) pages.push("...");

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safePage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const getStatusBadge = (status: RsvpData["attendanceStatus"]) => {
    switch (status) {
      case "ATTENDING":
        return <Badge variant="success">Attending</Badge>;
      case "NOT_ATTENDING":
        return <Badge variant="destructive">Not Attending</Badge>;
    }
  };

  const getStatusIcon = (status: RsvpData["attendanceStatus"]) => {
    switch (status) {
      case "ATTENDING":
        return <Check className="w-4 h-4 text-emerald-500" />;
      case "NOT_ATTENDING":
        return <X className="w-4 h-4 text-rose-500" />;
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {rsvps.length}
              </p>
              <p className="text-xs text-admin-text-muted">Total RSVPs</p>
            </div>
          </div>
        </div>
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {confirmedCount}
              </p>
              <p className="text-xs text-admin-text-muted">Attending</p>
            </div>
          </div>
        </div>
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <X className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {declinedCount}
              </p>
              <p className="text-xs text-admin-text-muted">Not Attending</p>
            </div>
          </div>
        </div>
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {totalAttendees}
              </p>
              <p className="text-xs text-admin-text-muted">Total Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block admin-fade-in admin-surface rounded-2xl overflow-hidden">
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
                Guests
              </th>
              <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {rsvps.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-admin-text-muted"
                >
                  No RSVPs submitted yet.
                </td>
              </tr>
            ) : (
              paginatedRsvps.map((rsvp) => (
                <tr
                  key={rsvp.id}
                  className="border-b border-admin-border hover:bg-admin-surface-hover/50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-admin-text">
                        {rsvp.guest.name}
                      </p>
                      {rsvp.guest.phone && (
                        <p className="text-xs text-admin-text-muted mt-1">
                          {rsvp.guest.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(rsvp.attendanceStatus)}
                      {getStatusBadge(rsvp.attendanceStatus)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-admin-text">
                      {rsvp.numberOfAttendees}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-admin-text-muted">
                      {new Date(rsvp.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {rsvps.length === 0 ? (
          <div className="admin-fade-in admin-surface rounded-2xl p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-admin-text-muted opacity-40" />
            <p className="text-admin-text-muted">No RSVPs submitted yet.</p>
          </div>
        ) : (
          paginatedRsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="admin-fade-in admin-surface rounded-xl p-4 space-y-3"
            >
              {/* Header: Name + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-admin-text truncate">
                    {rsvp.guest.name}
                  </p>
                  {rsvp.guest.phone && (
                    <p className="text-xs text-admin-text-muted mt-0.5">
                      {rsvp.guest.phone}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getStatusIcon(rsvp.attendanceStatus)}
                  {getStatusBadge(rsvp.attendanceStatus)}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-admin-border">
                <div>
                  <p className="text-xs text-admin-text-muted">Guests</p>
                  <p className="text-sm font-medium text-admin-text">
                    {rsvp.numberOfAttendees}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-admin-text-muted">Date</p>
                  <p className="text-sm text-admin-text">
                    {new Date(rsvp.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {rsvps.length > ITEMS_PER_PAGE && (
        <>
          {/* Desktop pagination - inside table container */}
          <div className="hidden md:block admin-surface rounded-t-none rounded-2xl border-t-0 border-admin-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
              <p className="text-xs text-admin-text-muted">
                Showing {Math.min(startIndex + 1, rsvps.length)} to{" "}
                {Math.min(endIndex, rsvps.length)} of {rsvps.length} RSVPs
              </p>
              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded-lg text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`dots-${i}`}
                      className="w-8 text-center text-xs text-admin-text-muted"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        page === safePage
                          ? "bg-admin-primary text-white"
                          : "text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded-lg text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile pagination */}
          <div className="md:hidden flex flex-col items-center gap-3 py-4">
            <p className="text-xs text-admin-text-muted">
              Showing {Math.min(startIndex + 1, rsvps.length)} to{" "}
              {Math.min(endIndex, rsvps.length)} of {rsvps.length} RSVPs
            </p>
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="w-8 text-center text-xs text-admin-text-muted"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === safePage
                        ? "bg-admin-primary text-white"
                        : "text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
