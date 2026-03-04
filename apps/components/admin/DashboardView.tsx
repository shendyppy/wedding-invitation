// ============================================================
// Dashboard View Component
// Beautiful stat cards and progress bars with dark theme
// ============================================================

"use client";

import {
  Users,
  CheckCircle2,
  UserCheck,
  MessageSquareHeart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuestStats {
  total: number;
  opened: number;
  rsvpSubmitted: number;
  withRsvp: number;
  withoutRsvp: number;
}

export interface DashboardData {
  guestStats: GuestStats;
  totalRsvps: number;
  confirmedAttendance: number;
  totalAttendees: number;
  totalWishes: number;
}

interface DashboardViewProps {
  data: DashboardData;
}

function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  gradient,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  subtitle?: string;
  gradient: string;
}) {
  return (
    <div className="admin-surface rounded-2xl p-5 admin-fade-in group hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            gradient,
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {subtitle && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-admin-surface-hover text-admin-text-muted">
            {subtitle}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-admin-text font-display">{value}</p>
      <p className="text-sm mt-1 text-admin-text-muted">{label}</p>
    </div>
  );
}

function ProgressBar({
  label,
  current,
  total,
  colorClass,
}: {
  label: string;
  current: number;
  total: number;
  colorClass: string;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-admin-text-muted">{label}</span>
        <span className="font-medium text-admin-text">
          {current} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-admin-surface-hover overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            colorClass,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardView({ data }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Guests"
          value={data.guestStats.total}
          icon={Users}
          subtitle={`${data.guestStats.opened} opened`}
          gradient="admin-gradient"
        />
        <StatCard
          label="Total RSVPs"
          value={data.totalRsvps}
          icon={CheckCircle2}
          subtitle={`${data.confirmedAttendance} confirmed`}
          gradient="bg-emerald-500"
        />
        <StatCard
          label="Expected Attendees"
          value={data.totalAttendees}
          icon={UserCheck}
          subtitle="Expected"
          gradient="bg-blue-500"
        />
        <StatCard
          label="Wedding Wishes"
          value={data.totalWishes}
          icon={MessageSquareHeart}
          subtitle="Messages"
          gradient="bg-amber-500"
        />
      </div>

      {/* Detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Guest engagement */}
        <div className="admin-surface rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-admin-text">
              Guest Engagement
            </h3>
          </div>
          <ProgressBar
            label="Opened Invite"
            current={data.guestStats.opened}
            total={data.guestStats.total}
            colorClass="admin-gradient"
          />
          <ProgressBar
            label="RSVP Submitted"
            current={data.guestStats.rsvpSubmitted}
            total={data.guestStats.total}
            colorClass="bg-emerald-500"
          />
          <ProgressBar
            label="With RSVP"
            current={data.guestStats.withRsvp}
            total={data.guestStats.total}
            colorClass="bg-blue-500"
          />
          <ProgressBar
            label="Without RSVP"
            current={data.guestStats.withoutRsvp}
            total={data.guestStats.total}
            colorClass="bg-admin-text-muted"
          />
        </div>

      </div>
    </div>
  );
}
