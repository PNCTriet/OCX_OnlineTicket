"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import SimpleHeader from "../../components/SimpleHeader";
import { createClient } from "@/lib/supabase";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"vi" | "en">("vi");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const supabase = createClient();

  const redirectTo = searchParams?.get("redirectTo") || "/";
  const ticketsParam = searchParams?.get("tickets");

  useEffect(() => {
    // If user is already logged in, redirect immediately
    if (user) {
      if (redirectTo === "/checkout" && ticketsParam) {
        // Preserve ticket data in the redirect
        router.push(`${redirectTo}?tickets=${ticketsParam}`);
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, redirectTo, ticketsParam, router]);

  useEffect(() => {
    // Nếu user đã login, đồng bộ với backend
    const syncWithBackend = async () => {
      if (user) {
        // Lấy access token từ supabase
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (accessToken && API_BASE_URL) {
          try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
            if (!res.ok) throw new Error("Backend sync failed");
            // const backendUserData = await res.json();
            // Nếu cần xử lý backendUserData, thêm logic tại đây
          } catch (err) {
            console.error("Backend sync error:", err);
          }
        }
      }
    };
    syncWithBackend();
  }, [user, supabase, API_BASE_URL]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(redirectTo, ticketsParam || undefined);
      // The redirect will be handled by the useEffect above
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
    }
  };

  // If user is already logged in, show loading
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang chuyển hướng...</div>
      </div>
    );
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
        <SimpleHeader lang={lang} setLang={setLang} />
        
        <main className="max-w-md mx-auto px-4 py-8 pt-24 sm:pt-28 md:pt-32">
          <div className="bg-zinc-900/30 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Đăng nhập
              </h1>
              <p className="text-zinc-300">
                Đăng nhập để tiếp tục mua vé
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>{loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}</span>
            </button>

            <div className="mt-6 text-center">
              <p className="text-zinc-400 text-sm">
                Bằng cách đăng nhập, bạn đồng ý với{" "}
                <a href="#" className="text-[#c53e00] hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-[#c53e00] hover:underline">
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 