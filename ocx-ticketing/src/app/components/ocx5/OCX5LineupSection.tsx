"use client";

import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";

const PORTRAIT_THEMES = [
  // Local lineup images from /public/images
  "/images/lineup_main_ss4_artist1_dehours_alt1.png",
  "/images/lineup_main_ss4_artist2_lybuc_alt1.png",
  "/images/lineup_main_ss4_artist3_minhdinh_alt1.png",
  "/images/lineup_main_ss4_artist4_alt1.png",
  "/images/lineup_main_ss4_artist5_alt1.png",
  "/images/lineup_main_ss4_artist6_alt1.png",
  "/images/lineup_main_ss4_artist7_alt1.png",
  "/images/lineup_main_ss4_artist8_alt1.png",
];

const FRAMES = [
  { 
    id: 1, 
    ratio: "aspect-[3/4]", 
    rotate: "rotate-[-2deg]", 
    shape: "rounded-[2px]", 
    frameColor: "border-[#8a6d3b]", // Gold
    bg: "bg-[#1a1510]"
  },
  { 
    id: 2, 
    ratio: "aspect-square", 
    rotate: "rotate-[3deg]", 
    shape: "rounded-t-full", // Hình vòm (Arch)
    frameColor: "border-[#3d2b1f]", // Dark wood
    bg: "bg-[#0d0d0d]"
  },
  { 
    id: 3, 
    ratio: "aspect-[2/3]", 
    rotate: "rotate-[-1deg]", 
    shape: "rounded-full", // Hình oval
    frameColor: "border-[#5e5e5e]", // Silver/Stone
    bg: "bg-[#1c1c1c]"
  },
  { 
    id: 4, 
    ratio: "aspect-[4/5]", 
    rotate: "rotate-[4deg]", 
    shape: "rounded-[40px] rounded-br-none", // Khung phá cách
    frameColor: "border-[#4a3728]",
    bg: "bg-[#15100d]"
  },
];

export default function OCX5LineupSection({ debugLayout }: { debugLayout: boolean }) {
  // Tạo danh sách 12 tấm hình ngẫu nhiên từ các style trên
  const items = Array.from({ length: 12 }).map((_, i) => ({
    ...FRAMES[i % FRAMES.length],
    id: i,
    image: PORTRAIT_THEMES[i % PORTRAIT_THEMES.length],
  }));

  return (
    <section
      className="relative min-h-screen overflow-hidden py-20 text-white"
      style={{
        // Match EventInfoSection gradient (do not change colors)
        background:
          "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)",
        fontFamily: "WizardWorldSimplified, fantasy, serif",
      }}
    >
      <StarsBackground />

      <div className="relative z-30 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-[#d4bd8b] drop-shadow-2xl">
            LINEUP
          </h2>
        </div>

        {/* Grid Layout: mobile 2 cols, md 3 cols, xl 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={`
                group relative transition-all duration-700 
                ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer
                ${item.rotate} hover:rotate-0 hover:scale-110 hover:z-50
              `}
            >
              {/* Outer Frame */}
              <div className={`
                relative p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] 
                border-[12px] ${item.frameColor} ${item.shape} ${item.bg}
                after:absolute after:inset-0 after:border-[1px] after:border-white/20 after:pointer-events-none
              `}>
                
                {/* Image Container */}
                <div className={`relative w-full ${item.ratio} overflow-hidden ${item.shape}`}>
                  <img
                    src={item.image}
                    alt="Wizard Portrait"
                    // No darkening: keep original colors (no grayscale, no vignette).
                    className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                  />
                  
                </div>

                {/* Lighting effect on frame */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-40">
        <HorizonBridge
          baseName="imgi_59_horizons_hogwarts"
          imageAlt="Magical Castle"
          parallaxSpeed={0.5}
        />
      </div>
    </section>
  );
}