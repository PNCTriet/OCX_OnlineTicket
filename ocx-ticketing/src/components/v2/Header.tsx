"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type HeaderLang = "vi" | "en";

export type HeaderNavItem = {
  href: string;
  label: ReactNode;
  active?: boolean;
};

type HeaderProps = {
  brandHref?: string;
  /** Nếu truyền, hiển thị cạnh logo; mặc định chỉ logo. */
  brandLabel?: string;
  navItems?: HeaderNavItem[];
  lang?: HeaderLang;
  onLangChange?: (lang: HeaderLang) => void;
  /** Replace default CTAs (e.g. auth-aware buttons) */
  actions?: ReactNode;
};

const defaultNav: HeaderNavItem[] = [
  { href: "/community", label: "Trợ giúp" },
  { href: "/profile", label: "Vé của tôi" },
];

export default function Header({
  brandHref = "/",
  brandLabel,
  navItems = defaultNav,
  lang = "vi",
  onLangChange,
  actions,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[#262626] bg-[#0A0A0A]/90 backdrop-blur-md backdrop-saturate-180">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-6">
        <Link
          href={brandHref}
          aria-label="Trang chủ"
          className="inline-flex shrink-0 items-center gap-2.5 text-[#FAFAFA]"
        >
          <Image
            src="/images/ocx5_images/elements/ocx_logo_ss5_shorten_alt1.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 object-contain brightness-110"
            priority
          />
          {brandLabel ? (
            <span className="text-[15px] font-semibold tracking-tight">{brandLabel}</span>
          ) : null}
        </Link>

        {navItems.length > 0 ? (
          <nav className="ml-2 hidden min-w-0 gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href + String(item.label)}
                href={item.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-[#212121] text-[#FAFAFA]"
                    : "text-[#A1A1A1] hover:text-[#FAFAFA]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {onLangChange && (
            <div className="inline-flex rounded-lg border border-[#262626] bg-[#141414] p-0.5">
              <button
                type="button"
                onClick={() => onLangChange("en")}
                className={[
                  "rounded-md px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide",
                  lang === "en"
                    ? "bg-[#212121] text-[#FAFAFA]"
                    : "text-[#A1A1A1] hover:text-[#FAFAFA]",
                ].join(" ")}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLangChange("vi")}
                className={[
                  "rounded-md px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide",
                  lang === "vi"
                    ? "bg-[#212121] text-[#FAFAFA]"
                    : "text-[#A1A1A1] hover:text-[#FAFAFA]",
                ].join(" ")}
              >
                VI
              </button>
            </div>
          )}
          {actions ?? (
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
