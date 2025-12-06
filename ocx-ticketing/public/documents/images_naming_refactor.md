
# 📁 Quy Tắc Đặt Tên & Quản Lý File Ảnh – Dự Án OCX Web

Hướng dẫn tiêu chuẩn hoá cách đặt tên và tổ chức file hình ảnh trong dự án website cho sự kiện âm nhạc **Ớt Cay Xè (OCX)**. Mục tiêu là giúp quản lý tài nguyên tốt hơn, tăng hiệu quả phối hợp giữa các team **design, frontend, backend**.

---

## ✅ CẤU TRÚC TÊN FILE

```
[vị-trí]__[đối-tượng]__[mô-tả-ngắn]__[hậu-tố].[định-dạng]
```

---

## 1. 📍 `[vị-trí]` – nơi hình ảnh được sử dụng trong giao diện
| Giá trị | Ý nghĩa |
|--------|---------|
| `header` | Phần đầu trang |
| `footer` | Phần chân trang |
| `hero` | Banner nổi bật đầu trang |
| `section` | Một khối nội dung trong body |
| `popup` | Cửa sổ nổi/modal |
| `background` | Ảnh nền toàn cục hoặc block |
| `card` | Ảnh thẻ nhỏ: nghệ sĩ, vé, tài trợ |

---

## 2. 🎯 `[đối-tượng]` – nhóm nội dung chính
| Giá trị | Ý nghĩa |
|--------|---------|
| `artist` | Nghệ sĩ trình diễn |
| `ticket` | Vé sự kiện |
| `booth` | Gian hàng tài trợ |
| `sponsor` | Nhà tài trợ/logo |
| `poster` | Poster chương trình |
| `checkin` | Hướng dẫn check-in |
| `map` | Sơ đồ chỗ ngồi, booth |

---

## 3. 🧩 `[mô-tả-ngắn]` – nội dung cụ thể
| Ví dụ | Ý nghĩa |
|--------|--------|
| `chillies` | Nghệ sĩ Chillies |
| `vip` | Vé VIP |
| `cay-xe-luoi` | Gói tài trợ Cay Xé Lưỡi |
| `ocx-mua3` | Chương trình mùa 3 |
| `qrcode-instruction` | Hướng dẫn quét QR |

---

## 4. 🔧 `[hậu-tố]` – biến thể/phiên bản hiển thị
| Giá trị | Ý nghĩa |
|--------|---------|
| `main` | Ảnh chính |
| `alt1`, `alt2` | Biến thể phụ |
| `web`, `mobile` | Cho desktop hoặc mobile |
| `v1`, `v2` | Phiên bản khác nhau |

---

## 5. 🖼️ `[định-dạng]` – định dạng ảnh
- `.jpg`, `.png`, `.webp`, v.v.

---

## 🧭 VÍ DỤ ĐẦY ĐỦ & GIẢI NGHĨA

### 🌿 Cấu trúc thư mục hình ảnh trong `public/assets/images/`
```
images/
├── header/
│   └── header__poster__ocx-mua3__mobile.jpg
├── hero/
│   └── hero__artist__chillies__main.jpg
├── section/
│   ├── section__ticket__vip__alt1.png
│   └── section__booth__cay-xe-luoi__map.jpg
├── popup/
│   └── popup__checkin__qrcode-instruction__v1.jpg
├── footer/
│   └── footer__sponsor__logo-universal__web.png
```

### 📄 Giải nghĩa từng file

| Tên file | Ý nghĩa |
|----------|---------|
| `header__poster__ocx-mua3__mobile.jpg` | Poster mùa 3 ở đầu trang (mobile) |
| `hero__artist__chillies__main.jpg` | Ảnh chính nghệ sĩ Chillies ở banner đầu |
| `section__ticket__vip__alt1.png` | Ảnh vé VIP, phiên bản 1 |
| `section__booth__cay-xe-luoi__map.jpg` | Sơ đồ booth gói tài trợ Cay Xé Lưỡi |
| `popup__checkin__qrcode-instruction__v1.jpg` | Hướng dẫn QR check-in trong popup |
| `footer__sponsor__logo-universal__web.png` | Logo Universal ở phần footer trang web |

---

## 📌 Lợi Ích

- ✅ Quản lý ảnh gọn gàng, nhất quán
- ✅ Dễ tìm kiếm, tái sử dụng
- ✅ Phối hợp nhanh chóng giữa thiết kế, frontend và backend
- ✅ Hạn chế lỗi mapping sai ảnh
