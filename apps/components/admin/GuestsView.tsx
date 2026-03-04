// ============================================================
// Guests View Component
// Display and manage guest list with dark theme styling
// ============================================================

"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  Copy,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui";
import { Input } from "./ui";
import { Button } from "./ui";

export interface Guest {
  id: string;
  name: string;
  phone?: string;
  maxQuota: number;
  uniqueToken: string;
  isOpened: boolean;
  rsvpSubmitted: boolean;
  rsvp?: {
    id: string;
    attendanceStatus: "hadir" | "tidak_hadir";
    numberOfAttendees: number;
  } | null;
  createdAt: string;
}

interface GuestsViewProps {
  guests: Guest[];
  onCreateGuest: () => void;
  onCopyLink: (token: string) => void;
}

const PAGE_SIZE = 10;

export function GuestsView({
  guests,
  onCreateGuest,
  onCopyLink,
}: GuestsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone?.includes(searchQuery),
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginatedGuests = filteredGuests.slice(startIdx, startIdx + PAGE_SIZE);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (guest: Guest) => {
    if (!guest.isOpened) {
      return <Badge variant="outline">Not Opened</Badge>;
    }
    if (!guest.rsvp) {
      return <Badge variant="info">Opened</Badge>;
    }
    if (guest.rsvp.attendanceStatus === "hadir") {
      return <Badge variant="success">Confirmed</Badge>;
    }
    if (guest.rsvp.attendanceStatus === "tidak_hadir") {
      return <Badge variant="destructive">Declined</Badge>;
    }
    return <Badge variant="warning">Pending</Badge>;
  };

  const getInvitationUrl = (token: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${baseUrl}/invite/${token}`;
  };

  const copyInviteLink = (token: string) => {
    const link = getInvitationUrl(token);
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    onCopyLink(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-admin-text font-display">
            Guests
          </h2>
          <p className="text-sm text-admin-text-muted">
            {guests.length} total guests
            {searchQuery && ` · ${filteredGuests.length} found`}
          </p>
        </div>
        <Button onClick={onCreateGuest} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Guest
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
        <Input
          type="search"
          placeholder="Search guests by name or phone..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
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
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Quota
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  RSVP
                </th>
                <th className="text-right p-4 font-medium text-sm text-admin-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-admin-text-muted"
                  >
                    {searchQuery
                      ? "No guests found matching your search."
                      : "No guests yet. Create your first guest!"}
                  </td>
                </tr>
              ) : (
                paginatedGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b border-admin-border hover:bg-admin-surface-hover/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-admin-text">
                          {guest.name}
                        </p>
                        <p className="text-xs text-admin-text-muted mt-1">
                          Created{" "}
                          {new Date(guest.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      {guest.phone ? (
                        <p className="text-sm text-admin-text-muted">
                          {guest.phone}
                        </p>
                      ) : (
                        <span className="text-sm text-admin-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-admin-text">
                        {guest.rsvp?.attendanceStatus === "hadir"
                          ? `${guest.rsvp.numberOfAttendees} / ${guest.maxQuota}`
                          : guest.maxQuota}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(guest)}</td>
                    <td className="p-4">
                      {guest.rsvp ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            {guest.rsvp.attendanceStatus === "hadir" ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <X className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-admin-text">
                              {guest.rsvp.attendanceStatus === "hadir"
                                ? "Hadir"
                                : "Tidak Hadir"}
                            </span>
                          </div>
                          {guest.rsvp.attendanceStatus === "hadir" && (
                            <p className="text-xs text-admin-text-muted">
                              {guest.rsvp.numberOfAttendees} attendee
                              {guest.rsvp.numberOfAttendees > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-admin-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {guest.isOpened && (
                          <span className="text-xs text-admin-text-muted flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Opened
                          </span>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyInviteLink(guest.uniqueToken)}
                          className="h-8 w-8"
                          title="Copy invitation link"
                        >
                          {copiedToken === guest.uniqueToken ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredGuests.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
            <p className="text-xs text-admin-text-muted">
              {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, filteredGuests.length)}{" "}
              of {filteredGuests.length}
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
                        ? "admin-gradient text-white"
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
        )}
      </div>
    </div>
  );
}
