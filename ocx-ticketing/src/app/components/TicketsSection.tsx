"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// const TICKETS = [...]

export default function TicketsSection({ lang }: { lang: "vi" | "en" }) {
  // ===== STATE MANAGEMENT =====
  // Track if device is mobile (width < 768px)
  const [isMobile, setIsMobile] = useState(false);
  // Track ticket flip state
  const [isFlipped, setIsFlipped] = useState(false);
  // Track last scroll position for mobile flip effect
  const [lastScrollY, setLastScrollY] = useState(0);

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
    if (!isMobile) return;

    const handleScroll = () => {
      const ticketSection = document.getElementById('tickets');
      if (!ticketSection) return;

      // Check if ticket section is in viewport
      const rect = ticketSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        const currentScrollY = window.scrollY;
        // Flip ticket based on scroll direction
        if (currentScrollY > lastScrollY) {
          // Scrolling down -> flip ticket out
          setIsFlipped(true);
        } else {
          // Scrolling up -> flip ticket back
          setIsFlipped(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, lastScrollY]);

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
          <div 
            className="group perspective cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => window.location.href = "/ticket"}
          >
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
        </div>
      </div>
    </section>
  );
} 