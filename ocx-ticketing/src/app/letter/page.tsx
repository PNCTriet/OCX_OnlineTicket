"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import StarsBackground from "@/app/components/ocx5/StarsBackground";
import FloatingLightningElements from "@/app/components/ocx5/FloatingLightningElements";
import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import OCX5Footer from "@/app/components/ocx5/OCX5Footer";

const OCX5_GRADIENT =
  "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)";

// API GET /orders/me/tickets
type TicketItem = {
  ticketType: string;
  ticketTypeId: string;
  quantity: number;
  codes: string[];
};
type OrderItem = {
  orderId: string;
  eventId: string;
  eventName: string;
  paidAt: string;
  tickets: TicketItem[];
};
type OrdersMeTicketsResponse = { items: OrderItem[] };

const HOUSE_BY_TICKET_TYPE: Record<string, string> = {
  GRY: "Gryffindor",
  RAV: "Ravenclaw",
  SLY: "Slytherin",
  HUF: "Hufflepuff",
};

// Thư mời nhập học kiểu Harry Potter — theo nhà
function invitationByHouse(recipient: string, houseName: string): string {
  return `HỌC VIỆN ÂM NHẠC ỚT CAY XÈ

Trò ${recipient} thân mến,

Nhà trường vui mừng thông báo trò đã được xếp vào Nhà ${houseName}.
Trò được triệu hồi tham dự buổi khai giảng — Ớt Cay Xè, một đêm âm nhạc đầy phép màu, tại thánh địa Roller Rink, 
Thứ Bảy ngày 18 tháng 04 năm 2026, lúc 15:00.

Hẹn gặp trò tại sự kiện và chúc trò một năm học mới thành công cùng Nhà ${houseName}.

Expecto Patronum,
Ban Tuyển Sinh — Ớt Cay Xè`;
}

export default function LetterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fullText, setFullText] = useState("");
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [assignedHouse, setAssignedHouse] = useState<string | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const letterSectionRef = useRef<HTMLDivElement>(null);

  const recipientName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "Khách";

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/auth/login?redirectTo=/letter");
      return;
    }
  }, [user, loading, router]);

  // Gọi API /orders/me/tickets — có vé thì lấy nhà sớm nhất, không vé thì về trang chủ
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setTicketsLoading(true);
    setAssignedHouse(null);

    (async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!token || !API_BASE_URL) {
          if (!cancelled) router.replace("/OCX5");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/orders/me/tickets`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (!cancelled) router.replace("/OCX5");
          return;
        }

        const data: OrdersMeTicketsResponse = await res.json();
        const items = data?.items ?? [];

        if (items.length === 0) {
          if (!cancelled) router.replace("/OCX5");
          return;
        }

        // Sắp xếp theo paidAt sớm nhất, lấy loại vé đầu tiên của đơn sớm nhất
        const sorted = [...items].sort(
          (a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()
        );
        const firstOrder = sorted[0];
        const firstTicket = firstOrder?.tickets?.[0];
        const ticketType = firstTicket?.ticketType?.toUpperCase?.();
        const houseName = ticketType && HOUSE_BY_TICKET_TYPE[ticketType];

        if (!houseName) {
          if (!cancelled) router.replace("/OCX5");
          return;
        }

        if (!cancelled) setAssignedHouse(houseName);
      } catch {
        if (!cancelled) router.replace("/OCX5");
      } finally {
        if (!cancelled) setTicketsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, router]);

  // Nội dung thư — set ngay khi có nhà (có vé)
  useEffect(() => {
    if (!user || !assignedHouse) return;
    const text = invitationByHouse(recipientName, assignedHouse);
    setFullText(text);
  }, [user, assignedHouse]); // eslint-disable-line react-hooks/exhaustive-deps -- recipientName từ closure

  // Bay lơ lửng nhẹ như lá bài — chạy khi đã render lá thư (có user + có vé), refs mới có
  useEffect(() => {
    if (!user || !assignedHouse) return;

    const reduceMotion =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
    if (reduceMotion) return;

    const tweens: gsap.core.Tween[] = [];
    const logoEl = logoRef.current;
    const letterEl = letterRef.current;

    if (logoEl) {
      tweens.push(
        gsap.to(logoEl, {
          y: -12,
          rotation: 1.5,
          duration: 3.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0,
        })
      );
    }
    if (letterEl) {
      tweens.push(
        gsap.to(letterEl, {
          y: -10,
          rotation: -1.2,
          duration: 3.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.4,
        })
      );
    }
    return () => tweens.forEach((t) => t.kill());
  }, [user, assignedHouse]);

  if (loading || !user || ticketsLoading || !assignedHouse) {
    return (
      <div
        className="h-screen max-h-[100dvh] overflow-hidden flex items-center justify-center bg-black"
        style={{ background: OCX5_GRADIENT }}
      >
        <div className="text-white text-xl text-center px-4" style={{ fontFamily: "KK7HarryPotter, fantasy, serif" }}>
          {loading || !user ? "Đang tải..." : "Đang kiểm tra vé..."}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen max-h-[100dvh] w-full overflow-hidden flex flex-col text-white"
      style={{
        background: OCX5_GRADIENT,
        fontFamily: "KK7HarryPotter, WizardWorldSimplified, fantasy, serif",
      }}
    >
      <StarsBackground />

      {/* Nội dung lá thư — flex-1 để còn chỗ cho footer, lock scroll 1 màn */}
      <div ref={letterSectionRef} className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-3 py-0 overflow-hidden">
        <FloatingLightningElements
          containerRef={letterSectionRef}
          count={6}
          wrapperClassName="z-20"
          wrapperStyle={{ filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255,190,120,0.25))" }}
        />

        {/* Lá thư fit trong vùng còn lại (trên footer), giữ tỉ lệ */}
        <div
          ref={letterRef}
          className="relative h-full max-h-full w-full max-w-[min(420px,92vw)] flex-shrink-0"
          style={{
            filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.55))",
          }}
        >
          <Image
            src="/images/ocx5_images/letter/letter.png"
            alt=""
            fill
            className="object-contain object-center select-none pointer-events-none"
            sizes="(max-width: 480px) 92vw, 420px"
            priority
            aria-hidden
          />
          {/* Vùng nội dung gọn trong lá thư (giữa hai mép cuộn), overflow-visible để logo bay không bị cắt */}
          <div
            className="absolute inset-0 flex flex-col items-center overflow-visible p-[11%] pt-[20%] pb-[22%] sm:p-[12%] sm:pt-[18%] sm:pb-[24%]"
            aria-label="Nội dung thư mời"
          >
            {/* Logo — khoảng cách dưới logo đủ rộng để không đè lên đoạn thư */}
            <div
              ref={logoRef}
              className="flex-shrink-0 w-full flex justify-center mt-[100px] mb-2 sm:mb-4"
            >
              <div
                className="relative"
                style={{
                  filter: "brightness(1.05) drop-shadow(0 0 12px rgba(255,190,120,0.2))",
                }}
              >
                <Image
                  src="/images/ocx5_images/letter/ocx_logo_ss5_horizon_alt2.png"
                  alt="Ớt Cay Xè"
                  width={280}
                  height={112}
                  className="w-auto h-auto max-w-[85%] max-h-[10vh] object-contain mx-auto"
                  priority
                />
              </div>
            </div>
            {/* Đoạn thư — CSS animation: reveal từ trên xuống + mờ dần (blur → rõ) */}
            <div
              className={`flex-1 min-h-0 w-full flex flex-col justify-center overflow-hidden -translate-y-[24px] letter-reveal-wrapper ${fullText ? "letter-reveal-wrapper--active" : ""}`}
            >
              <p
                className={`text-[#2c1810] text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-wrap text-center overflow-hidden letter-reveal-text ${fullText ? "letter-reveal-text--active" : ""}`}
                style={{ fontFamily: "KK7HarryPotter, WizardWorldSimplified, fantasy, serif" }}
              >
                {fullText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer giống OCX5: Horizon + OCX5Footer */}
      <div className="relative flex-shrink-0 w-full">
        <HorizonBridge
          baseName="imgi_62_horizons_bridge"
          imageAlt="Magical Bridge Horizon"
          parallaxSpeed={0}
          position="flow"
          imageClassName="block h-auto w-full max-w-none transform origin-bottom md:scale-110"
        />
      </div>
    </div>
  );
}
