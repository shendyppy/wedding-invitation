// ============================================================
// Admin Dashboard Page — Dark Theme UI
// Beautiful dark admin panel with sidebar, header, and views
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AdminSidebar,
  DashboardView,
  GuestsView,
  CreateGuestView,
  RsvpsView,
  WishesView,
  ActionLogsView,
  BulkImportView,
  Toaster,
  useToast,
} from "@/components/admin";
import type { AdminView } from "@/components/admin";
import type { ActionLogData, ActionStats } from "@/components/admin";
import { Menu } from "lucide-react";

interface GuestStats {
  total: number;
  opened: number;
  rsvpSubmitted: number;
  withRsvp: number;
  withoutRsvp: number;
}

interface DashboardData {
  guestStats: GuestStats;
  totalRsvps: number;
  confirmedAttendance: number;
  totalAttendees: number;
  totalWishes: number;
}

const viewTitles: Record<AdminView, string> = {
  dashboard: "Dashboard",
  guests: "Guests",
  "create-guest": "Add Guest",
  "bulk-import": "Bulk Import",
  rsvps: "RSVPs",
  wishes: "Wishes",
  "action-logs": "Action Logs",
};

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { toasts, toast, dismiss } = useToast();

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [guests, setGuests] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLogData[]>([]);
  const [actionStats, setActionStats] = useState<ActionStats | null>(null);

  const [loading, setLoading] = useState(true);

  // Helper: get stored auth token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem("admin-token") || "";
  }, []);

  // Helper: authenticated fetch
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = getAuthToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    [getAuthToken],
  );

  // Authentication check on mount
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        summaryRes,
        guestStatsRes,
        guestsRes,
        rsvpsRes,
        wishesRes,
        actionStatsRes,
      ] = await Promise.all([
        authFetch("/api/admin/summary"),
        authFetch("/api/admin/guest-stats"),
        authFetch("/api/admin/guests"),
        authFetch("/api/admin/rsvps"),
        authFetch("/api/admin/wishes"),
        fetch("/api/action-logs?stats=true"),
      ]);

      // Compose dashboard data
      let summaryData: any = null;
      let guestStatsData: any = null;

      if (summaryRes.ok) {
        const res = await summaryRes.json();
        summaryData = res.data || res;
      }
      if (guestStatsRes.ok) {
        const res = await guestStatsRes.json();
        guestStatsData = res.data || res;
      }

      if (summaryData && guestStatsData) {
        setDashboardData({
          guestStats: guestStatsData,
          totalRsvps: summaryData.totalRsvps || 0,
          confirmedAttendance: summaryData.confirmedAttendance || 0,
          totalAttendees: summaryData.totalAttendees || 0,
          totalWishes: summaryData.totalWishes || 0,
        });
      }

      if (guestsRes.ok) {
        const data = await guestsRes.json();
        setGuests(data.guests || data.data || data);
      }
      if (rsvpsRes.ok) {
        const data = await rsvpsRes.json();
        setRsvps(data.rsvps || data.data || data);
      }
      if (wishesRes.ok) {
        const data = await wishesRes.json();
        setWishes(data.wishes || data.data || data);
      }

      // Action logs stats
      if (actionStatsRes.ok) {
        const data = await actionStatsRes.json();
        setActionStats(data.data || data);
      }

      // Fetch full action logs
      try {
        const logsRes = await authFetch("/api/action-logs");
        if (logsRes.ok) {
          const data = await logsRes.json();
          setActionLogs(data.data || []);
        }
      } catch {
        // Action logs may not exist yet
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        message: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin-token", data.token);
        setIsAuthenticated(true);
        toast({
          title: "Welcome!",
          message: "Successfully signed in",
          variant: "success",
        });
      } else {
        toast({
          title: "Authentication Failed",
          message: data.error || "Invalid password",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        message: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-token");
    setPassword("");
    setDashboardData(null);
    setGuests([]);
    setRsvps([]);
    setWishes([]);
    setActionLogs([]);
    setActionStats(null);
  };

  const handleCopyLink = (token: string) => {
    toast({
      title: "Link Copied",
      message: "Invitation link copied to clipboard",
      variant: "success",
    });
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-page min-h-screen flex items-center justify-center p-6">
        <div className="admin-surface rounded-2xl p-8 w-full max-w-md admin-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl admin-gradient flex items-center justify-center mx-auto mb-4 admin-glow">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-admin-text mb-2 font-display">
              Admin Panel
            </h1>
            <p className="text-sm text-admin-text-muted">
              S &amp; Z Wedding Invitation
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-admin-border bg-admin-surface px-4 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-admin-text-muted transition-all"
                placeholder="Enter admin password..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-11 rounded-xl admin-gradient text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <Toaster toasts={toasts} onDismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen flex">
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-h-screen flex flex-col">
        {/* Sticky Header with Backdrop Blur */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-admin-bg/80 border-b border-admin-border px-6 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-admin-surface-hover text-admin-text-muted hover:text-admin-text transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-display font-semibold text-admin-text">
                {viewTitles[currentView]}
              </h1>
              <p className="text-xs text-admin-text-muted">
                Stevana &amp; Zulfikar • 11 April 2026
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto admin-scroll">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <>
                {currentView === "dashboard" && dashboardData && (
                  <DashboardView data={dashboardData} />
                )}

                {currentView === "guests" && (
                  <GuestsView
                    guests={guests}
                    onCreateGuest={() => setCurrentView("create-guest")}
                    onCopyLink={handleCopyLink}
                  />
                )}

                {currentView === "rsvps" && <RsvpsView rsvps={rsvps} />}

                {currentView === "wishes" && <WishesView wishes={wishes} />}

                {currentView === "action-logs" && (
                  <ActionLogsView
                    actionLogs={actionLogs}
                    actionStats={actionStats}
                  />
                )}

                {currentView === "bulk-import" && (
                  <BulkImportView
                    onBack={() => setCurrentView("guests")}
                    onImportComplete={() => {
                      fetchAllData();
                      toast({
                        title: "Import Complete",
                        message: "Guest list imported successfully",
                        variant: "success",
                      });
                    }}
                    authToken={getAuthToken()}
                  />
                )}

                {currentView === "create-guest" && (
                  <CreateGuestView
                    onBack={() => setCurrentView("guests")}
                    onGuestCreated={() => {
                      fetchAllData();
                      toast({
                        title: "Guest Created",
                        message: "New guest added successfully",
                        variant: "success",
                      });
                    }}
                    authToken={getAuthToken()}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
