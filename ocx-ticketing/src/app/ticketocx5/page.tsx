"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EventInfoCard from "../components/ticket/EventInfoCard";
import TicketSelectionCard from "../components/ticket/TicketSelectionCard";
import OrderSummaryCard from "../components/ticket/OrderSummaryCard";
import StageMapCard from "../components/ticket/StageMapCard";
import ZoneConfirmationModal from "../components/ticket/ZoneConfirmationModal";
import StarsBackground from "../components/ocx5/StarsBackground";
import OCX5HeaderNav from "../components/ocx5/OCX5HeaderNav";
import HorizonBridge from "../components/ocx5/HorizonBridge";
import { SEAT_LAYOUT_CONFIG } from "../constants/ticket";
import { EventInfo, TicketType, Zone } from "../types/ticket";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase";
import { isV2Enabled } from "@/lib/flags";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";
import TicketList from "@/components/v2/TicketList";
import TicketDetail from "@/components/v2/TicketDetail";

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

const EVENT_INFO_OCX5: EventInfo = {
  id: "ocx-5",
  name: "Ớt Cay Xè",
  time: "15:00",
  location: "Thủ Đô Hà Nội",
  avatar: "/images/client_logo_ss5_alt1.jpg",
  date: "07/2026",
};

// Google Map embed – Thủ Đô Hà Nội (15-17 Cộng Hòa, P.4, Tân Bình, HCM)
const VENUE_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4005.8995479482346!2d106.65554027509525!3d10.800006558758154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529300fb09909%3A0x22971093be7a67ef!2sS%C3%A2n%20Patin%20Vietnam%20Roller%20Rink%20%26%20Academy!5e1!3m2!1sen!2sus!4v1773502644229!5m2!1sen!2sus";

function extractSeatSectionId(text: string | undefined | null): string | null {
  if (!text) return null;
  const m = text.match(/khu\s*v[ựu]c\s*([A-E])/i);
  if (m?.[1]) return m[1].toUpperCase();
  return null;
}

type Ocx5ZoneId = "A" | "B" | "C" | "D";

const HOUSE_BY_ZONE_ID: Record<
  Ocx5ZoneId,
  { code: "GRY" | "HUF" | "SLY" | "RAV"; name: string; logo: string }
> = {
  D: {
    code: "GRY",
    name: "Nhà Gry [ VÉ ĐỨNG ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_gri_alt1.svg",
  },
  B: {
    code: "HUF",
    name: "Nhà Huf [ VÉ NGỒI ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_huf_alt1.svg",
  },
  A: {
    code: "SLY",
    name: "Nhà Sly [ VÉ NGỒI ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_sly_alt1.svg",
  },
  C: {
    code: "RAV",
    name: "Nhà Rav [ VÉ NGỒI ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_rav_alt1.svg",
  },
};

// OCX5 uses 4 ticket types from API -> 4 zones in seatmap.
const OCX5_SEAT_LAYOUT_CONFIG: typeof SEAT_LAYOUT_CONFIG = {
  STAGE: {
    x: 350, // "THE HALL" - Sân khấu ở giữa trên cùng
    y: 280,
    width: 300,
    height: 60,
  },
  SECTIONS: [
    {
      id: "D", // GRYFFINDOR - Khu vực đứng chính giữa
      label: "GRY - STANDING",
      color: "#e63946", // Màu đỏ
      x: 350,
      y: 350,
      width: 300,
      height: 250,
      rows: 15,
      cols: 12,
      ticketTypeId: "ocx5-ticket-gry",
    },
    {
      id: "B", // HUFFLEPUFF - Khu vực ngồi phía dưới GRY
      label: "HUF - SEATING",
      color: "#ffb703", // Màu vàng/cam
      x: 350,
      y: 610,
      width: 300,
      height: 190,
      rows: 5,
      cols: 15,
      ticketTypeId: "ocx5-ticket-huf",
    },
    {
      id: "A", // SLYTHERIN - Khu vực ngồi bên trái (nghiêng)
      label: "SLY - SEATING",
      color: "#2d6a4f", // Màu xanh lá đậm
      x: 140,
      y: 350,
      width: 200,
      height: 450,
      rows: 15,
      cols: 6,
      ticketTypeId: "ocx5-ticket-sly",
    },
    {
      id: "C", // RAVENCLAW - Khu vực ngồi bên phải (nghiêng)
      label: "RAV - SEATING",
      color: "#0077b6", // Màu xanh dương
      x: 660,
      y: 350,
      width: 200,
      height: 450,
      rows: 15,
      cols: 6,
      ticketTypeId: "ocx5-ticket-rav",
    },
  ],
};

/**
 * Khóa cứng trên trang OCX5: HUF (zone B) và RAV (zone C).
 * Ưu tiên hơn trạng thái trên database — xóa id khỏi Set khi cần mở bán lại.
 */
const OCX5_HARDCODED_LOCKED_ZONE_IDS = new Set<Ocx5ZoneId>(["B", "C"]);

function isOcx5HardcodedLockedZone(zoneId: string | null | undefined): boolean {
  if (!zoneId) return false;
  return OCX5_HARDCODED_LOCKED_ZONE_IDS.has(zoneId as Ocx5ZoneId);
}

function normalizeOcx5TicketStatus(
  raw: string | undefined | null
): "ACTIVE" | "INACTIVE" | "SOLD_OUT" {
  const u = String(raw ?? "")
    .trim()
    .toUpperCase();
  if (u === "ACTIVE") return "ACTIVE";
  if (u === "SOLD_OUT" || u === "SOULD_OUT") return "SOLD_OUT";
  if (u === "INACTIVE") return "INACTIVE";
  return "INACTIVE";
}

function mapOcx5TicketNameToZoneId(name: string | undefined | null): Ocx5ZoneId | null {
  if (!name) return null;
  const n = name.trim().toUpperCase();

  // New OCX5 API naming (house codes)
  // Layout mapping (per your latest seat layout):
  // - D: GRY
  // - B: HUF
  // - A: SLY
  // - C: RAV
  if (n === "GRY" || n.includes("GRY")) return "D";
  if (n === "HUF" || n.includes("HUF")) return "B";
  if (n === "SLY" || n.includes("SLY")) return "A";
  if (n === "RAV" || n.includes("RAV")) return "C";

  // Backwards-compatible mapping (older naming)
  if (n.includes("NGỒI TRÁI")) return "A";
  if (n.includes("NGỒI GIỮA")) return "B";
  if (n.includes("NGỒI PHẢI")) return "C";
  if (n.includes("VÉ ĐỨNG") || n === "ĐỨNG" || n.includes("ĐỨNG")) return "D";
  return null;
}

function Ocx5AlertBanners({
  error,
  showNoTicketsError,
  showMaxTicketsError,
  zoneUnavailableMessage,
}: {
  error: string | null;
  showNoTicketsError: boolean;
  showMaxTicketsError: boolean;
  zoneUnavailableMessage: string | null;
}) {
  return (
    <>
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
      {showNoTicketsError && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
          <p className="text-center">Vui lòng chọn ít nhất một vé để tiếp tục.</p>
        </div>
      )}
      {showMaxTicketsError && (
        <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-300">
          <p className="text-center">Mỗi người chỉ được mua tối đa 10 vé trong 1 phiên.</p>
        </div>
      )}
      {zoneUnavailableMessage && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <p className="text-center">{zoneUnavailableMessage}</p>
        </div>
      )}
    </>
  );
}

export default function TicketOCX5Page() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [error, setError] = useState<string | null>(null);
  const [showNoTicketsError, setShowNoTicketsError] = useState(false);
  const [showMaxTicketsError, setShowMaxTicketsError] = useState(false);
  const [zoneUnavailableMessage, setZoneUnavailableMessage] = useState<string | null>(null);
  const [showSeatmapIntro, setShowSeatmapIntro] = useState(false);
  const [seatmapIntroEntered, setSeatmapIntroEntered] = useState(false);
  const [seatmapIntroText, setSeatmapIntroText] = useState("");

  const [selectedTickets, setSelectedTickets] = useState<
    (TicketType & { quantity: number; availableQty: number; seatSectionId?: string | null })[]
  >([]);

  // Seatmap selection state
  // - highlightedZoneId: always highlight in seatmap (even if mapping isn't ready)
  // - activeZoneId: enables ticket controls (only set when mapping exists)
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null); // A/B/C/D
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null); // A/B/C/D
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingZone, setPendingZone] = useState<Zone | null>(null);
  const [pendingMaxQty, setPendingMaxQty] = useState(10);
  const [pendingInitialQty, setPendingInitialQty] = useState(0);

  const MAX_TICKETS_PER_SESSION = 10;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Intro seatmap modal: wait for page "ready" then show, auto-dismiss after 10s
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading || !user) return;

    setShowSeatmapIntro(false);
    setSeatmapIntroEntered(false);
    setSeatmapIntroText("");

    // Delay so UI can settle (avoid showing too fast)
    const showDelay = window.setTimeout(() => {
      setShowSeatmapIntro(true);
      setSeatmapIntroEntered(false);
      window.requestAnimationFrame(() => setSeatmapIntroEntered(true));
    }, 700);

    const autoClose = window.setTimeout(() => {
      setShowSeatmapIntro(false);
    }, 7000);

    return () => {
      window.clearTimeout(showDelay);
      window.clearTimeout(autoClose);
    };
  }, [loading, user]);

  const closeSeatmapIntro = () => {
    setShowSeatmapIntro(false);
  };

  // Typing effect for intro text
  useEffect(() => {
    if (!showSeatmapIntro) return;
    const full = "bảo bối, đây là sơ đồ chỗ ngồi\nmáy lạnh đã lắm em yên tâm nha";

    // Respect reduced motion
    const reduce =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
    if (reduce) {
      setSeatmapIntroText(full);
      return;
    }

    setSeatmapIntroText("");
    let i = 0;
    const iv = window.setInterval(() => {
      i += 1;
      setSeatmapIntroText(full.slice(0, i));
      if (i >= full.length) window.clearInterval(iv);
    }, 45);

    return () => window.clearInterval(iv);
  }, [showSeatmapIntro]);

  // Redirect to login (same pattern as /ticket)
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?redirectTo=/ticketocx5");
    }
  }, [user, loading, router]);

  // Verify backend auth (same pattern as /ticket)
  useEffect(() => {
    const checkBackendAuth = async () => {
      if (!user) return;
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (accessToken && API_BASE_URL) {
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
            router.replace("/auth/login?redirectTo=/ticketocx5");
          }
        } catch {
          window.alert(
            "Không thể xác thực tài khoản với hệ thống backend! Vui lòng đăng nhập lại."
          );
          await signOut();
          router.replace("/auth/login?redirectTo=/ticketocx5");
        }
      }
    };
    checkBackendAuth();
  }, [user, signOut, router]);

  // Fetch tickets from API (same endpoint used in /ticket currently)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setError(null);
        const response = await fetch(
          "https://api.otcayxe.com/tickets/event/cmoi4vq3m02jzo912nj53v59l",
          {
            method: "GET",
            headers: { accept: "*/*" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiTicketType[] = await response.json();

        const transformed = data.map((ticket) => {
          // Prefer explicit mapping by ticket name (API currently doesn't provide zone field).
          // Fallback to description parsing if you later add "Khu vực A/B/..." to description.
          const seatSectionId =
            mapOcx5TicketNameToZoneId(ticket.name) ?? extractSeatSectionId(ticket.description);
          const computedLabel =
            ticket.name?.toUpperCase().includes("GRY") ? "Vé đứng" : "Vé ngồi";
          const statusFromApi = normalizeOcx5TicketStatus(ticket.status);
          const hardcodedLocked = isOcx5HardcodedLockedZone(seatSectionId);
          const status = hardcodedLocked ? ("INACTIVE" as const) : statusFromApi;
          // Status wins over remaining inventory: only ACTIVE is sellable.
          const availableQty =
            status === "ACTIVE"
              ? Math.max(0, ticket.total_qty - ticket.sold_qty)
              : 0;
          // Use seatmap zone color for a consistent concept palette
          const zoneColor =
            seatSectionId &&
            (OCX5_SEAT_LAYOUT_CONFIG.SECTIONS.find((s) => s.id === seatSectionId)?.color ??
              undefined);
          return {
            id: ticket.id, // keep REAL backend ticket id for checkout
            name: ticket.name,
            price: parseInt(ticket.price),
            color: zoneColor ?? getRandomColor(),
            quantity: 0,
            sold: ticket.sold_qty,
            label: computedLabel,
            status,
            availableQty,
            seatSectionId,
          };
        });

        setSelectedTickets(transformed);
      } catch {
        setError("Không thể tải thông tin vé. Vui lòng thử lại sau.");
      }
    };

    fetchTickets();
  }, []);

  // Build tooltip text for seat sections (A-D)
  const tooltipBySectionId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const section of OCX5_SEAT_LAYOUT_CONFIG.SECTIONS) {
      const match = selectedTickets.find((t) => t.seatSectionId === section.id);
      if (match) {
        map[section.id] = `${match.name} - ${match.price.toLocaleString("vi-VN")}đ`;
      }
    }
    return map;
  }, [selectedTickets]);

  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  const totalTickets = selectedTickets.reduce((sum, t) => sum + t.quantity, 0);

  const handleQuantityChange = (ticketId: string, change: number) => {
    setShowNoTicketsError(false);
    setShowMaxTicketsError(false);
    setSelectedTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        const currentTotal = prev.reduce((s, t) => s + t.quantity, 0);
        const nextQty = ticket.quantity + change;
        if (nextQty < 0) return ticket;

        const perTicketMax = Math.min(MAX_TICKETS_PER_SESSION, ticket.availableQty);
        if (nextQty > perTicketMax) return ticket;

        // Global cap across all ticket types
        if (change > 0 && currentTotal >= MAX_TICKETS_PER_SESSION) {
          setShowMaxTicketsError(true);
          return ticket;
        }
        return { ...ticket, quantity: nextQty };
      })
    );
  };

  const handleZoneSelect = (sectionId: string) => {
    const sectionConfig = OCX5_SEAT_LAYOUT_CONFIG.SECTIONS.find((s) => s.id === sectionId);
    if (!sectionConfig) return;

    if (isOcx5HardcodedLockedZone(sectionId)) {
      setHighlightedZoneId(sectionId);
      setActiveZoneId(null);
      setZoneUnavailableMessage(
        "Hạng vé HUF và RAV đã hết."
      );
      return;
    }

    const matchingTicket = selectedTickets.find((t) => t.seatSectionId === sectionId);
    // Allow selecting zone even if mapping isn't ready (visual aid only).
    if (!matchingTicket) {
      setHighlightedZoneId(sectionId);
      setActiveZoneId(null);
      setZoneUnavailableMessage(null);
      return;
    }

    // Status (ACTIVE / INACTIVE / SOLD_OUT) must take priority over remaining qty.
    if (matchingTicket.status !== "ACTIVE") {
      setHighlightedZoneId(sectionId);
      setActiveZoneId(null);
      setZoneUnavailableMessage(
        matchingTicket.status === "SOLD_OUT"
          ? "Khu vực này đã hết vé."
          : "Khu vực này hiện không mở bán."
      );
      return;
    }
    setZoneUnavailableMessage(null);

    const houseMeta =
      (HOUSE_BY_ZONE_ID as Record<string, (typeof HOUSE_BY_ZONE_ID)[Ocx5ZoneId]>)[sectionId] ??
      null;

    const zone: Zone = {
      id: `zone-${sectionId}`,
      // For OCX5: show House code in popups instead of A/B/C/D
      name: houseMeta?.code ?? `Khu vực ${sectionId}`,
      color: sectionConfig.color,
      // Use backend ticket id so checkout works
      ticketTypeId: matchingTicket.id,
      capacity: matchingTicket.availableQty + matchingTicket.sold,
      sold: matchingTicket.sold,
      description: houseMeta ? `${houseMeta.name} • ${matchingTicket.name}` : matchingTicket.name,
    };

    // Prepare modal quantities with global cap (10 per session)
    const currentQty = matchingTicket.quantity;
    const otherTotal = selectedTickets.reduce((s, t) => s + (t.id === matchingTicket.id ? 0 : t.quantity), 0);
    const maxAllowedByGlobal = Math.max(0, MAX_TICKETS_PER_SESSION - otherTotal);
    const maxAllowed = Math.min(matchingTicket.availableQty, maxAllowedByGlobal);

    setHighlightedZoneId(sectionId);
    setPendingZone(zone);
    setPendingInitialQty(currentQty);
    setPendingMaxQty(maxAllowed);
    setIsModalOpen(true);
  };

  const handleConfirmZone = (nextQty: number) => {
    if (pendingZone) {
      const sectionIdForPendingZone =
        selectedTickets.find((t) => t.id === pendingZone.ticketTypeId)?.seatSectionId ?? null;

      setHighlightedZoneId(nextQty > 0 ? sectionIdForPendingZone : null);
      setActiveZoneId(nextQty > 0 ? sectionIdForPendingZone : null);
      setShowMaxTicketsError(false);
      setSelectedTickets((prevTickets) =>
        prevTickets.map((t) => {
          if (t.id === pendingZone.ticketTypeId) {
            const otherTotal = prevTickets.reduce(
              (s, x) => s + (x.id === t.id ? 0 : x.quantity),
              0
            );
            const maxAllowedByGlobal = Math.max(0, MAX_TICKETS_PER_SESSION - otherTotal);
            const maxAllowed = Math.min(t.availableQty, maxAllowedByGlobal);
            const clamped = Math.max(0, Math.min(nextQty, maxAllowed));
            if (nextQty > maxAllowed) setShowMaxTicketsError(true);
            return { ...t, quantity: clamped };
          }
          return t;
        })
      );
    }
    setIsModalOpen(false);
    setPendingZone(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingZone(null);
  };

  const handleContinue = () => {
    const ticketsToBuy = selectedTickets.filter((t) => t.quantity > 0);
    if (ticketsToBuy.length === 0) {
      setShowNoTicketsError(true);
      return;
    }

    try {
      const ticketsJson = JSON.stringify(ticketsToBuy);
      const encodedTickets = encodeURIComponent(ticketsJson);
      router.push(`/checkout?tickets=${encodedTickets}`);
    } catch {
      router.push("/checkout");
    }
  };

  const zoneConfirmationModal = (
    <ZoneConfirmationModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onConfirm={handleConfirmZone}
      zone={pendingZone}
      initialQuantity={pendingInitialQty}
      maxQuantity={pendingMaxQty}
    />
  );

  const seatmapIntroModal =
    showSeatmapIntro ? (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/70" onClick={closeSeatmapIntro} />
        <div
          className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${
            seatmapIntroEntered ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(180deg, rgb(0,0,0) 0%, rgb(44,9,11) 55%, rgb(60,10,12) 100%)",
            transition: "opacity 240ms ease, transform 240ms ease",
          }}
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/ocx5_seatmap_alt2.jpg"
              alt="OCX5 Seatmap"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-5">
            <p className="text-center font-semibold text-white">
              {seatmapIntroText.split("\n").map((line, idx, arr) => (
                <span key={idx}>
                  {line}
                  {idx < arr.length - 1 ? <br /> : null}
                </span>
              ))}
              <span
                className="ml-0.5 inline-block w-[10px] translate-y-[1px]"
                style={{
                  opacity: seatmapIntroText.length % 2 ? 1 : 0.35,
                  transition: "opacity 120ms linear",
                }}
              >
                |
              </span>
            </p>
          </div>
        </div>
      </div>
    ) : null;

  if (loading || !user) {
    if (isV2Enabled()) {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (isV2Enabled()) {
    return (
      <>
        <PageLayout>
          <Header
            lang={lang}
            onLangChange={setLang}
            actions={
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
              >
                Đăng xuất
              </button>
            }
          />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Ocx5AlertBanners
              error={error}
              showNoTicketsError={showNoTicketsError}
              showMaxTicketsError={showMaxTicketsError}
              zoneUnavailableMessage={zoneUnavailableMessage}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="min-h-0 space-y-6 lg:col-span-2">
                <div
                  className={isMobile ? "h-[380px]" : "h-[520px] lg:h-[640px]"}
                  style={{ minHeight: 0 }}
                >
                  <StageMapCard
                    selectedZoneId={highlightedZoneId}
                    onZoneSelect={handleZoneSelect}
                    tooltipBySectionId={tooltipBySectionId}
                    iconBySectionId={{
                      A: HOUSE_BY_ZONE_ID.A.logo,
                      B: HOUSE_BY_ZONE_ID.B.logo,
                      C: HOUSE_BY_ZONE_ID.C.logo,
                      D: HOUSE_BY_ZONE_ID.D.logo,
                    }}
                    layoutConfig={OCX5_SEAT_LAYOUT_CONFIG}
                    initialScale={isMobile ? 0.72 : 1}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="max-h-[640px] overflow-y-auto rounded-xl border border-[#262626] bg-[#141414] p-6 lg:h-[640px]">
                  <div className="space-y-6">
                    <TicketDetail event={EVENT_INFO_OCX5} />

                    <div className="overflow-hidden rounded-lg border border-[#262626] bg-black/30">
                      <p className="px-3 py-1.5 text-xs text-[#A1A1A1]">Vị trí</p>
                      <div className="relative aspect-video w-full">
                        <iframe
                          title="Bản đồ Thủ Đô Hà Nội"
                          src={VENUE_MAP_EMBED_SRC}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                    </div>

                    <div className="h-[320px] overflow-hidden sm:h-[360px]">
                      <TicketList
                        tickets={selectedTickets}
                        onQuantityChange={handleQuantityChange}
                        selectedZoneId={activeZoneId}
                        requireSeatmapSelection={false}
                      />
                    </div>

                    <OrderSummaryCard
                      totalAmount={totalAmount}
                      onContinue={handleContinue}
                      hasTickets={selectedTickets.some((ticket) => ticket.quantity > 0)}
                      selectedTickets={selectedTickets}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
          <V2Footer />
        </PageLayout>

        {zoneConfirmationModal}
        {seatmapIntroModal}
      </>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background: match OCX5 EventInfoSection gradient (no hero image) */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)",
        }}
      />
      {/* Stars overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          <StarsBackground />
        </div>
      </div>

      {/* Foreground content: use flex-col so Horizon always sits flush to viewport bottom */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header: same component as OCX5 landing */}
        <OCX5HeaderNav showSectionNav={false} />

        {/* Allow page scroll (same pattern as /ticket-seatmap) */}
        <main className="max-w-7xl mx-auto w-full flex-1 px-2 sm:px-4 lg:px-6 py-8 pt-24 sm:pt-28 md:pt-32">
          <Ocx5AlertBanners
            error={error}
            showNoTicketsError={showNoTicketsError}
            showMaxTicketsError={showMaxTicketsError}
            zoneUnavailableMessage={zoneUnavailableMessage}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Seatmap */}
            <div className="lg:col-span-2 space-y-6 min-h-0">
              {/* Mobile: keep seatmap shorter so users can scroll to the right column easily */}
              <div
                className={isMobile ? "h-[380px]" : "h-[520px] lg:h-[640px]"}
                style={{ minHeight: 0 }}
              >
                <StageMapCard
                  selectedZoneId={highlightedZoneId}
                  onZoneSelect={handleZoneSelect}
                  tooltipBySectionId={tooltipBySectionId}
                  iconBySectionId={{
                    A: HOUSE_BY_ZONE_ID.A.logo,
                    B: HOUSE_BY_ZONE_ID.B.logo,
                    C: HOUSE_BY_ZONE_ID.C.logo,
                    D: HOUSE_BY_ZONE_ID.D.logo,
                  }}
                  layoutConfig={OCX5_SEAT_LAYOUT_CONFIG}
                  // Mobile: start zoomed-out so the full map is easier to understand
                  initialScale={isMobile ? 0.72 : 1}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-1">
              <div
                className="rounded-xl p-6 shadow-lg border border-white/10 lg:h-[640px] lg:overflow-y-auto"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(44,9,11,0.55) 60%, rgba(154,26,21,0.35) 100%)",
                }}
              >
                <div className="space-y-6">
                  <EventInfoCard event={EVENT_INFO_OCX5} />

                  {/* Google Map – Thủ Đô Hà Nội */}
                  <div className="rounded-lg overflow-hidden border border-white/10 bg-black/30">
                    <p className="text-zinc-400 text-xs px-3 py-1.5">Vị trí</p>
                    <div className="relative w-full aspect-video">
                      <iframe
                        title="Bản đồ Thủ Đô Hà Nội"
                        src={VENUE_MAP_EMBED_SRC}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Ticket list scrolls inside this box so seatmap doesn't make the page too tall */}
                  <div className="h-[320px] sm:h-[360px] overflow-hidden">
                    <TicketSelectionCard
                      tickets={selectedTickets}
                      onQuantityChange={handleQuantityChange}
                      selectedZoneId={activeZoneId}
                      requireSeatmapSelection={false}
                    />
                  </div>

                  <OrderSummaryCard
                    totalAmount={totalAmount}
                    onContinue={handleContinue}
                    hasTickets={selectedTickets.some((ticket) => ticket.quantity > 0)}
                    selectedTickets={selectedTickets}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Horizon (no Footer component) */}
        <div className="relative w-full mt-auto">
          <HorizonBridge
            baseName="imgi_56_horizons_train"
            imageAlt="OCX5 Ticket Horizon"
            parallaxSpeed={0}
            position="flow"
            // Smaller horizon on ticket page to keep everything within one viewport (desktop).
            imageClassName="block h-auto w-full md:w-full max-w-none transform origin-bottom md:scale-110"
          />
        </div>
      </div>

      {zoneConfirmationModal}
      {seatmapIntroModal}
    </div>
  );
}

