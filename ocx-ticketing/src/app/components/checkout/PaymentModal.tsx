"use client";
import { Ticket } from "../../types/ticket";
import Image from "next/image";
import { useEffect, useState } from "react";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: (Ticket & { quantity: number })[];
  totalAmount: number;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
    message?: string;
  };
  paymentRemainingSeconds: number;
  paymentStatus: "pending" | "success" | "error";
  orderNumber: number | null;
  orderDate: string | null;
  orderTime: string | null;
  onPaymentSuccess?: () => void; // Add callback for payment success
};

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  selectedTickets, 
  totalAmount, 
  userInfo, 
  paymentRemainingSeconds, 
  paymentStatus, 
  orderNumber, 
  orderDate, 
  orderTime,
  onPaymentSuccess 
}: PaymentModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  // Send real email with electronic tickets using Resend API
  const sendEmailWithTickets = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Log the data being sent for verification
      console.log('📧 Preparing to send email with data:');
      console.log('👤 User Info:', userInfo);
      console.log('🎫 Selected Tickets:', selectedTickets.filter(t => t.quantity > 0));
      console.log('🔢 Order Details:', { orderNumber, orderDate, orderTime, totalAmount });
      
      // Prepare email data
      const emailData = {
        to: userInfo.email,
        subject: `🎫 Vé điện tử OCX4 - Đơn hàng #${orderNumber}`,
        tickets: selectedTickets.filter(t => t.quantity > 0),
        customerInfo: userInfo,
        orderNumber: orderNumber,
        orderDate: orderDate,
        orderTime: orderTime,
        totalAmount: totalAmount
      };

      console.log('📧 Sending email to:', userInfo.email);
      console.log('📧 Email subject:', emailData.subject);

      // Call our API route to send email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Email sent successfully:', result.data);
        setEmailSent(true);
        
        // Call success callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        console.error('❌ Failed to send email:', result.error);
        alert('❌ Có lỗi khi gửi email. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      alert('❌ Có lỗi khi gửi email. Vui lòng thử lại sau.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
                <p><span className="text-zinc-400">Người mua:</span> {userInfo.fullName}</p>
                <p><span className="text-zinc-400">Email:</span> {userInfo.email}</p>
                <p><span className="text-zinc-400">Số điện thoại:</span> {userInfo.phone}</p>
                {userInfo.message && (
                  <p><span className="text-zinc-400">Lời nhắn:</span> {userInfo.message}</p>
                )}
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

            {/* New: Simulate Payment Success Button */}
            {!emailSent && (
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Gửi email vé điện tử</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Nhấn nút bên dưới để gửi email vé điện tử tới {userInfo.email}
                </p>
                <button
                  onClick={sendEmailWithTickets}
                  disabled={isProcessingPayment}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang gửi email...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Gửi email vé điện tử</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Success Message */}
            {emailSent && (
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-green-500">Thanh toán thành công!</h3>
                    <p className="text-green-400 text-sm">
                      Email vé điện tử đã được gửi tới {userInfo.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
} 