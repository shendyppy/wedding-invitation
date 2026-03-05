// ============================================================
// Admin Dashboard Page — Dark Theme UI
// Beautiful dark admin panel with sidebar, header, and views
// ============================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AdminSidebar,
  DashboardView,
  GuestsView,
  RsvpsView,
  WishesView,
  ActionLogsView,
  BulkImportView,
  Toaster,
  useToast,
} from "@/components/admin";
import type { AdminView } from "@/components/admin";
import type { ActionLogData, ActionStats } from "@/components/admin";
import type { GuestFormData } from "@/components/admin";
import { Menu, Lock } from "lucide-react";

interface GuestStats {
  total: number;
  opened: number;
  rsvpSubmitted: number;
  withRsvp: number;
  withoutRsvp: number;
}

interface Guest {
  id: string;
  name: string;
  phone?: string;
  maxQuota: number;
  uniqueToken: string;
  isOpened: boolean;
  rsvpSubmitted: boolean;
  createdAt: string;
}

interface Rsvp {
  id: string;
  attendanceStatus: "ATTENDING" | "NOT_ATTENDING";
  numberOfAttendees: number;
  createdAt: Date;
  guest: {
    id: string;
    name: string;
    phone?: string;
  };
}

interface Wish {
  id: string;
  name: string;
  message: string;
  guest?: {
    id: string;
    name: string;
  } | null;
  attendanceStatus?: "ATTENDING" | "NOT_ATTENDING" | null;
  createdAt: Date;
}

interface RawRsvp {
  id: string;
  attendanceStatus: "hadir" | "tidak_hadir";
  numberOfAttendees: number;
  createdAt: string;
  guestId: string;
  guest: {
    name: string;
    phone?: string;
  };
}

interface RawWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  guest?: {
    id: string;
    name: string;
  } | null;
  attendanceStatus?: "hadir" | "tidak_hadir" | null;
}

interface SummaryData {
  totalRsvps: number;
  confirmedAttendance: number;
  declinedAttendance: number;
  totalAttendees: number;
  totalWishes: number;
}

interface DashboardData {
  guestStats: GuestStats;
  totalRsvps: number;
  confirmedAttendance: number;
  declinedAttendance: number;
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
  const [viewTransitionKey, setViewTransitionKey] = useState(0);
  const { toasts, toast, dismiss } = useToast();
  const prevViewRef = useRef<AdminView>("dashboard");

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
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

  // Page transition animation
  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      setViewTransitionKey((prev) => prev + 1);
      prevViewRef.current = currentView;
    }
  }, [currentView]);

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
      let summaryData: SummaryData | null = null;
      let guestStatsData: GuestStats | null = null;

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
          declinedAttendance: summaryData.declinedAttendance || 0,
          totalAttendees: summaryData.totalAttendees || 0,
          totalWishes: summaryData.totalWishes || 0,
        });
      }

      if (guestsRes.ok) {
        const data = await guestsRes.json();
        const guestList = data.guests || data.data || data;
        setGuests(guestList);
      }
      if (rsvpsRes.ok) {
        const data = await rsvpsRes.json();
        // Map raw RSVPs data to component-expected format
        const rawRsvps: RawRsvp[] = data.rsvps || data.data || data;
        const mappedRsvps = rawRsvps.map(
          (r: RawRsvp): Rsvp => ({
            id: r.id,
            attendanceStatus:
              r.attendanceStatus === "hadir" ? "ATTENDING" : "NOT_ATTENDING",
            numberOfAttendees: r.numberOfAttendees,
            createdAt: new Date(r.createdAt),
            guest: {
              id: r.guestId,
              name: r.guest.name,
              phone: r.guest.phone,
            },
          }),
        );
        setRsvps(mappedRsvps);
      }
      if (wishesRes.ok) {
        const data = await wishesRes.json();
        // Map raw wishes data to component-expected format
        const rawWishes: RawWish[] = data.wishes || data.data || data;
        const mappedWishes: Wish[] = rawWishes.map((w: RawWish) => ({
          id: w.id,
          name: w.name,
          message: w.message,
          guest: w.guest,
          attendanceStatus:
            w.attendanceStatus === "hadir"
              ? "ATTENDING"
              : w.attendanceStatus === "tidak_hadir"
                ? "NOT_ATTENDING"
                : null,
          createdAt: new Date(w.createdAt),
        }));
        setWishes(mappedWishes);
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

  const handleCopyLink = () => {
    toast({
      title: "Link Copied",
      message: "Invitation link copied to clipboard",
      variant: "success",
    });
  };

  // ---- Guest CRUD handlers ----

  const handleCreateGuest = async (data: GuestFormData) => {
    const res = await authFetch("/api/admin/guests", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        phone: data.phone || null,
        maxQuota: data.maxQuota,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to create guest");
    }

    // Refresh data
    await fetchAllData();
    toast({
      title: "Guest Created",
      message: `${data.name} has been added successfully`,
      variant: "success",
    });
  };

  const handleEditGuest = async (data: GuestFormData) => {
    if (!data.id) return;

    const res = await authFetch(`/api/admin/guests/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        phone: data.phone || null,
        maxQuota: data.maxQuota,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to update guest");
    }

    // Refresh data
    await fetchAllData();
    toast({
      title: "Guest Updated",
      message: `${data.name} has been updated successfully`,
      variant: "success",
    });
  };

  const handleDeleteGuest = async (id: string) => {
    const res = await authFetch(`/api/admin/guests/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to delete guest");
    }

    // Refresh data
    await fetchAllData();
    toast({
      title: "Guest Deleted",
      message: "Guest has been removed successfully",
      variant: "success",
    });
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-page min-h-screen flex items-center justify-center p-6">
        <div className="admin-surface rounded-2xl p-8 w-full max-w-md admin-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 admin-glow bg-admin-primary">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-admin-text mb-2 font-display">
              Admin Panel
            </p>
            <p className="text-sm">S &amp; Z Wedding Invitation</p>
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
                className="w-full h-11 rounded-xl border text-admin-text text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-admin-text-muted transition-all px-4"
                placeholder="Enter admin password..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-11 rounded-xl bg-[var(--color-olive)] text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

      <main className="flex-1 min-h-screen flex flex-col lg:ml-64">
        {/* Fixed Header with Backdrop Blur */}
        <header className="fixed top-0 left-0 right-0 lg:left-64 z-20 backdrop-blur-xl bg-admin-bg/95 border-b border-admin-border px-6 h-16 flex items-center justify-between shrink-0">
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
        <div className="flex-1 p-6 overflow-auto admin-scroll mt-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div key={viewTransitionKey} className="admin-page-transition">
                {currentView === "dashboard" && dashboardData && (
                  <DashboardView data={dashboardData} />
                )}

                {currentView === "guests" && (
                  <GuestsView
                    guests={guests}
                    onCreateGuest={handleCreateGuest}
                    onEditGuest={handleEditGuest}
                    onDeleteGuest={handleDeleteGuest}
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
              </div>
            )}
          </div>
        </div>
      </main>

      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
