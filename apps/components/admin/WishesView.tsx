// ============================================================
// Wishes View Component
// Display wedding wishes with dark theme styling
// ============================================================

"use client";

import { MessageSquareHeart, Heart } from "lucide-react";
import { Badge } from "./ui";

export interface WishData {
  id: string;
  message: string;
  guest: {
    id: string;
    name: string;
  };
  isAttending: boolean | null;
  createdAt: Date;
}

interface WishesViewProps {
  wishes: WishData[];
}

export function WishesView({ wishes }: WishesViewProps) {
  const attendingWishes = wishes.filter((w) => w.isAttending === true).length;
  const notAttendingWishes = wishes.filter(
    (w) => w.isAttending === false,
  ).length;
  const unknownWishes = wishes.filter((w) => w.isAttending === null).length;

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
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {attendingWishes}
              </p>
              <p className="text-xs text-admin-text-muted">From Guests</p>
            </div>
          </div>
        </div>
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-admin-text">
                {notAttendingWishes}
              </p>
              <p className="text-xs text-admin-text-muted">Well-wishers</p>
            </div>
          </div>
        </div>
        <div className="admin-surface rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-amber-500" />
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
        <div className="admin-surface rounded-2xl p-12 text-center">
          <MessageSquareHeart className="w-12 h-12 mx-auto mb-4 text-admin-text-muted" />
          <p className="text-admin-text-muted">
            No wishes yet. Wait for your guests to send their love!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="admin-surface rounded-xl p-5 hover:border-primary/20 transition-all admin-fade-in group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full admin-gradient flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-admin-text">
                      {wish.guest.name}
                    </p>
                    <p className="text-xs text-admin-text-muted">
                      {new Date(wish.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {wish.isAttending !== null && (
                  <Badge variant={wish.isAttending ? "success" : "info"}>
                    {wish.isAttending ? "Attending" : "Not Attending"}
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
      )}
    </div>
  );
}
