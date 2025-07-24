import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // Log lại để debug
  console.log('Received payment webhook:', req.body);
  // TODO: Có thể lưu trạng thái vào DB hoặc cache nếu muốn
  return res.status(200).json({ message: 'Webhook received' });
} 