"use client";

import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";

interface OCX5CTASectionProps {
  debugLayout: boolean;
}

export default function OCX5CTASection({
  debugLayout,
}: OCX5CTASectionProps) {
  const debugBorderClass = debugLayout ? "border-2 border-red-500" : "";

  return (
    <section
      id="cta"
      className={`relative min-h-[60vh] overflow-hidden bg-gradient-to-b from-black to-red-900 ${debugBorderClass}`}
      style={{
        background:
          "linear-gradient(to bottom, #000000 0%, #000000 25%, #7f1d1d 50%,rgb(51, 7, 7) 100%)",
      }}
    >
      {/* Stars overlay specific to this section */}
      <StarsBackground />

      {/* Marker Badge - only visible in debug mode */}
      {debugLayout && (
        <div className="absolute top-4 left-4 z-50 bg-pink-500/80 text-white px-3 py-1 rounded text-xs font-bold">
          SECTION 5: CTA
        </div>
      )}

      {/* Content Area - Padding bottom reserves space for horizon */}
      {/* pb-[40%] = 40% of container width, sufficient for typical landscape images */}
      <div className="relative z-30 min-h-[60vh] flex items-center justify-center px-4 pb-[40%]">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Get Your Tickets</h2>
          <p className="text-sm mt-4 opacity-60">
            Section 5: CTA (Coming Soon)
          </p>
        </div>
      </div>

      {/* Horizon Bridge - Final transition, anchored to bottom */}
      <HorizonBridge
        baseName="imgi_62_horizons_bridge"
        imageAlt="Magical Bridge Horizon"
        parallaxSpeed={0.4}
      />
    </section>
  );
}


