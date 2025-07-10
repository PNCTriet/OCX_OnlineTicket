"use client";
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SEAT_LAYOUT_CONFIG, TICKETS } from "../../constants/ticket";

type SeatMapProps = {
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
};

export default function SeatMap({ selectedZoneId, onZoneSelect }: SeatMapProps) {
  // Calculate SVG dimensions based on layout config for proper viewBox
  const minX = Math.min(SEAT_LAYOUT_CONFIG.STAGE.x, ...SEAT_LAYOUT_CONFIG.SECTIONS.map(s => s.x));
  const minY = Math.min(SEAT_LAYOUT_CONFIG.STAGE.y, ...SEAT_LAYOUT_CONFIG.SECTIONS.map(s => s.y));
  const maxX = Math.max(SEAT_LAYOUT_CONFIG.STAGE.x + SEAT_LAYOUT_CONFIG.STAGE.width, ...SEAT_LAYOUT_CONFIG.SECTIONS.map(s => s.x + s.width));
  const maxY = Math.max(SEAT_LAYOUT_CONFIG.STAGE.y + SEAT_LAYOUT_CONFIG.STAGE.height, ...SEAT_LAYOUT_CONFIG.SECTIONS.map(s => s.y + s.height));

  const viewBoxWidth = maxX - minX + 100; // Add some padding
  const viewBoxHeight = maxY - minY + 100; // Add some padding

  return (
    <div className="w-full h-full min-h-[400px] bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        limitToBounds={false}
        centerOnInit={true}
        wheel={{
          step: 0.1
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="tools absolute top-4 right-4 z-20 flex flex-col space-y-2">
              <button onClick={() => zoomIn()} className="p-2 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => zoomOut()} className="p-2 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => resetTransform()} className="p-2 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V2zm2 2h8v8H6V4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <TransformComponent
              contentStyle={{ width: viewBoxWidth, height: viewBoxHeight }}
              wrapperStyle={{ width: '100%', height: '100%' }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`}
                className="select-none"
              >
                {/* Stage */}
                <rect
                  x={SEAT_LAYOUT_CONFIG.STAGE.x}
                  y={SEAT_LAYOUT_CONFIG.STAGE.y}
                  width={SEAT_LAYOUT_CONFIG.STAGE.width}
                  height={SEAT_LAYOUT_CONFIG.STAGE.height}
                  fill="black"
                  rx="5"
                  ry="5"
                />
                <text
                  x={SEAT_LAYOUT_CONFIG.STAGE.x + SEAT_LAYOUT_CONFIG.STAGE.width / 2}
                  y={SEAT_LAYOUT_CONFIG.STAGE.y + SEAT_LAYOUT_CONFIG.STAGE.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="16"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                >
                  STAGE
                </text>

                {/* Seat Sections */}
                {SEAT_LAYOUT_CONFIG.SECTIONS.map(section => {
                  const ticketInfo = TICKETS.find(ticket => ticket.id === section.ticketTypeId);
                  const tooltipText = ticketInfo ? 
                    `${ticketInfo.name} - ${ticketInfo.price.toLocaleString()}đ` :
                    `Khu vực ${section.label}`;
                  return (
                    <React.Fragment key={section.id}>
                      <rect
                        x={section.x}
                        y={section.y}
                        width={section.width}
                        height={section.height}
                        fill={section.color}
                        opacity="0.2" // Slightly transparent background for sections
                        rx="5"
                        ry="5"
                        className={`cursor-pointer transition-all duration-100 ${
                          selectedZoneId === section.id ? "ring-2 ring-white" : ""
                        }`}
                        onClick={() => onZoneSelect(section.id)}
                      >
                        <title>{tooltipText}</title>
                      </rect>
                      <text
                        x={section.x + section.width / 2}
                        y={section.y + section.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="20"
                        fontWeight="800"
                        fontFamily="Inter, sans-serif"
                        className="pointer-events-none" // Prevent text from blocking click
                      >
                        {section.label}
                      </text>
                    </React.Fragment>
                  );
                })}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
} 