"use client";

import { useState } from "react";

export interface AccountSettingsProps {
  displayName: string;
  email: string;
  onLogout: () => void;
  className?: string;
}

export default function AccountSettings({
  displayName,
  email,
  onLogout,
  className = "",
}: AccountSettingsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section
      className={`rounded-xl border border-white/10 bg-black/20 overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-lg font-semibold text-white border-b border-white/10 hover:bg-white/5 transition-colors"
        aria-expanded={!collapsed}
      >
        <span>Cài đặt tài khoản</span>
        <svg
          className={`w-5 h-5 text-white/70 transition-transform ${collapsed ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* Personal info (read-only) */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-2">Thông tin cá nhân</h3>
            <dl className="space-y-1 text-sm">
              <div>
                <dt className="text-white/50">Tên hiển thị</dt>
                <dd className="text-white/90">{displayName || "—"}</dd>
              </div>
              <div>
                <dt className="text-white/50">Email</dt>
                <dd className="text-white/90">{email}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-white/40">Chỉnh sửa sẽ có trong phiên bản sau.</p>
          </div>

          {/* Change password - Coming soon */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 cursor-not-allowed"
            >
              <span>Đổi mật khẩu</span>
              <span className="text-xs bg-white/10 text-white/50 px-2 py-1 rounded-full">
                Soon
              </span>
            </button>
          </div>

          {/* Logout */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-full px-4 py-3 text-sm font-semibold text-white border border-red-800/60 bg-red-900/30 hover:bg-red-900/50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
