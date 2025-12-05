"use client";
import { useState, useEffect, useRef } from "react";
import MainHeader from "./components/MainHeader";
import HeroSection from "./components/HeroSection";
// import LineupSection from "./components/LineupSection";
// import TicketsSection from "./components/TicketsSection";
// import FAQSection from "./components/FAQSection";
// import Footer from "./components/Footer";

export default function HomeClient() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Xử lý audio autoplay với user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume
    audio.volume = 0.5;

    const handleUserInteraction = async () => {
      if (!isPlaying) {
        try {
          await audio.play();
          setIsPlaying(true);
          // Remove listeners after first play
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        } catch (error) {
          console.log('Audio autoplay prevented:', error);
        }
      }
    };

    // Try autoplay first
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Autoplay blocked, wait for user interaction
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
    });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isPlaying]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/sound/Prologue.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Audio Control Button */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <MainHeader lang={lang} setLang={setLang} />
      <main className="flex flex-col ">
        <HeroSection />
        {/* <LineupSection lang={lang} /> */}
        {/* <TicketsSection lang={lang} /> */}
        {/* <FAQSection lang={lang} /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
} 