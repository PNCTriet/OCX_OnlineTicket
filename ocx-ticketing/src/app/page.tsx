"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import LineupSection from "./components/LineupSection";
import TicketsSection from "./components/TicketsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Home() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans">
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main className="flex flex-col gap-0">
        <HeroSection lang={lang} />
        <LineupSection lang={lang} />
        <TicketsSection lang={lang} />
        <FAQSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
