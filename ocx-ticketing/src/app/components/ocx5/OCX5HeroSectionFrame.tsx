"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const debugBorderClass = debugLayout ? "border-2 border-red-500" : "";
  const contentRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const [paddingTop, setPaddingTop] = useState(140);
  const [paddingBottom, setPaddingBottom] = useState(250);

  // Tính toán padding động để logo cách đều header và footer
  useEffect(() => {
    const calculatePadding = () => {
      if (typeof window === "undefined") return;

      // Lấy vị trí mép dưới header THỰC TẾ (bao gồm transform khi ẩn/hiện)
      // Khi header ẩn (translateY -100%), rect.bottom thường <= 0
      const header = document.querySelector("header");
      const headerBottom = header
        ? Math.max(0, (header as HTMLElement).getBoundingClientRect().bottom)
        : 0;

      const viewportHeight = window.innerHeight;
      const horizonHeight =
        horizonRef.current?.getBoundingClientRect().height ?? viewportHeight * 0.25;

      // Tính toán để logo cách đều header và footer với khoảng cách nhỏ hơn
      // Logo sẽ nằm chính giữa khoảng trống còn lại
      const totalUsedHeight = headerBottom + horizonHeight;
      const availableSpace = viewportHeight - totalUsedHeight;
      
      // Giảm khoảng cách: chỉ dùng một phần nhỏ của availableSpace
      // Thay vì chia đôi, chỉ dùng 30-40% để có khoảng cách vừa phải
      const spacingRatio = 0.35; // 35% của availableSpace
      const equalSpacing = availableSpace * spacingRatio;

      // Padding-top: headerBottom + equalSpacing (để logo cách mép dưới header bằng equalSpacing)
      // Padding-bottom: footerHeight + equalSpacing (để logo cách footer bằng equalSpacing)
      const calculatedTop = headerBottom + equalSpacing;
      const calculatedBottom = horizonHeight + equalSpacing;

      // Đảm bảo padding tối thiểu nhưng nhỏ hơn
      const minSpacing = 40; // Giảm từ 80 xuống 40
      const maxSpacing = 80; // Giới hạn tối đa để không quá lớn
      
      setPaddingTop(
        Math.min(
          Math.max(calculatedTop, headerBottom + minSpacing),
          headerBottom + maxSpacing
        )
      );
      setPaddingBottom(
        Math.min(
          Math.max(calculatedBottom, horizonHeight + minSpacing),
          horizonHeight + maxSpacing
        )
      );
    };

    calculatePadding();

    // Recalc khi resize và khi scroll (vì header ẩn/hiện theo scroll)
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calculatePadding);
    };
    window.addEventListener("resize", calculatePadding);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", calculatePadding);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="hero-section"
      className={`ocx5HeroFrame relative overflow-hidden bg-gradient-to-b from-black to-red-900 ${debugBorderClass}`}
      style={{
        // Hero background image
        backgroundImage:
          "url('/images/ocx5_images/backround/ocx5_backround_hero_alt2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Fallback; mobile-safe units are applied via scoped CSS below.
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
        className="relative z-50 flex flex-col items-center justify-center gap-6 sm:gap-8"
        style={{
          height: "100%",
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
          boxSizing: "border-box",
        }}
      >
        <HeroSectionOCX5 enableInteraction={enableLogoInteraction} />
        <button
          type="button"
          onClick={() => router.push("/ticket")}
          className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-[#d43922] rounded-full font-bold overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[0_0_15px_rgba(212,57,34,0.35)] hover:shadow-[0_0_28px_rgba(212,57,34,0.55)]"
          style={{ fontFamily: "WizardWorldSimplified, fantasy, serif" }}
        >
          <span className="relative z-10 uppercase tracking-[0.2em] text-sm sm:text-base">
            Get Tickets Now
          </span>
          <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-white/20 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[120%]" />
        </button>
      </div>

      {/* Horizon Bridge - Visual connection to next section, anchored to bottom */}
      <div ref={horizonRef} className="absolute bottom-0 left-0 right-0">
        <HorizonBridge
          baseName="imgi_52_horizons_village"
          imageAlt="Magical Village Horizon"
          parallaxSpeed={0.6}
        />
      </div>

      {/* Mobile viewport fix: avoid iOS/Chrome address-bar 100vh overflow causing tiny scroll */}
      <style jsx>{`
        .ocx5HeroFrame {
          height: 100vh;
          max-height: 100vh;
        }
        @supports (height: 100svh) {
          .ocx5HeroFrame {
            height: 100svh;
            max-height: 100svh;
          }
        }
        @supports (height: 100dvh) {
          .ocx5HeroFrame {
            height: 100dvh;
            max-height: 100dvh;
          }
        }
      `}</style>
    </section>
  );
}


