// ============================================================
// Action Logs View Component
// Display all user interaction logs with filter tabs
// ============================================================

"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Badge } from "./ui";
import { Button } from "./ui";

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

  const filteredLogs =
    activeFilter === "ALL"
      ? actionLogs
      : actionLogs.filter((log) => log.actionType === activeFilter);

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

  const getMetadataDisplay = (log: ActionLogData) => {
    if (!log.metadata) return null;
    const meta = log.metadata;

    if (log.actionType === "BANK_COPY" && meta.bankName) {
      return (
        <span className="text-xs text-admin-text-muted">
          {String(meta.bankName)} • {String(meta.accountNumber || "")}
        </span>
      );
    }

    return null;
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
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg admin-gradient flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
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
            <div key={stat.actionType} className="admin-surface rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto admin-scroll pb-1">
        <Filter className="w-4 h-4 text-admin-text-muted shrink-0" />
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilter === tab.key
                ? "admin-gradient text-white"
                : "bg-admin-surface-hover text-admin-text-muted hover:text-admin-text"
            }`}
          >
            {tab.label} <span className="opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="admin-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
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
                  Details
                </th>
                <th className="text-left p-4 font-medium text-sm text-admin-text-muted">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
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
                filteredLogs.map((log) => {
                  const config =
                    ACTION_TYPE_CONFIG[log.actionType] ||
                    ACTION_TYPE_CONFIG.OTHER;
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-admin-border hover:bg-admin-surface-hover/50 transition-colors"
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
                        {getMetadataDisplay(log) || (
                          <span className="text-xs text-admin-text-muted">
                            —
                          </span>
                        )}
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
      </div>
    </div>
  );
}
