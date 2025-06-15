import { Zone } from "../../types/ticket";

type ZoneConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  zone: Zone | null;
};

export default function ZoneConfirmationModal({ isOpen, onClose, onConfirm, zone }: ZoneConfirmationModalProps) {
  if (!isOpen || !zone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900/90 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Xác nhận thêm vé</h3>
          <p className="text-zinc-400">
            Bạn có muốn thêm vé cho khu vực {zone.name}?
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 bg-[#c53e00] text-white rounded-lg font-medium hover:bg-[#b33800] transition-colors"
          >
            Thêm vào giỏ
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
} 