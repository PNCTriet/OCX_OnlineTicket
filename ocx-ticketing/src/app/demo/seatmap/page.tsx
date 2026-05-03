"use client";

/**
 * Demo seatmap — lưới ghế theo script + CSS trong `Ticketing Platform.html`
 * (màu seat-available / selected / vip / reserved / sold). Chọn ghế demo, không checkout thật.
 */

import { useCallback, useMemo, useState } from "react";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";
import SeatMapLegend from "@/components/v2/SeatMapLegend";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M"] as const;
const SEATS_PER_ROW = 22;
const AISLE_AFTER = [7, 14] as const;
const VIP_ROWS = new Set(["A", "B"]);

const SOLD = new Set([
  "B-3",
  "B-4",
  "C-9",
  "C-10",
  "D-15",
  "D-16",
  "D-17",
  "E-2",
  "F-12",
  "F-13",
  "F-14",
  "G-20",
  "H-5",
  "H-6",
  "H-7",
  "J-11",
  "K-16",
  "L-19",
  "L-20",
  "M-1",
  "M-22",
]);

const RESERVED = new Set([
  "A-12",
  "A-13",
  "C-2",
  "E-18",
  "G-9",
  "J-3",
  "K-4",
]);

const PRICE_STANDARD = 500_000;
const PRICE_VIP = 800_000;

type Lang = "vi" | "en";

function seatId(row: string, n: number) {
  return `${row}-${n}` as const;
}

type SeatKind = "sold" | "reserved" | "selected" | "vip" | "available";

function classifySeat(
  id: string,
  row: string,
  selected: ReadonlySet<string>
): SeatKind {
  if (SOLD.has(id)) return "sold";
  if (RESERVED.has(id)) return "reserved";
  if (selected.has(id)) return "selected";
  if (VIP_ROWS.has(row)) return "vip";
  return "available";
}

function seatButtonClass(kind: SeatKind): string {
  const base =
    "h-6 w-6 shrink-0 rounded border transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F]";
  switch (kind) {
    case "sold":
      return `${base} cursor-not-allowed border-[#262626] bg-[#1A1A1A] opacity-90`;
    case "reserved":
      return `${base} cursor-not-allowed border-[#3F3F3F] bg-[#3F3F3F]`;
    case "selected":
      return `${base} cursor-pointer border-[#FF6B1A] bg-[#FF6B1A]`;
    case "vip":
      return `${base} cursor-pointer border-[#FBBF24] bg-[#FBBF2414] hover:shadow-[0_0_0_1px_#FBBF24]`;
    default:
      return `${base} cursor-pointer border-[#404040] bg-[#262626] hover:border-[#FF6B1A]`;
  }
}

export default function DemoSeatmapPage() {
  const [lang, setLang] = useState<Lang>("vi");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const toggleSeat = useCallback((id: string) => {
    if (SOLD.has(id) || RESERVED.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setDemoNotice(null);
  }, []);

  const lines = useMemo(() => {
    const arr: { id: string; label: string; price: number }[] = [];
    for (const id of selected) {
      const [row, num] = id.split("-");
      const label =
        lang === "vi" ? `Hàng ${row} · Ghế ${num}` : `Row ${row} · Seat ${num}`;
      const price = VIP_ROWS.has(row!) ? PRICE_VIP : PRICE_STANDARD;
      arr.push({ id, label, price });
    }
    arr.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    return arr;
  }, [selected, lang]);

  const subtotal = useMemo(() => lines.reduce((s, x) => s + x.price, 0), [lines]);
  const fee = Math.round(subtotal * 0.05);
  const vat = Math.round((subtotal + fee) * 0.08);
  const total = subtotal + fee + vat;

  const fmt = (n: number) => `${n.toLocaleString("vi-VN")}₫`;

  const finishDemo = () => {
    setDemoNotice(
      lang === "vi"
        ? "Đây là trang demo — không có thanh toán hay điều hướng checkout."
        : "This is a demo page — no payment or checkout navigation."
    );
  };

  const clearSelection = () => {
    setSelected(new Set());
    setDemoNotice(null);
  };

  const t = lang === "vi";

  return (
    <PageLayout>
      <Header lang={lang} onLangChange={setLang} />

      <main className="mx-auto max-w-[1280px] px-6 pb-16 pt-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#737373]">
          {t ? "Sơ đồ ghế demo (dữ liệu tĩnh)" : "Seat map demo (static data)"}
        </p>
        <h1 className="mt-2 text-[32px] font-semibold leading-[1.15] tracking-[-0.7px] text-[#FAFAFA]">
          {t ? "Chọn từng chỗ ngồi" : "Pick individual seats"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#A1A1A1]">
          {t
            ? "Bấm ghế trống hoặc VIP để chọn/bỏ. Ghế đã bán / đang giữ không chọn được. Giá demo: VIP 800.000₫, thường 500.000₫ mỗi ghế."
            : "Tap available or VIP seats to toggle. Sold and held seats are locked. Demo price: VIP ₫800,000, standard ₫500,000 per seat."}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
          <div>
            <div className="mx-auto mb-8 max-w-[480px] text-center">
              <p className="rounded-lg border border-[#262626] bg-[#1A1A1A] px-3 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                {t ? "— SÂN KHẤU —" : "— STAGE —"}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#0F0F0F] p-8">
              <div className="flex min-w-max flex-col items-center gap-4">
                {ROWS.map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center gap-1">
                    <span className="w-5 text-center font-mono text-[11px] text-[#737373]">
                      {rowLetter}
                    </span>
                    {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                      const n = i + 1;
                      const id = seatId(rowLetter, n);
                      const kind = classifySeat(id, rowLetter, selected);
                      const isAisle = AISLE_AFTER.includes(n as (typeof AISLE_AFTER)[number]);
                      return (
                        <span key={id} className="contents">
                          <button
                            type="button"
                            title={
                              lang === "vi"
                                ? `Hàng ${rowLetter} · Ghế ${n}`
                                : `Row ${rowLetter} · Seat ${n}`
                            }
                            disabled={kind === "sold" || kind === "reserved"}
                            onClick={() => toggleSeat(id)}
                            className={seatButtonClass(kind)}
                            aria-pressed={kind === "selected"}
                            aria-label={
                              lang === "vi"
                                ? `Ghế ${rowLetter}${n}, ${kind}`
                                : `Seat ${rowLetter}${n}, ${kind}`
                            }
                          />
                          {isAisle ? <span className="w-7 shrink-0" aria-hidden /> : null}
                        </span>
                      );
                    })}
                    <span className="w-5 text-center font-mono text-[11px] text-[#737373]">
                      {rowLetter}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <SeatMapLegend lang={lang} />

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-[#262626] bg-[#212121] px-4 py-2 text-sm font-medium text-[#FAFAFA] hover:bg-[#262626]"
              >
                {t ? "Bỏ chọn tất cả" : "Clear selection"}
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[80px]">
            <div className="flex flex-col gap-4 rounded-xl border border-[#262626] bg-[#141414] p-6">
              <h2 className="text-base font-semibold text-[#FAFAFA]">
                {t ? "Giỏ demo" : "Demo cart"}
              </h2>
              <p className="text-[13px] text-[#A1A1A1]">
                {t ? "Sân khấu · Demo" : "Venue · Demo"}
              </p>
              <div className="h-px bg-[#262626]" />

              {lines.length === 0 ? (
                <p className="text-sm text-[#737373]">
                  {t ? "Chưa chọn ghế nào." : "No seats selected."}
                </p>
              ) : (
                lines.map((row) => (
                  <div key={row.id} className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-[#A1A1A1]">{row.label}</span>
                    <span className="shrink-0 font-mono text-sm font-medium text-[#FAFAFA]">
                      {fmt(row.price)}
                    </span>
                  </div>
                ))
              )}

              <div className="h-px bg-[#262626]" />

              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-[#A1A1A1]">{t ? "Tạm tính" : "Subtotal"}</span>
                <span className="font-mono text-sm text-[#FAFAFA]">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-[#A1A1A1]">
                  {t ? "Phí dịch vụ (5%)" : "Service fee (5%)"}
                </span>
                <span className="font-mono text-sm text-[#FAFAFA]">{fmt(fee)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-[#A1A1A1]">VAT (8%)</span>
                <span className="font-mono text-sm text-[#FAFAFA]">{fmt(vat)}</span>
              </div>

              <div className="flex items-baseline justify-between border-t border-[#262626] pt-4">
                <span className="text-[13px] font-medium uppercase tracking-wide text-[#A1A1A1]">
                  {t ? "Tổng" : "Total"}
                </span>
                <span className="font-mono text-[32px] font-medium tracking-[-0.5px] text-[#FFFFFF]">
                  {fmt(total)}
                </span>
              </div>

              {demoNotice ? (
                <p className="rounded-lg border border-[#FBBF2440] bg-[#FBBF2414] px-3 py-2 text-sm text-[#FBBF24]">
                  {demoNotice}
                </p>
              ) : null}

              <button
                type="button"
                onClick={finishDemo}
                disabled={lines.length === 0}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B1A] text-[15px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#FF7A33] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t ? "Hoàn tất demo (không mua thật)" : "Finish demo (no real purchase)"}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <V2Footer />
    </PageLayout>
  );
}
