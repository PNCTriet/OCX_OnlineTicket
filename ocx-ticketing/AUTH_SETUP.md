# Auth Gateway – Hướng dẫn thiết lập đăng nhập cho quyech.com và otcayxe.com

Tài liệu này hướng dẫn cấu hình để 2 website đích (quyech.com, otcayxe.com) đăng nhập qua Auth Gateway (`auth.howlstudio.tech`) dùng Supabase, bao gồm flow tự động không cần thao tác trung gian.

## Kiến trúc tổng quan
- **Auth Gateway** (Next.js, Supabase JS): `https://auth.howlstudio.tech`
- **Website đích**:
  - `https://www.quyech.com`
  - `https://otcayxe.com`
- Luồng: Người dùng bấm “Đăng nhập” tại website đích → website chuyển hướng đến Gateway `/auth/start?redirect_to=...` → Gateway tự động mở Google OAuth → Provider trả về Gateway `/auth/callback` → Gateway tạo session → redirect lại website đích với `token`, `refresh_token`, `user_id` → Website đích set session bằng Supabase JS tại endpoint `/inject`.

## 1) Cấu hình Supabase
Vào Supabase Dashboard → Authentication → URL Configuration

- **Site URL**: `https://auth.howlstudio.tech`
- **Redirect URLs** (thêm ít nhất):
  - `https://auth.howlstudio.tech/auth/callback` (bắt buộc)
  - Nếu dùng flow inject ở quyech: `https://www.quyech.com/inject`
  - Nếu dùng flow inject ở otcayxe: `https://otcayxe.com/inject` (nếu cần)
- **Google OAuth Provider**: bật và cấu hình theo hướng dẫn của Supabase (OAuth consent, Client ID/Secret).

Lưu ý: Nếu đặt Site URL là domain khác (vd `otcayxe.com`), Supabase có thể fallback về domain đó, gây redirect sai. Hãy để Site URL = Auth Gateway.

## 2) Biến môi trường cho Auth Gateway (Vercel)
Vào Vercel → Project `auth-gateway` → Settings → Environment Variables. Thêm cho Preview/Production:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://<PROJECT>.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<SUPABASE_ANON_KEY>`
- `SUPABASE_URL` = `https://<PROJECT>.supabase.co`
- `SUPABASE_ANON_KEY` = `<SUPABASE_ANON_KEY>`

Sau khi thêm, Redeploy.

## 3) Routes của Auth Gateway
- `GET /auth/start` (`src/app/auth/start/page.tsx`)
  - Nhận `redirect_to` từ query; validate whitelist (quyech.com, otcayxe.com, localhost)
  - Tự động gọi `supabase.auth.signInWithOAuth` với `redirectTo` trỏ về `/auth/callback?redirect_to=...`
  - Dùng route này để bỏ qua thao tác chọn site và bấm nút Google ở gateway

- `GET /auth/callback` (`src/app/auth/callback/page.tsx`)
  - Nhận `code` từ nhà cung cấp qua Supabase
  - Gọi `exchangeCodeForSession(code)` để thiết lập session ở gateway
  - Đọc `redirect_to` từ query, rồi redirect về URL này kèm `token`, `refresh_token`, `user_id`

- `GET /inject` (`src/app/inject/page.tsx`)
  - Đọc `token`, `refresh_token`, `user_id` từ query
  - `supabase.auth.setSession({ access_token: token, refresh_token })`
  - Success → hiển thị thông báo/đóng tab hoặc tự redirect nếu muốn

- `GET /login` (`src/app/login/page.tsx`)
  - Trang test thủ công (tùy chọn): nhập `redirect_to` và bấm “Đăng nhập với Google”

- `GET /auth/logout` (đăng xuất tập trung trên Gateway)
  - Xoá session trên gateway bằng `supabase.auth.signOut()`
  - Hỗ trợ `redirect_to` (phải nằm trong whitelist) để quay về site gọi sau khi xoá session

## 4) Tích hợp tại quyech.com (khuyến nghị dùng /auth/start)
Khi người dùng bấm “Đăng nhập”, chuyển hướng thẳng đến:

- Link ví dụ (HTML):
  ```html
  <a href="https://auth.howlstudio.tech/auth/start?redirect_to=https%3A%2F%2Fwww.quyech.com%2Finject%3Fpost_login_redirect%3D%252Fticket">
    Đăng nhập
  </a>
  ```

- Hoặc bằng JS:
  ```js
  window.location.href = 'https://auth.howlstudio.tech/auth/start?redirect_to=' +
    encodeURIComponent('https://www.quyech.com/inject?post_login_redirect=%2Fticket')
  ```

Sau khi đăng nhập Google xong, gateway sẽ trả về `https://www.quyech.com/inject?...token=...&refresh_token=...&user_id=...`.
Tại `www.quyech.com`, tạo route `/inject` (client page) để:
- Parse query
- `supabase.auth.setSession({ access_token: token, refresh_token })`
- Đọc `post_login_redirect` để chuyển tiếp người dùng (vd `/ticket`)

Nếu bạn muốn giữ flow cũ (gọi OAuth trực tiếp từ quyech):
```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://auth.howlstudio.tech/auth/callback?redirect_to=' +
      encodeURIComponent('https://www.quyech.com/inject?post_login_redirect=%2Fticket')
  }
})
```

## 5) Tích hợp tại otcayxe.com (khuyến nghị dùng /auth/start)
Khi người dùng bấm “Đăng nhập”, chuyển hướng thẳng đến:

- Link ví dụ (HTML) về trang chủ:
  ```html
  <a href="https://auth.howlstudio.tech/auth/start?redirect_to=https%3A%2F%2Fotcayxe.com%2F">Đăng nhập</a>
  ```

- Hoặc dùng flow inject tương tự quyech:
  ```html
  <a href="https://auth.howlstudio.tech/auth/start?redirect_to=https%3A%2F%2Fotcayxe.com%2Finject%3Fpost_login_redirect%3D%252F">Đăng nhập</a>
  ```

Flow cũ (tùy chọn) gọi OAuth trực tiếp từ otcayxe:
```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://auth.howlstudio.tech/auth/callback?redirect_to=' +
      encodeURIComponent('https://otcayxe.com/')
  }
})
```

## 6) Whitelist domain trong Gateway
Trong `src/lib/supabase.ts`, mảng `ALLOWED_DOMAINS` gồm:
- `quyech.com`
- `otcayxe.com`
- `localhost:3000` (dev)

Có thể mở rộng nếu cần subdomain khác. Logic cho phép `hostname.endsWith('.' + domain)` để nhận cả subdomain.

## 7) Kiểm tra nhanh (test checklist)
1. Supabase Site URL = `https://auth.howlstudio.tech`.
2. Redirect URL có `https://auth.howlstudio.tech/auth/callback` (+ các inject URL nếu dùng inject).
3. Vercel đã set đủ 4 biến môi trường cho gateway.
4. Từ site đích, bấm “Đăng nhập” → chuyển hướng thẳng tới `/auth/start?redirect_to=...` trên gateway.
5. Sau đăng nhập Google, kiểm tra:
   - Gateway `/auth/callback` chuyển hướng về đúng `redirect_to`.
   - Website đích `/inject` set session thành công → chuyển tới trang mong muốn (vd `/ticket`).

## 8) Lỗi thường gặp & cách xử lý
- Sau đăng nhập bị đẩy về domain khác (vd `otcayxe.com`):
  - Nguyên nhân: Site URL Supabase không phải Auth Gateway → Supabase fallback.
  - Cách xử lý: Chỉnh Site URL = `https://auth.howlstudio.tech`.

- “Không tìm thấy phiên đăng nhập” ở `/auth/callback`:
  - Nguyên nhân: Thiếu `code` hoặc chưa `exchangeCodeForSession(code)`.
  - Cách xử lý: Đảm bảo callback gọi `exchangeCodeForSession` khi có `code` và Redirect URL chính xác.

- Build lỗi do thiếu env: thêm các biến môi trường như mục 2.

---

## 9) Đăng xuất (Logout)
Mục tiêu: xoá session ở CẢ website đích (local) và Gateway.

Khuyến nghị thứ tự:
1) Xoá session local ở site đích
```ts
await supabase.auth.signOut()
```
2) Chuyển hướng xoá session ở Gateway, sau đó quay về site đích
```js
window.location.href = 'https://auth.howlstudio.tech/auth/logout?redirect_to=' +
  encodeURIComponent(window.location.origin + '/logged-out')
```

Ví dụ tích hợp nút Logout tại quyech/otcayxe (client):
```tsx
const handleLogout = async () => {
  try {
    await supabase.auth.signOut(); // clear local session first
  } finally {
    window.location.href = 'https://auth.howlstudio.tech/auth/logout?redirect_to=' +
      encodeURIComponent(window.location.origin + '/logged-out');
  }
};
```

Lưu ý:
- `redirect_to` phải là URL đầy đủ (https) và thuộc whitelist (quyech.com/otcayxe.com/localhost).
- Có thể trỏ về `/` nếu không có trang `/logged-out`.
- Nếu chỉ xoá local mà quên gọi Gateway, người dùng sẽ còn session trên Gateway; lần sau có thể tự động đăng nhập lại khi quay vòng.
