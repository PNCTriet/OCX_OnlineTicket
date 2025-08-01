"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase";

type OrderStatusInfo = {
  status: string;
  amount?: number;
  userEmail?: string;
  paidAt?: string;
};

export default function TestWebhookPage() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [info, setInfo] = useState<OrderStatusInfo | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = () => {
    if (!orderId) return;
    setTracking(true);
    setStatus(null);
    setInfo(null);
    pollStatus(orderId);
    intervalRef.current = setInterval(() => pollStatus(orderId), 3000); // 10s
  };

  const stopTracking = () => {
    setTracking(false);
    setStatus(null);
    setInfo(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const pollStatus = async (oid: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      console.log("[pollStatus] Gọi GET:", `${API_BASE_URL}/orders/${oid}`);
      console.log("[pollStatus] AccessToken:", accessToken);
      const res = await fetch(`${API_BASE_URL}/orders/${oid}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      console.log("[pollStatus] Response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("[pollStatus] Data:", data);
        setStatus(data.status);
        setInfo(data);
        if (data.status === "PAID" || data.status === "SUCCESS") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } else {
        setStatus(null);
        setInfo(null);
        console.log("[pollStatus] Không lấy được trạng thái order hoặc lỗi.");
      }
    } catch (err) {
      setStatus(null);
      setInfo(null);
      console.error("[pollStatus] Lỗi khi gọi GET:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 p-4">
      <div className="bg-zinc-800 rounded-xl p-8 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Test nhận Webhook thanh toán</h1>
        <div className="mb-4">
          <label className="block text-zinc-300 mb-2">Order ID cần theo dõi:</label>
          <input
            type="text"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:outline-none"
            disabled={tracking}
            placeholder="Nhập orderId..."
          />
        </div>
        <div className="flex gap-2 mb-6">
          {!tracking ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
              onClick={startTracking}
              disabled={!orderId}
            >
              Bắt đầu theo dõi
            </button>
          ) : (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
              onClick={stopTracking}
            >
              Dừng theo dõi
            </button>
          )}
        </div>
        {tracking && (
          <div className="mt-4">
            <p className="text-zinc-300">Đang theo dõi trạng thái order: <span className="font-mono text-white">{orderId}</span></p>
            {status === "PAID" || status === "SUCCESS" ? (
              <div className="bg-green-600 text-white p-4 rounded-lg text-center mt-4">
                🎉 Đã nhận webhook! Thanh toán thành công cho order <b>{orderId}</b>.<br/>
                <span className="text-xs">(status: {status})</span>
              </div>
            ) : status ? (
              <div className="bg-yellow-600 text-white p-4 rounded-lg text-center mt-4">
                Đã nhận webhook, trạng thái hiện tại: <b>{status}</b>
              </div>
            ) : (
              <div className="text-zinc-400 mt-4">Chưa nhận được webhook hoặc chưa có trạng thái.</div>
            )}
            {info && (
              <pre className="bg-zinc-900 text-zinc-200 rounded p-2 mt-2 text-xs overflow-x-auto">{JSON.stringify(info, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 