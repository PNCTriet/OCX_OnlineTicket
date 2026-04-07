"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
type Ticket = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};
interface CouponValidationResponse {
  valid: boolean;
  discount_amount: number;
  discount_type: string;
  message?: string;
}
type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderInfo: OrderInfo;
  countdownSeconds?: number;
  selectedTickets?: Ticket[];
  finalAmount?: number;
  appliedCoupon?: CouponValidationResponse | null;
  couponCode?: string;
};

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  orderInfo, 
  countdownSeconds, 
  selectedTickets, 
  finalAmount, 
  appliedCoupon, 
  couponCode 
}: PaymentModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [localCountdown, setLocalCountdown] = useState(countdownSeconds || 600);
  const router = useRouter();

  // Sync countdown with parent
  useEffect(() => {
    if (countdownSeconds !== undefined) {
      setLocalCountdown(countdownSeconds);
    }
  }, [countdownSeconds]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || localCountdown <= 0) return;
    
    const timer = setInterval(() => {
      setLocalCountdown(prev => {
        if (prev <= 1) {
          onClose(); // Close modal when countdown expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, localCountdown, onClose]);

  // Format countdown to MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isOpen || !orderInfo?.id) return;
    let interval: NodeJS.Timeout | null = null;
    const checkStatus = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) return;
        
        const res = await fetch(`${API_BASE_URL}/orders/${orderInfo.id}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.status === "PAID" || data.status === "SUCCESS") {
            setIsPaid(true);
            if (interval) clearInterval(interval);
            // Đóng modal thanh toán và hiện popup thành công
            setTimeout(() => {
              setShowSuccessAnimation(true);
              // Trigger animation sequence
              setTimeout(() => setShowCheckmark(true), 300);
              setTimeout(() => setShowMessage(true), 800);
              setTimeout(() => {
                onClose();
                router.push("/OCX5");
              }, 10000);
            }, 1000); // Delay 1 giây để hiển thị trạng thái "Đang xử lý"
          }
        }
      } catch {
        // console.error("Error checking payment status:", error);
      }
    };
    
    interval = setInterval(checkStatus, 3000);
    checkStatus();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, orderInfo?.id, onClose, router]);

  if (!isOpen || !orderInfo) return null;

  // Tạo link QR VietQR với giá cuối cùng sau giảm
  const paymentAmount = finalAmount ?? orderInfo.total_amount;
  // const qrUrl = `https://img.vietqr.io/image/VPB-214244527-compact.png?amount=${paymentAmount}&addInfo=OCX${orderInfo.id}&accountName=PHAM NG CAO TRIET`;
  //const qrUrl = `https://img.vietqr.io/image/VPB-0934782703-compact.png?amount=${paymentAmount}&addInfo=OCX${orderInfo.id}&accountName=LE THI NGOC HAN`;
  const qrUrl = `https://img.vietqr.io/image/VPB-0966512476-compact.png?amount=${paymentAmount}&addInfo=OCX${orderInfo.id}&accountName=TRUONG HOANG NHI`;
  return (
    <>
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

          {/* Countdown Timer */}
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-red-400 font-bold">Thời gian còn lại:</span>
              <span className="text-red-400 font-mono text-xl font-bold">{formatCountdown(localCountdown)}</span>
            </div>
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
              {/* Bank Information */}
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3">Thông tin chuyển khoản</h3>
                <div className="space-y-2 text-white">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Bank:</span>
                    <span className="font-medium">VPBank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Receiver Account:</span>
                    {/* <span className="font-medium">214244527</span> */}
                    <span className="font-medium">0966512476</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Receiver :</span>
                    {/* <span className="font-medium">PHAM NG CAO TRIET</span> */}
                    <span className="font-medium">TRUONG HOANG NHI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="font-medium text-[#c53e00]">{Number(paymentAmount).toLocaleString()} ₫</span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              {/* <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3">Thông tin đơn hàng</h3>
                <div className="space-y-2 text-white">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Mã đơn hàng:</span>
                    <span className="font-medium">{orderInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tổng tiền:</span>
                    <span className="font-medium text-[#c53e00]">{Number(orderInfo.total_amount).toLocaleString()} ₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Trạng thái:</span>
                    <span className="font-medium">{orderInfo.status}</span>
                  </div>
                </div>
              </div> */}

              {/* Ticket Details */}
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3">Chi tiết vé</h3>
                <div className="space-y-3">
                  {selectedTickets?.map((ticket: Ticket) => (
                    <div key={ticket.id} className="border-b border-zinc-700 pb-2 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-white font-medium">{ticket.name}</p>
                          <p className="text-zinc-400 text-sm">Số lượng: {ticket.quantity} vé</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{Number(ticket.price).toLocaleString()} ₫/vé</p>
                          <p className="text-[#c53e00] font-bold">{(Number(ticket.price) * ticket.quantity).toLocaleString()} ₫</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Total Summary */}
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 mt-3">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                      </svg>
                      <span className="text-zinc-400 font-bold">Tổng số vé:</span>
                      <span className="text-zinc-400 font-mono font-bold">
                        {selectedTickets?.reduce((total, ticket) => total + ticket.quantity, 0)} vé
                      </span>
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Tạm tính:</span>
                      <span className="text-white">{Number(orderInfo.total_amount).toLocaleString()} ₫</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">Giảm giá ({couponCode}):</span>
                        <span className="text-green-400">-{appliedCoupon.discount_amount.toLocaleString()} ₫</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center border-t border-zinc-600 pt-2">
                      <span className="text-zinc-400 font-bold">Tổng cộng:</span>
                      <span className="text-[#c53e00] font-bold text-lg">{Number(paymentAmount).toLocaleString()} ₫</span>
                    </div>
                  </div>
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
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-green-400 font-bold">Đang xử lý thanh toán...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Success Animation */}
          <div className="relative bg-zinc-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-green-500/20">
            <div className="flex flex-col items-center space-y-6">
              {/* Checkmark Circle */}
              <div className={`w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center transition-all duration-500 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}>
                <svg 
                  className={`w-10 h-10 text-green-500 transition-all duration-300 ${
                    showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <div className={`text-center transition-all duration-500 ${
                showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Thanh toán thành công!
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Email xác nhận sẽ được gửi đến bạn trong thời gian sớm nhất. 
                  Vé điện tử sẽ được gửi về email của bạn.
                </p>
              </div>

              {/* Loading dots */}
              <div className={`flex space-x-1 transition-all duration-1000 ${
                showMessage ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>

              {/* Redirect message */}
              <div className={`text-center transition-all duration-500 ${
                showMessage ? 'opacity-100' : 'opacity-0'
              }`}>
                <p className="text-zinc-400 text-xs">
                  Locket, story gì lẹ đi mom...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 