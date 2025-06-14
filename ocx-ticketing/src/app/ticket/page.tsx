"use client";
import { useState } from "react";
import TicketHeader from "../components/ticket/TicketHeader";
import EventInfoCard from "../components/ticket/EventInfoCard";
import TicketSelectionCard from "../components/ticket/TicketSelectionCard";
import OrderSummaryCard from "../components/ticket/OrderSummaryCard";
import StageMapCard from "../components/ticket/StageMapCard";
import Footer from "../components/Footer";
import { TICKETS, ZONES, EVENT_INFO } from "../constants/ticket";
import { TicketType } from "../types/ticket";

export default function TicketPage() {
  const [tickets, setTickets] = useState<TicketType[]>(TICKETS);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [lang, setLang] = useState<"vi" | "en">("vi");

  const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0);

  const handleQuantityChange = (ticketId: string, change: number) => {
    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          const newQuantity = Math.max(0, ticket.quantity + change);
          return { ...ticket, quantity: newQuantity };
        }
        return ticket;
      })
    );
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    const selectedZoneData = ZONES.find(zone => zone.id === zoneId);
    if (selectedZoneData) {
      setTickets(prevTickets =>
        prevTickets.map(ticket => {
          if (ticket.id === selectedZoneData.ticketTypeId) {
            return { ...ticket, quantity: ticket.quantity + 1 };
          }
          return ticket;
        })
      );
    }
  };

  const handleContinue = () => {
    // TODO: Implement continue logic
    console.log("Continue with:", { tickets, selectedZone, totalAmount });
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8
        }}
      />
      <div className="relative z-10">
        <TicketHeader lang={lang} setLang={setLang} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28 md:pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Right Panel (now containing StageMapCard and OrderSummaryCard) */}
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
              <StageMapCard
                zones={ZONES}
                selectedZone={selectedZone}
                onZoneSelect={handleZoneSelect}
              />
            </div>

            {/* Left Panel (now containing EventInfoCard and TicketSelectionCard) */}
            <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
              <EventInfoCard event={EVENT_INFO} />
              <TicketSelectionCard 
                tickets={tickets} 
                onQuantityChange={handleQuantityChange} 
                highlightedTicketId={selectedZone}
              />
              <OrderSummaryCard totalAmount={totalAmount} onContinue={handleContinue} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
} 