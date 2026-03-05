// ============================================================
// Wishes View Component
// Display wedding wishes with dark theme styling
// ============================================================

"use client";

import { useState } from "react";
import { MessageSquareHeart, Heart } from "lucide-react";
import { Badge, Button } from "./ui";

export interface WishData {
  id: string;
  name: string;
  message: string;
  guest?: {
    name: string;
  } | null;
  attendanceStatus?: "ATTENDING" | "NOT_ATTENDING" | null;
  createdAt: Date;
}

interface WishesViewProps {
  wishes: WishData[];
}

export function WishesView({ wishes }: WishesViewProps) {
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const attendingWishes = wishes.filter(
    (w) => w.attendanceStatus === "ATTENDING",
  ).length;
  const notAttendingWishes = wishes.filter(
    (w) => w.attendanceStatus === "NOT_ATTENDING",
  ).length;
  const unknownWishes = wishes.filter((w) => !w.attendanceStatus).length;

  const displayedWishes = wishes.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      setVisibleCount((prev) => prev + 9);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-admin-text font-display">
          Wedding Wishes
        </h2>
        <p className="text-sm text-admin-text-muted">
          {wishes.length} total wishes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {attendingWishes}
              </p>
              <p className="text-xs text-admin-text-muted">From Guests</p>
            </div>
          </div>
        </div>
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {notAttendingWishes}
              </p>
              <p className="text-xs text-admin-text-muted">Well-wishers</p>
            </div>
          </div>
        </div>
        <div className="admin-fade-in admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {unknownWishes}
              </p>
              <p className="text-xs text-admin-text-muted">Unknown Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishes Grid */}
      {wishes.length === 0 ? (
        <div className="admin-fade-in admin-surface rounded-2xl p-12 text-center">
          <MessageSquareHeart className="w-12 h-12 mx-auto mb-4 text-admin-text-muted" />
          <p className="text-admin-text-muted">
            No wishes yet. Wait for your guests to send their love!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedWishes.map((wish) => (
              <div
                key={wish.id}
                className="admin-surface rounded-xl p-5 hover:border-admin-border/50 transition-all admin-fade-in group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-admin-text">
                        {wish.guest?.name || wish.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-admin-text-muted">
                        {new Date(wish.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {wish.attendanceStatus && (
                    <Badge
                      variant={
                        wish.attendanceStatus === "ATTENDING"
                          ? "success"
                          : "info"
                      }
                    >
                      {wish.attendanceStatus === "ATTENDING"
                        ? "Attending"
                        : "Not Attending"}
                    </Badge>
                  )}
                </div>

                {/* Message */}
                <p className="text-sm text-admin-text leading-relaxed">
                  &ldquo;{wish.message}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Load More Control */}
          {visibleCount < wishes.length && (
            <div className="flex items-center justify-center p-4">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    Loading...
                  </span>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
