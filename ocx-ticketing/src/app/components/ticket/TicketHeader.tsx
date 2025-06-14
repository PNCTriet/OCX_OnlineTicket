"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";

type TicketHeaderProps = {
  lang: "vi" | "en";
  setLang: Dispatch<SetStateAction<"vi" | "en">>;
};

export default function TicketHeader({ lang, setLang }: TicketHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 bg-[#c53e00] px-4 sm:px-12 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`} 
      style={{ fontFamily: 'BDStreetSignSans' }}
    >
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <Image
            src="/images/client_logo_ss4.svg"
            alt="Logo"
            width={100}
            height={100}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="px-3 py-1 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {lang === "vi" ? "EN" : "VN"}
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {lang === "vi" ? "Trang chủ" : "Home"}
          </Link>
        </div>
      </div>
    </header>
  );
} 