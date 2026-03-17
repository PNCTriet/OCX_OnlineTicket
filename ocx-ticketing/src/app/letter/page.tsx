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

const HOUSE_LOGO_BY_NAME: Record<string, string> = {
  Gryffindor: "/images/ocx5_images/letter/logo_gry.png",
  Hufflepuff: "/images/ocx5_images/letter/logo_huf.png",
  Ravenclaw: "/images/ocx5_images/letter/logo_rav.png",
  Slytherin: "/images/ocx5_images/letter/logo_sly.png",
};

const BTC_EMAILS = new Set<string>([
  "baongocforworks@gmail.com",
  "dinhhoanggialinh2603@gmail.com",
  "buithihuonggiang1802@gmail.com",
  "hao08072006@gmail.com",
  "ngohphuong3062@gmail.com",
  "maikhanh030405@gmail.com",
  "han.work142@gmail.com",
  "nhthule13082004@gmail.com",
  "nphanngochan0511@gmail.com",
  "nguyenhuy.rin@gmail.com",
  "dongnnh2112.work@gmail.com",
  "nguyenvinhanthy@gmail.com",
  "nguyenngocanhvu2809@gmail.com",
  "nhatthy3178@gmail.com",
  "nguyenngocnhubang.work@gmail.com",
  "nhienpham0906@gmail.com",
  "phanquynh0128@gmail.com",
  "quynhhanh0511@gmail.com",
  "lesontung280705@gmail.com",
  "nhan.work2302@gmail.com",
  "thanhthuy4917@gmail.com",
  "tranngocthuylinh06@gmail.com",
  "tngan2020@gmail.com",
  "otistrisstruongss@gmail.com",
  "trietcrt.pnc@gmail.com",
  "nhidinhthn19@gmail.com",
  "tdhaiyen.work@gmail.com",
]);

const BTC_GROUP_BY_EMAIL: Record<string, string> = {
  "baongocforworks@gmail.com": "",
  "dinhhoanggialinh2603@gmail.com": "Sponsor",
  "buithihuonggiang1802@gmail.com": "",
  "hao08072006@gmail.com": "",
  "ngohphuong3062@gmail.com": "",
  "maikhanh030405@gmail.com": "Media",
  "han.work142@gmail.com": "Media",
  "nhthule13082004@gmail.com": "Media",
  "nphanngochan0511@gmail.com": "Media",
  "nguyenhuy.rin@gmail.com": "Sân khấu",
  "dongnnh2112.work@gmail.com": "",
  "nguyenvinhanthy@gmail.com": "Media",
  "nguyenngocanhvu2809@gmail.com": "Sân khấu",
  "nhatthy3178@gmail.com": "",
  "nguyenngocnhubang.work@gmail.com": "Media",
  "nhienpham0906@gmail.com": "Sponsor",
  "phanquynh0128@gmail.com": "Media",
  "quynhhanh0511@gmail.com": "",
  "lesontung280705@gmail.com": "Sân khấu",
  "nhan.work2302@gmail.com": "Media",
  "thanhthuy4917@gmail.com": "Sân khấu",
  "tranngocthuylinh06@gmail.com": "Media",
  "tngan2020@gmail.com": "Website",
  "otistrisstruongss@gmail.com": "",
  "trietcrt.pnc@gmail.com": "",
  "nhidinhthn19@gmail.com": "",
  "tdhaiyen.work@gmail.com": "Sân khấu",
};

const HOUSE_LETTER_BY_NAME: Record<string, string> = {
  Gryffindor: "/images/ocx5_images/letter/GRY_letter.png",
  Hufflepuff: "/images/ocx5_images/letter/HUF_letter.png",
  Ravenclaw: "/images/ocx5_images/letter/RAV_letter.png",
  Slytherin: "/images/ocx5_images/letter/SLY_letter.png",
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

function invitationBTC(recipient: string, group: string | null): string {
  const groupLabel = group && group.trim().length > 0 ? group : "BTC";
  return `HỌC VIỆN ÂM NHẠC ỚT CAY XÈ

Gửi đến Phù thủy ${recipient}, Giáo viên tổ ${groupLabel} hắc ám

Học viện trân trọng thông báo rằng bạn đã chính thức được triệu tập vào Hội Đồng Phù Thủy, tham dự buổi khai giảng của Học viện Ớt Cay Xè, tại thánh địa Roller Rink, Thứ Bảy, ngày 18 tháng 04 năm 2026, lúc 15:00.

Tại đây, nhiệm vụ của các phù thủy sẽ bắt đầu: cùng nhau chuẩn bị và biến đêm nhạc Ớt Cay Xè trở thành một sự kiện huyền diệu nhất của năm.

Hẹn gặp các phù thủy tại Học viện.`;
}

export default function LetterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fullText, setFullText] = useState("");
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [assignedHouse, setAssignedHouse] = useState<string | null>(null);
  const [showCameraPrompt, setShowCameraPrompt] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showText, setShowText] = useState(false); // mặc định chưa hiện nội dung
  const [visibleCount, setVisibleCount] = useState(0);

  const logoRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const letterSectionRef = useRef<HTMLDivElement>(null);
  const houseLogoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraInstanceRef = useRef<{
    camera: any;
    hands: any;
    stream: MediaStream;
  } | null>(null);

  const recipientName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "Khách";

  const isBTC = !!(user?.email && BTC_EMAILS.has(user.email.toLowerCase()));
  const btcGroup =
    (user?.email && BTC_GROUP_BY_EMAIL[user.email.toLowerCase()]) || null;

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/auth/login?redirectTo=/letter");
      return;
    }

    if (user && !loading) {
      if (isBTC) {
        setShowCameraPrompt(false);
        setShowText(true);
      } else {
        setShowCameraPrompt(true);
      }
    }
  }, [user, loading, isBTC, router]);

  // Gọi API /orders/me/tickets — có vé thì lấy nhà sớm nhất, không vé thì về trang chủ
  useEffect(() => {
    if (!user) return;
    if (isBTC) {
      // BTC không cần fetch vé
      setTicketsLoading(false);
      return;
    }

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
          if (!cancelled) {
            setAssignedHouse("Gryffindor");
            setTicketsLoading(false);
          }
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
          if (!cancelled) {
            setAssignedHouse("Gryffindor");
            setTicketsLoading(false);
          }
          return;
        }

        const data: OrdersMeTicketsResponse = await res.json();
        const items = data?.items ?? [];

        if (items.length === 0) {
          if (!cancelled) {
            setAssignedHouse("Gryffindor");
            setTicketsLoading(false);
          }
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
          if (!cancelled) {
            setAssignedHouse("Gryffindor");
          }
          return;
        }

        if (!cancelled) setAssignedHouse(houseName);
      } catch {
        if (!cancelled) {
          setAssignedHouse("Gryffindor");
        }
      } finally {
        if (!cancelled) setTicketsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, isBTC, router]);

  // Nội dung thư — set ngay khi có user; BTC dùng thư riêng, còn lại theo house (fallback Gryffindor)
  useEffect(() => {
    if (!user) return;
    let text: string;
    if (isBTC) {
      text = invitationBTC(recipientName, btcGroup);
    } else {
      const effectiveHouse = assignedHouse ?? "Gryffindor";
      text = invitationByHouse(recipientName, effectiveHouse);
    }
    setFullText(text);
    // reset visible text khi đổi nội dung
    setVisibleCount(0);
  }, [user, assignedHouse, isBTC]); // eslint-disable-line react-hooks/exhaustive-deps -- recipientName từ closure

  // Hiệu ứng chữ gõ từng ký tự trước đây tạm tắt — fade in/out điều khiển qua CSS + showText
  useEffect(() => {
    return;
  }, [showText, fullText]);

  // Khởi động camera + hand tracking: dơ tay (mở 5 ngón) ẩn chữ, nắm tay hiện chữ
  // startCamera chỉ bật cờ, logic khởi tạo thực tế chạy trong useEffect phụ thuộc cameraActive
  const startCamera = () => {
    setCameraActive(true);
    setShowCameraPrompt(false);
  };

  // Init camera + MediaPipe Hands sau khi React đã render video element
  useEffect(() => {
    if (!cameraActive || !videoRef.current || cameraInstanceRef.current) return;

    let cancelled = false;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });

        if (!videoRef.current || cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const handsModule = await import("@mediapipe/hands");
        const cameraUtils = await import("@mediapipe/camera_utils");

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const Hands = (handsModule as any).Hands;
        const Camera = (cameraUtils as any).Camera;

        const hands = new Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results: any) => {
          const landmarks = results.multiHandLandmarks?.[0];
          if (!landmarks) {
            // Không thấy tay: luôn ẩn chữ
            setShowText(false);
            return;
          }

          // Đếm ngón duỗi: 4 ngón tay + ngón cái (dùng trục Y cho độ ổn định tốt hơn)
          const tipIds = [8, 12, 16, 20];
          let extended = 0;

          tipIds.forEach((tip) => {
            const tipY = landmarks[tip].y;
            const pipY = landmarks[tip - 2].y;
            if (tipY < pipY) extended += 1;
          });

          const thumbExtended = landmarks[4].y < landmarks[2].y;
          if (thumbExtended) extended += 1;

          if (extended >= 4) {
            // Dơ tay (nhiều ngón duỗi) → ẩn chữ
            setShowText(false);
          } else if (extended <= 1) {
            // Nắm tay (rất ít ngón duỗi) → hiện chữ
            setShowText(true);
          }
        });

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && !cancelled) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        camera.start();
        cameraInstanceRef.current = { camera, hands, stream };
      } catch {
        if (!cancelled) {
          setCameraActive(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [cameraActive]);

  // Dọn dẹp camera khi rời trang
  useEffect(() => {
    return () => {
      const inst = cameraInstanceRef.current;
      if (inst?.camera) inst.camera.stop();
      if (inst?.hands) inst.hands.close();
      if (inst?.stream) {
        inst.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      cameraInstanceRef.current = null;
    };
  }, []);

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
    const houseLogoEl = houseLogoRef.current;

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
    if (houseLogoEl) {
      tweens.push(
        gsap.to(houseLogoEl, {
          y: -6,
          rotation: -2,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.6,
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

  if (loading || !user) {
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

  const effectiveHouse = assignedHouse ?? "Gryffindor";
  const letterBackgroundSrc =
    (effectiveHouse && HOUSE_LETTER_BY_NAME[effectiveHouse]) ||
    "/images/ocx5_images/letter/letter.png";

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
      <div
        ref={letterSectionRef}
        className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-3 py-2 overflow-hidden w-full"
      >
        <FloatingLightningElements
          containerRef={letterSectionRef}
          count={6}
          wrapperClassName="z-20"
          wrapperStyle={{ filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255,190,120,0.25))" }}
        />

        {/* Lá thư fit trong vùng còn lại (trên footer), giữ tỉ lệ */}
        <div
          ref={letterRef}
          className="relative w-full"
          style={{
            width: "min(420px, 92vw, calc((100dvh - 80px) * 1414 / 2000))",
            aspectRatio: "1414 / 2000",
            filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.55))",
          }}
        >
          <Image
            src={letterBackgroundSrc}
            alt=""
            fill
            className="object-contain object-center select-none pointer-events-none"
            sizes="(max-width: 480px) 92vw, 420px"
            priority
            aria-hidden
          />
          {/* Vùng nội dung gọn trong lá thư (giữa hai mép cuộn), overflow-visible để logo bay không bị cắt */}
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{
              paddingTop: "20%",
              paddingBottom: "18%",
              paddingLeft: "12%",
              paddingRight: "12%",
              overflow: "visible",
            }}
            aria-label="Nội dung thư mời"
          >
            {/* Logo — khoảng cách dưới logo đủ rộng để không đè lên đoạn thư */}
            <div ref={logoRef} className="flex-shrink-0 w-full flex justify-center mb-[4%]">
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
            {/* Đoạn thư — fade in/out theo chiều dọc, điều khiển bằng showText */}
            <div
              className={`flex-1 w-full flex flex-col justify-center overflow-hidden letter-reveal-wrapper ${
                showText ? "letter-reveal-wrapper--active" : ""
              }`}
            >
              <p
                className={`text-[#2c1810] text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-wrap text-center overflow-hidden letter-reveal-text ${
                  showText ? "letter-reveal-text--active" : ""
                }`}
                style={{ fontFamily: "KK7HarryPotter, WizardWorldSimplified, fantasy, serif" }}
              >
                {showText ? fullText : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup xin quyền mở camera */}
      {showCameraPrompt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-semibold">Mở camera để nhận thư mời ma thuật?</h3>
            <p className="text-sm text-zinc-300">
              Trang này dùng camera để nhận diện cử chỉ tay: khi dơ tay chữ sẽ biến mất, khi nắm tay chữ sẽ hiện dần ra.
            </p>
            <div className="flex gap-3 justify-center mt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-zinc-700 text-sm hover:bg-zinc-600"
                onClick={() => {
                  setShowCameraPrompt(false);
                  setShowText(true);
                }}
              >
                Để sau
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#d43922] text-sm font-semibold hover:bg-[#b9321d]"
                onClick={startCamera}
              >
                Cho phép camera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ô camera nhỏ — luôn mount video, dùng CSS để show/hide để đảm bảo ref luôn sẵn sàng */}
      <div
        className={`fixed bottom-4 right-4 z-[110] transition-opacity duration-200 ${
          cameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/70 border border-white/15 rounded-xl overflow-hidden shadow-lg w-32 h-24 sm:w-40 sm:h-28 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
        </div>
      </div>
    </div>
  );
}
