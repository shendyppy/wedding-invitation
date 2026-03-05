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
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "./ui";
import { Input } from "./ui";
import { Button } from "./ui";
import { GuestFormModal, type GuestFormData } from "./GuestFormModal";
import { ConfirmDialog } from "./ui/modal";

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
    attendanceStatus: "ATTENDING" | "NOT_ATTENDING";
    numberOfAttendees: number;
  } | null;
  createdAt: string;
}

interface GuestsViewProps {
  guests: Guest[];
  onCreateGuest: (data: GuestFormData) => Promise<void>;
  onEditGuest: (data: GuestFormData) => Promise<void>;
  onDeleteGuest: (id: string) => Promise<void>;
  onCopyLink: (token: string) => void;
}

const PAGE_SIZE = 10;

export function GuestsView({
  guests,
  onCreateGuest,
  onEditGuest,
  onDeleteGuest,
  onCopyLink,
}: GuestsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestFormData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    if (guest.rsvp.attendanceStatus === "ATTENDING") {
      return <Badge variant="success">Attending</Badge>;
    }
    if (guest.rsvp.attendanceStatus === "NOT_ATTENDING") {
      return <Badge variant="destructive">Not Attending</Badge>;
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

  // --- Modal handlers ---
  const handleOpenAddModal = () => {
    setEditingGuest(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (guest: Guest) => {
    setEditingGuest({
      id: guest.id,
      name: guest.name,
      phone: guest.phone || "",
      maxQuota: guest.maxQuota,
    });
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (data: GuestFormData) => {
    if (data.id) {
      await onEditGuest(data);
    } else {
      await onCreateGuest(data);
    }
  };

  const handleOpenDeleteDialog = (guest: Guest) => {
    setDeletingGuest(guest);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGuest) return;
    setDeleteLoading(true);
    try {
      await onDeleteGuest(deletingGuest.id);
      setDeleteDialogOpen(false);
      setDeletingGuest(null);
    } catch {
      // Error handling is done at parent level via toast
    } finally {
      setDeleteLoading(false);
    }
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-admin-text font-display">
              Guests
            </h2>
            <p className="text-sm text-admin-text-muted">
              {guests.length} total guests
              {searchQuery && ` · ${filteredGuests.length} found`}
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="gap-2 w-full sm:w-auto shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Add Guest
          </Button>
        </div>

        {/* Search */}
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
          <Input
            type="search"
            placeholder="Search by name or phone..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block admin-fade-in admin-surface rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted whitespace-nowrap">
                  Guest
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted whitespace-nowrap">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted whitespace-nowrap">
                  Quota
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted whitespace-nowrap">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted whitespace-nowrap">
                  RSVP
                </th>
                <th className="text-right p-4 font-medium text-sm text-admin-text-muted whitespace-nowrap">
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
                    <td className="p-4 whitespace-nowrap">
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
                    <td className="p-4 whitespace-nowrap">
                      {guest.phone ? (
                        <p className="text-sm text-admin-text-muted">
                          {guest.phone}
                        </p>
                      ) : (
                        <span className="text-sm text-admin-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-admin-text">
                        {guest.rsvp?.attendanceStatus === "ATTENDING"
                          ? `${guest.rsvp.numberOfAttendees} / ${guest.maxQuota}`
                          : guest.maxQuota}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(guest)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {guest.rsvp ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            {guest.rsvp.attendanceStatus === "ATTENDING" ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <X className="w-3 h-3 text-admin-text-muted" />
                            )}
                            <span className="text-admin-text">
                              {guest.rsvp.attendanceStatus === "ATTENDING"
                                ? "Attending"
                                : "Not Attending"}
                            </span>
                          </div>
                          {guest.rsvp.attendanceStatus === "ATTENDING" && (
                            <p className="text-xs text-admin-text-muted">
                              {guest.rsvp.numberOfAttendees} guest
                              {guest.rsvp.numberOfAttendees > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-admin-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {guest.isOpened && (
                          <span className="text-xs text-admin-text-muted flex items-center gap-1 mr-1">
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
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(guest)}
                          className="h-8 w-8"
                          title="Edit guest"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenDeleteDialog(guest)}
                          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                          title="Delete guest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {paginatedGuests.length === 0 ? (
            <div className="admin-fade-in admin-surface rounded-2xl p-8 text-center">
              <p className="text-admin-text-muted">
                {searchQuery
                  ? "No guests found matching your search."
                  : "No guests yet. Create your first guest!"}
              </p>
            </div>
          ) : (
            paginatedGuests.map((guest) => (
              <div
                key={guest.id}
                className="admin-fade-in admin-surface rounded-xl p-4 space-y-3"
              >
                {/* Header: Name + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-admin-text truncate">
                      {guest.name}
                    </p>
                    <p className="text-xs text-admin-text-muted mt-0.5">
                      Created {new Date(guest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(guest)}
                </div>

                {/* Contact */}
                {guest.phone && (
                  <div>
                    <p className="text-xs text-admin-text-muted">Contact</p>
                    <p className="text-sm text-admin-text">{guest.phone}</p>
                  </div>
                )}

                {/* Quota & RSVP Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-admin-text-muted">Quota</p>
                    <p className="text-sm font-medium text-admin-text">
                      {guest.rsvp?.attendanceStatus === "ATTENDING"
                        ? `${guest.rsvp.numberOfAttendees} / ${guest.maxQuota}`
                        : guest.maxQuota}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-admin-text-muted">RSVP</p>
                    {guest.rsvp ? (
                      <div className="flex items-center gap-1 text-sm">
                        {guest.rsvp.attendanceStatus === "ATTENDING" ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <X className="w-3 h-3 text-admin-text-muted" />
                        )}
                        <span className="text-admin-text">
                          {guest.rsvp.attendanceStatus === "ATTENDING"
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-admin-text-muted">—</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-admin-border">
                  {guest.isOpened && (
                    <span className="text-xs text-admin-text-muted flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Opened
                    </span>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenEditModal(guest)}
                      className="h-8 w-8"
                      title="Edit guest"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDeleteDialog(guest)}
                      className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete guest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredGuests.length > PAGE_SIZE && (
          <>
            {/* Desktop pagination - inside table container */}
            <div className="hidden md:block admin-surface rounded-t-none rounded-2xl border-t-0 border-admin-border overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-admin-border">
                <p className="text-xs text-admin-text-muted">
                  Showing {startIdx + 1}–
                  {Math.min(startIdx + PAGE_SIZE, filteredGuests.length)} of{" "}
                  {filteredGuests.length} guests
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
                Showing {startIdx + 1}–
                {Math.min(startIdx + PAGE_SIZE, filteredGuests.length)} of{" "}
                {filteredGuests.length} guests
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
      {/* Guest Form Modal (Add / Edit) */}
      <GuestFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingGuest(null);
        }}
        onSubmit={handleFormSubmit}
        guest={editingGuest}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingGuest(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Guest"
        description={
          deletingGuest
            ? `Are you sure you want to delete "${deletingGuest.name}"? This will also remove their RSVP and wishes. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteLoading}
      />
    </>
  );
}
