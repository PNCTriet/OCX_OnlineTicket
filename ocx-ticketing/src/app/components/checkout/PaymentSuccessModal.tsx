"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PaymentSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // console.log("PaymentSuccessModal opened");
      // Reset states khi modal mở
      setShowCheckmark(false);
      setShowMessage(false);
      
      // Delay để tạo hiệu ứng animation
      const timer1 = setTimeout(() => {
        // console.log("Showing checkmark");
        setShowCheckmark(true);
      }, 300);
      const timer2 = setTimeout(() => {
        // console.log("Showing message");
        setShowMessage(true);
      }, 800);
      const timer3 = setTimeout(() => {
        // console.log("Redirecting to home page");
        onClose();
        router.push("/");
      }, 10000); // Tăng thời gian hiển thị lên 20 giây

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-green-500/20">
        {/* Success Animation */}
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
          <div className={`flex space-x-1 transition-all duration-500 ${
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
              Tự động chuyển về trang chủ trong vài giây...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 