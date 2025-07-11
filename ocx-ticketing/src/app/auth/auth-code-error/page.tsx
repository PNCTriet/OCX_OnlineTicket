"use client";
import { Suspense, useState } from "react";
import SimpleHeader from "../../components/SimpleHeader";
import { useRouter } from "next/navigation";

function AuthCodeErrorContent() {
  const router = useRouter();
  const [lang, setLang] = useState<"vi" | "en">("vi");

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
        <SimpleHeader lang={lang} setLang={setLang} />
        
        <main className="max-w-md mx-auto px-4 py-8 pt-24 sm:pt-28 md:pt-32">
          <div className="bg-zinc-900/30 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Lỗi Đăng Nhập
              </h1>
              <p className="text-zinc-300">
                Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-[#c53e00] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#b33800] transition-colors"
              >
                Thử lại
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full bg-zinc-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-zinc-600 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCodeErrorContent />
    </Suspense>
  );
} 