# 📚 Icon Libraries Summary

This document summarizes modern, open-source icon libraries that can replace or extend Bootstrap Icons in your project.

---

## 1. [Bootstrap Icons](https://icons.getbootstrap.com)
- **Use when**: You're working within Bootstrap ecosystem.
- **Example**:
```html
<i class="bi bi-house"></i>
```

---

## 2. [Lucide Icons](https://lucide.dev)
- **Modern, clean replacement for Feather Icons.**
- **Usage**:
```html
<i data-lucide="calendar"></i>
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

---

## 3. [Tabler Icons](https://tabler.io/icons)
- **Over 4000+ clean SVG icons, ideal for dashboards.**
- **Usage**:
```html
<img src="https://tabler-icons.io/static/icons/calendar.svg" width="24">
```

---

## 4. [Heroicons](https://heroicons.com)
- **Made for Tailwind CSS, supports solid/outline versions.**
- **Example**:
```html
<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
     viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 7V3m8 4V3m-9 8h10m-10 4h10m-6 4h2"/>
</svg>
```

---

## 5. [Phosphor Icons](https://phosphoricons.com)
- **Multiple styles (bold, duotone, light, etc).**
- **Example**:
```html
<script src="https://unpkg.com/phosphor-icons"></script>
<ph-icon name="calendar"></ph-icon>
```

---

## 6. [Remix Icon](https://remixicon.com)
- **Stylish and compact, easy to use via CDN.**
- **Usage**:
```html
<link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet">
<i class="ri-calendar-line"></i>
```

---

## ✅ Summary Table

| Library         | Icons     | Style       | CDN Support | Notes                  |
|------------------|-----------|--------------|--------------|-------------------------|
| Bootstrap Icons | ~2000     | Flat         | ✅           | Default for Bootstrap   |
| Lucide          | ~1000     | Feather-like | ✅           | Clean, modern UI        |
| Tabler          | 4000+     | Stroke SVG   | ✅           | Great for admin UI      |
| Heroicons       | ~300      | Dual-style   | ✅           | Ideal with Tailwind     |
| Phosphor        | 1000+     | Multi-weight | ✅           | Flexible design         |
| Remix Icon      | 2200+     | Sharp + flat | ✅           | Minimal setup            |

---

## 📌 Pro Tip

Use [Iconify](https://icon-sets.iconify.design/) to access 100+ icon sets under one unified API.

---

## 🧠 Author

Document curated by **Bánh Cuốn / Howls Studio**, 2025.
