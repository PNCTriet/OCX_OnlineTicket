# 🎟️ UI Refactor Release Plan — Ticket Frontend

> **Nguyên tắc:** URL không đổi · API/logic không đổi · chỉ swap component · mỗi trang là 1 PR độc lập

---

## Phase 0 — Chuẩn bị

> Mục tiêu: có safety net trước khi động vào bất kỳ dòng UI nào

- [ ] Tạo branch `feat/ui-v2` từ `main`
- [ ] Snapshot lại toàn bộ flow quan trọng bằng test hoặc video recording
  - [ ] Flow: xem danh sách vé → chọn vé → checkout → confirm thanh toán
  - [ ] Flow: check trạng thái đơn hàng (polling / webhook)
- [ ] Setup staging environment (nếu chưa có)
- [ ] Tạo env var feature flag
  ```
  NEXT_PUBLIC_UI_V2=false
  ```
- [ ] Tạo thư mục `components/v2/` để chứa toàn bộ component mới
- [ ] Tạo file `lib/flags.ts` để quản lý feature flags tập trung

---

## Phase 1 — Build component mới song song

> Mục tiêu: UI mới hoàn chỉnh, chạy được, nhưng chưa ảnh hưởng production

### Shared layout & shell
- [ ] Build `components/v2/PageLayout.tsx` — layout wrapper mới
- [ ] Build `components/v2/Header.tsx`
- [ ] Build `components/v2/Footer.tsx`
- [ ] Review trên mobile (responsive check)

### Trang listing (danh sách vé)
- [ ] Build `components/v2/TicketList.tsx`
- [ ] Build `components/v2/TicketCard.tsx`
- [ ] Verify props nhận vào giống hệt component cũ (không đổi interface)

### Trang detail vé
- [ ] Build `components/v2/TicketDetail.tsx`
- [ ] Kiểm tra các trường dynamic: tên event, giá, ngày giờ, còn chỗ
- [ ] Verify SEO: `<Head>` title/description/OG tags render đúng

### Trang checkout
- [ ] Build `components/v2/CheckoutForm.tsx`
- [ ] **Không đổi** `onSubmit` handler — chỉ wrap UI bên ngoài
- [ ] **Không đổi** logic gọi API tạo order
- [ ] Kiểm tra form validation hiển thị đúng error message

### Trang confirm / success
- [ ] Build `components/v2/OrderConfirm.tsx`
- [ ] Kiểm tra `useEffect` poll order status vẫn mount đúng lifecycle
- [ ] Kiểm tra redirect sau thanh toán thành công không bị gián đoạn

---

## Phase 2 — Feature flag swap từng trang

> Mục tiêu: bật v2 từng trang trên staging, test kỹ trước khi lên production

### Pattern áp dụng cho mỗi trang

```tsx
// pages/checkout.tsx
import CheckoutOld from '@/components/checkout/CheckoutForm'
import CheckoutV2  from '@/components/v2/CheckoutForm'
import { isV2Enabled } from '@/lib/flags'

export default function CheckoutPage(props) {
  return isV2Enabled() ? <CheckoutV2 {...props} /> : <CheckoutOld {...props} />
}
```

### Thứ tự swap (ít rủi ro → cao rủi ro)

- [ ] **Trang listing** — swap + test trên staging
  - [ ] Hiển thị đúng danh sách vé
  - [ ] Filter/search hoạt động
  - [ ] Link sang trang detail đúng
- [ ] **Trang detail vé** — swap + test trên staging
  - [ ] Hiển thị đúng thông tin vé
  - [ ] Nút mua / chọn số lượng hoạt động
  - [ ] OG tags đúng khi share link
- [ ] **Trang checkout** — swap + test kỹ nhất
  - [ ] Submit form tạo order thành công
  - [ ] Hiển thị đúng lỗi validation
  - [ ] Redirect đến trang confirm sau khi thanh toán
- [ ] **Trang confirm/success** — swap + test
  - [ ] Hiển thị đúng thông tin đơn hàng
  - [ ] Polling status hoạt động (nếu có)
  - [ ] Không bị double-submit khi reload

---

## Phase 3 — Canary release production

> Mục tiêu: rollout dần, monitor, rollback ngay nếu có lỗi

- [ ] Deploy lên production với `NEXT_PUBLIC_UI_V2=false` (v2 vẫn tắt)
- [ ] Bật v2 cho **10% traffic** (cookie-based hoặc Vercel Edge Config)
  - [ ] Monitor: JS error rate
  - [ ] Monitor: payment callback success rate
  - [ ] Monitor: order completion rate
- [ ] Sau 24h ổn định → bật **50% traffic**
  - [ ] So sánh conversion rate v1 vs v2
- [ ] Sau 24h tiếp → bật **100% traffic**
  - [ ] Set `NEXT_PUBLIC_UI_V2=true` toàn bộ

> **Rollback procedure:** Đổi env var → redeploy Vercel (~30s) · Không cần revert code

---

## Phase 4 — Cleanup

> Mục tiêu: dọn dẹp sau khi v2 ổn định 100%

- [ ] Xoá toàn bộ component cũ trong `components/` (giữ lại `components/v2/`)
- [ ] Đổi tên `components/v2/` → `components/`
- [ ] Xoá feature flag khỏi tất cả page files
- [ ] Xoá file `lib/flags.ts`
- [ ] Xoá env var `NEXT_PUBLIC_UI_V2` khỏi tất cả môi trường
- [ ] Update README nếu có ghi chú về UI cũ
- [ ] Final smoke test toàn bộ flow thanh toán

---

## Checklist quan trọng trước mỗi PR

- [ ] URL không thay đổi
- [ ] API call không thay đổi (endpoint, payload, header)
- [ ] Logic tạo order / check thanh toán không bị wrap lại
- [ ] `<Head>` SEO vẫn render đúng
- [ ] Mobile responsive OK
- [ ] Không có console error mới
- [ ] Staging test pass trước khi merge

---

## Notes

- Mỗi trang là **1 PR riêng** — dễ review, dễ rollback granular
- Nếu dùng Vercel: có thể dùng **Preview Deployment** để test từng PR trước khi merge
- Ưu tiên test flow checkout trên **thiết bị thật** (mobile), không chỉ DevTools
