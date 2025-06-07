"use client";
import Image from "next/image";
import { useState } from "react";

// List of 6 artist groups, each with its own main and sub image
const ARTISTS = [
  {
    main: "/images/lineup_main_ss3_betband_alt1.png",
    sub: "/images/lineup_sub_ss3_betband_alt1.png",
    name: "Artist 1"
  },
  {
    main: "/images/lineup_main_ss3_dauvantay_alt1.png",
    sub: "/images/lineup_sub_ss3_dauvantay_alt1.png",
    name: "Artist 2"
  },
  {
    main: "/images/lineup_main_ss3_emellata_alt1.png",
    sub: "/images/lineup_sub_ss3_emellata_alt1.png",
    name: "Artist 3"
  },
  {
    main: "/images/lineup_main_ss3_minhtoclam_alt1.png",
    sub: "/images/lineup_sub_ss3_minhtoclam_alt1.png",
    name: "Artist 4"
  },
  {
    main: "/images/lineup_main_ss3_thecassette_alt1.png",
    sub: "/images/lineup_sub_ss3_thecassette_alt1.png",
    name: "Artist 5"
  },
  {
    main: "/images/lineup_main_ss3_theflop_alt1.png",
    sub: "/images/lineup_sub_ss3_theflop_alt1.png",
    name: "Artist 6"
  },
];

export default function LineupSection({ lang }: { lang: "vi" | "en" }) {
  // Track hovered card index
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section 
      id="lineup" 
      className="pt-5 pb-16 relative"
      style={{
        backgroundImage: 'url(/images/hero_backround_ss3_alt2.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>
          {lang === "vi" ? "NGHỆ SĨ" : "Artist Line-up"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {ARTISTS.map((artist, i) => (
            <div
              key={i}
              className="relative w-full aspect-[3/5] overflow-hidden rounded-xl cursor-pointer shadow-2xl hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-shadow duration-300"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Main Image */}
              <Image
                src={artist.main}
                alt={`Lineup Main ${i+1}`}
                fill
                className="object-contain transition-transform duration-500 rounded-xl"
                priority={i === 0}
              />
              {/* Sub Image with Slice Effect */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  hovered === i ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                <Image
                  src={artist.sub}
                  alt={`Lineup Sub ${i+1}`}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 