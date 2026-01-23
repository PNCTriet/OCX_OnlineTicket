"use client";

import { useEffect, useRef, useState } from "react";
import HeroSectionOCX5 from "@/app/components/ocx5/HeroSectionOCX5";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";
import OCX5HeaderNav from "@/app/components/ocx5/OCX5HeaderNav";
import FloatingLightningElements from "@/app/components/ocx5/FloatingLightningElements";

interface OCX5HeroSectionFrameProps {
  debugLayout: boolean;
  /**
   * Bật/tắt tương tác với logo (mouse/touch tracking)
   * @default true
   */
  enableLogoInteraction?: boolean;
}

export default function OCX5HeroSectionFrame({
  debugLayout,
  enableLogoInteraction = true,
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

      // Tính toán để logo cách đều header và footer với khoảng cách nhỏ hơn
      // Logo sẽ nằm chính giữa khoảng trống còn lại
      const totalUsedHeight = headerHeight + estimatedFooterHeight;
      const availableSpace = viewportHeight - totalUsedHeight;
      
      // Giảm khoảng cách: chỉ dùng một phần nhỏ của availableSpace
      // Thay vì chia đôi, chỉ dùng 30-40% để có khoảng cách vừa phải
      const spacingRatio = 0.35; // 35% của availableSpace
      const equalSpacing = availableSpace * spacingRatio;

      // Padding-top: headerHeight + equalSpacing (để logo cách header bằng equalSpacing)
      // Padding-bottom: footerHeight + equalSpacing (để logo cách footer bằng equalSpacing)
      const calculatedTop = headerHeight + equalSpacing;
      const calculatedBottom = estimatedFooterHeight + equalSpacing;

      // Đảm bảo padding tối thiểu nhưng nhỏ hơn
      const minSpacing = 40; // Giảm từ 80 xuống 40
      const maxSpacing = 80; // Giới hạn tối đa để không quá lớn
      
      setPaddingTop(Math.min(Math.max(calculatedTop, headerHeight + minSpacing), headerHeight + maxSpacing));
      setPaddingBottom(Math.min(Math.max(calculatedBottom, estimatedFooterHeight + minSpacing), estimatedFooterHeight + maxSpacing));
    };

    calculatePadding();
    window.addEventListener("resize", calculatePadding);
    return () => window.removeEventListener("resize", calculatePadding);
  }, []);

  return (
    <section
      id="hero-section"
      className={`relative overflow-hidden bg-gradient-to-b from-black to-red-900 ${debugBorderClass}`}
      style={{
        // Hero background image
        backgroundImage:
          "url('/images/ocx5_images/backround/ocx5_backround_hero_alt2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Đảm bảo section nằm trong viewport
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* Header thuộc hero (fixed, ẩn khi scroll xuống, hiện khi scroll lên) */}
      <OCX5HeaderNav />

      {/* Stars overlay specific to hero */}
      <StarsBackground />

      {/* Floating Lightning Elements - rơi tự do và phản ứng với chuột */}
      <FloatingLightningElements
        count={6}
        containerRef={contentRef}
      />

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
        className="relative z-50 flex items-center justify-center"
        style={{
          height: "100%",
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
          boxSizing: "border-box",
        }}
      >
        <HeroSectionOCX5 enableInteraction={enableLogoInteraction} />
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


