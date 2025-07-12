import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

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

// Store pending payments in memory (in production, use Redis or database)
const pendingPayments = new Map<string, {
  orderNumber: string;
  amount: number;
  timestamp: number;
  userEmail: string;
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Received SePay webhook:', body);

    // Validate webhook payload
    const {
      id,
      account_number,
      amount,
      content,
      transaction_id,
      transaction_time,
      virtual_account
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
    pendingPayments.set(transaction_id, {
      orderNumber,
      amount,
      timestamp: Date.now(),
      userEmail: '', // Will be set when user initiates payment
    });

    // Clean up old pending payments (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [key, payment] of pendingPayments.entries()) {
      if (payment.timestamp < fiveMinutesAgo) {
        pendingPayments.delete(key);
      }
    }

    console.log('💾 Stored payment for verification:', {
      transaction_id,
      orderNumber,
      amount,
      timestamp: new Date().toISOString()
    });

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

// Export function to check if payment was received
export function checkPaymentReceived(orderNumber: string, expectedAmount: number): boolean {
  for (const [transactionId, payment] of pendingPayments.entries()) {
    if (payment.orderNumber === orderNumber && payment.amount === expectedAmount) {
      // Remove from pending payments after successful verification
      pendingPayments.delete(transactionId);
      console.log('✅ Payment verified and removed from pending:', orderNumber);
      return true;
    }
  }
  return false;
}

// Export function to add pending payment (called when user initiates payment)
export function addPendingPayment(orderNumber: string, amount: number, userEmail: string): void {
  const paymentKey = `pending_${orderNumber}`;
  pendingPayments.set(paymentKey, {
    orderNumber,
    amount,
    timestamp: Date.now(),
    userEmail
  });
  console.log('⏳ Added pending payment:', { orderNumber, amount, userEmail });
} 