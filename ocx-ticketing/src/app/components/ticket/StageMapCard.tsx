import { Zone } from "../../types/ticket";

type StageMapCardProps = {
  zones: Zone[];
  selectedZone: string | null;
  onZoneSelect: (zoneId: string) => void;
};

export default function StageMapCard({ zones, selectedZone, onZoneSelect }: StageMapCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white">SÂN KHẤU</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {zones.map((zone, index) => (
          <div
            key={zone.id}
            onClick={() => onZoneSelect(zone.id)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 
              ${index < 2 ? 'w-1/2 md:w-1/3 lg:w-[calc(50%-0.375rem)]' : 'w-1/2 md:w-1/3 lg:w-[calc(33.333%-0.5rem)]'}
              ${selectedZone === zone.id ? "ring-2 ring-white" : ""}
            `}
            style={{ backgroundColor: zone.color }}
          >
            <div className="flex justify-center items-center">
              <span className="font-medium text-black text-center">{zone.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 