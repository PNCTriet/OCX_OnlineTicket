"use client";
import React, { useState, useCallback, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EVENT_INFO } from "../constants/ticket";
import TicketSummaryTable from "../components/checkout/TicketSummaryTable";
import TicketDetail from "@/components/v2/TicketDetail";
import CheckoutForm from "@/components/v2/CheckoutForm";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";
import CountdownTimer from "../components/checkout/CountdownTimer";
import PolicyCheckbox from "../components/checkout/PolicyCheckbox";
import PaymentModal from "../components/checkout/PaymentModal";
import SessionExpiryModal from "../components/checkout/SessionExpiryModal";
import { Ticket } from "../types/ticket";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase";
import { CHECKOUT_PROMO_ENABLED } from "@/lib/flags";
import {
  loadCheckoutContact,
  saveCheckoutContact,
} from "@/lib/checkout-contact-session";

type OrderInfo = {
  id: string;
  total_amount: number;
  status: string;
  order_items?: Array<{
    id: string;
    ticket_id: string;
    quantity: number;
    price: number;
  }>;
};

// Interface for coupon validation response
interface CouponValidationResponse {
  valid: boolean;
  discount_amount: number;
  discount_type: string;
  message?: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    facebook: "",
    refcode: "",
  });
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSessionExpiryModalOpen, setIsSessionExpiryModalOpen] =
    useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // New: Shared countdown state for the entire checkout process
  const initialCheckoutSeconds = 600; // 10 minutes for checkout
  const [checkoutCountdown, setCheckoutCountdown] = useState(initialCheckoutSeconds);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error">("pending");
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    name: "",
    policies: "",
    facebook: "",
    refcode: ""
  });

  // State to track if component has mounted on client
  const [mounted, setMounted] = useState(false);

  // Callbacks for countdown timer
  const handleCountdownExpire = useCallback(() => setIsSessionExpiryModalOpen(true), []);

  // Parse tickets from URL
  const ticketsParam = searchParams?.get("tickets");
  
  const selectedTickets: Ticket[] = useMemo(() => {
    if (!ticketsParam) {
      // console.log('No tickets parameter found in URL');
      return [];
    }
    
    try {
      // Log raw parameter for debugging
      // console.log('Raw tickets parameter:', ticketsParam);
      
      const decoded = decodeURIComponent(ticketsParam);
      // console.log('Decoded tickets parameter:', decoded);
      
      // Basic validation before parsing
      if (!decoded.startsWith('[') || !decoded.endsWith(']')) {
        // console.error('Invalid JSON format: Expected array');
        return [];
      }
      
      const parsed = JSON.parse(decoded);
      
      // Validate parsed data structure
      if (!Array.isArray(parsed)) {
        // console.error('Invalid data structure: Expected array, got', typeof parsed);
        return [];
      }
      
      // Validate each ticket object
      const validTickets = parsed.filter(ticket => {
        const isValid = ticket 
          && typeof ticket === 'object'
          && typeof ticket.quantity === 'number'
          && ticket.quantity > 0;
        
        if (!isValid) {
          // console.error('Invalid ticket object:', ticket);
        }
        return isValid;
      });
      
      return validTickets;
    } catch {
      // console.error('Error parsing tickets from URL:', {
      //   error,
      //   ticketsParam,
      //   message: error instanceof Error ? error.message : 'Unknown error'
      // });
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
    // const now = new Date();
    
    // Calculate total tickets
    // const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    
    // Generate a unique 8-digit number using timestamp and random number
    // const uniqueId = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    // Format date and time parts
    // const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    // const timePart = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Create order number in format: OCX4-DDMM-HHMMSS-TT-XXXXXXXX
    // where TT is total tickets (2 digits) and XXXXXXXX is unique ID
    // const orderNumberStr = `OCX4-${datePart}-${timePart}-${totalTickets.toString().padStart(2, '0')}-${uniqueId}`;
    
    // console.log('Debug - Order Generation:', {
    //   now: now.toISOString(),
    //   totalTickets,
    //   uniqueId,
    //   datePart,
    //   timePart,
    //   orderNumberStr
    // });
    
    // setOrderNumber(orderNumberStr); // Removed as per edit hint
    // setOrderDate(now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, '/')); // Removed as per edit hint
    // setOrderTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })); // Removed as per edit hint
  }, [selectedTickets]); // Add selectedTickets to dependencies since we use it

  // Auto-fill user info when user is logged in — ưu tiên cache session (SĐT / Facebook) nếu đã nhập trước đó
  useEffect(() => {
    if (user && !loading) {
      const cached = loadCheckoutContact(user.id);
      const metaPhone =
        user.user_metadata?.phone != null
          ? String(user.user_metadata.phone)
          : "";
      const metaFb =
        user.user_metadata?.facebook != null
          ? String(user.user_metadata.facebook)
          : "";
      setUserInfo({
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || "",
        email: user.email || "",
        phone: cached !== null ? cached.phone : metaPhone,
        facebook: cached !== null ? cached.facebook : metaFb,
        refcode: "",
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

  // Cleanup order when component unmounts or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (orderInfo?.id) {
        // Cancel order when user leaves page
        const cancelOrder = async () => {
          try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            
            if (accessToken && API_BASE_URL) {
              await fetch(`${API_BASE_URL}/orders/${orderInfo.id}/cancel`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              });
            }
          } catch {
            // console.error("Error canceling order on page unload:", error);
          }
        };
        cancelOrder();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [orderInfo?.id]);

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo((prev) => {
      const next = { ...prev, [field]: value };
      if (
        user?.id &&
        (field === "phone" || field === "facebook")
      ) {
        saveCheckoutContact(user.id, next.phone, next.facebook);
      }
      return next;
    });
  };

  // Validate coupon
  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã coupon");
      return;
    }

    if (totalAmount === 0) {
      setCouponError("Vui lòng chọn vé trước khi áp dụng coupon");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!accessToken || !API_BASE_URL) {
        setCouponError("Không xác thực được tài khoản!");
        return;
      }

      const selectedTicketIds = selectedTickets
        .filter(t => t.quantity > 0)
        .map(t => t.id);

      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          order_amount: totalAmount,
          user_id: user?.id,
          organization_id: "cmf4pxbbh00m4l912i7m4pcs7",
          event_id: "cmoi4vq3m02jzo912nj53v59l",
          ticket_ids: selectedTicketIds,
        }),
      });

      const result: CouponValidationResponse = await response.json();

      if (response.ok && result.valid) {
        setAppliedCoupon(result);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        // Chỉ thay đổi thông báo cho 2 trường hợp cụ thể
        if (result.message?.includes("has reached usage limit") || result.message?.includes("not found")) {
          setCouponError("Coupon không khả dụng hoặc đã hết hạn sử dụng");
        } else {
          setCouponError(result.message || "Mã coupon không hợp lệ");
        }
      }
    } catch {
      setCouponError("Lỗi khi xác thực coupon");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePayment = async () => {
    // Prevent spam clicking
    if (isProcessingPayment) {
      return;
    }

    // Validate user info - validate phone, name, facebook và refcode
    const isPhoneValid = /^\d{10,}$/.test(userInfo.phone);
    const isNameValid = userInfo.fullName.trim() !== "";
    const isFacebookValid = userInfo.facebook.trim() !== "";
    const isRefcodeValid = userInfo.refcode.trim() === "" || (userInfo.refcode.startsWith("#ocx") && userInfo.refcode.length === 11);
    
    // Set validation errors
    const newErrors = {
      phone: !isPhoneValid ? "Vui lòng nhập số điện thoại hợp lệ" : "",
      name: !isNameValid ? "Vui lòng nhập họ và tên" : "",
      policies: !agreedToPolicies ? "Vui lòng đồng ý với điều khoản" : "",
      facebook: !isFacebookValid ? "Vui lòng nhập link Facebook" : "",
      refcode: !isRefcodeValid ? "Mã giới thiệu không hợp lệ" : ""
    };
    setValidationErrors(newErrors);
    
    if (!isPhoneValid || !isNameValid || !isFacebookValid || !isRefcodeValid || !agreedToPolicies) {
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

    // Set loading state
    setIsProcessingPayment(true);

    try {
      // Kiểm tra lại tồn kho trước khi tạo order
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!accessToken || !API_BASE_URL) {
        alert("Không xác thực được tài khoản!");
        setIsProcessingPayment(false);
        return;
      }

      // Kiểm tra tồn kho cho từng loại vé
      const stockCheckPromises = selectedTickets
        .filter(t => t.quantity > 0)
        .map(async (ticket) => {
          const res = await fetch(`${API_BASE_URL}/tickets/${ticket.id}`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          
          if (res.ok) {
            const ticketData = await res.json();
            const availableQty = ticketData.total_qty - ticketData.sold_qty;
            return {
              ticketId: ticket.id,
              ticketName: ticket.name,
              requestedQty: ticket.quantity,
              availableQty: availableQty,
              isAvailable: availableQty >= ticket.quantity
            };
          }
          return null;
        });

      const stockResults = await Promise.all(stockCheckPromises);
      const unavailableTickets = stockResults.filter(result => result && !result.isAvailable);
      const partiallyAvailableTickets = stockResults.filter(result => 
        result && result.isAvailable && result.availableQty < result.requestedQty
      );

      // Xử lý trường hợp hết vé hoặc thiếu vé
      if (unavailableTickets.length > 0 || partiallyAvailableTickets.length > 0) {
        let message = "Rất tiếc, tình trạng vé đã thay đổi:\n\n";
        
        unavailableTickets.forEach(ticket => {
          if (ticket) {
            message += `• ${ticket.ticketName}: Hết vé\n`;
          }
        });
        
        partiallyAvailableTickets.forEach(ticket => {
          if (ticket) {
            message += `• ${ticket.ticketName}: Chỉ còn ${ticket.availableQty} vé (bạn yêu cầu ${ticket.requestedQty})\n`;
          }
        });
        
        message += "\nVui lòng quay lại trang chọn vé để cập nhật.";
        
        if (confirm(message + "\n\nBạn có muốn quay lại trang chọn vé không?")) {
          router.push('/ticketocx5');
        }
        setIsProcessingPayment(false);
        return;
      }

      // Chuẩn bị dữ liệu order
      const event_id = "cmoi4vq3m02jzo912nj53v59l";
      const organization_id = "cmf4pxbbh00m4l912i7m4pcs7"; 
      const items = selectedTickets
        .filter(t => t.quantity > 0)
        .map(t => ({
          ticket_id: t.id,
          quantity: t.quantity,
        }));

      // Xác định referral_code và referral_type
      const referral_code = userInfo.refcode.trim() !== "" ? userInfo.refcode : "DIRECT";
      const referral_type = userInfo.refcode.trim() !== "" && userInfo.refcode.startsWith("#ocx") && userInfo.refcode.length === 11 ? "SALER" : "DIRECT";

      // Tạo order
      const orderData: {
        organization_id: string;
        event_id: string;
        items: Array<{ ticket_id: string; quantity: number }>;
        referral_code: string;
        referral_type: string;
        coupon_code?: string;
      } = {
        organization_id,
        event_id,
        items,
        referral_code,
        referral_type,
      };

      // Thêm coupon nếu có
      if (appliedCoupon && couponCode.trim()) {
        orderData.coupon_code = couponCode.trim();
      }

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Tạo đơn hàng thất bại: " + (err.message || "Lỗi không xác định"));
        setIsProcessingPayment(false);
        return;
      }

      const order = await res.json();
      setOrderInfo(order);
      
      // Update user phone and facebook if order creation was successful
      if (order && order.user_id && (userInfo.phone || userInfo.facebook)) {
        try {
          const updateData: { phone?: string; fb?: string } = {};
          if (userInfo.phone) updateData.phone = userInfo.phone;
          if (userInfo.facebook) updateData.fb = userInfo.facebook;
          
          const updateUserRes = await fetch(`${API_BASE_URL}/users/${order.user_id}`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });
          
          if (updateUserRes.ok) {
            // console.log('User phone and facebook updated successfully');
          } else {
            // console.error('Failed to update user info:', await updateUserRes.text());
          }
        } catch {
          // console.error('Error updating user info:', error);
        }
      }
      
      setIsPaymentModalOpen(true);
      setIsProcessingPayment(false);
    } catch {
      // console.error("Error during payment process:", error);
      alert("Lỗi khi tạo đơn hàng!");
      setIsProcessingPayment(false);
    }
  };

  // Removed handlePaymentSuccess as per edit hint

  const totalAmount = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  // Calculate final amount after coupon discount
  const finalAmount = appliedCoupon ? totalAmount - appliedCoupon.discount_amount : totalAmount;

  // Show loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4">
          <p className="text-lg text-[#A1A1A1]">Đang tải...</p>
        </div>
        <V2Footer />
      </PageLayout>
    );
  }

  // Show login required if no user
  if (!user) {
    return (
      <PageLayout>
        <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
          <p className="text-lg text-[#FAFAFA]">Vui lòng đăng nhập để tiếp tục</p>
        </div>
        <V2Footer />
      </PageLayout>
    );
  }

  

  // Show error if no valid tickets
  if (!hasValidTickets) {
    // Use replace instead of push to avoid adding to history stack
    router.replace('/ticketocx5?noTickets=true');
    return null; // Return null instead of loading state
  }

  const checkoutPageMain = (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[#FAFAFA]">
        Thanh toán
      </h1>
      <p className="mb-8 text-center text-sm text-[#A1A1A1]">
        Kiểm tra lại đơn và hoàn tất thông tin người mua.
      </p>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-start lg:gap-12">
        {/* Cột trái (desktop): form — mobile: thứ tự sau sidebar */}
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <CheckoutForm
            userInfo={userInfo}
            onUserInfoChange={handleUserInfoChange}
            validationErrors={validationErrors}
          />

          {CHECKOUT_PROMO_ENABLED && (
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
              <h3 className="mb-4 text-lg font-semibold text-[#FAFAFA]">
                Mã giảm giá
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã coupon"
                    className="min-h-11 flex-1 rounded-lg border border-[#262626] bg-[#0A0A0A] px-4 py-2.5 text-[#FAFAFA] placeholder:text-[#737373] focus:border-[#FF6B1A] focus:outline-none focus:ring-1 focus:ring-[#FF6B1A]"
                    disabled={isValidatingCoupon}
                  />
                  <button
                    type="button"
                    onClick={validateCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[#FF6B1A] px-6 text-sm font-semibold text-white transition hover:bg-[#e55f15] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isValidatingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                  </button>
                </div>

                {couponError && (
                  <p className="text-sm text-[#F87171]">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="rounded-lg border border-[#34D399]/30 bg-[#34D399]/10 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-[#34D399]">
                          Đã áp dụng: {couponCode}
                        </p>
                        <p className="text-sm text-[#A7F3D0]">
                          Giảm{" "}
                          {appliedCoupon.discount_amount.toLocaleString("vi-VN")}{" "}
                          ₫
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="rounded-lg border border-[#262626] bg-[#212121] px-4 py-2 text-sm font-medium text-[#FAFAFA] hover:bg-[#262626]"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
            <PolicyCheckbox
              agreedToPolicies={agreedToPolicies}
              onAgreementChange={setAgreedToPolicies}
            />
            <button
              type="button"
              onClick={handlePayment}
              disabled={!agreedToPolicies || isProcessingPayment}
              className="mt-4 flex w-full min-h-12 items-center justify-center rounded-xl bg-[#FF6B1A] py-3 text-base font-semibold text-white transition hover:bg-[#e55f15] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <svg
                    className="mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Thanh toán"
              )}
            </button>
          </div>
        </div>

        {/* Cột phải (desktop): đếm ngược + sự kiện + tóm tắt — mobile: lên trước */}
        <div className="order-1 flex min-w-0 flex-col gap-6 lg:sticky lg:top-24 lg:order-2 lg:self-start">
          <CountdownTimer
            seconds={checkoutCountdown}
            onExpire={handleCountdownExpire}
          />
          <div className="overflow-hidden rounded-xl border border-[#262626]">
            <TicketDetail
              event={EVENT_INFO}
              showBackButton
              hideThumbnailBanner
            />
          </div>
          <TicketSummaryTable
            selectedTickets={selectedTickets}
            totalAmount={totalAmount}
            finalAmount={finalAmount}
            appliedCoupon={appliedCoupon}
            eventName={EVENT_INFO.name}
          />
        </div>
      </div>
    </main>
  );

  return (
    <>
      <PageLayout>
        <Header
          actions={
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden min-w-0 max-w-[200px] text-right sm:block">
                <p className="truncate text-sm font-medium text-[#FAFAFA]">
                  {user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    user?.email}
                </p>
                <p className="truncate text-xs text-[#737373]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
              >
                Đăng xuất
              </button>
            </div>
          }
        />
        <div className="relative z-10">{checkoutPageMain}</div>
        <V2Footer />
      </PageLayout>

      {mounted && isPaymentModalOpen && orderInfo && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={async () => {
            // Cancel order when modal is closed
            try {
              const supabase = createClient();
              const { data: { session } } = await supabase.auth.getSession();
              const accessToken = session?.access_token;
              const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
              
              if (accessToken && API_BASE_URL && orderInfo.id) {
                await fetch(`${API_BASE_URL}/orders/${orderInfo.id}/cancel`, {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                });
              }
            } catch {
              // console.error("Error canceling order when modal closed:", error);
            }
            
            setIsPaymentModalOpen(false);
            setOrderInfo(null);
          }}
          orderInfo={orderInfo}
          countdownSeconds={checkoutCountdown}
          selectedTickets={selectedTickets}
          finalAmount={finalAmount}
          appliedCoupon={appliedCoupon}
          couponCode={couponCode}
        />
      )}

      <SessionExpiryModal
        isOpen={isSessionExpiryModalOpen}
      />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
