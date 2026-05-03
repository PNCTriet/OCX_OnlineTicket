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
      className={`overflow-hidden rounded-xl border border-[#262626] bg-[#141414] ${className}`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between border-b border-[#262626] px-4 py-3 text-left text-lg font-semibold text-[#FAFAFA] transition-colors hover:bg-[#212121]"
        aria-expanded={!collapsed}
      >
        <span>Cài đặt tài khoản</span>
        <svg
          className={`size-5 text-[#A1A1A1] transition-transform ${collapsed ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="space-y-4 p-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-[#A1A1A1]">Thông tin cá nhân</h3>
            <dl className="space-y-1 text-sm">
              <div>
                <dt className="text-[#737373]">Tên hiển thị</dt>
                <dd className="text-[#FAFAFA]">{displayName || "—"}</dd>
              </div>
              <div>
                <dt className="text-[#737373]">Email</dt>
                <dd className="text-[#FAFAFA]">{email}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-[#525252]">Chỉnh sửa sẽ có trong phiên bản sau.</p>
          </div>

          <div className="border-t border-[#262626] pt-2">
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-between rounded-lg border border-[#262626] bg-[#0F0F0F] px-4 py-3 text-sm text-[#525252]"
            >
              <span>Đổi mật khẩu</span>
              <span className="rounded-full bg-[#212121] px-2 py-1 text-xs text-[#737373]">
                Soon
              </span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-lg border border-[#F8717140] bg-[#F8717114] px-4 py-3 text-sm font-semibold text-[#F87171] transition-colors hover:bg-[#F8717126]"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
