"use client";

/** Checkout + zone seatmap (04A). Lưới ghế từng ô: `/demo/seatmap`. */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";
import SeatMapLegend from "@/components/v2/SeatMapLegend";
import StageMapCard from "../components/ticket/StageMapCard";
import SeatmapOrderSummary from "../components/ticket/SeatmapOrderSummary";
import ZoneConfirmationModal from "../components/ticket/ZoneConfirmationModal";
import { TICKETS, ZONES, EVENT_INFO, SEAT_LAYOUT_CONFIG } from "../constants/ticket";
import type { TicketType, Zone } from "../types/ticket";

export default function TicketSeatmapPage() {
  const [selectedTickets, setSelectedTickets] = useState<
    (TicketType & { quantity: number })[]
  >(TICKETS.map((ticket) => ({ ...ticket, quantity: 0 })));
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingZone, setPendingZone] = useState<Zone | null>(null);
  const [showNoTicketsError, setShowNoTicketsError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("noTickets") === "true") setShowNoTicketsError(true);
  }, []);

  const handleZoneSelect = (sectionId: string) => {
    const sectionConfig = SEAT_LAYOUT_CONFIG.SECTIONS.find((s) => s.id === sectionId);
    if (!sectionConfig) return;

    const correspondingZone = ZONES.find(
      (z) => z.ticketTypeId === sectionConfig.ticketTypeId
    );
    if (!correspondingZone) return;

    if (selectedZone === sectionId) {
      setSelectedZone(null);
      setSelectedTickets((prevTickets) =>
        prevTickets.map((ticket) => {
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
    setShowNoTicketsError(false);
    if (pendingZone) {
      const sectionIdForPendingZone =
        SEAT_LAYOUT_CONFIG.SECTIONS.find((s) => s.ticketTypeId === pendingZone.ticketTypeId)
          ?.id ?? null;
      setSelectedZone(sectionIdForPendingZone);

      setSelectedTickets((prevTickets) =>
        prevTickets.map((ticket) => {
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
    const ticketsToBuy = selectedTickets.filter((t) => t.quantity > 0);
    if (ticketsToBuy.length === 0) {
      setShowNoTicketsError(true);
      return;
    }

    try {
      const ticketsJson = JSON.stringify(ticketsToBuy);
      const encodedTickets = encodeURIComponent(ticketsJson);
      router.push(`/checkout?tickets=${encodedTickets}`);
    } catch {
      router.push("/checkout");
    }
  };

  const sortedTickets = useMemo(
    () =>
      [...selectedTickets].sort((a, b) => {
        const statusOrder = (s: string) => {
          if (s === "ACTIVE") return 0;
          if (s === "INACTIVE") return 1;
          return 2;
        };
        return statusOrder(a.status) - statusOrder(b.status);
      }),
    [selectedTickets]
  );

  const hasTickets = selectedTickets.some((t) => t.quantity > 0);

  return (
    <>
      <PageLayout>
        <Header lang={lang} onLangChange={setLang} />
        <main className="mx-auto max-w-[1280px] px-6">
          <section className="mt-12 border-t border-[#262626] py-12">
            <div className="mb-8">
              <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-[#737373]">
                {lang === "vi" ? "Thanh toán — có sơ đồ ghế" : "Checkout — with seatmap"}
              </h2>
              <h3 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.7px] text-[#FAFAFA]">
                {lang === "vi" ? "Chọn ghế" : "Pick your seats"}
              </h3>
            </div>

            {showNoTicketsError && (
              <div className="mb-8 rounded-lg border border-[#F8717140] bg-[#F8717114] p-4 text-center text-sm text-[#F87171]">
                Vui lòng chọn ít nhất một vé để tiếp tục.
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_400px] lg:items-start">
              <div>
                <div className="mx-auto mb-8 max-w-[480px] text-center">
                  <p className="rounded-lg border border-[#262626] bg-[#1A1A1A] px-3 py-3 text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
                    {lang === "vi" ? "— SÂN KHẤU —" : "— STAGE —"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#262626] bg-[#0F0F0F] p-8">
                  <StageMapCard
                    embedInSeatmapShell
                    selectedZoneId={selectedZone}
                    onZoneSelect={handleZoneSelect}
                  />
                </div>

                <SeatMapLegend lang={lang} />
              </div>

              <aside>
                <SeatmapOrderSummary
                  lang={lang}
                  eventTitle={EVENT_INFO.name}
                  selectedTickets={sortedTickets}
                  onContinue={handleContinue}
                  hasTickets={hasTickets}
                />
              </aside>
            </div>
          </section>
        </main>
        <V2Footer />
      </PageLayout>

      <ZoneConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={(qty) => {
          if (qty <= 0) {
            handleCloseModal();
            return;
          }
          handleConfirmZone();
        }}
        zone={pendingZone}
        initialQuantity={1}
        maxQuantity={1}
      />
    </>
  );
}
