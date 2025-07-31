"use client";
import { useState, useEffect } from "react";
import CountdownLaunch from "../components/CountdownLaunch";
import { LAUNCH_CONFIG } from "../../config/launch";
import MainHeader from "../components/MainHeader";

export default function LaunchPage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Use launch date from config
  const launchDate = LAUNCH_CONFIG.LAUNCH_DATE;

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