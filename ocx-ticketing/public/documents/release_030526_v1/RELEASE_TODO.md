# UI v2 — Todo theo phase

> Cập nhật song song với `UI_RELEASE_PLAN.md`. Đường dẫn code: app Next.js trong `ocx-ticketing/`, components v2: `src/components/v2/`.  
> **Tham chiếu UI:** `Ticketing Platform.html` (cùng thư mục này).

---

## Phase 0 — Chuẩn bị

- [x] Branch `feat/ui-v2`
- [ ] Snapshot / video các flow quan trọng
  - [ ] Danh sách vé → chọn vé → checkout → confirm thanh toán
  - [ ] Check trạng thái đơn (polling / webhook)
- [ ] Staging (nếu cần)
- [ ] `NEXT_PUBLIC_UI_V2=false` trong env (thêm tay vào `.env.local` / deploy)
- [x] Thư mục `src/components/v2/`
- [x] `src/lib/flags.ts` (`isV2Enabled`)

---

## Phase 1 — Component v2

### Shell

- [x] `PageLayout.tsx`
- [x] `Header.tsx`
- [x] `Footer.tsx`
- [ ] Review mobile responsive (thiết bị thật hoặc DevTools)

### Listing

- [x] `TicketList.tsx`
- [x] `TicketCard.tsx`
- [ ] Xác nhận props đối chiếu `TicketSelectionCard` trên staging/preview

### Detail

- [x] `TicketDetail.tsx` (props giống `EventInfoCard`)
- [ ] Kiểm tra trường dynamic trên dữ liệu thật
- [ ] SEO: title / description / OG trên route (do `page.tsx`, không nằm trong component)

### Checkout

- [x] `CheckoutForm.tsx` (props giống `UserInfoForm`)
- [ ] Kiểm tra validation + error message trên browser

### Confirm / success

- [x] `OrderConfirm.tsx` (props giống `PaymentSuccessModal`)
- [ ] Xác nhận lifecycle redirect sau thanh toán khi đã swap trên page

---

## Phase 2 — Feature flag + swap từng trang

Bật giao diện v2: trong `ocx-ticketing/.env.local` đặt `NEXT_PUBLIC_UI_V2=true`, restart dev server.

- [x] **Listing + detail (trang `/ticket`)** — `TicketList`, `TicketDetail`, `PageLayout`, `Header`, `Footer`; `TicketList` dùng `requireSeatmapSelection={false}`.
- [x] **`/ticketocx5`** — cùng pattern: `StageMapCard` + map + `TicketList` (`requireSeatmapSelection={false}`) + `TicketDetail`; modals (zone, intro, trade) giữ nguyên; không còn gradient OCX5 / `HorizonBridge` khi v2.
- [x] **`/ticket-seatmap`** — `StageMapCard` + `TicketList` với `selectedZone` (bắt chọn khu) + `TicketDetail` + `OrderSummaryCard`.
- [x] **Checkout (`/checkout`)** — khi v2: `PageLayout` + `Header` v2 + `V2Footer` + cùng nội dung `main` (một `checkoutPageMain` dùng chung); khi tắt: gradient, `OCX5HeaderNav`, thanh user, `HorizonBridge`. Form / event card: `TicketDetail` / `CheckoutForm`.
- [x] **Confirm / success** — `PaymentModal` + `OrderConfirm` khi v2.

### Việc còn lại (QA)

- [ ] Test staging/preview toàn flow (đặc biệt `/ticketocx5` → checkout → QR)

---

## Phase 3 — Canary production

- [ ] (theo `UI_RELEASE_PLAN.md`)

---

## Phase 4 — Cleanup

- [ ] (theo `UI_RELEASE_PLAN.md`)

---

## Ghi chú

- `cursorrules` (repo root): nhắc một component / một PR; khi làm tiếp nên bám checklist trên và xác nhận với team trước khi đổi nhiều file một lượt.
