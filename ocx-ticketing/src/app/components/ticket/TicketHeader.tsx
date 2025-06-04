"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TicketHeader() {
  const router = useRouter();
  return (
    <header className="w-full bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-12 py-3 sticky top-0 z-50">
      <div className="flex items-center">
        <Image 
          src="/images/client_logo_ss4.svg" 
          alt="Logo" 
          width={48} 
          height={48} 
          className="rounded-full object-cover cursor-pointer" 
          onClick={() => router.push("/")}
        />
      </div>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 rounded bg-zinc-800 text-white font-semibold hover:bg-purple-600 transition-colors"
      >
        Trang chủ
      </button>
    </header>
  );
} 