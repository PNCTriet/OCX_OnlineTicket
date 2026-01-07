"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizonOverlayProps {
  baseName: string; // e.g., "imgi_52_horizons_village"
  imageAlt: string;
  height?: "short" | "medium" | "tall";
  parallaxSpeed?: number;
}

export default function HorizonOverlay({
  baseName,
  imageAlt,
  height = "medium",
  parallaxSpeed = 0.5,
}: HorizonOverlayProps) {
  // Always use desktop folder
  const imageSrc = `/images/ocx5_images/desktop/${baseName}.png`;
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for the horizon image (no scale, only vertical movement)
      if (overlayRef.current) {
        ScrollTrigger.create({
          trigger: overlayRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            if (imageRef.current) {
              const progress = self.progress;
              gsap.to(imageRef.current, {
                y: progress * 50 * parallaxSpeed,
                duration: 0.3,
              });
            }
          },
        });
      }
    }, overlayRef);

    return () => {
      ctx.revert();
    };
  }, [parallaxSpeed]);

  const heightClasses = {
    short: "h-[40vh]",
    medium: "h-[60vh]",
    tall: "h-[80vh]",
  };

  return (
    <div
      ref={overlayRef}
      className={`absolute left-0 right-0 w-full ${heightClasses[height]} pointer-events-none z-20`}
      style={{
        bottom: "0", // Sát mép dưới hoàn toàn
      }}
      aria-hidden="true"
    >
      {/* Horizon Image with Parallax - Full width, maintain aspect ratio */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div 
          className="relative w-full"
          style={{
            height: "100%",
            minHeight: "100%",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1920}
            height={1080}
            className="w-full h-auto"
            quality={90}
            priority={false}
            sizes="100vw"
            style={{
              objectFit: "contain",
              objectPosition: "bottom center",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Gradient Overlay - Black transition starts from bottom of image */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,1) 100%)",
        }}
      />
      
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-transparent z-20 pointer-events-none" />
    </div>
  );
}

