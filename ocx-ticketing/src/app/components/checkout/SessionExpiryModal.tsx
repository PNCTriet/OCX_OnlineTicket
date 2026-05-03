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
      <div className="absolute inset-0 bg-[#0A0A0A]/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-[#262626] bg-[#141414] p-8 shadow-2xl ring-1 ring-black/20">
        <div className="mb-2 inline-flex rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#FBBF24]">
          Hết phiên
        </div>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-[#FAFAFA]">
          Phiên làm việc đã hết hạn
        </h2>
        <p className="mb-8 text-[15px] leading-relaxed text-[#A1A1A1]">
          Phiên giữ vé của bạn đã kết thúc. Vui lòng quay lại trang chủ để chọn vé mới.
        </p>
        <button
          type="button"
          onClick={() => router.push("/OCX5")}
          className="w-full rounded-xl bg-[#FF6B1A] py-3 text-base font-semibold text-white transition hover:bg-[#e55f15]"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
