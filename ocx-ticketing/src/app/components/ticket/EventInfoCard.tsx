"use client";
import { EventInfo } from "../../types/ticket";
import Image from "next/image";

type EventInfoCardProps = {
  event: EventInfo;
};

export default function EventInfoCard({ event }: EventInfoCardProps) {
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
          {/* Row 1: Event Name */}
          <h2 className="text-xl font-bold text-white leading-tight">{event.name}</h2>

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