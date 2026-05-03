"use client";

import type { CSSProperties } from "react";
import type { HeaderLang } from "@/components/v2/Header";

type Item = {
  swatchClass: string;
  swatchStyle?: CSSProperties;
  vi: string;
  en: string;
};

const ITEMS: Item[] = [
  {
    swatchClass: "",
    swatchStyle: {
      background: "#262626",
      border: "1px solid #404040",
    },
    vi: "Còn ghế",
    en: "Available",
  },
  {
    swatchClass: "bg-[#FF6B1A]",
    vi: "Đã chọn",
    en: "Selected",
  },
  {
    swatchClass: "",
    swatchStyle: {
      background: "rgba(251, 191, 36, 0.08)",
      border: "1px solid #FBBF24",
    },
    vi: "VIP",
    en: "VIP",
  },
  {
    swatchClass: "bg-[#3F3F3F]",
    vi: "Đang giữ",
    en: "Held",
  },
  {
    swatchClass: "",
    swatchStyle: {
      background: "#1A1A1A",
      border: "1px solid #262626",
    },
    vi: "Đã bán",
    en: "Sold",
  },
];

export default function SeatMapLegend({ lang }: { lang: HeaderLang }) {
  return (
    <div
      className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[13px] text-[#A1A1A1]"
      role="list"
      aria-label={lang === "vi" ? "Chú thích ghế" : "Seat legend"}
    >
      {ITEMS.map((item) => (
        <div key={item.en} className="inline-flex items-center gap-2" role="listitem">
          <span
            className={`size-4 shrink-0 rounded ${item.swatchClass}`}
            style={item.swatchStyle}
            aria-hidden
          />
          <span>{lang === "vi" ? item.vi : item.en}</span>
        </div>
      ))}
    </div>
  );
}
