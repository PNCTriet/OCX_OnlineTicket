"use client";
import { EventInfo } from "../../types/ticket";
import Image from "next/image";
import { useRouter } from "next/navigation";

type EventInfoCardProps = {
  event: EventInfo;
  showBackButton?: boolean;
};

export default function EventInfoCard({ event, showBackButton = false }: EventInfoCardProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/ticket');
  };

  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="grid grid-cols-[auto,1fr] gap-4 items-start">
        {/* Column 1: Event Avatar */}
        <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={event.avatar || "/images/placeholder.png"} // Use event.avatar or a placeholder
            alt={`${event.name} avatar`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>

        {/* Column 2: Event Information */}
        <div className="flex flex-col space-y-2">
          {/* Row 1: Event Name and Back Button */}
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-white leading-tight">{event.name}</h2>
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 bg-[#c53e00] hover:bg-[#b33800] text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                </svg>
                <span>Mua thêm</span>
              </button>
            )}
          </div>

          {/* Row 2: Basic Info with Icons */}
          <div className="flex items-center text-white text-base space-x-4">
            <div className="flex items-center space-x-1">
              {/* Clock Icon */}
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              {/* Calendar Icon */}
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
              <span>{event.date}</span> {/* Assuming event.date exists, if not, adjust */}
            </div>
          </div>

          {/* Row 3: Address */}
          <p className="text-zinc-400 text-sm">{event.location}</p>
        </div>
      </div>
    </div>
  );
} 