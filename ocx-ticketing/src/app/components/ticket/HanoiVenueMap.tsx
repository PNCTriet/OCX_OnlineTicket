"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/** Trung tâm nội đô Hà Nội (tham chiếu địa điểm sự kiện OCX5) */
const HANOI_CENTER: [number, number] = [21.0285, 105.854];

/**
 * Bản đồ nền tối (CARTO dark_matter) — Leaflet, không cần API key.
 */
export default function HanoiVenueMap() {
  return (
    <div className="h-[min(320px,50vh)] w-full min-h-[220px] overflow-hidden rounded-xl border border-[#262626] bg-[#0A0A0A] [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-[#0A0A0A] [&_.leaflet-control-attribution]:max-w-full [&_.leaflet-control-attribution]:truncate [&_.leaflet-control-attribution]:bg-black/50 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:text-[#A1A1A1]">
      <MapContainer
        center={HANOI_CENTER}
        zoom={12}
        className="h-full w-full outline-none"
        scrollWheelZoom={false}
        aria-label="Bản đồ Hà Nội"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <CircleMarker
          center={HANOI_CENTER}
          radius={9}
          pathOptions={{
            color: "#FF6B1A",
            weight: 2,
            fillColor: "#FF6B1A",
            fillOpacity: 0.35,
          }}
        >
          <Popup className="[&_.leaflet-popup-content-wrapper]:rounded-lg [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-[#262626] [&_.leaflet-popup-content-wrapper]:bg-[#141414] [&_.leaflet-popup-content-wrapper]:text-[#FAFAFA] [&_.leaflet-popup-tip]:bg-[#141414]">
            <span className="text-sm font-medium text-[#FAFAFA]">
              Thủ đô Hà Nội
            </span>
            <br />
            <span className="text-xs text-[#A1A1A1]">Ớt Cay Xè Hà Nội · 07/2026</span>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
