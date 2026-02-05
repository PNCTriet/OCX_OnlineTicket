"use client";

import type { ProfileUser } from "./types";

export interface ProfileHeaderProps {
  user: ProfileUser;
  className?: string;
}

export default function ProfileHeader({ user, className = "" }: ProfileHeaderProps) {
  const initial = user.displayName?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header
      className={`sticky top-0 z-10 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-[#050508]/95 px-4 py-4 shadow-lg backdrop-blur-md md:gap-6 md:px-6 md:py-5 ${className}`}
    >
      {/* Avatar + name row (compact on mobile) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center text-lg md:text-xl font-bold border-2 border-red-800/80"
          aria-hidden
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl font-semibold text-white truncate">
            {user.displayName || "User"}
          </h1>
          <p className="text-sm text-white/60 truncate">{user.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                user.verified
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {user.verified ? "✓ Verified" : "Unverified"}
            </span>
            {user.totalTickets != null && user.totalTickets > 0 && (
              <span className="text-xs text-white/50">
                {user.totalTickets} vé
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
