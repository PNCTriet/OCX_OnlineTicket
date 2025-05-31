"use client";
import { useState } from "react";
import EventInfoCard from "../components/ticket/EventInfoCard";
import SeatMapCard from "../components/ticket/SeatMapCard";
import UserInfoFormCard from "../components/ticket/UserInfoFormCard";
import PaymentMethodCard from "../components/ticket/PaymentMethodCard";
import CountdownCard from "../components/ticket/CountdownCard";
import OrderSummaryCard from "../components/ticket/OrderSummaryCard";
import EmailSentCard from "../components/ticket/EmailSentCard";
import TicketHeader from "../components/ticket/TicketHeader";
import Footer from "../components/Footer";

export default function TicketPage() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [agreed, setAgreed] = useState(false);
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [paid, setPaid] = useState(false);

  // Reset khi countdown hết giờ
  const handleExpire = () => {
    setCountdownExpired(true);
    setSelectedSeats([]);
  };
  // Xác nhận thanh toán
  const handleConfirm = () => {
    setPaid(true);
  };

  if (paid) {
    return (
      <>
        <TicketHeader />
        <EmailSentCard email={userInfo.email || "your@email.com"} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <TicketHeader />
      <div className="min-h-screen bg-zinc-950 py-8 px-2 sm:px-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <EventInfoCard />
            <SeatMapCard selected={selectedSeats} setSelected={setSelectedSeats} />
            <UserInfoFormCard info={userInfo} setInfo={setUserInfo} />
            <PaymentMethodCard method={paymentMethod} setMethod={setPaymentMethod} />
          </div>
          <div className="flex flex-col gap-6">
            <CountdownCard seconds={600} onExpire={handleExpire} />
            <OrderSummaryCard
              selectedSeats={selectedSeats}
              onConfirm={handleConfirm}
              disabled={countdownExpired}
              agreed={agreed}
              setAgreed={setAgreed}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 