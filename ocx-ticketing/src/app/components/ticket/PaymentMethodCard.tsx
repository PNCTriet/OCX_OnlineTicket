"use client";
import { useState } from "react";

export default function PaymentMethodCard({ method, setMethod }: { method: string; setMethod: (m: string) => void }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="font-bold text-white mb-2">Payment Method</div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMethod("bank")} className={`px-4 py-2 rounded-t-lg font-semibold ${method === "bank" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-300"}`}>Bank Transfer</button>
        <button onClick={() => setMethod("card") } className={`px-4 py-2 rounded-t-lg font-semibold ${method === "card" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-300"}`}>Credit Card</button>
      </div>
      {method === "bank" ? (
        <div className="flex flex-col gap-2 items-center">
          <div className="w-32 h-32 bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">QR CODE</div>
          <div className="text-white/80 text-sm">Account: 1234567890</div>
          <div className="text-white/80 text-sm">Bank: OCX Bank</div>
          <div className="text-white/80 text-sm">Amount: <span className="text-green-400 font-bold">1,200,000₫</span></div>
          <div className="text-white/80 text-sm">Order ID: <span className="text-yellow-400 font-mono">OCX2025-001</span></div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center text-zinc-400">
          <div className="w-full h-12 bg-zinc-700 rounded mb-2 flex items-center justify-center">Credit Card Form (UI only)</div>
        </div>
      )}
    </div>
  );
} 