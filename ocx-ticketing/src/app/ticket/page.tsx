"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";
import { EVENT_INFO } from "../constants/ticket";
import { TicketType } from "../types/ticket";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Clock, MapPin } from "lucide-react";
import { OnyxIcon } from "@/components/ui/OnyxIcon";
import { createClient } from "@/lib/supabase";

type EventInfoTab = "intro" | "lineup" | "venue";

/** Poster line-up đã công bố (tỉ lệ 1:1 — hiển thị nguyên khung). */
const LINEUP_KIEN_POSTER = "/images/ocx5_hanoi/ocx5_hanoi_kien_alt1.jpg";

const HanoiVenueMap = dynamic(
  () => import("@/app/components/ticket/HanoiVenueMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(320px,50vh)] min-h-[220px] w-full items-center justify-center rounded-xl border border-[#262626] bg-[#141414] text-sm text-[#737373]">
        Đang tải bản đồ…
      </div>
    ),
  }
);

/* —— Data types + API (unchanged logic) —— */

interface ApiTicketType {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: string;
  total_qty: number;
  sold_qty: number;
  sale_start: string;
  sale_end: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const getRandomColor = () => {
  const colors = [
    "#56F482",
    "#31E4EC",
    "#F06185",
    "#F2D31F",
    "#A780F4",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/** Bật lại khi đã chốt ngày giờ chính thức */
const SHOW_EVENT_COUNTDOWN = false;

/** Countdown tới sự kiện (bật cùng SHOW_EVENT_COUNTDOWN) */
const EVENT_START = new Date("2026-07-07T15:00:00+07:00");

function useEventCountdown(target: Date) {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const tick = useCallback(() => {
    const now = Date.now();
    const ms = Math.max(0, target.getTime() - now);
    const s = Math.floor(ms / 1000);
    setParts({
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    });
  }, [target]);
  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return parts;
}

function statusBadgeClass(status: TicketType["status"]) {
  if (status === "ACTIVE")
    return "bg-[#34D39914] text-[#34D399] border-transparent";
  if (status === "SOLD_OUT")
    return "bg-[#F8717114] text-[#F87171] border-transparent";
  return "bg-[#FBBF2414] text-[#FBBF24] border-transparent";
}

function statusLabel(status: TicketType["status"]) {
  if (status === "ACTIVE") return "Còn vé";
  if (status === "SOLD_OUT") return "Hết vé";
  return "Chưa mở bán";
}

export default function TicketPage() {
  const { user, loading, signOut } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<
    (TicketType & { quantity: number; availableQty: number })[]
  >([]);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [showNoTicketsError, setShowNoTicketsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventInfoTab, setEventInfoTab] = useState<EventInfoTab>("intro");
  const router = useRouter();

  const minPrice = useMemo(() => {
    const active = selectedTickets.filter((t) => t.status === "ACTIVE");
    if (active.length === 0) return 0;
    return Math.min(...active.map((t) => t.price));
  }, [selectedTickets]);

  const totalQty = useMemo(
    () => selectedTickets.reduce((n, t) => n + t.quantity, 0),
    [selectedTickets]
  );

  const totalAmount = useMemo(
    () => selectedTickets.reduce((sum, t) => sum + t.price * t.quantity, 0),
    [selectedTickets]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("noTickets") === "true") setShowNoTicketsError(true);
    fetchTickets();
  }, []);

  useEffect(() => {
    const checkBackendAuth = async () => {
      if (!user) return;
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!accessToken || !API_BASE_URL) return;
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          window.alert(
            "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!"
          );
          await signOut();
          router.replace("/auth/login?redirectTo=/ticket");
        }
      } catch {
        window.alert(
          "Không thể xác thực tài khoản với hệ thống backend! Vui lòng đăng nhập lại."
        );
        await signOut();
        router.replace("/auth/login?redirectTo=/ticket");
      }
    };
    checkBackendAuth();
  }, [user, signOut, router]);

  const fetchTickets = async () => {
    try {
      setError(null);
      const response = await fetch(
        "https://api.otcayxe.com/tickets/event/cmoi4vq3m02jzo912nj53v59l",
        { method: "GET", headers: { accept: "*/*" } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: ApiTicketType[] = await response.json();
      setSelectedTickets(
        data.map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          price: parseInt(ticket.price, 10),
          color: getRandomColor(),
          quantity: 0,
          sold: ticket.sold_qty,
          label: ticket.description,
          status: ticket.status as TicketType["status"],
          availableQty: ticket.total_qty - ticket.sold_qty,
        }))
      );
    } catch {
      setError("Không thể tải thông tin vé. Vui lòng thử lại sau.");
    }
  };

  const handleQuantityChange = (ticketId: string, change: number) => {
    setShowNoTicketsError(false);
    setSelectedTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        const next = ticket.quantity + change;
        if (next < 0) return ticket;
        const maxLimit = Math.min(10, ticket.availableQty);
        if (next > maxLimit) return ticket;
        return { ...ticket, quantity: next };
      })
    );
  };

  const sortedTickets = useMemo(
    () =>
      [...selectedTickets].sort((a, b) => {
        const o = (s: string) =>
          s === "ACTIVE" ? 0 : s === "INACTIVE" ? 1 : 2;
        return o(a.status) - o(b.status);
      }),
    [selectedTickets]
  );

  const handleContinue = () => {
    const ticketsToBuy = selectedTickets.filter((t) => t.quantity > 0);
    if (ticketsToBuy.length === 0) {
      setShowNoTicketsError(true);
      return;
    }
    let checkoutUrl = "/checkout";
    try {
      const encoded = encodeURIComponent(JSON.stringify(ticketsToBuy));
      checkoutUrl = `/checkout?tickets=${encoded}`;
    } catch {
      /* giữ /checkout */
    }
    if (!user) {
      router.push(
        `/auth/login?redirectTo=${encodeURIComponent(checkoutUrl)}`
      );
      return;
    }
    router.push(checkoutUrl);
  };

  const headerActions = useMemo(() => {
    if (!user) {
      return (
        <Link
          href="/auth/login?redirectTo=/ticket"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
        >
          Đăng nhập
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
      >
        Đăng xuất
      </button>
    );
  }, [user, signOut]);

  if (loading) {
    return (
      <PageLayout>
        <Header
          lang={lang}
          onLangChange={setLang}
          actions={<span className="text-sm text-[#737373]">Đang tải...</span>}
        />
        <div className="flex min-h-[40vh] items-center justify-center text-[#FAFAFA]">
          Đang tải...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Header lang={lang} onLangChange={setLang} />
        <main className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="mx-auto max-w-md rounded-xl border border-[#F8717140] bg-[#F8717114] p-6 text-center">
            <p className="mb-4 text-[#F87171]">{error}</p>
            <button
              type="button"
              onClick={fetchTickets}
              className="rounded-lg bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-[#0A0A0A] hover:bg-[#FF7A33]"
            >
              Thử lại
            </button>
          </div>
        </main>
        <V2Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header lang={lang} onLangChange={setLang} actions={headerActions} />

      {showNoTicketsError && (
        <div className="mx-auto max-w-[1280px] px-6 pt-6">
          <div className="rounded-lg border border-[#F8717140] bg-[#F8717114] px-4 py-3 text-center text-sm text-[#F87171]">
            Vui lòng chọn ít nhất một vé để tiếp tục.
          </div>
        </div>
      )}

      {/* —— Reference: Ticketing Platform.html — event-hero — */}
      <section className="relative overflow-hidden bg-[#0A0A0A] pb-16 pt-12 md:pb-24 md:pt-24">
        {EVENT_INFO.thumbnail ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${EVENT_INFO.thumbnail}')` }}
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: `
              radial-gradient(60% 80% at 80% 20%, #4A1500 0%, transparent 60%),
              radial-gradient(60% 80% at 20% 80%, #3D1A0A 0%, transparent 62%),
              linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.75) 45%, #0A0A0A 100%)`,
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[1280px] px-6">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_480px]">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-transparent bg-[#FF6B1A1F] px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-[#FF6B1A]">
                  Đang bán
                </span>
                <span className="inline-flex items-center rounded-full border border-[#262626] bg-[#212121] px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                  Live event
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                {EVENT_INFO.date} · {EVENT_INFO.time} (ICT)
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#FFFFFF] md:text-[56px] md:tracking-[-1.4px]">
                {EVENT_INFO.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-6 text-[15px] text-[#A1A1A1]">
                <span className="inline-flex items-center gap-2">
                  <OnyxIcon icon={MapPin} size={18} />
                  {EVENT_INFO.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <OnyxIcon icon={Clock} size={18} />
                  Mở cửa trước giờ diễn
                </span>
              </div>
              {SHOW_EVENT_COUNTDOWN && <EventCountdownBlock />}
            </div>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-xl border border-[#262626] lg:max-w-none">
              <Image
                src={
                  EVENT_INFO.avatar ||
                  EVENT_INFO.thumbnail ||
                  "/images/placeholder.png"
                }
                alt={EVENT_INFO.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 320px, 480px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— event-body + sidebar (reference) — */}
      <div className="border-t border-[#262626] bg-[linear-gradient(180deg,#0F0F0F_0%,#0A0A0A_100%)]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-10 lg:grid-cols-[1fr_400px] lg:py-16">
          <div>
            <div className="mb-8 flex flex-wrap gap-4 border-b border-[#262626] sm:gap-6">
              {(
                [
                  { id: "intro" as const, label: "Giới thiệu" },
                  { id: "lineup" as const, label: "Line-up" },
                  { id: "venue" as const, label: "Địa điểm" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEventInfoTab(tab.id)}
                  className={`pb-3.5 text-[15px] font-medium transition-colors ${
                    eventInfoTab === tab.id
                      ? "border-b-2 border-[#FF6B1A] text-[#FAFAFA]"
                      : "border-b-2 border-transparent text-[#A1A1A1] hover:text-[#FAFAFA]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <Link
                href="/community"
                className="inline-flex items-center pb-3.5 text-[15px] font-medium text-[#A1A1A1] transition-colors hover:text-[#FAFAFA]"
              >
                FAQ
              </Link>
            </div>

            {eventInfoTab === "intro" && (
              <>
                <div className="prose prose-invert max-w-[720px] text-[17px] leading-relaxed text-[#FAFAFA]">
                  <p className="text-[#FAFAFA]">
                    Chọn loại vé phù hợp bên phải. Giữ nguyên giỏ hàng và tiếp tục
                    thanh toán khi đã chọn đủ số lượng.
                  </p>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight text-[#FAFAFA]">
                    Bao gồm
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-[#A1A1A1]">
                    <li>Vé điện tử — quét QR tại cổng</li>
                    <li>Thông tin vé gửi qua email sau khi thanh toán</li>
                  </ul>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight text-[#FAFAFA]">
                    Lưu ý
                  </h3>
                  <p className="text-[#A1A1A1]">
                    Vui lòng kiểm tra số lượng vé trước khi thanh toán. Mỗi phiên
                    có giới hạn số vé theo quy định ban tổ chức.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-[#262626] bg-[#141414] p-5">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-[#262626] bg-[#1A1A1A]">
                    {EVENT_INFO.avatar ? (
                      <Image
                        src={EVENT_INFO.avatar}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-lg font-semibold text-[#0A0A0A]">
                        OC
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-[#FAFAFA]">
                      Ban tổ chức Ớt Cay Xè
                    </p>
                    <p className="text-sm text-[#A1A1A1]">
                      Đơn vị phát hành vé được xác thực
                    </p>
                  </div>
                </div>
              </>
            )}

            {eventInfoTab === "lineup" && (
              <div className="max-w-[720px] space-y-6 text-[17px] leading-relaxed">
                <div>
                  <div className="relative mx-auto aspect-square w-full max-w-[min(100%,400px)]">
                    <Image
                      src={LINEUP_KIEN_POSTER}
                      alt="Trịnh Trung Kiên — OCX Hà Nội"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                    />
                  </div>
                  <p className="mt-3 text-center text-sm font-medium text-[#FAFAFA]">
                    Trịnh Trung Kiên
                  </p>
                </div>
                <p className="text-[#FAFAFA]">
                  Các nghệ sĩ còn lại sẽ được công bố trong thời gian sắp tới.
                </p>
                <p className="text-[15px] text-[#A1A1A1]">
                  Theo dõi fanpage và các kênh chính thức của chương trình để nhận
                  thông tin cập nhật.
                </p>
              </div>
            )}

            {eventInfoTab === "venue" && (
              <div className="max-w-[720px] space-y-6 text-[17px] leading-relaxed">
                <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">
                    Thủ đô Hà Nội
                  </h3>
                  <p className="mt-3 text-[#A1A1A1]">
                    {EVENT_INFO.location} — sự kiện{" "}
                    <span className="text-[#FAFAFA]">{EVENT_INFO.name}</span>{" "}
                    dự kiến trong khung thời gian{" "}
                    <span className="text-[#FAFAFA]">{EVENT_INFO.date}</span>
                    {EVENT_INFO.time ? (
                      <>
                        , mở cửa / giờ diễn theo thông báo chính thức (tham
                        chiếu {EVENT_INFO.time} ICT).
                      </>
                    ) : (
                      "."
                    )}
                  </p>
                  <p className="mt-3 text-sm text-[#737373]">
                    Địa chỉ chi tiết, cổng vào và gửi xe sẽ được cập nhật trên
                    fanpage và email vé trước ngày diễn.
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                    Bản đồ (tông tối)
                  </p>
                  <HanoiVenueMap />
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4 rounded-xl border border-[#262626] bg-[#141414] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                    Vé từ
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[#FAFAFA]">
                    {minPrice > 0
                      ? `${minPrice.toLocaleString("vi-VN")}₫`
                      : "—"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${statusBadgeClass(
                    sortedTickets.some((t) => t.status === "ACTIVE")
                      ? "ACTIVE"
                      : "INACTIVE"
                  )}`}
                >
                  {sortedTickets.some((t) => t.status === "ACTIVE")
                    ? "Đang mở bán"
                    : "Kiểm tra lại"}
                </span>
              </div>
              <div className="h-px bg-[#262626]" />
              <p className="text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                Chọn loại vé
              </p>
              <div className="flex flex-col gap-3">
                {sortedTickets.map((ticket) => {
                  const maxQty = Math.min(10, ticket.availableQty);
                  const selected = ticket.quantity > 0;
                  const disMinus =
                    ticket.quantity === 0 ||
                    ticket.status !== "ACTIVE";
                  const disPlus =
                    ticket.quantity >= maxQty ||
                    ticket.status !== "ACTIVE";
                  return (
                    <div
                      key={ticket.id}
                      className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-xl border p-5 transition-colors ${
                        selected
                          ? "border-[#FF6B1A] bg-[#FF6B1A1F]"
                          : "border-[#262626] bg-[#141414] hover:border-[#333333]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-base font-semibold tracking-tight text-[#FAFAFA]">
                          {ticket.name}
                        </div>
                        <div className="mt-1 text-[13px] text-[#A1A1A1]">
                          {ticket.label || "—"}{" "}
                          <span
                            className={
                              ticket.status === "ACTIVE"
                                ? "text-emerald-400"
                                : "text-[#737373]"
                            }
                          >
                            · {statusLabel(ticket.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xl font-semibold tabular-nums text-[#FAFAFA]">
                        {ticket.price.toLocaleString("vi-VN")}₫
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          aria-label="Giảm"
                          disabled={disMinus}
                          onClick={() => handleQuantityChange(ticket.id, -1)}
                          className="grid size-7 place-items-center rounded-md border border-[#262626] bg-[#212121] text-[#A1A1A1] hover:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="min-w-[22px] text-center font-mono text-sm font-medium text-[#FAFAFA]">
                          {ticket.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Tăng"
                          disabled={disPlus}
                          onClick={() => handleQuantityChange(ticket.id, 1)}
                          className="grid size-7 place-items-center rounded-md border border-[#262626] bg-[#212121] text-[#A1A1A1] hover:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-px bg-[#262626]" />
              <button
                type="button"
                onClick={handleContinue}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B1A] text-[15px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#FF7A33] active:bg-[#E85D14]"
              >
                Tiếp tục thanh toán
              </button>
              <p className="text-center text-[13px] text-[#737373]">
                Thanh toán an toàn · Kiểm tra đơn trước khi xác nhận
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* —— sticky-bar (reference) — */}
      <div className="sticky bottom-0 z-40 flex flex-col gap-3 border-t border-[#262626] bg-[#0A0A0A]/90 px-6 py-4 backdrop-blur-md backdrop-saturate-180 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
            {totalQty > 0
              ? `Đã chọn ${totalQty} vé`
              : "Chưa chọn vé"}
          </span>
          <span className="font-mono text-[32px] font-medium leading-none tracking-tight text-[#FFFFFF]">
            {totalAmount.toLocaleString("vi-VN")}₫
          </span>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-[#FF6B1A] px-8 text-[15px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#FF7A33] sm:min-w-[200px]"
        >
          Tiếp tục thanh toán
        </button>
      </div>

      <V2Footer />
    </PageLayout>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex min-w-[44px] flex-col items-center gap-1.5 md:min-w-[56px]">
      <span className="font-mono text-2xl font-medium leading-none tracking-tight text-[#FAFAFA] md:text-[32px]">
        {v}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-[#A1A1A1]">
        {label}
      </span>
    </div>
  );
}

function EventCountdownBlock() {
  const cd = useEventCountdown(EVENT_START);
  return (
    <div className="mt-8 inline-flex flex-wrap items-end gap-4 rounded-xl border border-[#262626] bg-[#141414] px-6 py-4">
      <CountUnit value={cd.d} label="Ngày" />
      <span className="pb-4 font-mono text-[32px] text-[#737373]">:</span>
      <CountUnit value={cd.h} label="Giờ" />
      <span className="pb-4 font-mono text-[32px] text-[#737373]">:</span>
      <CountUnit value={cd.m} label="Phút" />
      <span className="pb-4 font-mono text-[32px] text-[#737373]">:</span>
      <CountUnit value={cd.s} label="Giây" />
    </div>
  );
}
