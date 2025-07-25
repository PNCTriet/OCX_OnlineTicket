import type { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory cache for order status (for demo/dev only)
const orderStatusCache: Record<string, string> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, status, amount, userEmail, paidAt } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }
    // Chỉ xác nhận nếu status là PAID
    if (status === 'PAID') {
      orderStatusCache[orderId] = 'PAID';
      console.log('Received payment webhook:', { orderId, status, amount, userEmail, paidAt });
    }
    return res.status(200).json({ message: 'Webhook received' });
  }
  return res.status(405).json({ message: 'Method not allowed' });
} 