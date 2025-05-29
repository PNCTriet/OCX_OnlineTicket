"use client";
import { useState } from "react";

const MENU = [
  { label: { vi: "Giới thiệu", en: "About" }, href: "#about" },
  { label: { vi: "Line-up", en: "Line-up" }, href: "#lineup" },
  { label: { vi: "Vé", en: "Tickets" }, href: "#tickets" },
  { label: { vi: "FAQ", en: "FAQ" }, href: "#faq" },
];

export default function Header({ lang, setLang, theme, setTheme }: any) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 sm:px-12 py-2">
      <div className="flex items-center gap-2 font-bold text-xl text-red-600">
        <span role="img" aria-label="ớt">🌶️</span> Ớt Cay Xè
      </div>
      <nav className="hidden md:flex gap-8 text-base font-medium">
        {MENU.map((item) => (
          <a key={item.href} href={item.href} className="hover:text-red-600 transition-colors">
            {item.label[lang]}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle light/dark mode"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10"
        >
          {theme === "light" ? "🌗" : "🌞"}
        </button>
        <button
          aria-label="Chuyển ngôn ngữ"
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10"
        >
          {lang === "vi" ? "🇻🇳" : "🇺🇸"}
        </button>
      </div>
    </header>
  );
} 