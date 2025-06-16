"use client";
import { Ticket } from "../../types/ticket";
import Image from "next/image";
import { useEffect } from "react";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: (Ticket & { quantity: number })[];
  totalAmount: number;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentRemainingSeconds: number;
  paymentStatus: "pending" | "success" | "error";
  orderNumber: number | null;
  orderDate: string | null;
  orderTime: string | null;
};

export default function PaymentModal({ isOpen, onClose, selectedTickets, totalAmount, userInfo, paymentRemainingSeconds, paymentStatus, orderNumber, orderDate, orderTime }: PaymentModalProps) {
  // Effect để ngăn cuộn trang chính khi modal mở (di chuyển lên trên)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Chỉ tạo qrUrl khi các giá trị orderNumber, orderDate, orderTime đã có
  // Nếu chưa có, sử dụng một ảnh placeholder tĩnh
  const qrUrl = (orderNumber && orderDate && orderTime)
    ? `https://img.vietqr.io/image/VPB-214244527-compact.png?amount=${totalAmount}&addInfo=${encodeURIComponent("#OCX4 - Order " + orderNumber + " - " + orderDate + " " + orderTime)}&accountName=${encodeURIComponent("PHAM NG CAO TRIET")}`
    : "/images/qr_code_placeholder.png"; // Đảm bảo bạn có ảnh này trong thư mục public/images

  const currentPaymentStatus = paymentStatus;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
          <h2 className="text-2xl font-bold text-white">Thanh toán</h2>
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
                src={qrUrl} // Luôn có một URL hợp lệ
                alt="QR Code chuyển khoản ngân hàng"
                fill
                className="object-contain"
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
              <h3 className="text-lg font-bold text-white mb-2">Thông tin thanh toán</h3>
              <div className="space-y-2 text-white">
                <p><span className="text-zinc-400">Số tiền:</span> {totalAmount.toLocaleString()}đ</p>
                <p><span className="text-zinc-400">Người nhận:</span> {userInfo.fullName}</p>
                <p><span className="text-zinc-400">Email:</span> {userInfo.email}</p>
                <p><span className="text-zinc-400">Số điện thoại:</span> {userInfo.phone}</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Chi tiết vé</h3>
              <div className="space-y-2">
                {selectedTickets.filter(t => t.quantity > 0).map(ticket => (
                  <div key={ticket.id} className="text-white">
                    <p>{ticket.name} x{ticket.quantity}</p>
                    <p className="text-zinc-400">{ticket.price.toLocaleString()}đ/vé</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New: Payment Status and Remaining Time */}
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Trạng thái thanh toán</h3>
              <div className="space-y-2 text-white">
                <p>
                  <span className="text-zinc-400">Trạng thái:</span>{" "}
                  <span className={currentPaymentStatus === "pending" ? "text-yellow-400" : currentPaymentStatus === "success" ? "text-green-500" : "text-red-500"}>
                    {currentPaymentStatus === "pending" && "Đang chờ"}
                    {currentPaymentStatus === "success" && "Thành công"}
                    {currentPaymentStatus === "error" && "Thất bại / Hết thời gian"}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-400">Thời gian còn lại:</span>{" "}
                  {formatTime(paymentRemainingSeconds)}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 