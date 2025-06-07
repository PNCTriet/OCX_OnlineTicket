"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import Tooltip from "./Tooltip";

// const TICKETS = [...]

export default function TicketsSection({ lang }: { lang: "vi" | "en" }) {
  // ===== STATE MANAGEMENT =====
  // Track if device is mobile (width < 768px)
  const [isMobile, setIsMobile] = useState(false);
  // Track ticket flip state
  const [isFlipped, setIsFlipped] = useState(false);
  // Track last scroll position for mobile flip effect
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sectionTimer, setSectionTimer] = useState<NodeJS.Timeout | null>(null);

  // ===== MOBILE DETECTION =====
  // Check and update mobile state on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ===== MOBILE SCROLL FLIP EFFECT =====
  // Handle ticket flip based on scroll direction when in mobile view
  useEffect(() => {
    const handleScroll = () => {
      const ticketSection = document.getElementById('tickets');
      if (!ticketSection) return;

      const rect = ticketSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      // Handle mobile flip effect
      if (isMobile && isInView) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
          setIsFlipped(true);
        } else {
          setIsFlipped(false);
        }
        setLastScrollY(currentScrollY);
      }

      // Handle tooltip visibility
      if (isInView) {
        // Clear existing timer if any
        if (sectionTimer) {
          clearTimeout(sectionTimer);
        }
        // Start new timer
        const timer = setTimeout(() => {
          setShowTooltip(true);
        }, 3000);
        setSectionTimer(timer);
      } else {
        // Clear timer and hide tooltip when leaving section
        if (sectionTimer) {
          clearTimeout(sectionTimer);
        }
        setShowTooltip(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionTimer) {
        clearTimeout(sectionTimer);
      }
    };
  }, [isMobile, lastScrollY, sectionTimer]);

  return (
    // ===== TICKET SECTION LAYOUT =====
    <section 
      id="tickets" 
      className="py-5 sm:py-16 relative" // Reduced padding on mobile
      style={{
        backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-8 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>
          {lang === "vi" ? "LOẠI VÉ" : "Ticket Types"}
        </h2>

        {/* Ticket Card Container */}
        <div className="grid grid-cols-1 gap-2 sm:gap-8"> {/* Reduced gap on mobile */}
          <Link href="/ticket" className="block">
            <div className="group perspective cursor-pointer hover:scale-105 transition-transform duration-300">
              {/* Ticket Flip Container */}
              <div 
                className={`relative w-full h-[300px] sm:h-[400px] transition-transform duration-500 transform-style-3d ${
                  isMobile ? (isFlipped ? 'rotate-y-180' : '') : 'group-hover:rotate-y-180'
                }`}
              >
                {/* Front of Ticket */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/ticket_front_alt1.png"
                      alt="Ticket Front"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                
                {/* Back of Ticket */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/ticket_back_alt1.png"
                      alt="Ticket Back"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Buy Ticket Button */}
          <div className="flex justify-center mt-2 sm:mt-2">
            <div className="relative">
              <Link 
                href="/ticket" 
                className="inline-flex items-center px-8 py-3 text-lg font-bold text-white bg-[#c53e00] rounded-full hover:bg-[#b33800] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ fontFamily: 'BDStreetSignSans' }}
              >
                {lang === "vi" ? "MUA VÉ NGAY" : "BUY TICKETS NOW"}
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

              <Tooltip showTooltip={showTooltip} lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 