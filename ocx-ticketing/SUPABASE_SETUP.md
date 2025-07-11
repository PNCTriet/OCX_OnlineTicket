# 🚀 Hướng dẫn setup Supabase với Google OAuth

## 📋 Bước 1: Tạo dự án Supabase

1. Truy cập: https://supabase.com
2. Click "Start your project" và đăng ký tài khoản
3. Tạo dự án mới với tên "OCX Ticketing"
4. Chọn region gần nhất (ví dụ: Singapore)
5. Đặt database password

## 🔑 Bước 2: Lấy thông tin API

1. Vào **Settings** > **API**
2. Copy các thông tin sau:
   - **Project URL** (bắt đầu bằng `https://`)
   - **anon public** key (bắt đầu bằng `eyJ`)

## ⚙️ Bước 3: Cấu hình Google OAuth

1. Vào **Authentication** > **Providers**
2. Tìm **Google** và click **Enable**
3. Tạo Google OAuth credentials:
   - Truy cập: https://console.cloud.google.com
   - Tạo project mới hoặc chọn project có sẵn
   - Vào **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client IDs**
   - Chọn **Web application**
   - Đặt tên: "OCX Ticketing"
   - Thêm **Authorized redirect URIs**:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Copy **Client ID** và **Client Secret**

4. Quay lại Supabase và nhập:
   - **Client ID**: từ Google Console
   - **Client Secret**: từ Google Console
   - **Redirect URL**: `https://your-project-ref.supabase.co/auth/v1/callback`

## 🔧 Bước 4: Cấu hình Environment Variables

1. Tạo file `.env.local` trong thư mục gốc:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Resend Email Service (existing)
RESEND_API_KEY=re_your_actual_api_key_here
```

**Lưu ý:** Thay thế các giá trị bằng thông tin thật từ Supabase dashboard

## 🧪 Bước 5: Test Authentication

1. Chạy development server: `npm run dev`
2. Vào trang checkout: `http://localhost:3000/checkout`
3. Bạn sẽ được redirect đến trang đăng nhập
4. Click "Đăng nhập với Google"
5. Hoàn thành OAuth flow
6. Quay lại trang checkout với thông tin user

## 📊 Bước 6: Kiểm tra Database

1. Vào Supabase Dashboard > **Table Editor**
2. Bạn sẽ thấy bảng `auth.users` được tạo tự động
3. Kiểm tra user đã được tạo sau khi đăng nhập

## 🔒 Bước 7: Cấu hình RLS (Row Level Security)

1. Vào **Authentication** > **Policies**
2. Tạo policies cho các bảng cần thiết:

```sql
-- Ví dụ: Cho phép user chỉ đọc/ghi dữ liệu của mình
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🎯 Tính năng đã tích hợp

### ✅ Authentication Flow
- Google OAuth đăng nhập
- Middleware bảo vệ trang checkout
- Auto-redirect khi chưa đăng nhập
- Session management

### ✅ User Experience
- Auto-fill thông tin user từ Google
- Hiển thị avatar và tên user
- Nút đăng xuất
- Loading states

### ✅ API Integration
- Authenticated API routes
- User context trong backend
- Secure ticket purchase flow

### ✅ Database Ready
- Schema sẵn sàng cho production
- User management
- Order tracking
- Email logging

## 🚨 Troubleshooting

### Lỗi "Invalid redirect URI"
- Kiểm tra redirect URI trong Google Console
- Đảm bảo domain chính xác

### Lỗi "Unauthorized" khi gọi API
- Kiểm tra environment variables
- Đảm bảo user đã đăng nhập
- Kiểm tra middleware configuration

### Email không gửi được
- Kiểm tra RESEND_API_KEY
- Kiểm tra console logs

## 🔄 Next Steps

1. **Production Deployment**:
   - Cập nhật redirect URIs cho domain production
   - Cấu hình environment variables trên hosting platform

2. **Database Schema**:
   - Tạo các bảng theo schema trong `database_design_EN.md`
   - Implement RLS policies

3. **Payment Integration**:
   - Tích hợp payment gateway thật
   - Implement webhook handlers

4. **Email Templates**:
   - Customize email templates
   - Add branding elements

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs trong browser
2. Network tab để xem API calls
3. Supabase logs trong dashboard
4. Environment variables configuration 