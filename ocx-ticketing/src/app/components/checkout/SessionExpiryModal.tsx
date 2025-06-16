"use client";
import { useRouter } from "next/navigation";

type SessionExpiryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SessionExpiryModal({ isOpen, onClose }: SessionExpiryModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleReturnToTickets = () => {
    router.push("/ticket");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Phiên đã hết hạn</h2>
          <p className="text-zinc-400 mb-6">
            Thời gian giữ vé của bạn đã hết. Vui lòng quay lại trang mua vé để chọn lại.
          </p>
          <button
            onClick={handleReturnToTickets}
            className="w-full py-3 px-6 bg-[#c53e00] hover:bg-[#b33800] text-white font-bold rounded-lg transition-colors"
          >
            Quay lại mua vé
          </button>
        </div>
      </div>
    </div>
  );
} 