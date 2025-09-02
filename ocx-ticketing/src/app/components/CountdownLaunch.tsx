"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LAUNCH_CONFIG } from "../../config/launch";

type CountdownLaunchProps = {
  targetDate: Date;
  onComplete?: () => void;
};

export default function CountdownLaunch({ targetDate, onComplete }: CountdownLaunchProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLaunched, setIsLaunched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      

      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Launch time reached!
        setIsLaunched(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Then set up interval
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Check if already launched on mount
  useEffect(() => {
    const now = new Date();
    if (now >= targetDate) {
      setIsLaunched(true);
    }
  }, [targetDate]);

  // Force check launch status after a short delay
  useEffect(() => {
    const checkLaunchStatus = () => {
      const now = new Date();
      if (now >= targetDate && !isLaunched) {
        setIsLaunched(true);
      }
    };

    // Check immediately
    checkLaunchStatus();
    
    // Check again after 1 second
    const timer = setTimeout(checkLaunchStatus, 1000);
    
    return () => clearTimeout(timer);
  }, [targetDate, isLaunched]);

  // Separate useEffect for handling launch completion
  useEffect(() => {
    if (isLaunched) {
      if (onComplete) {
        onComplete();
      } else {
        // Default redirect to home page after 3 seconds
        const redirectTimer = setTimeout(() => {
          router.push('/');
        }, 3000);
        
        // Fallback redirect after 5 seconds in case the first one fails
        const fallbackTimer = setTimeout(() => {
          window.location.href = '/';
        }, 5000);
        
        return () => {
          clearTimeout(redirectTimer);
          clearTimeout(fallbackTimer);
        };
      }
    }
  }, [isLaunched, onComplete, router]);

  if (isLaunched) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
        onClick={() => {
          router.push('/');
        }}
      >
        <div className="absolute inset-0 z-0">
          {/* Desktop background */}
          <div
            className="hidden sm:block w-full h-full"
            style={{
              backgroundImage: "url(/images/hero_backround_ss4_alt1.svg)",
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
        
        <div className="relative z-10 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>

          
          {/* Logo */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image
                  src="/images/client_logo_ss4.svg"
                  alt="Logo"
                  width={500}
                  height={500}
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-80 lg:h-80 rounded-full object-cover transition-transform duration-300 animate-pulse"
                />
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 animate-bounce">
              Quẩy lên anh em ơi !
            </h1>
            <p className="text-xl text-zinc-300 mb-6">
              {LAUNCH_CONFIG.BRAND.name} đã chính thức ra mắt!
            </p>
            <p className="text-sm text-zinc-400">
              Click để vào logo để chuyển hướng
            </p>
          </div>
          
          {/* Loading animation */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[#c53e00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-[#c53e00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-[#c53e00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="absolute inset-0 z-0">
        {/* Desktop background */}
        <div
          className="hidden sm:block w-full h-full"
          style={{
            backgroundImage: "url(/images/hero_backround_ss4_alt1.svg)",
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
      
      <div className="relative z-10 text-center px-4 py-4 max-w-4xl w-full h-full flex flex-col justify-center" style={{ fontFamily: 'BDStreetSignSans' }}>
        {/* Logo */}
        <div className="mb-2 sm:mb-3 lg:mb-4">
          <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
            <Link href="/">
              <Image
                src="/images/client_logo_ss4.svg"
                alt="Logo"
                width={300}
                height={300}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </Link>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 lg:mb-3">
            SẮP RA MẮT
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-300">
            {LAUNCH_CONFIG.BRAND.description}
          </p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 sm:p-2 lg:p-4 border border-white/10">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-zinc-400">NGÀY</div>
          </div>
          
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 sm:p-2 lg:p-4 border border-white/10">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-zinc-400">GIỜ</div>
          </div>
          
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 sm:p-2 lg:p-4 border border-white/10">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-zinc-400">PHÚT</div>
          </div>
          
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 sm:p-2 lg:p-4 border border-white/10">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-zinc-400">GIÂY</div>
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-white/10 max-w-2xl mx-auto">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 lg:mb-3">
            {LAUNCH_CONFIG.EVENT_INFO.name}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 mb-2 sm:mb-3 lg:mb-4">
            {LAUNCH_CONFIG.EVENT_INFO.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 lg:gap-3 text-xs">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#c53e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-zinc-300">{LAUNCH_CONFIG.EVENT_INFO.date}</span>
            </div>
            
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#c53e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="text-zinc-300">{LAUNCH_CONFIG.EVENT_INFO.location}</span>
            </div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="mt-2 sm:mt-3 lg:mt-4 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-[#c53e00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-[#c53e00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-[#c53e00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 