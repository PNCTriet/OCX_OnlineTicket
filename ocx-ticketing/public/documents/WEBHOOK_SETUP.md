# 📦 SePay Webhook Integration for Next.js App

This document provides detailed instructions for integrating SePay Webhooks into a Next.js application. Webhooks allow SePay to notify your system when a new transaction occurs, enabling real-time order status updates.

---

## ✅ Use Case

> **When a customer makes a payment, SePay sends a webhook to your backend, which verifies the data and updates the order status.**

---

## 🔗 Webhook Endpoint

**Production URL:**
```
https://www.otcayxe.com/api/sepay/webhook
```

**Development URL:**
```
http://localhost:3000/api/sepay/webhook
```

---

## 1. 🧪 Setup Testing Environment (Sandbox)

To simulate transactions for testing purposes:

1. Register at: [https://my.dev.sepay.vn](https://my.dev.sepay.vn)
2. Contact SePay support to activate sandbox mode
3. Use the **"Giả lập giao dịch"** menu to trigger test transactions
4. Observe webhook delivery via **Nhật ký WebHooks**

---

## 2. ⚙️ Add Webhook in SePay Dashboard

### Steps:

1. Go to `WebHooks` menu in SePay dashboard
2. Click **`+ Thêm WebHooks`**
3. Fill in the fields:
   - **Tên WebHooks**: e.g. `OCX4 Payment Hook`
   - **Sự kiện**: `Có tiền vào`
   - **Tài khoản ngân hàng**: Chọn chính xác tài khoản cần theo dõi
   - **Lọc theo tài khoản ảo**: Bật nếu cần theo dõi từng tài khoản định danh (VA)
   - **Bỏ qua nếu không có code thanh toán**: Tùy chỉnh
   - **Gọi đến URL**: `https://www.otcayxe.com/api/sepay/webhook`
   - **Là webhook xác thực thanh toán**: Chọn `Đúng`
   - **Gọi lại webhook khi**: tick HTTP status code not in 2xx range

### Webhook Payload Format:

The webhook expects the following JSON payload:

```json
{
  "id": "transaction_id",
  "account_number": "1234567890",
  "amount": 489000,
  "content": "OCX4-2412-143025-03-12345678",
  "transaction_id": "unique_transaction_id",
  "transaction_time": "2024-12-24T14:30:25Z",
  "virtual_account": "optional_va",
  "bank_code": "VPB",
  "bank_name": "Vietcombank"
}
```

---

## 3. 🔐 Webhook Authentication

Choose one of the following:

- `OAuth 2.0` (recommended for secure backends)
- `API Key`
- `No authentication` (for dev/testing only)

Example headers if using API Key:
```http
Authorization: Apikey YOUR_SEPAY_API_KEY
Content-Type: application/json
```

---

## 4. 🔍 Payment Verification Flow

### How it works:

1. **User initiates payment** → System generates order number (e.g., `OCX4-2412-143025-03-12345678`)
2. **User scans QR code** → QR contains order number as payment content
3. **User transfers money** → SePay receives payment with order number in content
4. **SePay sends webhook** → Our system receives webhook with order number
5. **System verifies payment** → Matches order number and amount
6. **Payment confirmed** → Email tickets sent automatically

### Payment Content Format:

The payment content must match our order number format:
```
OCX4-DDMM-HHMMSS-TT-XXXXXXXX
```

Where:
- `DDMM`: Day and month (24-12)
- `HHMMSS`: Hour, minute, second (14-30-25)
- `TT`: Total tickets (03)
- `XXXXXXXX`: Unique 8-digit ID (12345678)

---

## 5. 🧪 Testing

### Test Payment Flow:

1. **Start payment process** in the app
2. **Copy order number** from the QR code
3. **Simulate payment** in SePay sandbox with the order number as content
4. **Check webhook logs** in SePay dashboard
5. **Verify payment confirmation** in the app

### Expected Behavior:

- ✅ **Payment received within 60 seconds** → Email sent, success message
- ❌ **No payment within 60 seconds** → Timeout, failure message
- ❌ **Wrong order number** → Payment ignored
- ❌ **Wrong amount** → Payment ignored

---

## 6. 🔧 Troubleshooting

### Common Issues:

1. **Webhook not received**:
   - Check URL is correct
   - Verify webhook is enabled
   - Check server logs

2. **Payment not verified**:
   - Ensure order number format matches
   - Check amount matches exactly
   - Verify webhook payload structure

3. **Timeout issues**:
   - Check network connectivity
   - Verify webhook response time
   - Check server performance

### Debug Logs:

The webhook endpoint logs detailed information:
```
📦 Received SePay webhook: {...}
✅ Valid payment detected for order: OCX4-2412-143025-03-12345678
💾 Stored payment for verification: {...}
```

---

## 7. 🚀 Production Deployment

### Environment Variables:

Ensure these are set in production:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
RESEND_API_KEY=your_resend_key
```

### Security Considerations:

1. **Validate webhook signatures** (if SePay provides)
2. **Rate limiting** on webhook endpoint
3. **Logging and monitoring** for webhook failures
4. **Database storage** for payment records (instead of memory)

---

## 📞 Support

For issues with:
- **SePay integration**: Contact SePay support
- **Webhook setup**: Check this documentation
- **Payment verification**: Check server logs
- **Email delivery**: Check Resend dashboard
