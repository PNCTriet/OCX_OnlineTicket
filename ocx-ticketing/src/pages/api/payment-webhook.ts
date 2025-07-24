import type { NextApiRequest, NextApiResponse } from 'next';

type OrderStatusInfo = {
  status: string;
  amount?: number;
  userEmail?: string;
  paidAt?: string;
};

// Simple in-memory cache for order status (for demo/dev only)
const orderStatusCache: Record<string, OrderStatusInfo> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, status, amount, userEmail, paidAt } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }
    // Save status to cache
    orderStatusCache[orderId] = { status, amount, userEmail, paidAt };
    console.log('Received payment webhook:', req.body);
    return res.status(200).json({ message: 'Webhook received' });
  }
  if (req.method === 'GET') {
    const { orderId } = req.query;
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ message: 'Missing orderId' });
    }
    const status = orderStatusCache[orderId];
    if (!status) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(status);
  }
  return res.status(405).json({ message: 'Method not allowed' });
} 