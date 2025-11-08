"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import FlameLottie from "../components/FlameLottie";

export default function HeroSection() {
  // const [timeLeft, setTimeLeft] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });
  const [videoLoaded, setVideoLoaded] = useState(false);

  // NOTE: Cập nhật mục tiêu thời gian cho đúng với sự kiện của bạn
  // 27/09/2025 15:00:00 (GMT+7)
  // const targetDate = useMemo(() => new Date("2025-09-27T15:00:00+07:00"), []);

  // Force video to play on mount
  useEffect(() => {
    const video = document.querySelector('video');
    if (video) {
      video.play().catch(error => {
        console.log('Video autoplay was prevented:', error);
      });
    }
  }, []);

  return (
    <section
      id="about"
      className="w-full h-screen flex flex-col items-center justify-between text-center relative bg-black overflow-hidden py-12 md:py-16"
      style={{
        fontFamily: 'BDStreetSignSans'
      }}
    >
      <div className="absolute inset-0 z-0 bg-black">
        {/* Video loading placeholder */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-70' : 'opacity-0'}`}
        >
          <source src="/videos/fpv-drone.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Black overlay - 50% opacity */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      </div>
      
      {/* Spacer top */}
      <div className="flex-shrink-0"></div>
      
      {/* Main Content - Logo + Button + Spotify */}
      <div className="relative flex flex-col text-center px-4 w-full z-20 flex-1 min-h-0 max-w-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center w-full mb-2">
          <Image 
            src="/images/hero_logo_ss3_alt1.png" 
            alt="Hero Logo" 
            width={3000} 
            height={3000} 
            className="w-[65vw] sm:w-[50vw] md:w-[40vw] lg:w-[35vw] max-w-lg mx-auto transition-transform duration-300 hover:scale-105 relative z-20"
            priority
          />
        </div>
        
        {/* Buy Ticket Button */}
        <div className="relative flex flex-col items-center mb-4">
          <Link
            href="/ticket"
            className="relative z-20 inline-flex items-center px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 text-sm sm:text-base md:text-lg font-bold text-white bg-[#c53e00] rounded-full hover:bg-[#b33800] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            MUA VÉ NGAY
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
        
        {/* Spotify Player - In same container */}
        <div className="relative w-full pt-5 px-8 z-20 flex-shrink-0">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/395aL8Jd34UnMfj6QhuvuD?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </div>
      
      {/* Spacer bottom */}
      <div className="flex-shrink-0"></div>
    </section>
  );
}
