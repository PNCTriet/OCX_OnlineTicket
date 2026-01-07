"use client";

import { useEffect, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [paddingTop, setPaddingTop] = useState(140);
  const [paddingBottom, setPaddingBottom] = useState(250);

  // Tính toán padding động để logo cách đều header và footer
  useEffect(() => {
    const calculatePadding = () => {
      if (typeof window === "undefined") return;

      // Lấy chiều cao header (fixed)
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 140;

      // Lấy chiều cao footer (HorizonBridge) - ước tính dựa trên viewport
      // HorizonBridge thường có chiều cao ~20-30% viewport height
      const viewportHeight = window.innerHeight;
      const estimatedFooterHeight = viewportHeight * 0.25; // ~25% viewport

      // Tính toán để logo cách đều header và footer
      // Logo sẽ nằm chính giữa khoảng trống còn lại
      // padding-top = headerHeight + X
      // padding-bottom = footerHeight + X
      // Trong đó X là khoảng cách đều nhau từ logo đến header và footer
      const totalUsedHeight = headerHeight + estimatedFooterHeight;
      const availableSpace = viewportHeight - totalUsedHeight;
      const equalSpacing = availableSpace / 2; // Khoảng cách đều nhau

      // Padding-top: headerHeight + equalSpacing (để logo cách header bằng equalSpacing)
      // Padding-bottom: footerHeight + equalSpacing (để logo cách footer bằng equalSpacing)
      const calculatedTop = headerHeight + equalSpacing;
      const calculatedBottom = estimatedFooterHeight + equalSpacing;

      // Đảm bảo padding tối thiểu
      const minSpacing = 80;
      setPaddingTop(Math.max(calculatedTop, headerHeight + minSpacing));
      setPaddingBottom(Math.max(calculatedBottom, estimatedFooterHeight + minSpacing));
    };

    calculatePadding();
    window.addEventListener("resize", calculatePadding);
    return () => window.removeEventListener("resize", calculatePadding);
  }, []);

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
      {/* 
        Sử dụng padding động để đảm bảo logo cách đều header và footer
        Logo được căn giữa theo chiều dọc trong khoảng trống còn lại
      */}
      <div
        ref={contentRef}
        className="relative z-30 min-h-screen flex items-center justify-center"
        style={{
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
        }}
      >
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


