"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CountdownLaunch from "../components/CountdownLaunch";
import { LAUNCH_CONFIG } from "../../config/launch";
import MainHeader from "../components/MainHeader";

export default function LaunchPage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("dark");
    
    // Check if site is already launched
    const currentTime = new Date();
    const launchTime = new Date(LAUNCH_CONFIG.LAUNCH_TIME);
    const isLaunched = currentTime >= launchTime;
    
    if (isLaunched) {
      // Set launch cookie (expires in 1 day)
      Cookies.set('launch', '1', { expires: 1 });
      // Redirect to home page
      router.push('/');
    }
  }, [router]);

  // Use launch date from config
  const launchDate = new Date(LAUNCH_CONFIG.LAUNCH_TIME);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-sans text-white flex flex-col">
      <MainHeader lang={lang} setLang={setLang} />
      <div className="flex-1 flex items-center justify-center p-4">
        <CountdownLaunch 
          targetDate={launchDate}
          onComplete={() => {
            // When countdown completes, set cookie and redirect
            Cookies.set('launch', '1', { expires: 1 });
            router.push('/');
          }}
        />
      </div>
    </div>
  );
} 