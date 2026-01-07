"use client";

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

      {/* Interactive 3D Hero Logo - logo cách đều header và footer */}
      <div className="relative z-30 min-h-screen pt-[100px] sm:pt-[120px] pb-[100px] sm:pb-[120px]">
        <HeroSectionOCX5 />
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


