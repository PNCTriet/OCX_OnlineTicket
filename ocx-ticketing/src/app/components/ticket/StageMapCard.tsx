import dynamic from 'next/dynamic';
import { SEAT_LAYOUT_CONFIG } from "../../constants/ticket";
// No longer directly importing Seat as we are not rendering individual seats here

const DynamicSeatMap = dynamic(() => import('./SeatMap'), { ssr: false });

type StageMapCardProps = {
  selectedZoneId: string | null; // Renamed to selectedZoneId
  onZoneSelect: (zoneId: string) => void; // Renamed to onZoneSelect
  tooltipBySectionId?: Record<string, string>;
  iconBySectionId?: Record<string, string>;
  backgroundImageHref?: string;
  layoutConfig?: typeof SEAT_LAYOUT_CONFIG;
  initialScale?: number;
  /**
   * Chỉ render vùng map (dùng trong layout HTML: `.stage-label` + `.seatmap` bọc ngoài).
   * @default false
   */
  embedInSeatmapShell?: boolean;
};

export default function StageMapCard({
  selectedZoneId,
  onZoneSelect,
  tooltipBySectionId,
  iconBySectionId,
  backgroundImageHref,
  layoutConfig,
  initialScale,
  embedInSeatmapShell = false,
}: StageMapCardProps) {
  const map = (
    <div className="flex h-full min-h-[280px] w-full flex-1 flex-col">
      <DynamicSeatMap
        selectedZoneId={selectedZoneId}
        onZoneSelect={onZoneSelect}
        tooltipBySectionId={tooltipBySectionId}
        iconBySectionId={iconBySectionId}
        backgroundImageHref={backgroundImageHref}
        layoutConfig={layoutConfig}
        initialScale={initialScale}
      />
    </div>
  );

  if (embedInSeatmapShell) {
    return map;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#262626] bg-[#0F0F0F] p-6 sm:p-8">
      <div className="mx-auto mb-6 max-w-[480px] text-center">
        <p className="rounded-lg border border-[#262626] bg-[#141414] px-3 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
          — Sân khấu —
        </p>
      </div>
      {map}
    </div>
  );
} 