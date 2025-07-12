'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">404 - Không tìm thấy trang</h1>
        <p className="text-zinc-400">Trang bạn đang tìm kiếm không tồn tại.</p>
        <Link 
          href="/"
          className="inline-block bg-[#c53e00] text-white px-6 py-3 rounded-lg hover:bg-[#b33800] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
} 