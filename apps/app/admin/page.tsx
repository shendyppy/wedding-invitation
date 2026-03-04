// ============================================================
// Admin Dashboard Page - Premium UI
// Modern, beautiful admin interface with proper aesthetics
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/components/atoms";
import type { Guest, Rsvp, Wish } from "@/types";

type View =
  | "dashboard"
  | "guests"
  | "rsvps"
  | "wishes"
  | "bank-logs"
  | "create-guest";

interface BankCopyLog {
  id: string;
  guestName: string;
  bankName: string;
  accountNumber: string;
  createdAt: string;
}

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
  bankCopyStats: { byBank: { bankName: string; count: number }[]; total: number };
}

// Icon components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [guests, setGuests] = useState<(Guest & { rsvp: Rsvp | null })[]>([]);
  const [rsvps, setRsvps] = useState<(Rsvp & { guest: { name: string; phone: string | null } })[]>([]);
  const [wishes, setWishes] = useState<(Wish & { guest?: { name: string } | null })[]>([]);
  const [bankLogs, setBankLogs] = useState<BankCopyLog[]>([]);

  // New guest form
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestQuota, setNewGuestQuota] = useState("2");

  function getAuthHeaders(): Record<string, string> {
    return isAuthenticated
      ? { Authorization: `Bearer ${password}` }
      : {};
  }

  async function fetchData(endpoint: string, setter: (data: any) => void) {
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (result.success) setter(result.data);
    } catch (err) {
      setError("Network error");
    }
  }

  async function fetchBankLogs() {
    try {
      const response = await fetch("/api/bank-copy", { headers: getAuthHeaders() });
      const result = await response.json();
      if (result.success) setBankLogs(result.data);
    } catch (err) {
      setError("Failed to fetch bank logs");
    }
  }

  async function loadDashboard() {
    setLoading(true);
    try {
      const [guestStatsRes, rsvpsRes, wishesRes, bankStatsRes] = await Promise.all([
        fetch("/api/admin/guest-stats", { headers: getAuthHeaders() }),
        fetch("/api/admin/rsvps", { headers: getAuthHeaders() }),
        fetch("/api/admin/wishes", { headers: getAuthHeaders() }),
        fetch("/api/bank-copy?stats=true", { headers: getAuthHeaders() }),
      ]);

      const [guestStats, rsvpsData, wishesData, bankStats] = await Promise.all([
        guestStatsRes.json(),
        rsvpsRes.json(),
        wishesRes.json(),
        bankStatsRes.json(),
      ]);

      setDashboardData({
        guestStats: guestStats.data || { total: 0, opened: 0, rsvpSubmitted: 0, withRsvp: 0, withoutRsvp: 0 },
        totalRsvps: rsvpsData.data?.length || 0,
        confirmedAttendance: rsvpsData.data?.filter((r: any) => r.attendanceStatus === "hadir").length || 0,
        totalAttendees: rsvpsData.data?.reduce((sum: number, r: any) => sum + (r.attendanceStatus === "hadir" ? r.numberOfAttendees : 0), 0) || 0,
        totalWishes: wishesData.data?.length || 0,
        bankCopyStats: bankStats.data || { byBank: [], total: 0 },
      });
    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  function loadGuests() { fetchData("guests", setGuests); }
  function loadRsvps() { fetchData("rsvps", setRsvps); }
  function loadWishes() { fetchData("wishes", setWishes); }

  useEffect(() => {
    if (isAuthenticated && currentView === "dashboard") loadDashboard();
  }, [isAuthenticated, currentView]);

  useEffect(() => {
    if (isAuthenticated && currentView !== "dashboard" && currentView !== "create-guest") {
      if (currentView === "guests") loadGuests();
      if (currentView === "rsvps") loadRsvps();
      if (currentView === "wishes") loadWishes();
      if (currentView === "bank-logs") fetchBankLogs();
    }
  }, [currentView, isAuthenticated]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/summary", {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadDashboard();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          name: newGuestName,
          phone: newGuestPhone || null,
          maxQuota: parseInt(newGuestQuota),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewGuestName("");
        setNewGuestPhone("");
        setNewGuestQuota("2");
        setCurrentView("guests");
        loadGuests();
      } else {
        setError(result.error || "Failed to create guest");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  // LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 shadow-2xl shadow-pink-500/25 mb-4">
              <HeartIcon />
            </div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">Stevana & Zulfikar</h1>
            <p className="text-slate-400">Wedding Admin Dashboard</p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-pink-500/25 transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-center text-slate-500 text-xs">
                April 11, 2026 • Wedding Invitation Management
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shrink-0">
              <HeartIcon />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-serif font-bold text-white">S & Z</h1>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { view: "dashboard" as View, label: "Dashboard", icon: <DashboardIcon /> },
            { view: "guests" as View, label: "Guests", icon: <UsersIcon /> },
            { view: "create-guest" as View, label: "Add Guest", icon: <PlusIcon /> },
            { view: "rsvps" as View, label: "RSVPs", icon: <CheckIcon /> },
            { view: "wishes" as View, label: "Wishes", icon: <ChatIcon /> },
            { view: "bank-logs" as View, label: "Bank Logs", icon: <CreditCardIcon /> },
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.view
                  ? "bg-gradient-to-r from-pink-500/20 to-amber-500/20 text-white shadow-lg shadow-pink-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <div className="shrink-0"><LogoutIcon /></div>
            {sidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-900/30 backdrop-blur-xl border-b border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {currentView === "dashboard" && "Dashboard"}
                {currentView === "guests" && "Guest Management"}
                {currentView === "create-guest" && "Add New Guest"}
                {currentView === "rsvps" && "RSVP Responses"}
                {currentView === "wishes" && "Wedding Wishes"}
                {currentView === "bank-logs" && "Bank Copy Logs"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">Stevana & Zulfikar • April 11, 2026</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl">
              {error}
            </div>
          )}

          {currentView === "dashboard" && dashboardData && <DashboardView data={dashboardData} loading={loading} />}
          {currentView === "guests" && <GuestsView guests={guests} loading={loading} />}
          {currentView === "create-guest" && (
            <CreateGuestView
              onSubmit={handleAddGuest}
              loading={loading}
              formData={{ name: newGuestName, phone: newGuestPhone, quota: newGuestQuota }}
              onChange={(data) => {
                setNewGuestName(data.name);
                setNewGuestPhone(data.phone);
                setNewGuestQuota(data.quota);
              }}
              onCancel={() => setCurrentView("guests")}
            />
          )}
          {currentView === "rsvps" && <RsvpsView rsvps={rsvps} loading={loading} />}
          {currentView === "wishes" && <WishesView wishes={wishes} loading={loading} />}
          {currentView === "bank-logs" && <BankLogsView logs={bankLogs} loading={loading} />}
        </div>
      </main>
    </div>
  );
}

// ==================== VIEW COMPONENTS ====================

function DashboardView({ data, loading }: { data: DashboardData; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Guests"
          value={data.guestStats.total}
          icon={<UsersIcon />}
          color="pink"
          trend={`${data.guestStats.opened} opened`}
        />
        <StatCard
          label="RSVPs"
          value={data.totalRsvps}
          icon={<CheckIcon />}
          color="emerald"
          trend={`${data.confirmedAttendance} confirmed`}
        />
        <StatCard
          label="Attendees"
          value={data.totalAttendees}
          icon={<CalendarIcon />}
          color="blue"
          trend="Expected"
        />
        <StatCard
          label="Wishes"
          value={data.totalWishes}
          icon={<ChatIcon />}
          color="amber"
          trend="Messages"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guest Stats */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <UsersIcon />
            Guest Engagement
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Opened Invitation" value={data.guestStats.total} current={data.guestStats.opened} color="pink" />
            <ProgressBar label="RSVP Submitted" value={data.guestStats.total} current={data.guestStats.rsvpSubmitted} color="emerald" />
            <ProgressBar label="Has RSVP" value={data.guestStats.total} current={data.guestStats.withRsvp} color="blue" />
            <ProgressBar label="No RSVP Yet" value={data.guestStats.total} current={data.guestStats.withoutRsvp} color="slate" />
          </div>
        </div>

        {/* Bank Copy Stats */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCardIcon />
            Bank Copy Activity
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">
                {data.bankCopyStats.total}
              </p>
              <p className="text-slate-400 mt-2">Total Copies</p>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            {data.bankCopyStats.byBank.map((bank) => (
              <div key={bank.bankName} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300">{bank.bankName}</span>
                <span className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-amber-500/20 text-pink-300 rounded-full text-sm font-medium">
                  {bank.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color = "pink",
  trend,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: "pink" | "emerald" | "blue" | "amber" | "purple" | "red";
  trend?: string;
}) {
  const colors = {
    pink: "from-pink-500 to-rose-500",
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-cyan-500",
    amber: "from-amber-500 to-orange-500",
    purple: "from-purple-500 to-violet-500",
    red: "from-red-500 to-pink-500",
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className="text-xs text-slate-500">{trend}</span>
      </div>
      <p className="text-4xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
}

function ProgressBar({ label, value, current, color }: { label: string; value: number; current: number; color: string }) {
  const percentage = value > 0 ? Math.round((current / value) * 100) : 0;
  const colors = {
    pink: "bg-pink-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    slate: "bg-slate-500",
  } as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-white font-medium">{current} / {value}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color as keyof typeof colors]} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function GuestsView({ guests, loading }: { guests: (Guest & { rsvp: Rsvp | null })[]; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading guests...</div>;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <UsersIcon />
            Guest List
          </h3>
          <span className="text-sm text-slate-500">{guests.length} guests</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quota</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Opened</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">RSVP Form</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">RSVP Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Invite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{guest.name}</p>
                  <code className="text-xs text-slate-500">{guest.uniqueToken}</code>
                </td>
                <td className="px-6 py-4 text-slate-400">{guest.phone || "-"}</td>
                <td className="px-6 py-4 text-center text-white">{guest.maxQuota}</td>
                <td className="px-6 py-4 text-center">
                  {guest.isOpened ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Opened
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-500 rounded-lg text-xs font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      Not opened
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {guest.rsvpSubmitted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-500 rounded-lg text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {guest.rsvp ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        guest.rsvp.attendanceStatus === "hadir"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {guest.rsvp.attendanceStatus === "hadir" ? "Attending" : "Not Attending"}
                      </span>
                      <span className="text-slate-500 text-xs">{guest.rsvp.numberOfAttendees} guest{guest.rsvp.numberOfAttendees > 1 ? "s" : ""}</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm">No RSVP</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/invite/${guest.uniqueToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
                  >
                    <LinkIcon />
                    Open invite
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateGuestView({
  onSubmit,
  loading,
  formData,
  onChange,
  onCancel,
}: {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  formData: { name: string; phone: string; quota: string };
  onChange: (data: { name: string; phone: string; quota: string }) => void;
  onCancel: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500">
            <PlusIcon />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Create New Guest</h3>
            <p className="text-slate-500 text-sm">Add a guest to the wedding list</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Guest Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onChange({ ...formData, name: e.target.value })}
                placeholder="Enter guest name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => onChange({ ...formData, phone: e.target.value })}
                placeholder="+62 xxx xxxx"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Max Quota *</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.quota}
              onChange={(e) => onChange({ ...formData, quota: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-slate-600 text-xs mt-2">Maximum number of attendees for this guest (including the guest)</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-pink-500/25 transition-all"
            >
              {loading ? "Creating..." : "Create Guest"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-500/20 rounded-2xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-slate-400">
              <p className="text-white font-medium mb-1">Auto-generated invitation link</p>
              <p>A unique token will be automatically generated. The invitation link will be:</p>
              <code className="block mt-2 text-xs bg-slate-800/50 px-3 py-2 rounded-lg text-pink-300">
                /invite/[token]
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RsvpsView({ rsvps, loading }: { rsvps: (Rsvp & { guest: { name: string; phone: string | null } })[]; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading RSVPs...</div>;
  }

  const confirmed = rsvps.filter((r) => r.attendanceStatus === "hadir");

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total RSVPs</p>
              <p className="text-3xl font-bold text-white mt-1">{rsvps.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800">
              <CheckIcon />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-sm">Confirmed</p>
              <p className="text-3xl font-bold text-white mt-1">{confirmed.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/20">
              <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm">Declined</p>
              <p className="text-3xl font-bold text-white mt-1">{rsvps.length - confirmed.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-red-500/20">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP List */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckIcon />
            All RSVPs
          </h3>
        </div>

        <div className="divide-y divide-slate-800">
          {rsvps.map((rsvp) => (
            <div key={rsvp.id} className="p-6 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{rsvp.guest.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rsvp.attendanceStatus === "hadir"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {rsvp.attendanceStatus === "hadir" ? "Attending" : "Not Attending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{rsvp.guest.phone || "No phone"}</span>
                    <span>•</span>
                    <span>{rsvp.numberOfAttendees} guest{rsvp.numberOfAttendees > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Submitted</p>
                  <p className="text-sm text-slate-400">{new Date(rsvp.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WishesView({ wishes, loading }: { wishes: (Wish & { guest?: { name: string } | null })[]; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading wishes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ChatIcon />
            Wedding Wishes
          </h3>
          <span className="text-sm text-slate-500">{wishes.length} messages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-amber-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-pink-400">
                      {wish.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{wish.name}</h4>
                    {wish.guest && (
                      <p className="text-xs text-slate-600">Guest: {wish.guest.name}</p>
                    )}
                  </div>
                </div>
                {wish.attendanceStatus && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    wish.attendanceStatus === "hadir"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {wish.attendanceStatus}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">{wish.message}</p>
              <p className="text-xs text-slate-600">
                {new Date(wish.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BankLogsView({ logs, loading }: { logs: BankCopyLog[]; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading logs...</div>;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CreditCardIcon />
            Bank Copy Logs
          </h3>
          <span className="text-sm text-slate-500">{logs.length} total copies</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Bank</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Number</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-amber-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-pink-400">
                        {log.guestName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-medium">{log.guestName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-amber-500/10 text-pink-300 rounded-lg text-sm font-medium">
                    {log.bankName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">{log.accountNumber}</code>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
            <CreditCardIcon />
          </div>
          <p className="text-slate-500">No bank copies recorded yet</p>
        </div>
      )}
    </div>
  );
}
