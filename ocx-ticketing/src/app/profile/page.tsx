"use client";

/**
 * Profile — layout theo Ticketing Platform.html (#profile).
 * Dữ liệu: GET /auth/me + GET /orders (JWT) khi có NEXT_PUBLIC_API_BASE_URL.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Calendar, Lock, MapPin, X } from "lucide-react";
import { OnyxIcon } from "@/components/ui/OnyxIcon";
import {
  type ApiMeUser,
  type ApiOrderRow,
  type QrRevealPhase,
  displayNameFromMe,
  fetchAuthMe,
  fetchMyOrders,
  filterOrdersForAccount,
  filterPaidOrdersOnly,
  formatEventWhen,
  formatMoneyVnd,
  formatOrderDate,
  getQrRevealPhase,
  getSupabaseAccessToken,
} from "@/lib/profile-api";

type Lang = "vi" | "en";

type NavId = "upcoming" | "past" | "orders";

const NAV: { id: NavId; vi: string; en: string }[] = [
  { id: "upcoming", vi: "Sắp tới", en: "Upcoming" },
  { id: "past", vi: "Vé đã qua", en: "Past tickets" },
  { id: "orders", vi: "Lịch sử đơn hàng", en: "Order history" },
];

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isPaid(o: ApiOrderRow) {
  return o.status?.toUpperCase() === "PAID";
}

function isUpcomingOrder(o: ApiOrderRow): boolean {
  if (!isPaid(o)) return false;
  const start = o.event?.start_date;
  if (!start) return true;
  const t = new Date(start).getTime();
  if (Number.isNaN(t)) return true;
  return t >= startOfToday().getTime();
}

function isPastOrder(o: ApiOrderRow): boolean {
  if (!isPaid(o)) return false;
  const start = o.event?.start_date;
  if (!start) return false;
  const t = new Date(start).getTime();
  if (Number.isNaN(t)) return false;
  return t < startOfToday().getTime();
}

function sortOrdersByCreatedDesc(list: ApiOrderRow[]): ApiOrderRow[] {
  return [...list].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/** Profile chỉ còn đơn PAID — luôn hiển thị nhãn Paid. */
function paidOrderBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-[#34D39914] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[#34D399]">
      Paid
    </span>
  );
}

function badgeSuccess(label: string) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-[#34D39914] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[#34D399]">
      {label}
    </span>
  );
}

function badgeNeutral(label: string) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#262626] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
      {label}
    </span>
  );
}

function badgePrimary(label: string) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-[#FF6B1A1F] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[#FF6B1A]">
      {label}
    </span>
  );
}

function memberYear(createdAt?: string): string {
  if (!createdAt) return new Date().getFullYear().toString();
  try {
    return String(new Date(createdAt).getFullYear());
  } catch {
    return new Date().getFullYear().toString();
  }
}

function formatLocalDayRange(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  lang: Lang
): string {
  if (!startIso) return "—";
  try {
    const s = new Date(startIso);
    if (Number.isNaN(s.getTime())) return "—";
    const opt: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const loc = lang === "vi" ? "vi-VN" : "en-GB";
    if (endIso) {
      const e = new Date(endIso);
      if (!Number.isNaN(e.getTime())) {
        const sameDay =
          s.getFullYear() === e.getFullYear() &&
          s.getMonth() === e.getMonth() &&
          s.getDate() === e.getDate();
        if (sameDay) return s.toLocaleDateString(loc, opt);
        return `${s.toLocaleDateString(loc, opt)} – ${e.toLocaleDateString(loc, opt)}`;
      }
    }
    return s.toLocaleDateString(loc, opt);
  } catch {
    return "—";
  }
}

function qrModalCopy(
  phase: QrRevealPhase,
  lang: Lang,
  dayRange: string
): { title: string; body: string } {
  const vi = {
    no_schedule: {
      title: "Chưa mở mã vé",
      body: "Sự kiện chưa có lịch diễn cụ thể. Khi có ngày giờ, mã QR chỉ hiển thị trong ngày diễn ra.",
    },
    before: {
      title: "Mã vé đang khóa",
      body: `Mã QR chỉ hiển thị trong thời gian diễn ra chương trình (${dayRange}). Hôm nay chưa tới ngày mở mã.`,
    },
    during: {
      title: "Mã vé của bạn",
      body: "Quét mã tại cổng vào. Giữ bí mật mã trên màn hình.",
    },
    after: {
      title: "Sự kiện đã diễn ra",
      body: "Buổi diễn đã kết thúc. Mã QR không còn dùng để vào cổng.",
    },
  };
  const en = {
    no_schedule: {
      title: "Ticket code locked",
      body: "This event has no performance schedule yet. When dates are set, the QR will only appear during show dates.",
    },
    before: {
      title: "Ticket code locked",
      body: `The QR is only available during the show window (${dayRange}). It is not unlocked yet.`,
    },
    during: {
      title: "Your ticket",
      body: "Scan at the entrance. Do not share this code.",
    },
    after: {
      title: "Show has ended",
      body: "This performance is over. The QR is no longer valid for entry.",
    },
  };
  const pack = lang === "vi" ? vi : en;
  return pack[phase];
}

function TicketQrModal({
  lang,
  orderTitle,
  startDate,
  endDate,
  qrUrl,
  onClose,
}: {
  lang: Lang;
  orderTitle: string;
  startDate?: string | null;
  endDate?: string | null;
  qrUrl: string | null;
  onClose: () => void;
}) {
  const phase = getQrRevealPhase(startDate, endDate);
  const dayRange = formatLocalDayRange(startDate, endDate, lang);
  const copy = qrModalCopy(phase, lang, dayRange);
  const showRealQr =
    phase === "during" && qrUrl && (qrUrl.startsWith("http") || qrUrl.startsWith("/"));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-qr-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#262626] bg-[#141414] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 id="ticket-qr-title" className="text-lg font-semibold text-[#FAFAFA]">
            {copy.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] text-[#FAFAFA] hover:bg-[#262626]"
            aria-label={lang === "vi" ? "Đóng" : "Close"}
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
        {orderTitle ? (
          <p className="mb-3 text-sm font-medium text-[#FAFAFA]">{orderTitle}</p>
        ) : null}
        <p className="text-sm leading-relaxed text-[#A1A1A1]">{copy.body}</p>

        {showRealQr ? (
          <div className="mt-6 flex justify-center rounded-lg border border-[#262626] bg-[#0A0A0A] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="" className="max-h-[240px] w-full max-w-[240px] object-contain" />
          </div>
        ) : phase === "during" ? (
          <div className="mt-6 rounded-lg border border-[#262626] bg-[#0F0F0F] px-4 py-6 text-center text-sm text-[#737373]">
            {lang === "vi"
              ? "Chưa có ảnh QR từ hệ thống cho vé này."
              : "No QR image is available for this ticket yet."}
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <LockedQrVisual size={160} />
          </div>
        )}
      </div>
    </div>
  );
}

function LockedQrVisual({ size = 88 }: { size?: number }) {
  const s = `${size}px`;
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg border border-[#262626] bg-[#0A0A0A]"
      style={{ width: s, height: s }}
    >
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background:
            "repeating-conic-gradient(#FAFAFA 0 25%, #0A0A0A 0 50%) 0 0 / 8px 8px",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 grid place-items-center bg-[#0A0A0A]/80">
        <Lock className="size-[28px] text-[#FAFAFA]" strokeWidth={1.75} aria-hidden />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("vi");
  const [activeNav, setActiveNav] = useState<NavId>("upcoming");
  const [meUser, setMeUser] = useState<ApiMeUser | null>(null);
  const [orders, setOrders] = useState<ApiOrderRow[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [apiMissing, setApiMissing] = useState(false);
  const [qrModal, setQrModal] = useState<{
    order: ApiOrderRow;
    qrUrl: string | null;
  } | null>(null);

  const upcomingRef = useRef<HTMLDivElement | null>(null);
  const pastRef = useRef<HTMLDivElement | null>(null);
  const ordersRef = useRef<HTMLDivElement | null>(null);

  const loadProfileData = useCallback(async () => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
    if (!api) {
      setApiMissing(true);
      setProfileError(null);
      setMeUser(null);
      setOrders([]);
      setProfileLoading(false);
      return;
    }
    setApiMissing(false);
    setProfileLoading(true);
    setProfileError(null);
    try {
      const token = await getSupabaseAccessToken();
      if (!token) {
        setProfileError("Không có phiên đăng nhập. Vui lòng đăng nhập lại.");
        setMeUser(null);
        setOrders([]);
        setProfileLoading(false);
        return;
      }
      const [meJson, ordersJson] = await Promise.all([
        fetchAuthMe(api, token),
        fetchMyOrders(api, token),
      ]);
      setMeUser(meJson.user);
      const raw = Array.isArray(ordersJson) ? ordersJson : [];
      const mine = filterPaidOrdersOnly(filterOrdersForAccount(raw, meJson.user?.id));
      setOrders(sortOrdersByCreatedDesc(mine));
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Không tải được dữ liệu profile.");
      setMeUser(null);
      setOrders([]);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth/login?redirectTo=/profile");
      return;
    }
    void loadProfileData();
  }, [user, authLoading, router, loadProfileData]);

  const displayName = useMemo(() => {
    if (meUser) return displayNameFromMe(meUser);
    if (!user) return "";
    return (
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      user.email?.split("@")[0] ||
      "User"
    );
  }, [meUser, user]);

  const email = meUser?.email ?? user?.email ?? "";

  const welcomeFirst = useMemo(() => {
    const fn = (meUser?.first_name ?? "").trim();
    if (fn) return fn;
    const parts = displayName.trim().split(/\s+/);
    return parts.length > 1 ? parts[parts.length - 1]! : parts[0]!;
  }, [meUser, displayName]);

  const avatarLetter = useMemo(() => {
    const ch =
      displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?";
    return ch;
  }, [displayName, user?.email]);

  const avatarSrc =
    (meUser?.avatar_url as string | undefined) ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    null;

  const upcomingOrders = useMemo(
    () => orders.filter(isUpcomingOrder),
    [orders]
  );
  const pastOrders = useMemo(() => orders.filter(isPastOrder), [orders]);

  const upcomingStats = useMemo(() => {
    const qty = upcomingOrders.reduce(
      (n, o) => n + (o.order_items?.reduce((s, it) => s + (it.quantity ?? 0), 0) ?? 0),
      0
    );
    const events = new Set(
      upcomingOrders.map((o) => o.event?.id).filter(Boolean)
    ).size;
    return { qty, events };
  }, [upcomingOrders]);

  const headerActions = (
    <button
      type="button"
      onClick={() => signOut()}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
    >
      {lang === "vi" ? "Đăng xuất" : "Sign out"}
    </button>
  );

  const navItems = [
    { href: "/community", label: lang === "vi" ? "Trợ giúp" : "Help" },
    { href: "/profile", label: lang === "vi" ? "Vé của tôi" : "My tickets", active: true },
  ];

  const scrollNav = (id: NavId) => {
    setActiveNav(id);
    const map: Record<NavId, RefObject<HTMLDivElement | null>> = {
      upcoming: upcomingRef,
      past: pastRef,
      orders: ordersRef,
    };
    map[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (authLoading || !user) {
    return (
      <PageLayout>
        <Header
          lang={lang}
          onLangChange={setLang}
          navItems={navItems.map((i) => ({ ...i, active: false }))}
          actions={<span className="text-sm text-[#737373]">{lang === "vi" ? "Đang tải..." : "Loading..."}</span>}
        />
        <div className="flex min-h-[40vh] items-center justify-center text-[#FAFAFA]">
          {lang === "vi" ? "Đang tải..." : "Loading..."}
        </div>
        <V2Footer />
      </PageLayout>
    );
  }

  const t = lang === "vi";
  const locale: "vi" | "en" = t ? "vi" : "en";
  const roleUpper = (meUser?.role ?? "USER").toUpperCase();
  const showProBadge =
    roleUpper.includes("ADMIN") ||
    roleUpper.includes("OWNER") ||
    roleUpper.includes("SUPER");

  return (
    <PageLayout>
      <Header lang={lang} onLangChange={setLang} navItems={navItems} actions={headerActions} />

      <main className="mx-auto max-w-[1280px] px-6">
        <div className="pt-8">
          <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-[#737373]">
            {t ? "Hồ sơ / Vé của tôi" : "Profile / My tickets"}
          </h2>
          <h3 className="mb-8 text-[32px] font-semibold leading-[1.15] tracking-[-0.7px] text-[#FAFAFA]">
            {t ? `Chào mừng trở lại, ${welcomeFirst}` : `Welcome back, ${welcomeFirst}`}
          </h3>
        </div>

        {apiMissing && (
          <div className="mb-6 rounded-lg border border-[#FBBF2440] bg-[#FBBF2414] px-4 py-3 text-sm text-[#FBBF24]">
            {t
              ? "Chưa cấu hình NEXT_PUBLIC_API_BASE_URL — không thể tải /auth/me và /orders."
              : "NEXT_PUBLIC_API_BASE_URL is not set — cannot load /auth/me and /orders."}
          </div>
        )}

        {profileError && !apiMissing && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F8717140] bg-[#F8717114] px-4 py-3 text-sm text-[#F87171]">
            <span>{profileError}</span>
            <button
              type="button"
              onClick={() => void loadProfileData()}
              className="shrink-0 rounded-lg border border-[#262626] bg-[#212121] px-3 py-1.5 text-xs font-medium text-[#FAFAFA] hover:bg-[#262626]"
            >
              {t ? "Thử lại" : "Retry"}
            </button>
          </div>
        )}

        <section className="pb-16">
          <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-[280px_1fr]">
            <aside className="flex flex-col gap-2">
              <div className="grid size-24 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF6B1A] to-[#6B1A00] text-[36px] font-semibold text-[#0A0A0A]">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt="" className="size-full object-cover" />
                ) : (
                  avatarLetter
                )}
              </div>
              <div className="mt-4 text-[20px] font-semibold leading-[1.3] tracking-[-0.3px] text-[#FAFAFA]">
                {displayName}
              </div>
              <div className="text-[13px] leading-[1.45] text-[#A1A1A1]">{email}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {showProBadge && badgePrimary("Pro")}
                {badgeNeutral(
                  t ? `Thành viên · ${memberYear(meUser?.created_at)}` : `Member · ${memberYear(meUser?.created_at)}`
                )}
              </div>

              <nav className="mt-4 flex flex-col gap-1" aria-label="Profile">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollNav(item.id)}
                    className={[
                      "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeNav === item.id
                        ? "bg-[#1A1A1A] text-[#FAFAFA]"
                        : "text-[#A1A1A1] hover:bg-[#141414] hover:text-[#FAFAFA]",
                    ].join(" ")}
                  >
                    {t ? item.vi : item.en}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex min-w-0 flex-col gap-8">
              {profileLoading && (
                <p className="text-sm text-[#A1A1A1]">{t ? "Đang tải dữ liệu…" : "Loading data…"}</p>
              )}

              <div ref={upcomingRef} className="scroll-mt-24">
                <section id="profile-upcoming">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.7px] text-[#FAFAFA]">
                        {t ? "Sự kiện sắp tới" : "Upcoming events"}
                      </h2>
                      <p className="mt-1 text-[15px] text-[#A1A1A1]">
                        {upcomingOrders.length === 0 && !profileLoading
                          ? t
                            ? "Chưa có vé đã thanh toán cho sự kiện sắp tới."
                            : "No paid tickets for upcoming events yet."
                          : t
                            ? `${upcomingStats.qty} vé · ${upcomingStats.events} sự kiện`
                            : `${upcomingStats.qty} tickets · ${upcomingStats.events} events`}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled
                      title={t ? "Cần API lịch (ICS) từ server" : "Requires server-side ICS export"}
                      className="cursor-not-allowed text-sm text-[#525252]"
                    >
                      Export ICS →
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {upcomingOrders.map((o) => {
                      const firstItem = o.order_items?.[0];
                      const zone = firstItem?.ticket?.name ?? "—";
                      const qr = firstItem?.qr_code?.trim() || null;
                      const when = formatEventWhen(o.event?.start_date ?? null, locale);
                      const loc = o.event?.location ?? "—";
                      const openQrModal = () =>
                        setQrModal({
                          order: o,
                          qrUrl: qr,
                        });
                      return (
                        <article
                          key={o.id}
                          className="grid grid-cols-1 items-center gap-6 rounded-xl border border-[#262626] bg-[#141414] p-5 md:grid-cols-[1fr_96px]"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              {badgeSuccess("Confirmed")}
                              {badgeNeutral(zone)}
                            </div>
                            <h4 className="text-base font-semibold tracking-[-0.2px] text-[#FAFAFA]">
                              {o.event?.title ?? (t ? "Sự kiện" : "Event")}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#A1A1A1]">
                              <span className="inline-flex items-center gap-2">
                                <OnyxIcon icon={Calendar} size={16} />
                                {when}
                              </span>
                              <span className="inline-flex min-w-0 items-center gap-2">
                                <OnyxIcon icon={MapPin} size={16} className="shrink-0" />
                                <span className="truncate">{loc}</span>
                              </span>
                              <span className="inline-flex items-center gap-2 font-mono text-[#737373]">
                                #{o.id.slice(0, 8)}
                              </span>
                            </div>
                            <p className="text-xs text-[#525252]">
                              {t
                                ? "Mã QR chỉ hiển thị thật trong ngày diễn — còn lại chỉ xem giao diện khóa."
                                : "The real QR only appears during show dates — otherwise you see a locked preview."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={openQrModal}
                                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#212121]"
                              >
                                {t ? "Xem vé" : "View ticket"}
                              </button>
                              <button
                                type="button"
                                disabled
                                className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg bg-transparent px-4 text-sm font-medium text-[#525252]"
                              >
                                {t ? "Tải PDF" : "Download PDF"}
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={openQrModal}
                            className="mx-auto shrink-0 cursor-pointer rounded-lg border border-[#262626] bg-transparent p-0 md:mx-0"
                            aria-label={t ? "Mở thông tin mã vé" : "Open ticket code"}
                          >
                            <LockedQrVisual size={88} />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div ref={pastRef} className="scroll-mt-24">
                <section id="profile-past">
                  <h2 className="mb-4 text-[24px] font-semibold tracking-tight text-[#FAFAFA]">
                    {t ? "Vé đã qua" : "Past tickets"}
                  </h2>
                  {pastOrders.length === 0 && !profileLoading ? (
                    <p className="text-sm text-[#737373]">
                      {t ? "Chưa có vé PAID cho sự kiện đã diễn." : "No paid tickets for past events yet."}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {pastOrders.map((o) => {
                        const firstItem = o.order_items?.[0];
                        const zone = firstItem?.ticket?.name ?? "—";
                        const qr = firstItem?.qr_code?.trim() || null;
                        const when = formatEventWhen(o.event?.start_date ?? null, locale);
                        const loc = o.event?.location ?? "—";
                        return (
                          <article
                            key={`past-${o.id}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setQrModal({ order: o, qrUrl: qr })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setQrModal({ order: o, qrUrl: qr });
                              }
                            }}
                            className="cursor-pointer rounded-xl border border-[#262626] bg-[#141414] p-5 opacity-90 transition-colors hover:border-[#333333]"
                          >
                            <div className="flex flex-wrap gap-2">
                              {paidOrderBadge()}
                              {badgeNeutral(zone)}
                            </div>
                            <h4 className="mt-2 text-base font-semibold text-[#FAFAFA]">
                              {o.event?.title ?? o.id}
                            </h4>
                            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#A1A1A1]">
                              <span className="inline-flex items-center gap-2">
                                <OnyxIcon icon={Calendar} size={16} />
                                {when}
                              </span>
                              <span className="inline-flex min-w-0 items-center gap-2">
                                <OnyxIcon icon={MapPin} size={16} className="shrink-0" />
                                <span className="truncate">{loc}</span>
                              </span>
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              <div ref={ordersRef} className="scroll-mt-24">
                <section id="profile-orders">
                  <h2 className="mb-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.7px] text-[#FAFAFA]">
                    {t ? "Lịch sử đơn hàng" : "Order history"}
                  </h2>
                  <div className="overflow-x-auto overflow-hidden rounded-xl border border-[#262626] bg-[#0F0F0F]">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[#262626] bg-[#141414]">
                          <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                            {t ? "Đơn" : "Order"}
                          </th>
                          <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                            {t ? "Sự kiện" : "Event"}
                          </th>
                          <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                            {t ? "Ngày" : "Date"}
                          </th>
                          <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                            {t ? "Tổng" : "Total"}
                          </th>
                          <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                            {t ? "Trạng thái" : "Status"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 && !profileLoading ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#737373]">
                              {t ? "Chưa có đơn đã thanh toán (PAID)." : "No paid orders yet."}
                            </td>
                          </tr>
                        ) : (
                          orders.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-[#262626] text-sm text-[#FAFAFA] transition-colors last:border-b-0 hover:bg-[#141414]"
                            >
                              <td className="px-4 py-3.5 font-mono text-sm">{row.id}</td>
                              <td className="max-w-[220px] truncate px-4 py-3.5">
                                {row.event?.title ?? "—"}
                              </td>
                              <td className="px-4 py-3.5 font-mono text-sm">
                                {formatOrderDate(row.created_at, locale)}
                              </td>
                              <td className="px-4 py-3.5 font-mono text-sm">
                                {formatMoneyVnd(row.total_amount)}
                              </td>
                              <td className="px-4 py-3.5">{paidOrderBadge()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      {qrModal ? (
        <TicketQrModal
          lang={lang}
          orderTitle={qrModal.order.event?.title ?? ""}
          startDate={qrModal.order.event?.start_date}
          endDate={qrModal.order.event?.end_date}
          qrUrl={qrModal.qrUrl}
          onClose={() => setQrModal(null)}
        />
      ) : null}

      <V2Footer />
    </PageLayout>
  );
}
