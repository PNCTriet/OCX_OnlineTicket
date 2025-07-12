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

    return NextResponse.json({ 
      success: true, 
      message: 'Payment received and stored for verification',
      orderNumber,
      amount: transferAmount
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 