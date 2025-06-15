import dynamic from 'next/dynamic';
// No longer directly importing Seat as we are not rendering individual seats here

const DynamicSeatMap = dynamic(() => import('./SeatMap'), { ssr: false });

type StageMapCardProps = {
  selectedZoneId: string | null; // Renamed to selectedZoneId
  onZoneSelect: (zoneId: string) => void; // Renamed to onZoneSelect
};

export default function StageMapCard({ selectedZoneId, onZoneSelect }: StageMapCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white">SÂN KHẤU</h2>
      </div>
      <div className="flex-1 w-full h-full">
        <DynamicSeatMap 
          selectedZoneId={selectedZoneId}
          onZoneSelect={onZoneSelect}
        />
      </div>
    </div>
  );
} 