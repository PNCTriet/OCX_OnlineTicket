import { NextRequest, NextResponse } from 'next/server';
import { storePaymentFromWebhook } from '@/lib/payment-utils';

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

    // Check if this is a payment for our system
    // Content should contain our order number format: OCX4-DDMM-HHMMSS-TT-XXXXXXXX
    // But bank might send without dashes: OCX4DDMMHHMMSSTTXXXXXXXX
    const orderMatch = content.match(/OCX4\d{2}\d{2}\d{6}\d{2}\d{8}/);
    
    if (!orderMatch) {
      console.log('⚠️ Payment not for our system:', content);
      return NextResponse.json({ success: true, message: 'Payment not for our system' });
    }

    const orderNumber = orderMatch[0];
    console.log('✅ Valid payment detected for order:', orderNumber);

    // Store the payment for later verification
    storePaymentFromWebhook(referenceCode, orderNumber, transferAmount);

    // Auto send email with tickets
    try {
      // Create basic email data (you can enhance this with more details)
      const emailData = {
        to: 'triet.pnc@gmail.com', // Default email for testing
        subject: `🎫 Vé điện tử Ớt Cay Xè - Đơn hàng #${orderNumber}`,
        tickets: [
          {
            id: 'auto-generated',
            name: 'Single Ticket',
            price: transferAmount,
            color: '#c53e00',
            quantity: 1,
            sold: 0,
            status: 'available'
          }
        ],
        customerInfo: {
          fullName: 'Khách hàng',
          email: 'triet.pnc@gmail.com',
          phone: 'Auto-generated'
        },
        orderNumber: orderNumber,
        orderDate: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, '/'),
        orderTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        totalAmount: transferAmount
      };

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
        console.log('📧 Email sent automatically via webhook:', emailResult);
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
      emailSent: true
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 