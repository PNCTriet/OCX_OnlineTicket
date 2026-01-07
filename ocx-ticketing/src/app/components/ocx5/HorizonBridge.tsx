"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizonBridgeProps {
  baseName: string; // e.g., "imgi_52_horizons_village"
  imageAlt: string;
  parallaxSpeed?: number;
}

/**
 * HorizonBridge - A visual bridge between sections
 * 
 * ARCHITECTURE:
 * - Positioned absolutely at bottom of parent section
 * - Scales naturally by width (no fixed height)
 * - Height determined by image aspect ratio
 * - Anchors to bottom edge (bottom: 0)
 * - Does not intercept pointer events
 * - Z-index below content (z-20)
 */
export default function HorizonBridge({
  baseName,
  imageAlt,
  parallaxSpeed = 0.5,
}: HorizonBridgeProps) {
  const [isMobile, setIsMobile] = useState(false);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Responsive image selection: desktop vs mobile horizons
  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();

    // Debounced resize handler to avoid excessive re-renders
    let resizeTimeout: number | undefined;
    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(updateIsMobile, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
    };
  }, []);

  // Build image path based on device type
  const imageSrc = (() => {
    if (isMobile) {
      // Insert `_mobile` after "horizons_"
      // baseName example: "imgi_52_horizons_village"
      const mobileName = baseName.replace(
        "horizons_",
        "horizons_mobile_"
      );
      return `/images/ocx5_images/mobile/${mobileName}.png`;
    }
    return `/images/ocx5_images/desktop/${baseName}.png`;
  })();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle parallax effect (optional, can be removed if not needed)
      if (bridgeRef.current && imageRef.current) {
        ScrollTrigger.create({
          trigger: bridgeRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            // Dùng set thay vì to + duration để tránh giật lag khi scroll
            gsap.set(imageRef.current, {
              y: progress * 30 * parallaxSpeed,
            });
          },
        });
      }
    }, bridgeRef);

    return () => {
      ctx.revert();
    };
  }, [parallaxSpeed]);

  return (
    <div
      ref={bridgeRef}
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-20"
      aria-hidden="true"
    >
      {/* 
        Image container: Natural height based on aspect ratio
        - No fixed height (vh units removed)
        - Width: 100% (scales with section width)
        - Height: auto (maintains aspect ratio)
        - Anchored to bottom via parent absolute positioning
        - Image naturally scales by width, height follows
      */}
      <div ref={imageRef} className="relative w-full flex justify-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1920}
          height={1080}
          // Mobile: full width, giữ đúng tỉ lệ
          // Desktop: tăng chiều ngang ~130% và scale 2x để horizon trông lớn hơn nhiều (có thể bị cắt bớt hai bên)
          className="block h-auto w-full md:w-[110%] max-w-none transform origin-bottom md:scale-150"
          quality={90}
          priority={false}
          sizes="100vw"
        />
      </div>

      {/* 
        Gradient overlay: Smooth transition to next section
        - Starts transparent at top
        - Fades to black at bottom
        - Creates visual bridge effect
      */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0.8) 95%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
}

