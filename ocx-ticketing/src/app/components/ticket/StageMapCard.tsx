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
};

export default function StageMapCard({
  selectedZoneId,
  onZoneSelect,
  tooltipBySectionId,
  iconBySectionId,
  backgroundImageHref,
  layoutConfig,
  initialScale,
}: StageMapCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full min-h-0 overflow-hidden">
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold text-white">SÂN KHẤU</h2>
      </div>
      <div className="flex-1 w-full h-full min-h-0">
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
    </div>
  );
} 