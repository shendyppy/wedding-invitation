// ============================================================
// Action Logs View Component
// Display all user interaction logs with filter tabs
// ============================================================

"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CreditCard,
  MapPin,
  Calendar,
  Eye,
  Link,
  MessageSquareHeart,
  CheckCircle2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui";
import { AdminSelect } from "./AdminSelect";

export interface ActionLogData {
  id: string;
  guestName: string;
  actionType: string;
  metadata: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  guest?: { name: string } | null;
}

export interface ActionStats {
  byType: { actionType: string; count: number; label: string }[];
  total: number;
  recentActivity: { date: string; count: number }[];
}

interface ActionLogsViewProps {
  actionLogs: ActionLogData[];
  actionStats: ActionStats | null;
}

const ACTION_TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string; color: string; bgColor: string }
> = {
  BANK_COPY: {
    icon: CreditCard,
    label: "Bank Copy",
    color: "text-amber-500",
    bgColor: "bg-amber-500/20",
  },
  SEE_LOCATION: {
    icon: MapPin,
    label: "See Location",
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  SAVE_THE_DATE: {
    icon: Calendar,
    label: "Save the Date",
    color: "text-pink-500",
    bgColor: "bg-pink-500/20",
  },
  OPEN_INVITATION: {
    icon: Eye,
    label: "Open Invitation",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/20",
  },
  COPY_LINK: {
    icon: Link,
    label: "Copy Link",
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
  SUBMIT_RSVP: {
    icon: CheckCircle2,
    label: "Submit RSVP",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  SUBMIT_WISH: {
    icon: MessageSquareHeart,
    label: "Submit Wish",
    color: "text-rose-500",
    bgColor: "bg-rose-500/20",
  },
  OTHER: {
    icon: Activity,
    label: "Other",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
  },
};

export function ActionLogsView({
  actionLogs,
  actionStats,
}: ActionLogsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<typeof actionLogs>([]);
  const ITEMS_PER_PAGE = 10;

  const filteredLogs =
    activeFilter === "ALL"
      ? actionLogs
      : actionLogs.filter((log) => log.actionType === activeFilter);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

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

  // Update displayed logs with smooth transition (only when filter/page changes)
  useEffect(() => {
    setDisplayedLogs(paginatedLogs);
    setIsTransitioning(true);
    // Brief transition, then reset
    const timer = setTimeout(() => setIsTransitioning(false), 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, currentPage]);

  // Reset to first page when filter changes
  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filterTabs = [
    { key: "ALL", label: "All", count: actionLogs.length },
    ...(actionStats?.byType || []).map((stat) => ({
      key: stat.actionType,
      label: ACTION_TYPE_CONFIG[stat.actionType]?.label || stat.actionType,
      count: stat.count,
    })),
  ];

  const getActionIcon = (actionType: string) => {
    const config = ACTION_TYPE_CONFIG[actionType] || ACTION_TYPE_CONFIG.OTHER;
    const Icon = config.icon;
    return (
      <div
        className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
    );
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-admin-text font-display">
          Action Logs
        </h2>
        <p className="text-sm text-admin-text-muted">
          Track all guest interactions with your invitation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Total */}
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-admin-primary flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-admin-text">
                {actionStats?.total || 0}
              </p>
              <p className="text-xs text-admin-text-muted">Total Actions</p>
            </div>
          </div>
        </div>

        {/* Per type */}
        {(actionStats?.byType || []).slice(0, 7).map((stat) => {
          const config =
            ACTION_TYPE_CONFIG[stat.actionType] || ACTION_TYPE_CONFIG.OTHER;
          const Icon = config.icon;
          return (
            <div
              key={stat.actionType}
              className="admin-fade-in admin-surface rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold text-admin-text">
                    {stat.count}
                  </p>
                  <p className="text-xs text-admin-text-muted truncate">
                    {config.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs - Desktop: horizontal scroll */}
      <div className="hidden sm:flex admin-fade-in items-center gap-2 overflow-x-auto admin-scroll">
        <Filter className="w-4 h-4 text-admin-text-muted shrink-0" />
        <div className="flex items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeFilter === tab.key
                  ? "bg-admin-primary text-white"
                  : "bg-admin-surface-hover text-admin-text-muted hover:text-admin-text"
              }`}
            >
              {tab.label} <span className="opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter - Mobile: AdminSelect with smooth animations */}
      <div className="sm:hidden admin-fade-in" style={{ zIndex: 40 }}>
        <AdminSelect
          placeholder="Filter by action type..."
          options={filterTabs.map((tab) => ({
            value: tab.key,
            label: `${tab.label} (${tab.count})`,
          }))}
          value={activeFilter}
          onChange={(val) => handleFilterChange(val)}
        />
      </div>

      {/* Logs Table - Desktop */}
      <div className="hidden md:block admin-fade-in admin-surface rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border">
              <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                Action
              </th>
              <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                Guest
              </th>
              <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center text-admin-text-muted"
                >
                  <Activity className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p>No activity logged yet.</p>
                  <p className="text-xs mt-1">
                    Guest interactions will appear here automatically.
                  </p>
                </td>
              </tr>
            ) : (
              displayedLogs.map((log, idx) => {
                const config =
                  ACTION_TYPE_CONFIG[log.actionType] ||
                  ACTION_TYPE_CONFIG.OTHER;
                return (
                  <tr
                    key={log.id}
                    className={`
                      border-b border-admin-border hover:bg-admin-surface-hover/50
                      transition-all duration-300 ease-out
                      ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
                    `}
                    style={{ transitionDelay: `${idx * 30}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getActionIcon(log.actionType)}
                        <Badge variant="outline" className="text-xs">
                          {config.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-admin-text text-sm">
                        {log.guestName}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-admin-text-muted whitespace-nowrap">
                        {formatTime(log.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {paginatedLogs.length === 0 ? (
          <div className="admin-fade-in admin-surface rounded-2xl p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-admin-text-muted opacity-40" />
            <p className="text-admin-text-muted">No activity logged yet.</p>
            <p className="text-xs mt-1 text-admin-text-muted">
              Guest interactions will appear here automatically.
            </p>
          </div>
        ) : (
          displayedLogs.map((log, idx) => {
            const config =
              ACTION_TYPE_CONFIG[log.actionType] || ACTION_TYPE_CONFIG.OTHER;
            return (
              <div
                key={log.id}
                className={`
                  admin-surface rounded-xl p-4 space-y-3
                  transition-all duration-300 ease-out
                  ${isTransitioning ? "opacity-0 translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100"}
                `}
                style={{ transitionDelay: `${idx * 30}ms` }}
              >
                {/* Header: Action icon + label */}
                <div className="flex items-center gap-3">
                  {getActionIcon(log.actionType)}
                  <Badge variant="outline" className="text-xs">
                    {config.label}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t border-admin-border">
                  <div>
                    <p className="text-xs text-admin-text-muted">Guest</p>
                    <p className="text-sm text-admin-text">{log.guestName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-admin-text-muted">Time</p>
                    <p className="text-sm text-admin-text">
                      {formatTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filteredLogs.length > ITEMS_PER_PAGE && (
        <>
          {/* Desktop pagination - inside table container */}
          <div className="hidden md:block admin-surface rounded-t-none rounded-2xl border-t-0 border-admin-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
              <p className="text-xs text-admin-text-muted">
                Showing {Math.min(startIndex + 1, filteredLogs.length)} to{" "}
                {Math.min(endIndex, filteredLogs.length)} of{" "}
                {filteredLogs.length} action logs
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
              Showing {Math.min(startIndex + 1, filteredLogs.length)} to{" "}
              {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length}{" "}
              action logs
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
