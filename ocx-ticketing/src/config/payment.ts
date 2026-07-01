/** Thông tin TK nhận chuyển khoản (VietQR). */
export const PAYMENT_BANK = {
  /** Mã ngân hàng VietQR — ACB (Á Châu / ABC). */
  vietqrCode: "ACB",
  displayName: "ABC",
  accountNumber: "69692838",
  accountHolder: "Ớt Cay Xè",
} as const;

export function buildVietQrImageUrl(
  amount: number | string,
  addInfo: string
): string {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo,
    accountName: PAYMENT_BANK.accountHolder,
  });
  return `https://img.vietqr.io/image/${PAYMENT_BANK.vietqrCode}-${PAYMENT_BANK.accountNumber}-compact.png?${params.toString()}`;
}
