// ============================================================
// Admin Sidebar Component
// Beautiful dark sidebar with gradient active states
// ============================================================

"use client";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  CheckCircle2,
  MessageSquareHeart,
  Activity,
  LogOut,
  Heart,
  Menu,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminView =
  | "dashboard"
  | "guests"
  | "rsvps"
  | "wishes"
  | "action-logs"
  | "create-guest"
  | "bulk-import";

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  open: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const navItems: { view: AdminView; label: string; icon: React.ElementType }[] =
  [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "guests", label: "Guests", icon: Users },
    { view: "bulk-import", label: "Bulk Import", icon: Upload },
    { view: "rsvps", label: "RSVPs", icon: CheckCircle2 },
    { view: "wishes", label: "Wishes", icon: MessageSquareHeart },
    { view: "action-logs", label: "Action Logs", icon: Activity },
  ];

export function AdminSidebar({
  currentView,
  onViewChange,
  open,
  onToggle,
  onLogout,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar-background border-r border-sidebar-border transition-all duration-300",
          open ? "w-64" : "w-0 lg:w-64",
          !open && "overflow-hidden lg:overflow-visible",
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border shrink-0">
          <div className="w-9 h-9 rounded-xl admin-gradient flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div className="admin-slide-in overflow-hidden">
            <p className="font-display text-sm text-sidebar-accent-foreground font-semibold">
              S & Z
            </p>
            <p className="text-[11px] text-sidebar-foreground">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto admin-scroll">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  onViewChange(item.view);
                  if (typeof window !== "undefined" && window.innerWidth < 1024)
                    onToggle();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "admin-gradient text-white shadow-lg admin-glow"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="admin-slide-in">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-lg bg-admin-surface border border-admin-border text-admin-text"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
