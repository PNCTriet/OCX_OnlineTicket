"use client";
import { useState, useEffect } from "react";
import MainHeader from "./components/MainHeader";
import HeroSection from "./components/HeroSection";
import LineupSection from "./components/LineupSection";
import TicketsSection from "./components/TicketsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import { LAUNCH_CONFIG } from "../config/launch";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("dark");
    
    // Check launch status on mount
    const currentDate = new Date();
    if (currentDate < LAUNCH_CONFIG.LAUNCH_DATE) {
      console.log('Site not launched yet, redirecting to launch page');
      router.push('/launch');
    }
  }, [router]);

  // Continuous launch status check
  useEffect(() => {
    if (mounted) {
      const checkLaunchStatus = () => {
        const currentDate = new Date();
        if (currentDate < LAUNCH_CONFIG.LAUNCH_DATE) {
          console.log('Site not launched yet, redirecting to launch page');
          router.push('/launch');
        }
      };

      // Check immediately
      checkLaunchStatus();
      
      // Check every 30 seconds
      const interval = setInterval(checkLaunchStatus, 30000);
      
      return () => clearInterval(interval);
    }
  }, [mounted, router]);

  // Show loading while checking launch status
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

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