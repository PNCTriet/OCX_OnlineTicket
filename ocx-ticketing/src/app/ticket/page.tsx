"use client";
import { useState, useEffect } from "react";
import SimpleHeader from "../components/SimpleHeader";
import EventInfoCard from "../components/ticket/EventInfoCard";
import OrderSummaryCard from "../components/ticket/OrderSummaryCard";
import Footer from "../components/Footer";
import { EVENT_INFO } from "../constants/ticket";
import { TicketType } from "../types/ticket";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase";

// Function to generate random colors for tickets
const getRandomColor = () => {
  const colors = ['#56F482', '#31E4EC', '#F06185', '#F2D31F', '#A780F4', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Interface for API response
interface ApiTicketType {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: string;
  total_qty: number;
  sold_qty: number;
  sale_start: string;
  sale_end: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TicketOption2Page() {
  const { user, loading, signOut } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<(TicketType & { quantity: number; availableQty: number })[]>([]);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [showNoTicketsError, setShowNoTicketsError] = useState(false);
  // Đã có biến loading từ useAuth, không cần khai báo lại
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Check if we came from checkout without tickets
    const urlParams = new URLSearchParams(window.location.search);
    const noTickets = urlParams.get('noTickets');
    if (noTickets === 'true') {
      setShowNoTicketsError(true);
    }

    // Fetch tickets from API
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?redirectTo=/ticket");
    }
  }, [user, loading, router]);

  // Xác thực user với backend khi đã đăng nhập
  useEffect(() => {
    const checkBackendAuth = async () => {
      if (user) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (accessToken && API_BASE_URL) {
          try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
            if (!res.ok) {
              window.alert("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!");
              await signOut();
              router.replace("/auth/login?redirectTo=/ticket");
            }
          } catch {
            window.alert("Không thể xác thực tài khoản với hệ thống backend! Vui lòng đăng nhập lại.");
            await signOut();
            router.replace("/auth/login?redirectTo=/ticket");
          }
        }
      }
    };
    checkBackendAuth();
  }, [user, signOut, router]);

  const fetchTickets = async () => {
    try {
      setError(null);
      const response = await fetch('https://api.otcayxe.com/tickets/event/cmd5gmqgp0005v78s79bina9z', {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiTicketType[] = await response.json();
      // Transform API data to match our TicketType interface
      const transformedTickets = data.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: parseInt(ticket.price),
        color: getRandomColor(), // Generate random color for each ticket
        quantity: 0, // Initialize quantity to 0
        sold: ticket.sold_qty,
        label: ticket.description,
        status: ticket.status as 'INACTIVE' | 'ACTIVE' | 'SOLD_OUT',
        availableQty: ticket.total_qty - ticket.sold_qty, // Calculate available quantity
      }));

      setSelectedTickets(transformedTickets);
    } catch {
      // console.error('Error fetching tickets:', err);
      setError('Không thể tải thông tin vé. Vui lòng thử lại sau.');
    }
  };

  const handleQuantityChange = (ticketId: string, change: number) => {
    setShowNoTicketsError(false); // Clear error when user selects tickets
    setSelectedTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          const newQuantity = ticket.quantity + change;
          // Prevent negative quantities
          if (newQuantity < 0) return ticket;
          // Calculate max limit: min of 10 or available quantity
          const maxLimit = Math.min(10, ticket.availableQty);
          if (newQuantity > maxLimit) return ticket;
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
    } catch {
      // console.error('Error encoding tickets for checkout:', error);
      // Fallback: redirect without tickets
      router.push('/checkout');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button 
                    onClick={fetchTickets}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

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
              <p className="text-center">Vui lòng chọn ít nhất một vé để tiếp tục.</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
              <div className="block sm:hidden">
                <EventInfoCard event={EVENT_INFO} />
              </div>
              <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-4">Chọn Vé</h2>
                <p className="text-gray-300 mb-6">
                  Chọn loại vé phù hợp với nhu cầu của bạn. Mỗi loại vé có những đặc quyền khác nhau. Khác mỗi cái giá
                </p>
                <div className="space-y-4">
                  {selectedTickets
                    .slice()
                    .sort((a, b) => {
                      const statusOrder = (status: string) => {
                        if (status === 'ACTIVE') return 0;
                        if (status === 'INACTIVE') return 1;
                        return 2; // SOLD_OUT
                      };
                      return statusOrder(a.status) - statusOrder(b.status);
                    })
                    .map((ticket) => (
                    <div 
                      key={ticket.id}
                      className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-xl font-semibold text-white">{ticket.name}</h3>
                            {/* <span 
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{ backgroundColor: ticket.color + '20', color: ticket.color }}
                            >
                              {ticket.label}
                            </span> */}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-3xl font-bold text-white mb-1">
                                {ticket.price.toLocaleString('vi-VN')} VNĐ
                              </p>
                              <div className="flex items-center gap-2">
                                {ticket.status === 'ACTIVE' && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                    Còn vé
                                  </span>
                                )}
                                {ticket.status === 'INACTIVE' && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                    Chưa mở bán
                                  </span>
                                )}
                                {ticket.status === 'SOLD_OUT' && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                    Hết vé
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleQuantityChange(ticket.id, -1)}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={ticket.quantity === 0}
                              >
                                -
                              </button>
                              <span className="text-white font-semibold text-xl min-w-[3rem] text-center">
                                {ticket.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(ticket.id, 1)}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={ticket.quantity >= Math.min(10, ticket.availableQty) || ticket.status !== 'ACTIVE'}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="hidden sm:block">
                    <EventInfoCard event={EVENT_INFO} />
                  </div>
                  {/* <TicketSelectionCard 
                    tickets={selectedTickets} 
                    onQuantityChange={handleQuantityChange}
                    selectedZoneId={null} // No zone selection for this option
                  /> */}
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
    </div>
  );
} 