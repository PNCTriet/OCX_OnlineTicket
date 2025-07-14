import { NextRequest, NextResponse } from 'next/server';
import { storePaymentFromWebhook, getUserInfoByOrderNumber, getPaymentDataByOrderNumber } from '@/lib/payment-utils';
import { getOrder, removeOrder } from '@/lib/pending-orders';

// Define the webhook payload type based on actual SePay response
type SePayWebhookPayload = {
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount: string | null;
  code: string;
  content: string;
  transferType: string;
  description: string;
  transferAmount: number;
  referenceCode: string;
  accumulated: number;
  id: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Received SePay webhook:', body);

    // Validate webhook payload
    const {
      transferAmount,
      content,
      referenceCode,
      id
    } = body as SePayWebhookPayload;

    if (!id || !transferAmount || !content) {
      console.error('❌ Invalid webhook payload - missing required fields');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Làm sạch content: loại bỏ ký tự không phải chữ/số
    const cleanedContent = content.replace(/[^A-Za-z0-9]/g, '');
    // Tìm OCX4 + 20 số liên tiếp
    const orderMatch = cleanedContent.match(/OCX4\d{20}/);
    
    if (!orderMatch) {
      console.log('⚠️ Payment not for our system:', content);
      return NextResponse.json({ success: true, message: 'Payment not for our system' });
    }

    const orderNumber = orderMatch[0];
    console.log('✅ Valid payment detected for order:', orderNumber);

    // Lấy đơn hàng từ file JSON
    const orderData = getOrder(orderNumber);
    if (!orderData) {
      console.log('⚠️ No user info found for order:', orderNumber);
      // Store payment without user info for now
      storePaymentFromWebhook(referenceCode, orderNumber, transferAmount);
      return NextResponse.json({ 
        success: true, 
        message: 'Payment received but no user info found',
        orderNumber,
        amount: transferAmount
      });
    }

    // Store the payment for later verification (vẫn lưu vào RAM nếu cần)
    storePaymentFromWebhook(referenceCode, orderNumber, transferAmount, orderData.userInfo, orderData.tickets);

    // Auto send email with tickets
    try {
      const userInfo = orderData.userInfo;
      const tickets = orderData.tickets;
      const totalAmount = orderData.totalAmount;
      // Create email data with actual user info and ticket data
      const emailData = {
        to: userInfo.email, // Use actual customer email
        subject: `🎫 Vé điện tử Ớt Cay Xè - Đơn hàng #${orderNumber}`,
        tickets: tickets,
        customerInfo: userInfo, // Use actual customer info
        orderNumber: orderNumber,
        orderDate: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, '/'),
        orderTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        totalAmount: totalAmount
      };

      console.log('📧 Sending email with data:', {
        to: userInfo.email,
        tickets: tickets,
        totalAmount: totalAmount
      });

      // Call send-email API
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.otcayxe.com'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const emailResult = await emailResponse.json();

      if (emailResult.success) {
        console.log('📧 Email sent automatically via webhook to:', userInfo.email);
        // Xóa đơn hàng khỏi file sau khi gửi mail thành công
        removeOrder(orderNumber);
      } else {
        console.error('❌ Failed to send email via webhook:', emailResult);
      }
    } catch (emailError) {
      console.error('❌ Error sending email via webhook:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment received and stored for verification',
      orderNumber,
      amount: transferAmount,
      emailSent: true,
      customerEmail: orderData.userInfo.email
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 