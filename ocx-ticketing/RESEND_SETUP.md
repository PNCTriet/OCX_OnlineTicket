# 🚀 Hướng dẫn setup Resend Email Service

## 📋 Bước 1: Đăng ký tài khoản Resend
1. Truy cập: https://resend.com
2. Click "Sign up" và đăng ký tài khoản miễn phí
3. Verify email của bạn

## 🔑 Bước 2: Lấy API Key
1. Đăng nhập vào Resend Dashboard
2. Vào menu "API Keys" 
3. Click "Create API Key"
4. Đặt tên cho API Key (ví dụ: "OCX4 Email Service")
5. Copy API Key (bắt đầu bằng `re_`)

## ⚙️ Bước 3: Cấu hình Environment Variables
1. Tạo file `.env.local` trong thư mục gốc của project
2. Thêm dòng sau vào file:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

**Lưu ý:** Thay thế `re_your_actual_api_key_here` bằng API key thật bạn vừa copy

## 🧪 Bước 4: Test Email Service
1. Chạy development server: `npm run dev`
2. Vào trang checkout và thử mua vé
3. Click "Đã thanh toán & Gửi email vé"
4. Kiểm tra email inbox để xem vé điện tử

## 📧 Tính năng Email Template
- ✅ Template HTML đẹp với responsive design
- ✅ Thông tin đơn hàng chi tiết
- ✅ Chi tiết vé và giá cả
- ✅ Mã QR tự động tạo
- ✅ Thông tin sự kiện
- ✅ Thông tin khách hàng

## 🔧 Troubleshooting
- **Lỗi "Invalid API Key"**: Kiểm tra lại API key trong .env.local
- **Email không gửi được**: Kiểm tra console log để xem lỗi chi tiết
- **Email vào spam**: Thêm domain của bạn vào Resend để tăng độ tin cậy

## 💡 Tips
- Free tier: 3,000 emails/tháng
- Có thể verify domain để tăng deliverability
- Template email có thể customize thêm theo ý muốn 