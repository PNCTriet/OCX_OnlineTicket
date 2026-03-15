"use client";

import { useEffect, useMemo, useRef } from "react";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";
import gsap from "gsap";
import FloatingLightningElements from "@/app/components/ocx5/FloatingLightningElements";
import Link from "next/link";

export default function OCX5LineupSection({ debugLayout }: { debugLayout: boolean }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(
    () => [
      {
        id: 0,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_bmktcr_alt1.png",
      },
      {
        id: 1,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_lybuc_alt1.png",
      },
      {
        id: 2,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_thebre_alt1.png",
      },
      {
        id: 3,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_themeo_alt1.png",
      },
      {
        id: 4,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_maydays_alt1.png",
      },
      {
        id: 5,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_truanfu_alt1.png",
      },
      {
        id: 6,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_thang_alt1.png",
      },
      {
        id: 7,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_tflop_alt1.png",
      },
      {
        id: 8,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_tung_alt1.png",
      },
      {
        id: 9,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_middle_alt1.png",
      },
      {
        id: 10,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_thotrauma_alt1.png",
      },
      {
        id: 11,
        image: "/images/ocx5_images/lineup/OCX5_lineup_main_artist1_syncx_alt1.png",
      },
    ],
    []
  );

  const ticketCards = useMemo(
    () => [
      { id: "gry", label: "GRY", tone: "from-[#d43922] to-[#9a1a15]" },
      { id: "sly", label: "SLY", tone: "from-[#0b3d2e] to-[#2d6a4f]" },
      { id: "rav", label: "RAV", tone: "from-[#023e8a] to-[#0077b6]" },
      { id: "huf", label: "HUF", tone: "from-[#b45309] to-[#ffb703]" },
    ],
    []
  );

  // Floating effect (like HeroSection idle feel) — subtle per-card drift
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const phase = (idx % 3) * 0.4;
      const y = 10 + (idx % 4) * 3; // 10..19px
      const r = (idx % 2 === 0 ? 1 : -1) * (1.2 + (idx % 3) * 0.3);
      const duration = 3.2 + (idx % 5) * 0.25;

      tweens.push(
        gsap.to(el, {
          y: -y,
          rotation: r,
          duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: phase,
        })
      );
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  const isDesktop = () => (typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false);
  const reduceMotion = () =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  const handleCardMove = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop() || reduceMotion()) return;
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const nx = (px - 0.5) * 2; // -1..1
    const ny = (py - 0.5) * 2; // -1..1

    // Very subtle tilt following mouse direction
    const maxTilt = 3.3; // degrees (~ +50%)
    const rotateY = nx * maxTilt;
    const rotateX = -ny * maxTilt;
    const maxShift = 6; // px
    const x = nx * maxShift;
    const y = ny * maxShift;

    gsap.to(card, {
      rotateX,
      rotateY,
      x,
      y,
      duration: 0.18,
      ease: "power2.out",
      transformPerspective: 900,
      transformOrigin: "center",
    });
  };

  const handleCardEnter = (idx: number) => {
    if (!isDesktop() || reduceMotion()) return;
    const card = cardRefs.current[idx];
    if (!card) return;
    gsap.to(card, { scale: 1.015, duration: 0.18, ease: "power2.out" });
  };

  const handleCardLeave = (idx: number) => {
    if (!isDesktop() || reduceMotion()) return;
    const card = cardRefs.current[idx];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden py-20 text-white"
      style={{
        // Match EventInfoSection gradient (do not change colors)
        background:
          // Extend the initial "black" segment by ~50% (25% -> 37.5%) to keep the top darker.
          "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 37.5%, #2c090b 60%, #9a1a15 80%, #d43922 100%)",
        fontFamily: "WizardWorldSimplified, fantasy, serif",
      }}
    >
      {/* Stars overlay can read as "white" due to screen blend; keep it but dim it for lineup */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{ filter: "brightness(0.75) contrast(1)" }}
      >
        <StarsBackground />
      </div>

      {/* Lightning: two layers for depth (some under cards, some above) */}
      <div ref={sectionRef} className="absolute inset-0">
        {/* Under cards */}
        <FloatingLightningElements
          containerRef={sectionRef}
          count={6}
          wrapperClassName="z-20 opacity-60"
          wrapperStyle={{ filter: "brightness(0.95)" }}
        />
        {/* Above cards */}
        <FloatingLightningElements
          containerRef={sectionRef}
          count={5}
          wrapperClassName="z-40 opacity-85"
          wrapperStyle={{ filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255,190,120,0.25))" }}
        />
      </div>

      <div className="relative z-30 mx-auto w-full max-w-7xl px-2 sm:px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-white drop-shadow-2xl">
            LINEUP
          </h2>
        </div>

        {/* Grid Layout: mobile 2 cols, desktop 3 cols */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[10px] w-full mx-auto place-items-center">
          {items.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onMouseEnter={() => handleCardEnter(idx)}
              onMouseLeave={() => handleCardLeave(idx)}
              onMouseMove={(e) => handleCardMove(idx, e)}
              className="group relative w-full max-w-[430px] md:max-w-[505px] transition-transform duration-300 ease-out will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                href="/ticketocx5"
                className="block relative"
                aria-label="Go to tickets"
              >
                {/* keep aspect like your provided card image */}
                <div className="relative w-full aspect-[4/5]">
                  <img
                    src={item.image}
                    alt="Lineup Card"
                    className="w-full h-full object-contain"
                    style={{
                      // Shadow should cast DOWN (not halo around edges -> looks like a border)
                      filter:
                        "drop-shadow(0 42px 34px rgba(0,0,0,0.62)) drop-shadow(0 10px 12px rgba(0,0,0,0.22))",
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Ticket cards (click to go to seatmap) */}
        {/* <div className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-white">
              Tickets
            </h3>
            <Link
              href="/ticketocx5"
              className="text-sm text-white/80 hover:text-white transition-colors underline underline-offset-4"
            >
              Open Seatmap
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px]">
            {ticketCards.map((t) => (
              <Link
                key={t.id}
                href="/ticketocx5"
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b ${t.tone} p-5 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)] transition-transform hover:-translate-y-1 active:translate-y-0`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-white/10" />
                </div>
                <div className="relative">
                  <div className="text-white/90 text-xs uppercase tracking-[0.25em]">
                    House
                  </div>
                  <div className="mt-2 text-3xl font-extrabold tracking-widest text-white drop-shadow">
                    {t.label}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white/95">
                    <span>Buy tickets</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}
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