"use client";

import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";

interface OCX5PricingSectionProps {
  debugLayout: boolean;
}

export default function OCX5PricingSection({
  debugLayout,
}: OCX5PricingSectionProps) {
  const debugBorderClass = debugLayout ? "border-2 border-red-500" : "";

  return (
    <section
      id="pricing"
      className={`relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-black to-red-900 ${debugBorderClass}`}
      style={{
        background:
          "linear-gradient(to bottom, #000000 0%, #000000 25%, #7f1d1d 50%, #7f1d1d 100%)",
      }}
    >
      {/* Stars overlay specific to this section */}
      <StarsBackground />

      {/* Marker Badge - only visible in debug mode */}
      {debugLayout && (
        <div className="absolute top-4 left-4 z-50 bg-purple-500/80 text-white px-3 py-1 rounded text-xs font-bold">
          SECTION 4: PRICING
        </div>
      )}

      {/* Content Area - Padding bottom reserves space for horizon */}
      {/* pb-[40%] = 40% of container width, sufficient for typical landscape images */}
      <div className="relative z-30 min-h-[80vh] flex items-center justify-center px-4 pb-[40%]">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Ticket Pricing</h2>
          <p className="text-sm mt-4 opacity-60">
            Section 4: Pricing (Coming Soon)
          </p>
        </div>
      </div>

      {/* Horizon Bridge - Visual connection to next section, anchored to bottom */}
      <HorizonBridge
        baseName="imgi_61_horizons_quidditch"
        imageAlt="Magical Quidditch Horizon"
        parallaxSpeed={0.6}
      />
    </section>
  );
}


