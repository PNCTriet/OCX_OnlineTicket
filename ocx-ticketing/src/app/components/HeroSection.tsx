"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import FlameLottie from "../components/FlameLottie";

export default function HeroSection() {
  // const [timeLeft, setTimeLeft] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });
  const router = useRouter();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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
      className="w-full h-screen flex items-center justify-center text-center relative bg-black overflow-hidden"
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
      
      {/* Main Content - Logo + Button - Horizontally centered, vertically offset */}
      <div className="relative flex flex-col items-center justify-center px-4 w-full z-20 max-w-4xl mx-auto -mt-30">
        {/* Logo - 50% larger */}
        <div className="flex flex-col items-center w-full mb-4 sm:mb-6">
          <Image 
            src="/images/hero_logo_ss3_alt1.svg" 
            alt="Hero Logo" 
            width={4500} 
            height={4500} 
            className="w-[90vw] sm:w-[70vw] md:w-[55vw] lg:w-[45vw] max-w-3xl mx-auto transition-transform duration-300 hover:scale-105 relative z-20"
            priority
          />
        </div>
        
        {/* Buy Ticket Button with animated text */}
        <div className="relative flex flex-col items-center">
            <button
            onClick={() => router.push('/ticket')}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="relative z-20 inline-flex items-center px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-bold text-white bg-[#c53e00] rounded-full hover:bg-[#b33800] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden cursor-pointer"
          >
            <span className="relative inline-block whitespace-nowrap">
              VUÝP
              {isButtonHovered && (
                <>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.05s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.1s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.15s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.2s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.25s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.3s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.35s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.4s_both]">P</span>
                  <span className="inline-block animate-[slideIn_0.1s_ease-out_0.45s_both]">!</span>
                </>
              )}
            </span>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3"
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
            </button>
          </div>
        </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
