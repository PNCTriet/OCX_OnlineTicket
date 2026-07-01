/** Mã loại vé từ DB → tên hiển thị trên UI. */
const TICKET_CODE_LABELS: Record<string, string> = {
  EB: "EARLY BIRD",
  LB: "LATE BIRD",
};

/** Đổi mã EB/LB (hoặc chuỗi chứa mã) sang tên đầy đủ. */
export function formatTicketDisplayName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  const upper = trimmed.toUpperCase();
  if (TICKET_CODE_LABELS[upper]) return TICKET_CODE_LABELS[upper];

  return trimmed
    .replace(/\bEB\b/gi, "EARLY BIRD")
    .replace(/\bLB\b/gi, "LATE BIRD");
}
