export function isV2Enabled(): boolean {
  return process.env.NEXT_PUBLIC_UI_V2 === 'true';
}

/**
 * Tạm tắt: ẩn ô **mã giới thiệu** (CheckoutForm) và khối **mã giảm giá** (checkout).
 * Bật lại khi cần: đổi thành `true`.
 */
export const CHECKOUT_PROMO_ENABLED = false;
