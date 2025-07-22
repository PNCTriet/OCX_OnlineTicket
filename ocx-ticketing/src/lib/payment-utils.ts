// Store pending payments in memory (in production, use Redis or database)
const pendingPayments = new Map<string, {
  orderNumber: string;
  amount: number;
  timestamp: number;
  userEmail: string;
}>();

// Export function to check if payment was received
export function checkPaymentReceived(orderNumber: string, expectedAmount: number): boolean {
  // Normalize order number by removing dashes for comparison
  const normalizedOrderNumber = orderNumber.replace(/-/g, '');
  
  for (const [transactionId, payment] of pendingPayments.entries()) {
    // Normalize stored order number by removing dashes
    const normalizedStoredOrderNumber = payment.orderNumber.replace(/-/g, '');
    
    if (normalizedStoredOrderNumber === normalizedOrderNumber && payment.amount === expectedAmount) {
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

// Export function to store payment from webhook
export function storePaymentFromWebhook(transactionId: string, orderNumber: string, amount: number): void {
  pendingPayments.set(transactionId, {
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
    transactionId,
    orderNumber,
    amount,
    timestamp: new Date().toISOString()
  });
} 