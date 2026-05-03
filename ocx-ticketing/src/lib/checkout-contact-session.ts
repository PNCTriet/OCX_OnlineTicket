/**
 * Lưu SĐT + Facebook đã nhập ở checkout vào sessionStorage (theo user id).
 * Refresh hoặc quay lại mua vé vẫn giữ — tab đóng là hết session.
 */

const keyFor = (userId: string) => `ocx.checkout.contact.${userId}`;

export type CheckoutContactCache = {
  phone: string;
  facebook: string;
};

export function loadCheckoutContact(userId: string): CheckoutContactCache | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = sessionStorage.getItem(keyFor(userId));
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const rec = o as Record<string, unknown>;
    const phone = typeof rec.phone === "string" ? rec.phone : "";
    const facebook = typeof rec.facebook === "string" ? rec.facebook : "";
    return { phone, facebook };
  } catch {
    return null;
  }
}

export function saveCheckoutContact(
  userId: string,
  phone: string,
  facebook: string
): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    sessionStorage.setItem(
      keyFor(userId),
      JSON.stringify({ phone, facebook })
    );
  } catch {
    // quota / private mode
  }
}
