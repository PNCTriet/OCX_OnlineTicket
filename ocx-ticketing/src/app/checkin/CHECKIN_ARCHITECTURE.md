# Kiến trúc và Flow Check-in System

## 📋 Tổng quan

Hệ thống check-in cho phép quét QR code vé và thực hiện check-in tự động với giao diện camera realtime, validation, và tracking đầy đủ.

## 🏗️ Kiến trúc tổng thể

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (API Server)   │◄──►│   (Supabase)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Components chính:
- **CheckinPage**: Component chính xử lý UI và logic
- **QR Scanner**: Thư viện qr-scanner để đọc QR code
- **Toast System**: Thông báo realtime
- **Modal System**: Hiển thị thông tin vé và check-in

## 🔄 Flow hoạt động

### 1. Khởi tạo hệ thống
```
User truy cập /checkin
    ↓
Kiểm tra quyền (SUPERADMIN, OWNER_ORGANIZER)
    ↓
Fetch danh sách events
    ↓
User chọn event để check-in
    ↓
Fetch ticket data và stats
```

### 2. QR Code Scanning Flow
```
Bật camera
    ↓
QR Scanner khởi tạo
    ↓
Detect QR code
    ↓
Debounce (2 giây)
    ↓
Validate QR content
    ↓
Tìm vé trong ticket map
    ↓
Hiển thị modal thông tin vé
```

### 3. Check-in Flow
```
User click "Check-in Ticket"
    ↓
Validate vé (đã check-in chưa)
    ↓
Gọi API checkin/verify-qr
    ↓
Cập nhật local state
    ↓
Refresh data (tickets + stats)
    ↓
Hiển thị thông báo thành công
```

## 🎨 Giao diện và UI Components

### 1. Layout chính
```
┌─────────────────────────────────────────┐
│ Header: Event Checkin                   │
├─────────────────────────────────────────┤
│ Event Selection Dropdown                │
│ Manual Search Input                     │
│ View Check-in Logs Button               │
├─────────────────────────────────────────┤
│ Camera Section                          │
│ ┌─────────────────────────────────────┐ │
│ │ Camera Preview (1:1 aspect ratio)   │ │
│ │ QR Scanning Overlay                 │ │
│ │ Loading Indicator                   │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Event Info & Statistics                 │
│ Total | Checked In | Remaining | Rate   │
└─────────────────────────────────────────┘
```

### 2. Success Modal
```
┌─────────────────────────────────────────┐
│ ✅ Checkin Successful!                  │
├─────────────────────────────────────────┤
│ Ticket Code: [QR_CODE]                  │
├─────────────────────────────────────────┤
│ User Information                        │
│ [Avatar] Name + Email                   │
├─────────────────────────────────────────┤
│ Ticket Information                      │
│ Type | Price | Order ID | Status        │
├─────────────────────────────────────────┤
│ [Check-in Ticket] [Close]               │
└─────────────────────────────────────────┘
```

### 3. Check-in Logs Modal
```
┌─────────────────────────────────────────┐
│ 📋 Check-in Logs                        │
├─────────────────────────────────────────┤
│ [User Avatar] Name + Email              │
│ Check-in Time | Verified By             │
│ Ticket | Event | Order ID               │
│ Notes (if any)                          │
└─────────────────────────────────────────┘
```

## 🔌 API Integration

### 1. Events API
```typescript
GET /events
Headers: Authorization: Bearer <token>
Response: Event[]
```

### 2. Ticket Data API
```typescript
GET /orders/event/{eventId}/items
Headers: Authorization: Bearer <token>
Response: {
  event_id: string,
  event_name: string,
  total_items: number,
  items: OrderItem[]
}
```

### 3. Check-in API
```typescript
POST /checkin/verify-qr
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
Body: {
  qrCode: string,
  checkedBy: string
}
Response: {
  success: boolean,
  message: string,
  data?: any
}
```

### 4. Check-in Logs API
```typescript
GET /checkin/logs?eventId={eventId}
Headers: Authorization: Bearer <token>
Response: CheckinLog[]
```

### 5. Check-in Stats API
```typescript
GET /checkin/stats/{eventId}
Headers: Authorization: Bearer <token>
Response: {
  totalTickets: number,
  checkedIn: number,
  remaining: number,
  checkinRate: string
}
```

## 🗂️ Data Mapping và Structures

### 1. Ticket Map (O(1) Lookup)
```typescript
const ticketMap = new Map<string, {
  id: string,
  code: string,
  used: boolean,
  used_at: string | null,
  created_at: string,
  orderItem: OrderItem
}>();
```

### 2. OrderItem Structure
```typescript
interface OrderItem {
  id: string,
  order_id: string,
  ticket_id: string,
  quantity: number,
  price: string,
  order: {
    id: string,
    status: string,
    created_at: string,
    user: {
      id: string,
      email: string,
      first_name: string,
      last_name: string,
      avatar_url?: string
    }
  },
  ticket: {
    id: string,
    name: string,
    price: string,
    description: string
  },
  codes: TicketCode[]
}
```

### 3. CheckinLog Structure
```typescript
interface CheckinLog {
  id: string,
  ticket_code: string,
  checkin_time: string,
  verified_by: string,
  user: User,
  ticket: Ticket,
  event: Event,
  order_id: string,
  notes?: string
}
```

## 🔒 Security và Validation

### 1. Authentication
- JWT Token từ localStorage/sessionStorage
- Role-based access: SUPERADMIN, OWNER_ORGANIZER
- Token validation trên mọi API calls

### 2. Frontend Validation
```typescript
const validateCheckin = (orderItem: any, scannedCode: string) => {
  // Check if ticket is already used
  const foundCode = orderItem.codes.find((code: any) => code.code === scannedCode);
  if (foundCode && foundCode.used) {
    showToast('This ticket has already been checked in', 'error');
    return false;
  }
  return true;
};
```

### 3. Error Handling
- HTTP Status Codes: 400, 403, 404
- Specific error messages cho từng case
- Toast notifications với 3 loại: success, warning, error

## 📱 Responsive Design

### Mobile Optimization
- Camera preview: 1:1 aspect ratio, max-width responsive
- QR overlay: 28x28 (tăng từ 24x24)
- Button layout: flex-col cho mobile
- Font sizes: Giảm cho mobile screens
- Touch-friendly interactions

### Breakpoints
```css
/* Mobile First */
max-w-md (768px+)
aspect-square (1:1 ratio)
text-sm, text-xs (mobile fonts)
```

## 🎯 Performance Optimizations

### 1. Data Structures
- **Ticket Map**: O(1) lookup thay vì O(n) array search
- **Debouncing**: 2 giây cho QR detection
- **Memoization**: useMemo cho filtered data

### 2. API Calls
- **Parallel requests**: Fetch events + organizations cùng lúc
- **Conditional fetching**: Chỉ fetch khi cần thiết
- **Error retry**: Retry logic cho failed requests

### 3. UI Performance
- **Virtual scrolling**: Cho large lists
- **Lazy loading**: Modal components
- **Debounced search**: User input

## 🔄 State Management

### 1. Local State (useState)
```typescript
const [events, setEvents] = useState<Event[]>([]);
const [selectedEventId, setSelectedEventId] = useState<string>("");
const [isScanning, setIsScanning] = useState(false);
const [foundTicket, setFoundTicket] = useState<any>(null);
const [showSuccessModal, setShowSuccessModal] = useState(false);
```

### 2. Refs (useRef)
```typescript
const videoRef = useRef<HTMLVideoElement>(null);
const qrScannerRef = useRef<QrScanner | null>(null);
const ticketMapRef = useRef<Map<string, any>>(new Map());
```

### 3. Effects (useEffect)
- Camera initialization
- QR scanner setup
- Data fetching
- Cleanup on unmount

## 🧪 Testing Strategy

### 1. Unit Tests
- QR code validation logic
- Ticket mapping functions
- API response handling

### 2. Integration Tests
- Camera permission flow
- API integration
- Modal interactions

### 3. E2E Tests
- Complete check-in flow
- Error scenarios
- Mobile responsiveness

## 🚀 Deployment Considerations

### 1. Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_QR_SCANNER_WORKER_URL=/qr-scanner-worker.min.js
```

### 2. Build Optimizations
- Code splitting cho camera components
- Image optimization cho avatars
- Bundle analysis và optimization

### 3. Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics

## 📚 Dependencies

### Core Dependencies
```json
{
  "qr-scanner": "^1.4.2",
  "@tabler/icons-react": "^2.x",
  "next": "^14.x",
  "react": "^18.x"
}
```

### Key Features
- **qr-scanner**: QR code detection và scanning
- **@tabler/icons-react**: Icon system
- **Next.js**: SSR/SSG framework
- **React Hooks**: State management

## 🔧 Configuration

### 1. QR Scanner Config
```typescript
const qrScanner = new QrScanner(videoRef.current, callback, {
  highlightScanRegion: true,
  highlightCodeOutline: true,
  preferredCamera: 'environment',
  maxScansPerSecond: 10,
  returnDetailedScanResult: true
});
```

### 2. Camera Constraints
```typescript
const constraints = {
  video: {
    facingMode: 'environment', // Back camera
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
};
```

## 🎨 UI/UX Guidelines

### 1. Color Scheme
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)  
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### 2. Typography
- **Headers**: text-2xl, font-semibold
- **Body**: text-sm, text-base
- **Captions**: text-xs
- **Monospace**: font-mono cho codes

### 3. Spacing
- **Padding**: p-4, p-6
- **Margins**: mb-6, mt-4
- **Gaps**: gap-2, gap-3, gap-4

---

## 📝 Notes

- Hệ thống được thiết kế cho mobile-first
- QR scanner hoạt động tốt trên camera back
- Error handling comprehensive với user-friendly messages
- Performance optimized với O(1) lookups và debouncing
- Security được đảm bảo với JWT authentication và role-based access
