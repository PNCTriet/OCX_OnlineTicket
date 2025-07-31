# 🚀 Launch Countdown System

## Tổng quan

Hệ thống đếm ngược launch được tạo để hiển thị trang countdown trước khi website chính thức ra mắt. Khi đến thời gian launch, hệ thống sẽ tự động chuyển hướng về trang chủ.

## 📁 Cấu trúc file

```
src/
├── app/
│   ├── launch/
│   │   └── page.tsx              # Trang launch countdown
│   └── components/
│       └── CountdownLaunch.tsx   # Component countdown
├── config/
│   └── launch.ts                 # Cấu hình launch
└── middleware.ts                 # Middleware redirect
```

## ⚙️ Cấu hình

### 1. Thay đổi Launch Date

Mở file `src/config/launch.ts` và thay đổi:

```typescript
export const LAUNCH_CONFIG = {
  // Thay đổi ngày launch ở đây
  LAUNCH_DATE: new Date('2025-01-15T00:00:00'),
  
  // Thông tin sự kiện
  EVENT_INFO: {
    name: "Sự kiện âm nhạc Howls",
    description: "Đêm nhạc đặc biệt với những nghệ sĩ tài năng nhất",
    date: "01/08/2025 - 19:00",
    location: "Nhà hát Hòa Bình",
    organizer: "Howls Studio"
  },
  
  // Thông tin brand
  BRAND: {
    name: "OCX",
    description: "Hệ thống đặt vé trực tuyến",
    color: "#c53e00"
  }
};
```

### 2. Tùy chỉnh giao diện

Chỉnh sửa file `src/app/components/CountdownLaunch.tsx` để thay đổi:
- Logo và branding
- Layout countdown
- Thông tin sự kiện
- Animation và hiệu ứng

## 🔄 Cách hoạt động

### 1. Trước Launch
- Tất cả request sẽ được redirect về `/launch`
- Hiển thị countdown timer với thông tin sự kiện
- Background với animation đẹp mắt

### 2. Sau Launch
- Tự động chuyển hướng về trang chủ (`/`)
- Hiển thị animation "LAUNCHED!" trong 3 giây
- Sau đó redirect về trang chính

### 3. Middleware Logic
```typescript
// Kiểm tra thời gian hiện tại vs launch date
const isBeforeLaunch = currentDate < LAUNCH_CONFIG.LAUNCH_DATE;

// Redirect logic
if (isBeforeLaunch && pathname !== '/launch') {
  // Chưa đến giờ launch -> redirect về launch page
  return NextResponse.redirect(new URL('/launch', request.url));
}

if (!isBeforeLaunch && pathname === '/launch') {
  // Đã launch rồi mà vẫn ở launch page -> redirect về home
  return NextResponse.redirect(new URL('/', request.url));
}
```

## 🎨 Tính năng

### ✅ Đã hoàn thành:
- [x] Countdown timer với ngày/giờ/phút/giây
- [x] Responsive design
- [x] Animation đẹp mắt
- [x] Auto redirect khi đến giờ
- [x] Middleware bảo vệ
- [x] Config dễ thay đổi
- [x] Background với hero image
- [x] Loading animation
- [x] Launch success animation

### 🎯 Tính năng chính:
1. **Countdown Timer**: Đếm ngược chính xác đến giây
2. **Auto Redirect**: Tự động chuyển hướng khi đến giờ
3. **Responsive**: Hoạt động tốt trên mobile/desktop
4. **Configurable**: Dễ dàng thay đổi ngày và thông tin
5. **Beautiful UI**: Giao diện đẹp với animation

## 🚀 Sử dụng

### 1. Thay đổi Launch Date
```typescript
// Trong src/config/launch.ts
LAUNCH_DATE: new Date('2025-01-15T00:00:00')
```

### 2. Test Launch
```bash
# Chạy development server
npm run dev

# Truy cập
http://localhost:3000/launch
```

### 3. Build Production
```bash
npm run build
npm start
```

## 📱 Responsive Design

- **Mobile**: Grid 2x2 cho countdown
- **Desktop**: Grid 4x1 cho countdown
- **Tablet**: Tự động scale

## 🎨 Customization

### Thay đổi màu sắc:
```typescript
// Trong LAUNCH_CONFIG
BRAND: {
  color: "#c53e00"  // Thay đổi màu chủ đạo
}
```

### Thay đổi background:
```typescript
// Trong CountdownLaunch.tsx
backgroundImage: "url(/images/hero_backround_ss3_alt1.svg)"
```

### Thay đổi animation:
```typescript
// Các class animation có sẵn:
// animate-bounce, animate-pulse, animate-spin
```

## 🔧 Troubleshooting

### 1. Countdown không hoạt động
- Kiểm tra timezone trong Date object
- Đảm bảo format date đúng: `YYYY-MM-DDTHH:mm:ss`

### 2. Redirect không hoạt động
- Kiểm tra middleware.ts
- Đảm bảo LAUNCH_CONFIG được import đúng

### 3. Styling issues
- Kiểm tra Tailwind CSS classes
- Đảm bảo responsive breakpoints

## 📝 Notes

- Launch date được set trong `src/config/launch.ts`
- Middleware sẽ tự động redirect dựa trên thời gian
- Component sử dụng client-side rendering để countdown chính xác
- Background image có thể thay đổi trong component

---

**🎉 Chúc mừng! Hệ thống launch countdown đã sẵn sàng!** 