"use client";
import { EventInfo } from "../../types/ticket";

type EventInfoCardProps = {
  event: EventInfo;
};

export default function EventInfoCard({ event }: EventInfoCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-4">{event.name}</h2>
      <div className="space-y-2 text-zinc-300">
        <p>Thời gian: {event.time}</p>
        <p>Địa điểm: {event.location}</p>
      </div>
    </div>
  );
} 