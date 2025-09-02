"use client";
import Image from "next/image";
import Link from "next/link";
// import FlameLottie from "../components/FlameLottie";

export default function HeroSection() {
  return (
    <section
      id="about"
      className="aspect-[16/9] w-full mt-[45px] sm:mt-[64px] md:mt-[80px] flex flex-col items-center justify-center text-center relative pb-0"
      style={{
        backgroundImage: 'url(/images/hero_backround_ss4_alt1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'BDStreetSignSans'
      }}
    >
      <div className="absolute inset-0 z-0">
        {/* Desktop background */}
        <div
          className="hidden sm:block w-full h-full"
          style={{
            backgroundImage: "url(/images/hero_backround_ss4_alt1.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
        {/* Mobile background */}
        <div
          className="block sm:hidden w-full h-full"
          style={{
            backgroundImage: "url(/images/hero_background_ss4_mobile.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
      </div>
      <div className="relative flex flex-col items-center justify-center text-center px-4 w-full">
        {/* Logo + Flame animation */}
        <div className="flex flex-col items-center w-full" style={{paddingTop: '4vh'}}>
          {/* Flame animation absolutely around logo */}
          {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" style={{width: '56vw', height: '56vw', maxWidth: 340, maxHeight: 340}}>
            <FlameLottie />
          </div> */}
          <Image 
            src="/images/hero_logo_ss3_alt1.svg" 
            alt="Hero Logo" 
            width={4000} 
            height={4000} 
            className="w-[50vw] mx-auto transition-transform duration-300 hover:scale-105 relative z-10"
            priority
          />
        </div>
        {/* Event Info */}
        <div className="mt-2 flex flex-col items-center gap-6 max-w-xl mx-auto justify-center">
          {/* Date/Time Row */}
          <div className="flex items-center w-full">
            {/* Calendar Icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" className="stroke-current" />
                <path d="M16 2v4M8 2v4M3 10h18" className="stroke-current" />
              </svg>
            </div>
            <div className="flex flex-col justify-center ml-3 text-left">
              <span className="text-xl sm:text-2xl font-bold leading-tight">27/09/2025</span>
              <span className="text-base sm:text-lg font-normal text-white/90 leading-tight">THỨ BẢY, 27/9/2025 | 15H - 22H</span>
            </div>
          </div>
          {/* Location Row */}
          <div className="flex items-center w-full">
            {/* Location Icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 21c-4.418 0-8-5.373-8-10a8 8 0 1 1 16 0c0 4.627-3.582 10-8 10z" className="stroke-current" />
                <circle cx="12" cy="11" r="3" className="stroke-current" />
              </svg>
            </div>
            <div className="flex flex-col justify-center ml-3 text-left">
              <span className="text-xl sm:text-2xl font-bold leading-tight"> CAPITAL THEATRE</span>
              <span className="text-base sm:text-lg font-normal text-white/90 leading-tight">212 Lý Chính Thắng, Phường 9, Quận 3, Hồ Chí Minh</span>
            </div>
          </div>
        </div>
        {/* Buy Ticket Button + Flame animation as background */}
        <div className="relative mt-8 mb-8 flex flex-col items-center">
          <div className="relative inline-block">
            {/* Flame background: 4 flames, absolutely positioned and overlapping */}
            {/* <div className="absolute inset-0 pointer-events-none z-11" style={{ width: "100%", height: "100%" }}>
              <FlameLottie
                style={{
                  position: "absolute",
                  left: "10%",
                  bottom: "-10%",
                  width: 50,
                  height: 70,
                  zIndex: 1,
                  transform: "rotate(-8deg) scale(1.05)",
                }}
              />
              <FlameLottie
                style={{
                  position: "absolute",
                  left: "32%",
                  bottom: "-12%",
                  width: 60,
                  height: 80,
                  zIndex: 2,
                  transform: "scale(1.15)",
                }}
              />
              <FlameLottie
                style={{
                  position: "absolute",
                  left: "54%",
                  bottom: "-10%",
                  width: 50,
                  height: 70,
                  zIndex: 1,
                  transform: "rotate(8deg) scale(1.05)",
                }}
              />
              <FlameLottie
                style={{
                  position: "absolute",
                  left: "75%",
                  bottom: "-8%",
                  width: 40,
                  height: 60,
                  zIndex: 0,
                  transform: "rotate(12deg) scale(0.95)",
                }}
              />
            </div> */}
            {/* Button on top */}
            <Link
              href="#tickets"
              className="relative z-10 inline-flex items-center px-8 py-3 text-lg font-bold text-white bg-[#c53e00] rounded-full hover:bg-[#b33800] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              MUA VÉ NGAY
              <svg
                className="w-5 h-5 ml-2"
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
        </div>
      </div>
    </section>
  );
}

