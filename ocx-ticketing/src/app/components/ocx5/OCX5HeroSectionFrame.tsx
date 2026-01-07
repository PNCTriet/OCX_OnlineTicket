"use client";

import Image from "next/image";
import HeroSectionOCX5 from "@/app/components/ocx5/HeroSectionOCX5";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";
import OCX5HeaderNav from "@/app/components/ocx5/OCX5HeaderNav";

interface OCX5HeroSectionFrameProps {
  debugLayout: boolean;
}

export default function OCX5HeroSectionFrame({
  debugLayout,
}: OCX5HeroSectionFrameProps) {
  const debugBorderClass = debugLayout ? "border-2 border-red-500" : "";

  return (
    <section
      id="hero-section"
      className={`relative min-h-screen overflow-hidden bg-gradient-to-b from-black to-red-900 ${debugBorderClass}`}
      style={{
        // Hero background image
        backgroundImage:
          "url('/images/ocx5_images/backround/ocx5_backround_hero_alt2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header thuộc hero (fixed, ẩn khi scroll xuống, hiện khi scroll lên) */}
      <OCX5HeaderNav />

      {/* Stars overlay specific to hero */}
      <StarsBackground />

      {/* Marker Badge - only visible in debug mode */}
      {debugLayout && (
        <div className="absolute top-4 left-4 z-50 bg-red-500/80 text-white px-3 py-1 rounded text-xs font-bold">
          SECTION 1: HERO
        </div>
      )}

      {/* Background / hero content shell */}
      <HeroSectionOCX5 />

      {/* Content Area - padding-top tính từ header để logo không bị che */}
      <div className="relative z-30 flex items-center justify-center px-4 pt-[100px] sm:pt-[120px] pb-8 min-h-[60vh]">
        {/* Logo hero lớn - giữ tỷ lệ theo chiều dọc, responsive mobile */}
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src="/images/ocx5_images/elements/ocx_logo_ss5_horizon_alt1.png"
            alt="OCX Hero Logo"
            width={4500}
            height={4500}
            className="w-[85vw] h-auto sm:w-[65vw] md:w-[50vw] lg:w-[40vw] max-w-3xl mx-auto transition-transform duration-300 hover:scale-105"
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            priority
          />
        </div>
      </div>

      {/* Horizon Bridge - Visual connection to next section, anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <HorizonBridge
          baseName="imgi_52_horizons_village"
          imageAlt="Magical Village Horizon"
          parallaxSpeed={0.6}
        />
      </div>
    </section>
  );
}


