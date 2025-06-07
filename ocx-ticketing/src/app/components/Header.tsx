"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const MENU = [
  { label: { vi: "TỔNG QUAN", en: "ABOUT" }, href: "#about" },
  { label: { vi: "NGHỆ SĨ", en: "LINE-UP" }, href: "#lineup" },
  { label: { vi: "MUA VÉ", en: "TICKETS" }, href: "#tickets" },
  { label: { vi: "FAQS", en: "FAQS" }, href: "#faq" },
];

export default function Header({ lang, setLang }: { lang: "vi" | "en"; setLang: (lang: "vi" | "en") => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 bg-[#c53e00] px-4 sm:px-12 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} style={{ fontFamily: 'BDStreetSignSans' }}>
      {/* MOBILE: 3-column flex, DESKTOP: flex as before */}
      <div className="flex items-center justify-between md:justify-normal md:flex-row w-full">
        {/* Hamburger - left on mobile, hidden on desktop */}
        <div className="flex-1 flex md:hidden">
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
        {/* Logo - centered on mobile, left on desktop */}
        <div className="flex-1 flex justify-center md:justify-start">
          <div className="flex items-center gap-2 font-bold text-xl text-red-600">
            <Image
              src="/images/client_logo_ss4.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>
        {/* Language toggle - right on mobile, right on desktop */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <button
            aria-label="Chuyển ngôn ngữ"
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="rounded-full p-2 transition-transform duration-300 hover:scale-110"
          >
            {lang === "vi" ? "VI" : "EN"}
          </button>
        </div>
        {/* Desktop Menu - centered on desktop only */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-25 text-2xl font-medium">
          {MENU.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-transform duration-300 hover:scale-110"
            >
              {item.label[lang]}
            </a>
          ))}
        </nav>
      </div>
      {/* Mobile Dropdown Menu - left aligned */}
      <div className={`absolute top-full left-0 w-full bg-[#c53e00] md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <nav className="flex flex-col items-start py-4">
          {MENU.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="w-full text-left px-4 py-3 text-xl font-medium hover:bg-[#b33800] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label[lang]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}