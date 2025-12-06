# ✅ Setup Checklist - OCX4 Email System

## 🔧 Pre-requisites
- [ ] Node.js đã cài đặt
- [ ] npm đã cài đặt
- [ ] Project đã clone về máy

## 📦 Dependencies
- [x] Resend SDK đã cài đặt (`npm install resend`)
- [x] Next.js project đã setup

## 🌐 Resend Account
- [ ] Đăng ký tài khoản tại https://resend.com
- [ ] Verify email address
- [ ] Tạo API Key trong Dashboard
- [ ] Copy API Key (bắt đầu bằng `re_`)

## ⚙️ Environment Setup
- [x] File `.env.local` đã tạo
- [ ] Thêm `RESEND_API_KEY=re_your_actual_api_key_here` vào `.env.local`
- [ ] Thay thế `re_your_actual_api_key_here` bằng API key thật

## 🔍 Files Created
- [x] `/api/send-email/route.ts` - API endpoint
- [x] Updated `PaymentModal.tsx` - UI integration
- [x] `RESEND_SETUP.md` - Setup guide
- [x] `ENV_SETUP.md` - Environment guide
- [x] `test-email.js` - Test script

## 🧪 Testing
- [ ] Chạy `npm run dev`
- [ ] Mở http://localhost:3000
- [ ] Vào trang ticket selection
- [ ] Chọn vé và checkout
- [ ] Click "Đã thanh toán & Gửi email vé"
- [ ] Kiểm tra email inbox

## 🔧 Troubleshooting
Nếu gặp lỗi, kiểm tra:
- [ ] API key đúng format (bắt đầu bằng `re_`)
- [ ] Server đã restart sau khi thêm API key
- [ ] Console log để xem lỗi chi tiết
- [ ] Email không vào spam folder

## 🎯 Success Indicators
- [ ] Button "Đã thanh toán & Gửi email vé" hiển thị
- [ ] Loading spinner khi click
- [ ] Success message hiển thị
- [ ] Email nhận được với template đẹp
- [ ] QR code hiển thị trong email
- [ ] Thông tin vé chi tiết trong email

## 📧 Email Template Features
- [x] Header với gradient OCX4
- [x] Thông tin đơn hàng
- [x] Thông tin khách hàng
- [x] Chi tiết vé và giá
- [x] QR code tự động tạo
- [x] Thông tin sự kiện
- [x] Responsive design
- [x] Footer với contact info

## 🚀 Production Ready
- [ ] Test với email thật
- [ ] Verify domain trong Resend (optional)
- [ ] Monitor email delivery
- [ ] Setup error logging 