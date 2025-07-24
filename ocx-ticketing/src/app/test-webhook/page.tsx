"use client";
import { useState, useRef } from "react";

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
    intervalRef.current = setInterval(() => pollStatus(orderId), 3000);
  };

  const stopTracking = () => {
    setTracking(false);
    setStatus(null);
    setInfo(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const pollStatus = async (oid: string) => {
    try {
      const res = await fetch(`/api/payment-webhook?orderId=${oid}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setInfo(data);
        if (data.status === "PAID" || data.status === "SUCCESS") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } else {
        setStatus(null);
        setInfo(null);
      }
    } catch {
      setStatus(null);
      setInfo(null);
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