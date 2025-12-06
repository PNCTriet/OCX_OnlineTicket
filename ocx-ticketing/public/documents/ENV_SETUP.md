# 🔧 Environment Variables Setup

## 📝 Nội dung file .env.local

Tạo file `.env.local` trong thư mục gốc và thêm nội dung sau:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Resend Email Service Configuration
RESEND_API_KEY=re_your_actual_api_key_here
```

## 🔑 Cách lấy API Keys:

### Supabase Setup:
1. **Đăng ký tài khoản**: https://supabase.com
2. **Tạo dự án mới** với tên "OCX Ticketing"
3. **Vào Settings > API** trong Supabase Dashboard
4. **Copy Project URL** và **anon public key**

### Google OAuth Setup:
1. **Truy cập**: https://console.cloud.google.com
2. **Tạo OAuth 2.0 Client ID** cho web application
3. **Thêm redirect URI**: `https://your-project-ref.supabase.co/auth/v1/callback`
4. **Copy Client ID và Client Secret** vào Supabase Dashboard

### Resend Setup:
1. **Đăng ký tài khoản**: https://resend.com
2. **Đăng nhập** vào Dashboard
3. **Vào menu "API Keys"**
4. **Click "Create API Key"**
5. **Đặt tên**: "OCX4 Email Service"
6. **Copy API Key** (bắt đầu bằng `re_`)

## 📋 Ví dụ API Keys thật:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example
RESEND_API_KEY=re_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## ⚠️ Lưu ý quan trọng:
- **KHÔNG commit** file `.env.local` lên git
- **KHÔNG chia sẻ** API keys với người khác
- **Restart server** sau khi thêm environment variables
- **Test ngay** để đảm bảo hoạt động

## 🧪 Test sau khi setup:
1. Chạy: `npm run dev`
2. Vào trang checkout: `http://localhost:3000/checkout`
3. Kiểm tra redirect đến trang đăng nhập
4. Test đăng nhập với Google
5. Kiểm tra thông tin user được auto-fill
6. Test mua vé và gửi email

## 📚 Chi tiết setup:
- Xem file `SUPABASE_SETUP.md` để setup chi tiết Supabase
- Xem file `RESEND_SETUP.md` để setup chi tiết email service 