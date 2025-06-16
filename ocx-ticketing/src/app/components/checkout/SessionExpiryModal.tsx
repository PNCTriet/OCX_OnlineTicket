"use client";
import { useRouter } from "next/navigation";

type SessionExpiryModalProps = {
  isOpen: boolean;
};

export default function SessionExpiryModal({ isOpen }: SessionExpiryModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-zinc-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Phiên làm việc đã hết hạn</h2>
        <p className="text-zinc-400 mb-6">
          Phiên làm việc của bạn đã hết hạn. Vui lòng quay lại trang mua vé để bắt đầu lại.
        </p>
        <button
          onClick={() => router.push('/ticket')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Quay lại mua vé
        </button>
      </div>
    </div>
  );
} 