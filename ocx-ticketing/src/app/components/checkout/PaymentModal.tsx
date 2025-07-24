"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type OrderItem = {
  ticket_id: string;
  quantity: number;
  price: number;
  ticket?: { name?: string };
};
type OrderInfo = {
  id: string;
  total_amount: number;
  status: string;
  order_items?: OrderItem[];
};
type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderInfo: OrderInfo;
};

export default function PaymentModal({ isOpen, onClose, orderInfo }: PaymentModalProps) {
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderInfo?.id) return;
    let interval: NodeJS.Timeout | null = null;
    const checkStatus = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/orders/${orderInfo.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "PAID" || data.status === "SUCCESS") {
          setIsPaid(true);
          if (interval) clearInterval(interval);
        }
      }
    };
    interval = setInterval(checkStatus, 3000);
    checkStatus();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, orderInfo?.id]);

  if (!isOpen || !orderInfo) return null;

  // Tạo link QR VietQR
  const qrUrl = `https://img.vietqr.io/image/VPB-214244527-compact.png?amount=${orderInfo.total_amount}&addInfo=OCX${orderInfo.id}&accountName=PHAM NG CAO TRIET`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-xl p-6 md:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Thông tin thanh toán</h2>
          <button onClick={onClose} className="text-white hover:text-zinc-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: QR Code */}
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <div className="w-64 h-64 relative mb-4 flex items-center justify-center">
              <Image
                src={qrUrl}
                alt="QR Code chuyển khoản ngân hàng"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-black text-center font-bold">Quét mã QR để thanh toán</p>
            <p className="text-zinc-700 text-sm text-center mt-2">
              Sử dụng ứng dụng ngân hàng của bạn để quét mã và chuyển khoản.
            </p>
          </div>
          {/* Right Column: Payment Info */}
          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-white">
                <p><span className="text-zinc-400">Mã đơn hàng:</span> {orderInfo.id}</p>
                <p><span className="text-zinc-400">Số tiền:</span> {Number(orderInfo.total_amount).toLocaleString()}đ</p>
                <p><span className="text-zinc-400">Trạng thái:</span> {orderInfo.status}</p>
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Chi tiết vé</h3>
              <div className="space-y-2">
                {orderInfo.order_items?.map((item: OrderItem) => (
                  <div key={item.ticket_id} className="text-white">
                    <p>{item.ticket?.name || item.ticket_id} x{item.quantity}</p>
                    <p className="text-zinc-400">{Number(item.price).toLocaleString()}đ/vé</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-sm">
                💡 <strong>Hướng dẫn:</strong> Quét mã QR và chuyển khoản. Đơn hàng sẽ được xác nhận tự động khi thanh toán thành công.
              </p>
            </div>
          </div>
        </div>
        {isPaid && (
          <div className="bg-green-600 text-white p-4 rounded-lg text-center mt-4">
            🎉 Thanh toán thành công! Vé sẽ được gửi về email của bạn.
          </div>
        )}
      </div>
    </div>
  );
} 