"use client";

import { Clock } from "lucide-react";
import type { TicketType } from "@/app/types/ticket";

type Lang = "vi" | "en";

type Props = {
  lang: Lang;
  eventTitle: string;
  selectedTickets: (TicketType & { quantity: number })[];
  onContinue: () => void;
  hasTickets: boolean;
};

/** Khối `.order-summary` theo Ticketing Platform.html (04A — checkout with seatmap). */
export default function SeatmapOrderSummary({
  lang,
  eventTitle,
  selectedTickets,
  onContinue,
  hasTickets,
}: Props) {
  const t = lang === "vi";
  const lines = selectedTickets.filter((x) => x.quantity > 0);
  const subtotal = lines.reduce((s, x) => s + x.price * x.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const beforeVat = subtotal + serviceFee;
  const vat = Math.round(beforeVat * 0.08);
  const total = subtotal + serviceFee + vat;

  const fmt = (n: number) => `${n.toLocaleString("vi-VN")}₫`;

  return (
    <div className="sticky top-20 flex flex-col gap-4 rounded-xl border border-[#262626] bg-[#141414] p-6 lg:top-[80px]">
      <h3 className="text-base font-semibold text-[#FAFAFA]">
        {t ? "Tóm tắt" : "Order summary"}
      </h3>
      <p className="text-[13px] leading-[1.45] text-[#A1A1A1]">{eventTitle}</p>
      <div className="h-px bg-[#262626]" />

      {lines.length === 0 ? (
        <p className="text-sm text-[#737373]">
          {t ? "Chọn khu trên sơ đồ ghế để thêm vé." : "Pick a zone on the seat map to add tickets."}
        </p>
      ) : (
        lines.map((x) => (
          <div key={x.id} className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-[#A1A1A1]">
              {x.name}
              {x.quantity > 1 ? ` · ×${x.quantity}` : ""}
            </span>
            <span className="shrink-0 font-mono text-sm font-medium text-[#FAFAFA]">
              {fmt(x.price * x.quantity)}
            </span>
          </div>
        ))
      )}

      <div className="h-px bg-[#262626]" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-[#A1A1A1]">{t ? "Tạm tính" : "Subtotal"}</span>
        <span className="font-mono text-sm font-medium text-[#FAFAFA]">{fmt(subtotal)}</span>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-[#A1A1A1]">
          {t ? "Phí dịch vụ (5%)" : "Service fee (5%)"}
        </span>
        <span className="font-mono text-sm font-medium text-[#FAFAFA]">{fmt(serviceFee)}</span>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-[#A1A1A1]">VAT (8%)</span>
        <span className="font-mono text-sm font-medium text-[#FAFAFA]">{fmt(vat)}</span>
      </div>

      <div className="flex items-baseline justify-between border-t border-[#262626] pt-4">
        <span className="text-[13px] font-medium uppercase tracking-wide text-[#A1A1A1]">
          {t ? "Tổng" : "Total"}
        </span>
        <span className="font-mono text-[32px] font-medium tracking-[-0.5px] text-[#FFFFFF]">
          {fmt(total)}
        </span>
      </div>

      {hasTickets ? (
        <div className="flex items-center gap-2 text-[13px] text-[#FBBF24]">
          <Clock className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <span>
            {t ? "Giữ ghế trong —:— (demo)" : "Seats held for —:— (demo)"}
          </span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        disabled={!hasTickets}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B1A] text-[15px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#FF7A33] active:bg-[#E85D14] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t ? "Tiếp tục thanh toán" : "Continue to payment"}
      </button>
    </div>
  );
}
