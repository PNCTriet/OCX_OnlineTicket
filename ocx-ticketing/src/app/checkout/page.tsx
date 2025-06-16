"use client";
import React, { useState, useCallback, useEffect } from "react";
import TicketHeader from "../components/ticket/TicketHeader";
import Footer from "../components/Footer";
import EventInfoCard from "../components/ticket/EventInfoCard";
import { EVENT_INFO } from "../constants/ticket";
import TicketSummaryTable from "../components/checkout/TicketSummaryTable";
import UserInfoForm from "../components/checkout/UserInfoForm";
import CountdownTimer from "../components/checkout/CountdownTimer";
import PolicyCheckbox from "../components/checkout/PolicyCheckbox";
import PaymentModal from "../components/checkout/PaymentModal";
import SessionExpiryModal from "../components/checkout/SessionExpiryModal";
import { useSearchParams } from "next/navigation";
import { Ticket } from "../types/ticket";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSessionExpiryModalOpen, setIsSessionExpiryModalOpen] =
    useState(false);

  // New: Shared countdown state for the entire checkout process
  const initialCheckoutSeconds = 180; // 3 minutes for checkout
  const [checkoutCountdown, setCheckoutCountdown] = useState(initialCheckoutSeconds);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error">("pending");

  // States for dynamic QR content, generated on client mount
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [orderDate, setOrderDate] = useState<string | null>(null);
  const [orderTime, setOrderTime] = useState<string | null>(null);

  // State to track if component has mounted on client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate order details only on client side
    const now = new Date();
    setOrderNumber(now.getTime());
    setOrderDate(now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, '/'));
    setOrderTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
  }, []);

  // Timer logic for checkoutCountdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkoutCountdown > 0 && !isSessionExpiryModalOpen) {
      timer = setInterval(() => {
        setCheckoutCountdown(prev => prev - 1);
      }, 1000);
    } else if (checkoutCountdown <= 0 && !isSessionExpiryModalOpen) {
      // Countdown expired, show session expiry modal and set payment status to error
      setIsSessionExpiryModalOpen(true);
      setIsPaymentModalOpen(false); // Close payment modal if open
      setPaymentStatus("error"); // Set payment status to error when time runs out
    }

    return () => clearInterval(timer);
  }, [checkoutCountdown, isSessionExpiryModalOpen]);

  // Update payment status when checkoutCountdown changes
  useEffect(() => {
    if (checkoutCountdown <= 0 && paymentStatus !== "error") {
      setPaymentStatus("error");
    } else if (checkoutCountdown > 0 && paymentStatus === "error") {
        setPaymentStatus("pending"); // Reset to pending if time somehow reset
    }
  }, [checkoutCountdown, paymentStatus]);

  // Parse tickets from URL
  const ticketsParam = searchParams.get("tickets");
  const selectedTickets: Ticket[] = ticketsParam
    ? JSON.parse(decodeURIComponent(ticketsParam))
    : [];

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayment = () => {
    // Validate user info
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
    const isPhoneValid = /^\d{10,}$/.test(userInfo.phone);
    const isNameValid = userInfo.fullName.trim() !== "";

    if (!isEmailValid || !isPhoneValid || !isNameValid || !agreedToPolicies) {
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/images/hero_backround_ss3_alt1.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      />
      <div className="relative z-10">
        {mounted && <TicketHeader lang={"vi"} setLang={() => {}} />}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28 md:pt-32">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Thanh Toán
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="max-h-[300px] overflow-hidden">
                <EventInfoCard event={EVENT_INFO} />
              </div>
              <TicketSummaryTable
                selectedTickets={selectedTickets}
                totalAmount={totalAmount}
              />
              <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <PolicyCheckbox
                  agreedToPolicies={agreedToPolicies}
                  onAgreementChange={setAgreedToPolicies}
                />
                <button
                  onClick={handlePayment}
                  disabled={!agreedToPolicies}
                  className="w-full py-3 px-4 bg-[#c53e00] text-white rounded-lg font-medium hover:bg-[#b33800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thanh toán
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <CountdownTimer
                seconds={checkoutCountdown}
                onExpire={useCallback(() => setIsSessionExpiryModalOpen(true), [])}
              />
              <UserInfoForm
                userInfo={userInfo}
                onUserInfoChange={handleUserInfoChange}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {mounted && isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          selectedTickets={selectedTickets}
          totalAmount={totalAmount}
          userInfo={userInfo}
          paymentRemainingSeconds={checkoutCountdown}
          paymentStatus={paymentStatus}
          orderNumber={orderNumber}
          orderDate={orderDate}
          orderTime={orderTime}
        />
      )}

      <SessionExpiryModal
        isOpen={isSessionExpiryModalOpen}
        onClose={() => setIsSessionExpiryModalOpen(false)}
      />
    </div>
  );
}
