# 🚀 Launch Gate System

Hệ thống launch gate cho Next.js app với middleware và cookie management.

## 🎯 Tính năng

- ✅ Redirect toàn bộ user sang `/launch` nếu chưa tới giờ mở
- ✅ Tránh loop redirect
- ✅ Cookie `launch=1` để track trạng thái
- ✅ Hoạt động trên Vercel Edge Middleware
- ✅ Auto redirect sau khi launch

## 🛠️ Cài đặt

### 1. Dependencies
```bash
npm install js-cookie @types/js-cookie
```

### 2. Config
File: `src/config/launch.ts`
```typescript
export const LAUNCH_CONFIG = {
  LAUNCH_TIME: '2025-08-01T00:00:00+07:00', // ISO string với timezone
  // ... other config
};
```

## 🔧 Logic hoạt động

### Middleware (`src/middleware.ts`)
1. **Check launch time** vs current time
2. **Check cookie** `launch=1`
3. **Redirect logic**:
   - Nếu chưa launch + không có cookie → redirect `/launch`
   - Nếu đã launch hoặc có cookie → allow access
   - Nếu ở `/launch` → allow access

### Launch Page (`src/app/launch/page.tsx`)
1. **Check launch status** on mount
2. **Set cookie** khi launch hoàn thành
3. **Auto redirect** về `/`

### Countdown Component
1. **Countdown timer** hiển thị thời gian
2. **On complete** → set cookie + redirect

## 🎮 Cách sử dụng

### 1. Set launch time
```typescript
// src/config/launch.ts
LAUNCH_TIME: '2025-08-01T00:00:00+07:00'
```

### 2. Test locally
```bash
npm run dev
# Truy cập http://localhost:3000
```

### 3. Deploy to Vercel
```bash
git push
# Vercel sẽ auto deploy
```

## 🔍 Debug

### Console logs
Middleware sẽ log:
```javascript
Launch Gate Check: {
  currentTime: "2024-12-01T10:00:00.000Z",
  launchTime: "2025-08-01T00:00:00.000Z", 
  isLaunched: false,
  pathname: "/",
  hasLaunchedCookie: false,
  shouldRedirect: true
}
```

### Cookie check
```javascript
// Browser console
document.cookie.includes('launch=1')
```

## 🚨 Troubleshooting

### Loop redirect
- Check launch time format (ISO string)
- Clear browser cookies
- Check console logs

### Not redirecting
- Verify middleware matcher config
- Check launch time vs current time
- Ensure cookie is set correctly

### Vercel issues
- Edge middleware limitations
- Timezone differences
- Cache issues

## 📝 Notes

- **Timezone**: Sử dụng ISO string với timezone
- **Cookie**: Expires 1 day
- **Edge**: Middleware chạy trên Vercel Edge
- **Cache**: Clear cache nếu cần

## 🎉 Done!

Hệ thống launch gate đã sẵn sàng sử dụng! 🚀 