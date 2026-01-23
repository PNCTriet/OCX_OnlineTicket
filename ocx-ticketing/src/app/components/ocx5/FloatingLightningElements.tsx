"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
  count?: number;
  /**
   * Control layering (e.g. "z-20", "z-40") and optional opacity.
   * Defaults to "z-20".
   */
  wrapperClassName?: string;
  /**
   * Optional inline style for wrapper (e.g. filter).
   */
  wrapperStyle?: React.CSSProperties;
}

export default function FlashLightningElements({
  containerRef,
  count = 12, // slightly more elements for better spatial coverage
  wrapperClassName = "z-20",
  wrapperStyle,
}: Props) {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    const container = containerRef.current;

    elementsRef.current.forEach((el) => {
      if (!el) return;

      const playFlash = () => {
        if (!container) return;

        const w = container.offsetWidth;
        const h = container.offsetHeight;

        // Random position for every flash
        gsap.set(el, {
          x: Math.random() * w,
          y: Math.random() * h,
          rotate: Math.random() * 25 - 12, // subtle angle, not chaotic
          scale: 0.7 + Math.random() * 0.8,
          opacity: 0,
          filter: "brightness(1)",
        });

        // Realistic lightning pattern:
        // quick strike → small fade → second strike → decay
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.12, // first pop
            ease: "power2.in",
            onComplete: () => {
              gsap.to(el, {
                opacity: 0.35,
                duration: 0.18, // afterglow
                ease: "power1.out",
                onComplete: () => {
                  gsap.to(el, {
                    opacity: 1,
                    duration: 0.1, // second micro-strike
                    ease: "power3.inOut",
                    onComplete: () => {
                      gsap.to(el, {
                        opacity: 0,
                        duration: 0.35, // slow vanish
                        ease: "power1.out",
                      });
                    },
                  });
                },
              });
            },
          }
        );

        // Long, random storm delay (no spammy flashing)
        const nextDelay =
          2.5 + Math.random() * 6.5; // 2.5s → 9s between strikes per element

        gsap.delayedCall(nextDelay, playFlash);
      };

      // Staggered bootstrapping so they don’t sync
      gsap.delayedCall(Math.random() * 3, playFlash);
    });
  }, [containerRef]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${wrapperClassName}`}
      style={wrapperStyle}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            elementsRef.current[i] = el;
          }}
          className="absolute"
          style={{
            willChange: "opacity, transform, filter",
            opacity: 0,
          }}
        >
          <Image
            src="/images/ocx5_images/elements/ocx5_element_lightning_alt1.png"
            alt="lightning"
            width={140}
            height={140}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
