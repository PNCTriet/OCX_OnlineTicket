# 🧩 Design-to-Web Export Rules — Key Priorities  
*Version 1.0 — Optimized for cross-team workflow*

Dưới đây là 3 nguyên tắc “must-have” giúp team design bàn giao asset gọn gàng, chuẩn, và web-friendly. Bộ rule này tạo nền tảng để dev tái sử dụng tài sản số mượt mà và không phát sinh technical debt.

---

## 1. Ưu tiên tuyệt đối: **File vector cho mọi asset quan trọng**
Tất cả logo, topo, icon, pattern cần được cung cấp dạng **AI / SVG / EPS**.  
Đây là nguồn chuẩn để đảm bảo khả năng scaling, giữ chất lượng và hỗ trợ tái sử dụng lâu dài.

**Ví dụ chuẩn:**
- `logo_primary_horizontal.svg`
- `topo_light_pattern.ai`
- `icon_arrow_right.svg`

**Ví dụ không ưu tiên:**  
- `logo_final.png`  
- `pattern_new_v3_export.png`

---

## 2. Hạn chế tối đa sử dụng PNG trong working file
PNG chỉ nên dùng cho ảnh chụp hoặc texture raster không thể vector hóa.  
Hạn chế dùng PNG làm base cho các asset vốn phải ở dạng vector.

**Ví dụ đúng:**  
- PNG dùng làm mockup minh họa trong Figma/AI.

**Ví dụ không ưu tiên:**  
- Chèn PNG của logo thay vì SVG.  
- Import topo PNG rồi stretch theo layout.

---

## 3. Nếu buộc phải dùng PNG → **luôn export đa mật độ: x1 / x2 / x3 / x4**
Xuất nhiều cấp độ density giúp web render sắc nét trên mọi màn hình, đặc biệt là HiDPI/Retina.

**Ví dụ đúng:**
- `banner_hero@1x.png`  
- `banner_hero@2x.png`  
- `banner_hero@3x.png`  
- `banner_hero@4x.png`

**Ví dụ không ưu tiên:**  
- Chỉ cung cấp 1 file `banner.png` rồi để web tự scale.

---

## 📌 Quick Summary
- **Vector-first để đảm bảo tính ổn định và tái sử dụng.**  
- **PNG chỉ dùng khi thật sự cần thiết.**  
- **Nếu dùng PNG thì luôn xuất đủ bộ x1 → x4.**

---

Nếu bạn muốn mình chuẩn hóa thành file cho team onboarding hoặc checklist in-office, mình làm ngay.  
