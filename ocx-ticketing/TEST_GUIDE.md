# 🧪 Hướng dẫn Test Email System

## ✅ Setup đã hoàn tất:
- [x] API key đã cấu hình: `re_8xw44Kw3_NQN7Nw2YJTMaMszXEC8WppSM`
- [x] API route `/api/send-email` đã tạo
- [x] PaymentModal đã tích hợp
- [x] Test script đã chạy thành công

## 🚀 Cách test đầy đủ:

### **Bước 1: Chạy development server**
```bash
npm run dev
```

### **Bước 2: Test flow hoàn chỉnh**
1. Mở http://localhost:3000
2. Vào trang ticket selection
3. Chọn vé từ seatmap
4. Điền thông tin cá nhân trong checkout
5. Click "Thanh toán"
6. Trong PaymentModal, click "Gửi email vé điện tử"
7. Kiểm tra console log để xem dữ liệu
8. Kiểm tra email inbox

### **Bước 3: Kiểm tra Console Log**
Khi click button, bạn sẽ thấy:
```
📧 Preparing to send email with data:
👤 User Info: {fullName: "...", email: "...", phone: "..."}
🎫 Selected Tickets: [...]
🔢 Order Details: {orderNumber: ..., orderDate: "...", orderTime: "...", totalAmount: ...}
📧 Sending email to: user@example.com
📧 Email subject: 🎫 Vé điện tử OCX4 - Đơn hàng #...
✅ Email sent successfully: {...}
```

### **Bước 4: Kiểm tra Email**
Email sẽ chứa:
- ✅ Header đẹp với gradient OCX4
- ✅ Thông tin đơn hàng chi tiết
- ✅ Thông tin khách hàng
- ✅ Chi tiết vé và giá cả
- ✅ Mã QR tự động tạo
- ✅ Thông tin sự kiện OCX4
- ✅ Responsive design

## 🔧 Troubleshooting

### **Nếu email không gửi được:**
1. Kiểm tra API key trong `.env.local`
2. Restart server: `npm run dev`
3. Kiểm tra console log để xem lỗi
4. Kiểm tra spam folder

### **Nếu dữ liệu không đúng:**
1. Kiểm tra form validation trong checkout
2. Đảm bảo đã chọn vé từ seatmap
3. Kiểm tra console log để xem dữ liệu được gửi

## 📧 Email Template Features
- **From**: OCX4 <noreply@resend.dev>
- **Subject**: 🎫 Vé điện tử OCX4 - Đơn hàng #[orderNumber]
- **Content**: HTML template đẹp với đầy đủ thông tin
- **QR Code**: Tự động tạo từ thông tin vé
- **Responsive**: Hiển thị tốt trên mobile và desktop

## 🎯 Success Indicators
- ✅ Button "Gửi email vé điện tử" hiển thị
- ✅ Loading spinner khi click
- ✅ Success message hiển thị
- ✅ Email nhận được với template đẹp
- ✅ Console log hiển thị dữ liệu đầy đủ

## 📱 Test với email thật
- Thay đổi email trong form checkout
- Sử dụng email thật để test
- Kiểm tra cả inbox và spam folder 