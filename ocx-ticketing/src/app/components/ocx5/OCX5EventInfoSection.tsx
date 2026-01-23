"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";

interface OCX5EventInfoSectionProps {
  debugLayout: boolean;
}

const houses = [
  {
    id: "gryffindor",
    name: "Gryffindor",
    percent: 26,
    color: "bg-[#BD3935]",
    border: "border-[#ae0001]",
    borderColor: "#ae0001",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_gri_alt1.svg",
  },
  {
    id: "ravenclaw",
    name: "Ravenclaw",
    percent: 27,
    color: "bg-[#035DAF]",
    border: "border-[#222f5b]",
    borderColor: "#222f5b",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_rav_alt1.svg",
  },
  {
    id: "hufflepuff",
    name: "Hufflepuff",
    percent: 25,
    color: "bg-[#FFB10E]",
    border: "border-[#f0c75e]",
    borderColor: "#f0c75e",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_huf_alt1.svg",
  },
  {
    id: "slytherin",
    name: "Slytherin",
    percent: 22,
    color: "bg-[#006F5B]",
    border: "border-[#2a623d]",
    borderColor: "#2a623d",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_sly_alt1.svg",
  },
];

export default function OCX5EventInfoSection({
  debugLayout,
}: OCX5EventInfoSectionProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    houses.map(() => 0)
  );

  // % load up animation on first view
  useEffect(() => {
    const timers = houses.map((h, idx) => {
      const duration = 800;
      const stepTime = 20;
      let current = 0;

      return setInterval(() => {
        current += h.percent / (duration / stepTime);
        if (current >= h.percent) {
          current = h.percent;
          clearInterval(timers[idx]);
        }
        setAnimatedValues((prev) => {
          const clone = [...prev];
          clone[idx] = Math.round(current);
          return clone;
        });
      }, stepTime);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section
      id="event-info"
      // Reduce vertical height ~40% (from full screen to ~60vh). Gradient unchanged.
      // Mobile: give ~20% more vertical room so text blocks aren't cramped.
      className="relative min-h-[84vh] md:min-h-[70vh] overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)",
        fontFamily: "WizardWorldSimplified, fantasy, serif",
      }}
    >
      <StarsBackground />

      <div className="relative z-30 container mx-auto min-h-[72vh] md:min-h-[60vh] flex flex-col lg:flex-row items-center lg:items-start justify-between px-6 pt-12 sm:pt-12 pb-20 sm:pb-[120px]">
        {/* LEFT SIDE */}
        {/* NOTE: overflow-visible so the header can sit above this block without being clipped */}
        <div className="relative w-full lg:w-3/5 flex flex-nowrap justify-center items-start gap-1 sm:gap-6 h-[260px] sm:h-[320px] md:h-[380px] overflow-visible">
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
            {/* <div
              className="
                          relative px-10 py-3
                          text-white uppercase tracking-widest text-sm font-semibold
                        "
              style={{
                background: "linear-gradient(180deg, #d43922 0%,rgb(102, 28, 17) 100%)",
                clipPath:
                  "polygon(4% 0%, 96% 0%, 100% 50%, 96% 100%, 4% 100%, 0% 50%)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
              }}
            >
              Sorted Today
            </div> */}

            {/* Shadow layer dưới */}
            <div
              className="absolute left-1/2 top-full -translate-x-1/2 mt-1 w-[90%] h-2"
              style={{
                background: "rgba(0,0,0,0.35)",
                filter: "blur(8px)",
              }}
            />
          </div>

          {houses.map((h, idx) => {
            const isHovered = hovered === h.id;
            const othersHovered = hovered && !isHovered;

            return (
              <div
                key={h.id}
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex flex-col items-center transition-all duration-500 ease-out"
              >
                {/* Banner */}
                <div
                  className={`
    relative w-[clamp(60px,18vw,124px)] sm:w-28 md:w-36
    ${h.color}
    shadow-[0_10px_30px_rgba(0,0,0,0.5)]
    transition-all duration-500
    ${othersHovered ? "brightness-75" : "brightness-100"}
  `}
                  style={{
                    height: isHovered
                      ? "310px"
                      : othersHovered
                        ? "180px"
                        : "230px",

                    // Shape tam giác cân – không có cạnh ngang trên
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",

                    // ✅ VIỀN CHUẨN – ÔM ĐÚNG 2 CẠNH XIÊN + ĐÁY
                    outline: `6px solid ${h.borderColor}`,
                    outlineOffset: "-6px",

                    // Bo nhẹ đáy cho cảm giác mềm (optional)
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full pt-8">
                    <Image
                      src={h.logo}
                      alt={h.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                </div>

                {/* INFO */}
                <div className="mt-4 text-center transition-all duration-300">
                  {/* Title always visible */}
                  <h3 className="uppercase tracking-widest text-sm md:text-base">
                    {h.name}
                  </h3>

                  {/* Percentage only visible when hovered OR none hovered */}
                  {(!hovered || isHovered) && (
                    <p className="text-3xl font-bold">{animatedValues[idx]}%</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE CTA */}
        <div className="w-full lg:w-2/5 text-center lg:text-left space-y-8 sm:space-y-8 mt-10 sm:mt-12 lg:mt-0 lg:self-start">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase leading-tight">
            What's your <br /> OCX House?
          </h2>

          <Link
            href="/ticketocx5"
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-[#d43922] rounded-full font-bold overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-[0_0_15px_rgba(212,57,34,0.35)] hover:shadow-[0_0_28px_rgba(212,57,34,0.55)]"
          >
            <span className="relative z-10 uppercase tracking-[0.2em]">
              Get Tickets Now
            </span>
            {/* Shine sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-white/20 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[120%]" />
          </Link>
        </div>
      </div>

      {/* Horizon should sit BEHIND content (otherwise it looks like the flags are "cut" on mobile). */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <HorizonBridge
          baseName="imgi_56_horizons_train"
          imageAlt="Magical Train Horizon"
          parallaxSpeed={0.5}
        />
      </div>
    </section>
  );
}
