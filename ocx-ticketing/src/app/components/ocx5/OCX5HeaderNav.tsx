"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const SECTIONS = [
  { id: "hero-section", label: "info" },
  { id: "event-info", label: "ticket" },
  { id: "lineup", label: "Line-up" },
  { id: "cta", label: "FAQs" },
];

type OCX5HeaderNavProps = {
  /**
   * Ticket pages don't need section navigation.
   * @default true
   */
  showSectionNav?: boolean;
};

export default function OCX5HeaderNav({ showSectionNav = true }: OCX5HeaderNavProps) {
  const { user, signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollYRef.current;
      if (diff > 5) {
        setIsVisible(false);
      } else if (diff < -5) {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isUserMenuOpen]);

  const handleScrollTo = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    if (typeof window === "undefined") return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSignOut = async () => {
    try {
      setIsUserMenuOpen(false);
      await signOut();
    } catch (error) {
      // keep silent UI; log for debugging
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[80] transition-transform duration-500 bg-[#030305] shadow-2xl ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* TẦNG 1: TOP BAR */}
      <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-white/10">
        
        <div className="flex-1 hidden md:block" />

        {/* LOGO CHÍNH GIỮA */}
        <div className="flex-none">
          <Link href="/OCX5">
            <Image
              src="/images/ocx5_images/elements/ocx_logo_ss5_shorten_alt1.png" 
              alt="OCX Logo"
              width={104}
              height={104}
              className="w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] object-contain brightness-125 transition-transform hover:scale-110"
            />
          </Link>
        </div>

        {/* NHÓM PHẢI: Auth Buttons (Chỉnh lại theo mẫu Harry Potter) */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {user ? (
            <div className="relative z-[90]">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full p-1.5 hover:bg-white/10 transition-colors"
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold border-2 border-red-800">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <svg
                  className={`w-4 h-4 text-white/80 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#050508]/95 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.95)] backdrop-blur-md py-2 z-[120] pointer-events-auto">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">
                      {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-xs text-white/60">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      alert("Profile sẽ sớm ra mắt ✨");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile</span>
                    <span className="ml-auto text-[10px] bg-white/10 text-white/70 px-2 py-1 rounded-full">
                      Coming soon
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/ticketocx5"
                className="px-4 py-2 text-[11px] sm:text-[12px] font-bold text-white tracking-[1px] border border-white/70 rounded-full hover:bg-white hover:text-black transition-all"
                style={{ fontFamily: "WizardWorldSimplified, fantasy, serif" }}
              >
                LOG IN
              </Link>
              <Link
                href="/ticketocx5"
                className="px-4 py-2 text-[11px] sm:text-[12px] font-bold text-white tracking-[1px] rounded-full transition-all shadow-[0_0_15px_rgba(212,57,34,0.35)] hover:shadow-[0_0_28px_rgba(212,57,34,0.55)] hover:scale-[1.03] active:scale-95"
                style={{
                  fontFamily: "WizardWorldSimplified, fantasy, serif",
                  background: "linear-gradient(180deg, #d43922 0%, #9a1a15 100%)",
                }}
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* TẦNG 2: NAVIGATION MENU */}
      {showSectionNav && (
        <nav 
          className="w-full flex justify-center py-4 bg-black/40"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-14 px-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={(e) => handleScrollTo(e, section.id)}
                className="relative group text-white uppercase transition-colors"
                style={{
                  fontFamily: "WizardWorldSimplified, fantasy, serif",
                  fontSize: "13px",
                  letterSpacing: "2px",
                  fontWeight: 400,
                }}
              >
                {section.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Backdrop for user menu (below header content, above page) */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-[70]"
          onClick={() => setIsUserMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}