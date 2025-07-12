import { NextRequest, NextResponse } from 'next/server';
import { storePaymentFromWebhook } from '@/lib/payment-utils';

// Define the webhook payload type based on SePay documentation
type SePayWebhookPayload = {
  id: string;
  account_number: string;
  amount: number;
  content: string;
  transaction_id: string;
  transaction_time: string;
  virtual_account?: string;
  bank_code?: string;
  bank_name?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Received SePay webhook:', body);

    // Validate webhook payload
    const {
      id,
      amount,
      content,
      transaction_id
    } = body as SePayWebhookPayload;

    if (!id || !amount || !content) {
      console.error('❌ Invalid webhook payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Check if this is a payment for our system
    // Content should match our order number format: OCX4-DDMM-HHMMSS-TT-XXXXXXXX
    const orderMatch = content.match(/OCX4-\d{2}\d{2}-\d{6}-\d{2}-\d{8}/);
    
    if (!orderMatch) {
      console.log('⚠️ Payment not for our system:', content);
      return NextResponse.json({ success: true, message: 'Payment not for our system' });
    }

    const orderNumber = orderMatch[0];
    console.log('✅ Valid payment detected for order:', orderNumber);

    // Store the payment for later verification
    storePaymentFromWebhook(transaction_id, orderNumber, amount);

    return NextResponse.json({ 
      success: true, 
      message: 'Payment received and stored for verification' 
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 