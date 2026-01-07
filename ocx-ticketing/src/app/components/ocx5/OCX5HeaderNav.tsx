"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const SECTIONS = [
  { id: "hero-section", label: "Hero" },
  { id: "event-info", label: "info" },
  { id: "lineup", label: "Line-up" },
  { id: "pricing", label: "Pricing" },
  { id: "cta", label: "CTA" },
];

export default function OCX5HeaderNav() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollYRef.current;

      if (diff > 5) {
        // Scroll down
        setIsVisible(false);
      } else if (diff < -5) {
        // Scroll up
        setIsVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    if (typeof window === "undefined") return;

    const target = document.getElementById(id);
    if (!target) return;

    // Scroll smoothly so that the section's top aligns with viewport top
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav
        className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8 py-3 text-sm"
        style={{
          background:
            "linear-gradient(to bottom, rgba(154, 26, 21, 0.85) 0%, rgba(106, 20, 20, 0.75) 50%, rgba(74, 12, 16, 0.65) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          fontFamily: "fantasy, serif",
        }}
      >
        {/* Logo lớn hơn 50% */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-lg text-white"
          >
            <Image
              src="/images/client_logo_ss4.svg"
              alt="OCX Logo"
              width={96}
              height={96}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </Link>
        </div>

        {/* Section titles ở giữa - Font Harry Beast Display */}
        <div className="hidden sm:flex flex-1 justify-center gap-4 lg:gap-6">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={(e) => handleScrollTo(e, section.id)}
              className="px-3 py-1.5 hover:text-red-200 transition-colors"
              style={{
                fontFamily: "WizardWorldSimplified, fantasy, serif",
                fontSize: "clamp(24px, 3.5vw, 20px)",
                fontWeight: 400,
                fontStyle: "normal",
                lineHeight: "20px",
                letterSpacing: "normal",
                textTransform: "none",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Avatar / Sign in bên phải */}
        <div className="flex items-center justify-end flex-1 gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider hover:text-red-200 transition-colors"
              style={{ fontFamily: "WizardWorldSimplified, fantasy, serif" }}
            >
              SIGN IN
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}


