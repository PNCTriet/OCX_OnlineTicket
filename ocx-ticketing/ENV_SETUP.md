# 🔧 Environment Variables Setup

## 📝 Nội dung file .env.local

Tạo file `.env.local` trong thư mục gốc và thêm nội dung sau:

```env
# Resend Email Service Configuration
RESEND_API_KEY=re_your_actual_api_key_here
```

## 🔑 Cách lấy API Key từ Resend:

1. **Đăng ký tài khoản**: https://resend.com
2. **Đăng nhập** vào Dashboard
3. **Vào menu "API Keys"**
4. **Click "Create API Key"**
5. **Đặt tên**: "OCX4 Email Service"
6. **Copy API Key** (bắt đầu bằng `re_`)

## 📋 Ví dụ API Key thật:
```env
RESEND_API_KEY=re_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## ⚠️ Lưu ý quan trọng:
- **KHÔNG commit** file `.env.local` lên git
- **KHÔNG chia sẻ** API key với người khác
- **Restart server** sau khi thêm API key
- **Test ngay** để đảm bảo hoạt động

## 🧪 Test sau khi setup:
1. Chạy: `npm run dev`
2. Vào trang checkout
3. Thử mua vé
4. Click "Đã thanh toán & Gửi email vé"
5. Kiểm tra email inbox 