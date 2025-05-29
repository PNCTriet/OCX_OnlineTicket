"use client";
import Image from "next/image";
import { useState } from "react";

const ARTISTS = [
  {
    name: { vi: "Nghệ sĩ A", en: "Artist A" },
    desc: { vi: "Indie Rock", en: "Indie Rock" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ B", en: "Artist B" },
    desc: { vi: "Indie Pop", en: "Indie Pop" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ C", en: "Artist C" },
    desc: { vi: "Folk", en: "Folk" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ D", en: "Artist D" },
    desc: { vi: "Alternative", en: "Alternative" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ E", en: "Artist E" },
    desc: { vi: "Indie Rock", en: "Indie Rock" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ F", en: "Artist F" },
    desc: { vi: "Indie Pop", en: "Indie Pop" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ G", en: "Artist G" },
    desc: { vi: "Folk", en: "Folk" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ H", en: "Artist H" },
    desc: { vi: "Alternative", en: "Alternative" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ I", en: "Artist I" },
    desc: { vi: "Indie Rock", en: "Indie Rock" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ J", en: "Artist J" },
    desc: { vi: "Indie Pop", en: "Indie Pop" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ I", en: "Artist I" },
    desc: { vi: "Indie Rock", en: "Indie Rock" },
    img: "/images/client_logo_ss3.jpg",
  },
  {
    name: { vi: "Nghệ sĩ J", en: "Artist J" },
    desc: { vi: "Indie Pop", en: "Indie Pop" },
    img: "/images/client_logo_ss3.jpg",
  },
];

export default function LineupSection({ lang }: { lang: "vi" | "en" }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="lineup" className="py-16 bg-[#fff8f2] dark:bg-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-8 text-center">
          {lang === "vi" ? "Line-up Nghệ Sĩ" : "Artist Line-up"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {ARTISTS.map((a, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center bg-white dark:bg-black rounded-xl shadow p-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Image
                src={a.img}
                alt={a.name[lang]}
                width={112}
                height={112}
                className="rounded-full object-cover mb-3 border-4 border-red-600"
              />
              <div className="font-semibold text-lg text-black dark:text-white">{a.name[lang]}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{a.desc[lang]}</div>
              {hovered === i && (
                <div className="absolute inset-0 bg-black/80 text-white rounded-xl flex flex-col items-center justify-center p-4 animate-fade-in">
                  <div className="font-bold text-xl mb-2">{a.name[lang]}</div>
                  <div className="text-center">{a.desc[lang]}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 