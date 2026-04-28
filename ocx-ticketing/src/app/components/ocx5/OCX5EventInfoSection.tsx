"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";

interface OCX5EventInfoSectionProps {
  debugLayout: boolean;
}

export default function OCX5EventInfoSection({
  debugLayout,
}: OCX5EventInfoSectionProps) {
  const router = useRouter();

  return (
    <section
      id="event-info"
      // Reduce vertical height ~40% (from full screen to ~60vh). Gradient unchanged.
      // Mobile: give ~20% more vertical room so text blocks aren't cramped.
      className="relative min-h-[84vh] md:min-h-[70vh] overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)",
        fontFamily: "WizardWorldSimplified, fantasy, serif",
      }}
    >
      <StarsBackground />

      <div className="relative z-30 container mx-auto min-h-[72vh] md:min-h-[60vh] flex flex-col 2xl:flex-row items-center 2xl:items-start justify-between px-6 pt-12 sm:pt-12 pb-20 sm:pb-[120px]">
        {/* LEFT SIDE FLAGS - hidden/commented as requested
        <div className="relative w-full 2xl:w-3/5 flex flex-nowrap justify-center items-start gap-1 sm:gap-6 h-[260px] sm:h-[320px] md:h-[380px] overflow-visible">
          ...
        </div>
        */}

        {/* RIGHT SIDE CTA */}
        <div className="w-full 2xl:w-2/5 text-center 2xl:text-left space-y-10 sm:space-y-8 mt-10 sm:mt-12 2xl:mt-0 2xl:self-start">
          <h2 className="mt-3 sm:mt-0 text-2xl sm:text-4xl md:text-6xl font-bold uppercase leading-tight">
            What's your <br /> OCX House?
          </h2>

          <button
            type="button"
            onClick={() => router.push("/ticket")}
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-[#d43922] rounded-full font-bold overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[0_0_15px_rgba(212,57,34,0.35)] hover:shadow-[0_0_28px_rgba(212,57,34,0.55)]"
          >
            <span className="relative z-10 uppercase tracking-[0.2em]">
              Get Tickets Now
            </span>
            {/* Shine sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-white/20 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[120%]" />
          </button>
        </div>
      </div>

      {/* Horizon should sit BEHIND content (otherwise it looks like the flags are "cut" on mobile). */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <HorizonBridge
          baseName="imgi_56_horizons_train"
          imageAlt="Magical Train Horizon"
          parallaxSpeed={0.5}
        />
      </div>
    </section>
  );
}
