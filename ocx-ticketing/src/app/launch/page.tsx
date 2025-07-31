"use client";
import { useState, useEffect } from "react";
import CountdownLaunch from "../components/CountdownLaunch";
import { LAUNCH_CONFIG } from "../../config/launch";
import MainHeader from "../components/MainHeader";

export default function LaunchPage() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"vi" | "en">("vi");

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("dark");
    
    // Check if launch date has passed and redirect
    const currentDate = new Date();
    if (currentDate >= LAUNCH_CONFIG.LAUNCH_DATE) {
      window.location.href = '/';
    }
  }, []);

  // Auto redirect if already launched
  useEffect(() => {
    if (mounted) {
      const currentDate = new Date();
      if (currentDate >= LAUNCH_CONFIG.LAUNCH_DATE) {
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    }
  }, [mounted]);

  // Use launch date from config
  const launchDate = LAUNCH_CONFIG.LAUNCH_DATE;

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
      <CountdownLaunch 
        targetDate={launchDate}
        onComplete={() => {
          // Có thể thêm logic custom khi launch hoàn thành
          console.log("Launch completed!");
        }}
      />
    </div>
  );
} 