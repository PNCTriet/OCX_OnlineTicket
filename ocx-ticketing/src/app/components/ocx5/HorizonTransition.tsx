"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizonTransitionProps {
  baseName: string; // e.g., "imgi_52_horizons_village"
  imageAlt: string;
  height?: "short" | "medium" | "tall";
  parallaxSpeed?: number;
}

export default function HorizonTransition({
  baseName,
  imageAlt,
  height = "medium",
  parallaxSpeed = 0.5,
}: HorizonTransitionProps) {
  // Always use desktop folder
  const imageSrc = `/images/ocx5_images/desktop/${baseName}.png`;
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for the horizon image (no scale, only vertical movement)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (imageRef.current) {
            const progress = self.progress;
            gsap.to(imageRef.current, {
              y: progress * 100 * parallaxSpeed,
              duration: 0.3,
            });
          }
        },
      });

      // Fade in/out overlay
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
        onUpdate: (self) => {
          if (overlayRef.current) {
            const progress = self.progress;
            gsap.to(overlayRef.current, {
              opacity: Math.abs(0.5 - progress) * 2,
              duration: 0.3,
            });
          }
        },
      });
    }, sectionRef);

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
    <section
      ref={sectionRef}
      className={`relative w-full ${heightClasses[height]} overflow-hidden`}
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
              objectPosition: "top center",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Gradient Overlay - Black transition starts from bottom of image */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,1) 100%)",
        }}
      />
      
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent z-20 pointer-events-none" />
    </section>
  );
}

