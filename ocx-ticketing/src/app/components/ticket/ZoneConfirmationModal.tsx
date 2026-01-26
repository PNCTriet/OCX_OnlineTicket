import { Zone } from "../../types/ticket";
import Image from "next/image";
import { useEffect, useState } from "react";

const HOUSE_BY_SECTION_ID: Record<
  string,
  { code: "GRY" | "HUF" | "SLY" | "RAV"; name: string; logo: string }
> = {
  D: {
    code: "GRY",
    name: "[ VÉ ĐỨNG ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_gri_alt1.svg",
  },
  B: {
    code: "HUF",
    name: "[ VÉ NGỒI ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_huf_alt1.svg",
  },
  A: {
    code: "SLY",
    name: "[ VÉ NGỒI ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_sly_alt1.svg",
  },
  C: {
    code: "RAV",
    name: "[ VÉ NGỒI ]",
    logo: "/images/ocx5_images/elements/ticket_house/ocx_logo_ss5_house_rav_alt1.svg",
  },
};

type ZoneConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nextQty: number) => void;
  zone: Zone | null;
  initialQuantity: number;
  maxQuantity: number;
};

export default function ZoneConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  zone,
  initialQuantity,
  maxQuantity,
}: ZoneConfirmationModalProps) {
  // Hooks must be called unconditionally (avoid early returns before hooks).
  const [qty, setQty] = useState<number>(initialQuantity);

  const sectionId = zone?.id
    ? zone.id.startsWith("zone-")
      ? zone.id.replace("zone-", "")
      : zone.id
    : "";
  const house = sectionId ? HOUSE_BY_SECTION_ID[sectionId] : undefined;

  useEffect(() => {
    if (!isOpen || !zone) return;
    setQty(initialQuantity);
  }, [initialQuantity, zone?.id, isOpen, zone]);

  if (!isOpen || !zone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-6 shadow-2xl border border-white/10"
        style={{
          background:
            // Opaque background (no transparency)
            "linear-gradient(180deg, rgb(0,0,0) 0%, rgb(44,9,11) 55%, rgb(60,10,12) 100%)",
        }}
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            {house?.logo && (
              <div className="relative w-10 h-10">
                <Image
                  src={house.logo}
                  alt={house.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="text-left">
              <div className="text-white font-extrabold tracking-widest text-lg">
                {house?.code ?? zone.name}
              </div>
              <div className="text-white/70 text-sm">{house?.name ?? "Zone"}</div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Xác nhận thêm vé</h3>
          <p className="text-white/80">
            Bạn có muốn thêm vé cho <span className="font-bold">{house?.code ?? zone.name}</span>?
          </p>
          {zone.description && (
            <p className="mt-2 text-white/60 text-sm">{zone.description}</p>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          {/* Quantity controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setQty((v) => Math.max(0, v - 1))}
              disabled={qty <= 0}
              className="w-11 h-11 rounded-full bg-white/10 text-white disabled:opacity-40 hover:bg-white/15 transition-colors flex items-center justify-center text-2xl"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-white font-extrabold text-3xl tabular-nums">{qty}</div>
              <div className="text-white/60 text-xs">Tối đa {maxQuantity} vé</div>
            </div>
            <button
              type="button"
              onClick={() => setQty((v) => Math.min(maxQuantity, v + 1))}
              disabled={qty >= maxQuantity}
              className="w-11 h-11 rounded-full bg-white/10 text-white disabled:opacity-40 hover:bg-white/15 transition-colors flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onConfirm(qty)}
            className="w-full py-3 px-4 text-white rounded-xl font-bold transition-transform hover:scale-[1.01] active:scale-95"
            style={{
              backgroundColor: zone.color,
              boxShadow: `0 0 18px rgba(212,57,34,0.25)`,
            }}
          >
            {qty === 0 ? "Bỏ chọn" : "Cập nhật"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/15 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
} 