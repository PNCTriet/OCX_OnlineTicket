 "use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OCX5HeroSectionFrame from "@/app/components/ocx5/OCX5HeroSectionFrame";
import OCX5EventInfoSection from "@/app/components/ocx5/OCX5EventInfoSection";
import OCX5LineupSection from "@/app/components/ocx5/OCX5LineupSection";
import OCX5CTASection from "@/app/components/ocx5/OCX5CTASection";

// Global debug flag: turn on to show section markers & red frames
const DEBUG_LAYOUT = false;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function OCX5Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      // ScrollTrigger setup will be added as we build sections
      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert(); // Cleanup
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-black text-white overflow-x-hidden"
    >
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="relative w-full z-10"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* SECTION 1: HERO */}
        <OCX5HeroSectionFrame debugLayout={DEBUG_LAYOUT} />

        {/* SECTION 2: EVENT INFO */}
        <OCX5EventInfoSection debugLayout={DEBUG_LAYOUT} />

        {/* SECTION 3: LINE-UP */}
        <OCX5LineupSection debugLayout={DEBUG_LAYOUT} />

        {/* SECTION 4: PRICING (temporarily disabled) */}

        {/* SECTION 5: CTA */}
        <OCX5CTASection debugLayout={DEBUG_LAYOUT} />
      </div>
    </div>
  );
}

