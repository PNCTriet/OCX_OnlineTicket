# OCX5 Layout Logic - Giải Thích Chi Tiết

## 📐 CẤU TRÚC TỔNG QUAN

Mỗi section có cấu trúc như sau:

```
┌─────────────────────────────────────────┐
│  SECTION (relative, border-2 red)       │
│  ┌───────────────────────────────────┐ │
│  │  Background Image (cover, center)  │ │  ← Layer 0 (z-0)
│  └───────────────────────────────────┘ │
│                                           │
│  ┌───────────────────────────────────┐ │
│  │  Content (z-30, relative)         │ │  ← Layer 1 (z-30)
│  │  - Text, buttons, etc.             │ │
│  └───────────────────────────────────┘ │
│                                           │
│  ┌───────────────────────────────────┐ │
│  │  Horizon Overlay (absolute)        │ │  ← Layer 2 (z-20)
│  │  - Position: bottom: 0             │ │
│  │  - Height: 60vh (medium)           │ │
│  │  - Image: objectPosition bottom   │ │
│  └───────────────────────────────────┘ │
│                                           │
│  ┌───────────────────────────────────┐ │
│  │  Marker Badge (absolute)           │ │  ← Layer 3 (z-50)
│  │  - Position: top-4 left-4         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎯 CHI TIẾT TỪNG LAYER

### **Layer 0: Background (z-index: 0 hoặc default)**

**Vị trí:** Lớp nền nhất
**CSS:**
```css
backgroundImage: "url('/images/ocx5_images/backround/ocx5_backround_hero_alt1.png')"
backgroundSize: "cover"        /* Phủ toàn bộ section */
backgroundPosition: "center"  /* Căn giữa */
backgroundRepeat: "no-repeat"  /* Không lặp lại */
```

**Chức năng:**
- Background image cho toàn bộ section
- Phủ toàn bộ không gian section
- Không scroll, cố định với section

---

### **Layer 1: Content (z-index: 30)**

**Vị trí:** Nằm trên background, dưới marker
**CSS:**
```css
position: relative
z-index: 30
```

**Ví dụ (Section 2):**
```jsx
<div className="text-center z-30 relative">
  <h2>Event Information</h2>
  <p>Section 2: Event Info (Coming Soon)</p>
</div>
```

**Chức năng:**
- Chứa nội dung chính của section (text, buttons, cards, etc.)
- Có thể tương tác (clickable, hover, etc.)
- Căn giữa với `flex items-center justify-center`

**Lưu ý:**
- Content nằm **TRÊN** horizon overlay (z-30 > z-20)
- Có thể scroll và tương tác bình thường

---

### **Layer 2: Horizon Overlay (z-index: 20)**

**Vị trí:** Nằm trên background, dưới content
**CSS:**
```css
position: absolute
bottom: 0                    /* Sát mép dưới section */
left: 0
right: 0
width: 100%
height: 60vh (medium)        /* hoặc 40vh (short), 80vh (tall) */
z-index: 20
pointer-events: none          /* Không chặn tương tác */
```

**Cấu trúc bên trong:**
```
HorizonOverlay Container (60vh height, bottom: 0)
  └── Image Container (absolute inset-0)
      └── Image (objectFit: contain, objectPosition: bottom center)
  └── Gradient Overlay (fade to black)
```

**Chức năng:**
- Hiển thị hình horizon ở cuối section
- Image được căn từ **bottom** lên (objectPosition: bottom center)
- Có parallax effect khi scroll
- Gradient overlay tạo transition mượt với section tiếp theo

**Vấn đề hiện tại:**
- Container có height cố định (60vh)
- Image bên trong có `objectFit: contain` → giữ tỉ lệ
- Image được căn từ bottom của container
- → Image nằm trong container 60vh, không fill hết section

---

### **Layer 3: Marker Badge (z-index: 50)**

**Vị trí:** Lớp trên cùng, góc trên bên trái
**CSS:**
```css
position: absolute
top: 1rem (top-4)
left: 1rem (left-4)
z-index: 50
```

**Chức năng:**
- Đánh dấu section để dễ nhận biết khi development
- Luôn hiển thị trên cùng
- Có thể xóa sau khi hoàn thành

---

## 🔍 PHÂN TÍCH CHI TIẾT HORIZON OVERLAY

### **Vấn đề: Tại sao horizon không nằm sát mép dưới?**

**Hiện tại:**
```
Section (h-screen = 100vh)
  └── HorizonOverlay Container
      ├── Position: absolute, bottom: 0
      ├── Height: 60vh
      └── Image
          ├── objectFit: contain
          ├── objectPosition: bottom center
          └── Height: auto (tự điều chỉnh theo tỉ lệ)
```

**Kết quả:**
- Container nằm ở bottom của section ✅
- Container có height = 60vh
- Image bên trong được căn từ bottom của container
- Nhưng image có thể không fill hết 60vh nếu tỉ lệ không khớp
- → Image có thể nằm cách mép dưới một khoảng

**Giải pháp có thể:**
1. **Option 1:** Giảm height của container xuống (ví dụ: 40vh thay vì 60vh)
2. **Option 2:** Đổi `objectFit` từ `contain` → `cover` (nhưng sẽ crop image)
3. **Option 3:** Điều chỉnh container để image nằm sát bottom thực sự
4. **Option 4:** Dùng `objectFit: none` và set width/height cụ thể

---

## 📊 Z-INDEX HIERARCHY

```
z-50: Marker Badge (luôn trên cùng)
z-30: Content (text, buttons, interactive elements)
z-20: Horizon Overlay (transition images)
z-10: Gradient overlays (trong horizon)
z-0:  Background image (nền nhất)
```

---

## 🎨 SECTION STRUCTURE BREAKDOWN

### **Section 1: Hero**
```
<section className="relative border-2 border-red-500 overflow-hidden">
  ├── Marker: "SECTION 1: HERO" (z-50)
  ├── HeroSectionOCX5 (background image only)
  └── HorizonOverlay (village) - bottom
```

### **Section 2-5: Content Sections**
```
<section className="relative h-screen flex items-center justify-center overflow-hidden border-2 border-red-500">
  ├── Background Image (inline style)
  ├── Marker Badge (z-50)
  ├── Content (z-30, relative)
  │   └── Text, buttons, etc.
  └── HorizonOverlay (z-20, absolute, bottom: 0)
```

---

## 🔧 CÁC THUỘC TÍNH QUAN TRỌNG

### **Section Container:**
- `position: relative` → Cho phép absolute children
- `overflow-hidden` → Ẩn phần tràn ra ngoài
- `border-2 border-red-500` → Viền đỏ 2px
- `h-screen` hoặc `h-[80vh]` → Chiều cao section

### **HorizonOverlay:**
- `position: absolute` → Tách khỏi flow, đặt ở vị trí cụ thể
- `bottom: 0` → Sát mép dưới của parent section
- `pointer-events: none` → Không chặn click events
- `z-20` → Nằm trên background, dưới content

### **Image trong HorizonOverlay:**
- `objectFit: contain` → Giữ tỉ lệ, không crop
- `objectPosition: bottom center` → Căn từ dưới lên
- `width: 100%` → Full width
- `height: auto` → Tự điều chỉnh theo tỉ lệ

---

## 💡 GỢI Ý ĐIỀU CHỈNH

### **Nếu muốn horizon nằm sát mép dưới hơn:**
1. Giảm `height` của container (từ 60vh → 40vh hoặc 30vh)
2. Hoặc điều chỉnh `objectPosition` và container structure

### **Nếu muốn horizon fill toàn bộ chiều cao:**
1. Đổi `objectFit: contain` → `objectFit: cover`
2. Nhưng sẽ bị crop nếu tỉ lệ không khớp

### **Nếu muốn horizon nằm ở giữa section:**
1. Đổi `bottom: 0` → `top: 50%` và `transform: translateY(-50%)`
2. Hoặc dùng `flex items-center` trên container

---

## 📝 TÓM TẮT

**Layout hiện tại:**
- Background image phủ toàn bộ section
- Content nằm giữa section (flex center)
- Horizon overlay nằm ở bottom với height cố định
- Image trong horizon được căn từ bottom của container
- Z-index đảm bảo content luôn trên horizon

**Vấn đề:**
- Horizon container có height cố định (60vh)
- Image bên trong có thể không fill hết container
- → Image không nằm sát mép dưới thực sự

**Giải pháp:**
- Cần điều chỉnh height của container hoặc cách image được render

