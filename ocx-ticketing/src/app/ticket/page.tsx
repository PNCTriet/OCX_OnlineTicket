"use client";
import { useState, useEffect } from "react";
import SimpleHeader from "../components/SimpleHeader";
import EventInfoCard from "../components/ticket/EventInfoCard";
import TicketSelectionCard from "../components/ticket/TicketSelectionCard";
import OrderSummaryCard from "../components/ticket/OrderSummaryCard";
import StageMapCard from "../components/ticket/StageMapCard";
import ZoneConfirmationModal from "../components/ticket/ZoneConfirmationModal";
import Footer from "../components/Footer";
import { TICKETS, ZONES, EVENT_INFO, SEAT_LAYOUT_CONFIG } from "../constants/ticket";
import { TicketType, Zone } from "../types/ticket";
import { useRouter } from 'next/navigation';

export default function TicketPage() {
  const [selectedTickets, setSelectedTickets] = useState<(TicketType & { quantity: number })[]>(
    TICKETS.map(ticket => ({ ...ticket, quantity: 0 }))
  );
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingZone, setPendingZone] = useState<Zone | null>(null);
  const [showNoTicketsError, setShowNoTicketsError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if we came from checkout without tickets
    const urlParams = new URLSearchParams(window.location.search);
    const noTickets = urlParams.get('noTickets');
    if (noTickets === 'true') {
      setShowNoTicketsError(true);
    }
  }, []);

  const handleQuantityChange = (ticketId: string, change: number) => {
    setShowNoTicketsError(false); // Clear error when user selects tickets
    setSelectedTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          const newQuantity = ticket.quantity + change;
          // Prevent negative quantities
          if (newQuantity < 0) return ticket;
          // Prevent exceeding max limit of 5 tickets per type
          if (newQuantity > 5) return ticket;
          return { ...ticket, quantity: newQuantity };
        }
        return ticket;
      })
    );
  };

  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  const handleZoneSelect = (sectionId: string) => {
    const sectionConfig = SEAT_LAYOUT_CONFIG.SECTIONS.find(s => s.id === sectionId);
    if (!sectionConfig) {
      return;
    }

    const correspondingZone = ZONES.find(z => z.ticketTypeId === sectionConfig.ticketTypeId);
    if (!correspondingZone) {
      console.error(`No corresponding Zone found for ticketTypeId: ${sectionConfig.ticketTypeId}`);
      return;
    }

    if (selectedZone === sectionId) {
      setSelectedZone(null);
      setSelectedTickets(prevTickets =>
        prevTickets.map(ticket => {
          if (ticket.id === correspondingZone.ticketTypeId && ticket.quantity > 0) {
            return { ...ticket, quantity: ticket.quantity - 1 };
          }
          return ticket;
        })
      );
    } else {
      setPendingZone(correspondingZone);
      setIsModalOpen(true);
    }
  };

  const handleConfirmZone = () => {
    if (pendingZone) {
      const sectionIdForPendingZone = SEAT_LAYOUT_CONFIG.SECTIONS.find(s => s.ticketTypeId === pendingZone.ticketTypeId)?.id || null;
      setSelectedZone(sectionIdForPendingZone);

      setSelectedTickets(prevTickets =>
        prevTickets.map(ticket => {
          if (ticket.id === pendingZone.ticketTypeId) {
            return { ...ticket, quantity: ticket.quantity + 1 };
          }
          return ticket;
        })
      );
    }
    setIsModalOpen(false);
    setPendingZone(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingZone(null);
  };

  const handleContinue = () => {
    const ticketsToBuy = selectedTickets.filter(t => t.quantity > 0);
    if (ticketsToBuy.length === 0) {
      setShowNoTicketsError(true);
      return;
    }

    try {
      const ticketsJson = JSON.stringify(ticketsToBuy);
      const encodedTickets = encodeURIComponent(ticketsJson);
      router.push(`/checkout?tickets=${encodedTickets}`);
    } catch (error) {
      console.error('Error encoding tickets for checkout:', error);
      // Fallback: redirect without tickets
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8
        }}
      />
      <div className="relative z-10">
        <SimpleHeader lang={lang} setLang={setLang} />
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 pt-24 sm:pt-28 md:pt-32">
          {showNoTicketsError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
              {/* <p className="text-center">Vui lòng chọn ít nhất một vé để tiếp tục.</p> */}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
              <StageMapCard
                selectedZoneId={selectedZone}
                onZoneSelect={handleZoneSelect}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="space-y-6">
                  <EventInfoCard event={EVENT_INFO} />
                  <TicketSelectionCard 
                    tickets={selectedTickets} 
                    onQuantityChange={handleQuantityChange}
                    selectedZoneId={selectedZone}
                  />
                  <OrderSummaryCard 
                    totalAmount={totalAmount} 
                    onContinue={handleContinue}
                    hasTickets={selectedTickets.some(ticket => ticket.quantity > 0)}
                    selectedTickets={selectedTickets}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <ZoneConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmZone}
        zone={pendingZone}
      />
    </div>
  );
} 