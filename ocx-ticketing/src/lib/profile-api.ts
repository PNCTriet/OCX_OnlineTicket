import { createClient } from "@/lib/supabase";

/** Response `GET /auth/me` (theo API_DOCUMENTATION.md). */
export type ApiMeUser = {
  id: string;
  supabase_id?: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string | null;
  fb?: string | null;
  avatar_url?: string | null;
};

export type ApiMeResponse = {
  user: ApiMeUser;
};

/** Một phần shape `GET /orders` — backend có thể bổ sung field. */
export type ApiOrderRow = {
  id: string;
  user_id: string;
  organization_id?: string;
  event_id?: string | null;
  total_amount: string | number;
  status: string;
  created_at: string;
  updated_at?: string;
  reserved_until?: string | null;
  event?: {
    id: string;
    title: string;
    location?: string | null;
    /** ISO — dùng để mở khóa hiển thị QR theo ngày diễn */
    start_date?: string | null;
    end_date?: string | null;
  } | null;
  organization?: { id: string; name: string } | null;
  order_items?: Array<{
    id: string;
    order_id?: string;
    ticket_id: string;
    quantity: number;
    price?: number | string;
    qr_code?: string | null;
    ticket?: { id: string; name: string; description?: string | null };
  }>;
};

export async function getSupabaseAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function fetchAuthMe(
  apiBase: string,
  accessToken: string
): Promise<ApiMeResponse> {
  const res = await fetch(`${apiBase.replace(/\/$/, "")}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`auth/me ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
  }
  return res.json() as Promise<ApiMeResponse>;
}

export async function fetchMyOrders(
  apiBase: string,
  accessToken: string
): Promise<ApiOrderRow[]> {
  const res = await fetch(`${apiBase.replace(/\/$/, "")}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`orders ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
  }
  return res.json() as Promise<ApiOrderRow[]>;
}

export function formatMoneyVnd(amount: string | number): string {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(n)) return String(amount);
  return `${n.toLocaleString("vi-VN")}₫`;
}

export function formatOrderDate(iso: string, locale: "vi" | "en"): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatEventWhen(
  startIso: string | null | undefined,
  locale: "vi" | "en"
): string {
  if (!startIso) return "—";
  try {
    const d = new Date(startIso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(locale === "vi" ? "vi-VN" : "en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function displayNameFromMe(user: ApiMeUser): string {
  const fn = (user.first_name ?? "").trim();
  const ln = (user.last_name ?? "").trim();
  const combined = [fn, ln].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  return user.email?.split("@")[0] ?? "User";
}

/** Chỉ giữ đơn thuộc tài khoản backend đang đăng nhập (tránh admin nhìn thấy toàn bộ đơn từ API). */
export function filterOrdersForAccount(
  orders: ApiOrderRow[],
  backendUserId: string | undefined
): ApiOrderRow[] {
  if (!backendUserId) return [];
  return orders.filter((o) => o.user_id === backendUserId);
}

/** Profile / vé: chỉ đơn đã thanh toán (PAID). */
export function filterPaidOrdersOnly(orders: ApiOrderRow[]): ApiOrderRow[] {
  return orders.filter((o) => o.status?.toUpperCase() === "PAID");
}

export type QrRevealPhase = "no_schedule" | "before" | "during" | "after";

/**
 * Mã QR chỉ "mở" trong cửa sổ ngày diễn: từ 00:00 ngày bắt đầu đến hết ngày kết thúc (theo giờ local).
 * Trước đó: before; sau đó: after; không có start_date: no_schedule.
 */
export function getQrRevealPhase(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  now = new Date()
): QrRevealPhase {
  if (!startIso) return "no_schedule";
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return "no_schedule";

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);

  let endBoundary: Date;
  if (endIso) {
    const end = new Date(endIso);
    if (!Number.isNaN(end.getTime())) {
      endBoundary = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
    } else {
      endBoundary = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999);
    }
  } else {
    endBoundary = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999);
  }

  if (now.getTime() < startDay.getTime()) return "before";
  if (now.getTime() > endBoundary.getTime()) return "after";
  return "during";
}
