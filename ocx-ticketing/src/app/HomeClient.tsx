"use client";
import { useState, useEffect } from "react";
import MainHeader from "./components/MainHeader";
import HeroSection from "./components/HeroSection";
import LineupSection from "./components/LineupSection";
import TicketsSection from "./components/TicketsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function HomeClient() {
  const [lang, setLang] = useState<"vi" | "en">("vi");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      <MainHeader lang={lang} setLang={setLang} />
      <main className="flex flex-col ">
        <HeroSection />
        <LineupSection lang={lang} />
        <TicketsSection lang={lang} />
        <FAQSection lang={lang} />
      </main>
      <Footer />
    </div>
  );
} 