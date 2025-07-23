"use client";
import React, { useState, useCallback, useEffect, Suspense, useMemo } from "react";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";
import EventInfoCard from "../components/ticket/EventInfoCard";
import { EVENT_INFO } from "../constants/ticket";
import TicketSummaryTable from "../components/checkout/TicketSummaryTable";
import UserInfoForm from "../components/checkout/UserInfoForm";
import CountdownTimer from "../components/checkout/CountdownTimer";
import PolicyCheckbox from "../components/checkout/PolicyCheckbox";
import PaymentModal from "../components/checkout/PaymentModal";
import SessionExpiryModal from "../components/checkout/SessionExpiryModal";
import { useSearchParams, useRouter } from "next/navigation";
import { Ticket } from "../types/ticket";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSessionExpiryModalOpen, setIsSessionExpiryModalOpen] =
    useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  // New: Shared countdown state for the entire checkout process
  const initialCheckoutSeconds = 180; // 3 minutes for checkout
  const [checkoutCountdown, setCheckoutCountdown] = useState(initialCheckoutSeconds);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error">("pending");

  // State to track if component has mounted on client
  const [mounted, setMounted] = useState(false);

  // Callbacks for countdown timer
  const handleCountdownExpire = useCallback(() => setIsSessionExpiryModalOpen(true), []);

  // Parse tickets from URL
  const ticketsParam = searchParams.get("tickets");
  
  const selectedTickets: Ticket[] = useMemo(() => {
    if (!ticketsParam) {
      console.log('No tickets parameter found in URL');
      return [];
    }
    
    try {
      // Log raw parameter for debugging
      console.log('Raw tickets parameter:', ticketsParam);
      
      const decoded = decodeURIComponent(ticketsParam);
      console.log('Decoded tickets parameter:', decoded);
      
      // Basic validation before parsing
      if (!decoded.startsWith('[') || !decoded.endsWith(']')) {
        console.error('Invalid JSON format: Expected array');
        return [];
      }
      
      const parsed = JSON.parse(decoded);
      
      // Validate parsed data structure
      if (!Array.isArray(parsed)) {
        console.error('Invalid data structure: Expected array, got', typeof parsed);
        return [];
      }
      
      // Validate each ticket object
      const validTickets = parsed.filter(ticket => {
        const isValid = ticket 
          && typeof ticket === 'object'
          && typeof ticket.quantity === 'number'
          && ticket.quantity > 0;
        
        if (!isValid) {
          console.error('Invalid ticket object:', ticket);
        }
        return isValid;
      });
      
      return validTickets;
    } catch (error) {
      console.error('Error parsing tickets from URL:', {
        error,
        ticketsParam,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return [];
    }
  }, [ticketsParam]);

  // Check if there are valid tickets
  const hasValidTickets = useMemo(() => 
    selectedTickets.length > 0 && selectedTickets.some(ticket => ticket.quantity > 0)
  , [selectedTickets]);

  useEffect(() => {
    setMounted(true);
    // Generate order details only on client side
    const now = new Date();
    
    // Calculate total tickets
    const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    
    // Generate a unique 8-digit number using timestamp and random number
    const uniqueId = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    // Format date and time parts
    const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const timePart = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Create order number in format: OCX4-DDMM-HHMMSS-TT-XXXXXXXX
    // where TT is total tickets (2 digits) and XXXXXXXX is unique ID
    const orderNumberStr = `OCX4-${datePart}-${timePart}-${totalTickets.toString().padStart(2, '0')}-${uniqueId}`;
    
    console.log('Debug - Order Generation:', {
      now: now.toISOString(),
      totalTickets,
      uniqueId,
      datePart,
      timePart,
      orderNumberStr
    });
    
    // setOrderNumber(orderNumberStr); // Removed as per edit hint
    // setOrderDate(now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, '/')); // Removed as per edit hint
    // setOrderTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })); // Removed as per edit hint
  }, [selectedTickets]); // Add selectedTickets to dependencies since we use it

  // Auto-fill user info when user is logged in
  useEffect(() => {
    if (user && !loading) {
      setUserInfo({
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      });
    }
  }, [user, loading]);

  // Timer logic for checkoutCountdown - only start if there are valid tickets
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkoutCountdown > 0 && !isSessionExpiryModalOpen && hasValidTickets) {
      timer = setInterval(() => {
        setCheckoutCountdown(prev => prev - 1);
      }, 1000);
    } else if (checkoutCountdown <= 0 && !isSessionExpiryModalOpen && hasValidTickets) {
      // Countdown expired, show session expiry modal and set payment status to error
      setIsSessionExpiryModalOpen(true);
      setIsPaymentModalOpen(false); // Close payment modal if open
      setPaymentStatus("error"); // Set payment status to error when time runs out
    }

    return () => clearInterval(timer);
  }, [checkoutCountdown, isSessionExpiryModalOpen, hasValidTickets]);

  // Update payment status when checkoutCountdown changes
  useEffect(() => {
    if (checkoutCountdown <= 0 && paymentStatus !== "error" && hasValidTickets) {
      setPaymentStatus("error");
    } else if (checkoutCountdown > 0 && paymentStatus === "error" && hasValidTickets) {
        setPaymentStatus("pending"); // Reset to pending if time somehow reset
    }
  }, [checkoutCountdown, paymentStatus, hasValidTickets]);

  useEffect(() => {
    if (!hasValidTickets && mounted) {
      router.replace('/ticket?noTickets=true');
    }
  }, [hasValidTickets, mounted, router]);

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayment = async () => {
    // Validate user info - chỉ validate phone và name
    const isPhoneValid = /^\d{10,}$/.test(userInfo.phone);
    const isNameValid = userInfo.fullName.trim() !== "";
    if (!isPhoneValid || !isNameValid || !agreedToPolicies) {
      return;
    }
    if (!user) {
      alert("Vui lòng đăng nhập!");
      return;
    }
    if (!hasValidTickets) {
      alert("Vui lòng chọn vé!");
      return;
    }
    // Chuẩn bị dữ liệu order
    const event_id = "cmd5gmqgp0005v78s79bina9z";
    const organization_id = "cmd5g7d2w0003v78sdjha8onv"; 
    const items = selectedTickets
      .filter(t => t.quantity > 0)
      .map(t => ({
        ticket_id: t.id,
        quantity: t.quantity,
      }));
    // Lấy access token
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!accessToken || !API_BASE_URL) {
      alert("Không xác thực được tài khoản!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id,
          event_id,
          items,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Tạo đơn hàng thất bại: " + (err.message || "Lỗi không xác định"));
        return;
      }
      const order = await res.json();
      setOrderInfo(order);
      setIsPaymentModalOpen(true);
    } catch {
      alert("Lỗi khi tạo đơn hàng!");
    }
  };

  // Removed handlePaymentSuccess as per edit hint

  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  // Show login required if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Vui lòng đăng nhập để tiếp tục</div>
          {/* Nút đăng nhập hoặc redirect sẽ được xử lý ở nơi khác */}
        </div>
      </div>
    );
  }

  

  // Show error if no valid tickets
  if (!hasValidTickets) {
    // Use replace instead of push to avoid adding to history stack
    router.replace('/ticket?noTickets=true');
    return null; // Return null instead of loading state
  }

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
        {mounted && <SimpleHeader lang={"vi"} setLang={() => {}} />}
        
        {/* User Info Bar */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#c53e00] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-zinc-400 text-xs">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28 md:pt-32">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Thanh Toán
          </h1>
          
          {/* Mobile Layout - Single Column */}
          <div className="lg:hidden space-y-6">
            {/* CountdownTimer at top for mobile */}
            <CountdownTimer
              seconds={checkoutCountdown}
              onExpire={handleCountdownExpire}
            />
            
            {/* Event Info */}
            <div className="max-h-[300px] overflow-hidden">
              <EventInfoCard event={EVENT_INFO} />
            </div>
            
            {/* Ticket Summary */}
            <TicketSummaryTable
              selectedTickets={selectedTickets}
              totalAmount={totalAmount}
            />
            
            {/* User Info Form */}
            <UserInfoForm
              userInfo={userInfo}
              onUserInfoChange={handleUserInfoChange}
            />
            
            {/* Policy and Payment Button at bottom for mobile */}
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

          {/* Desktop Layout - Two Columns */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
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
                onExpire={handleCountdownExpire}
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

      {mounted && isPaymentModalOpen && orderInfo && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderInfo={orderInfo}
          // truyền thêm props nếu cần
        />
      )}

      <SessionExpiryModal
        isOpen={isSessionExpiryModalOpen}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
