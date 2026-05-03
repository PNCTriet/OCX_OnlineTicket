"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase";
import PageLayout from "@/components/v2/PageLayout";
import Header from "@/components/v2/Header";
import type { HeaderLang } from "@/components/v2/Header";
import V2Footer from "@/components/v2/Footer";

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
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
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<HeaderLang>("vi");
  const [oauthError, setOauthError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const supabase = createClient();

  const redirectTo = searchParams?.get("redirectTo") || "/";
  const ticketsParam = searchParams?.get("tickets");
  const vi = lang === "vi";

  useEffect(() => {
    if (user) {
      if (redirectTo === "/checkout" && ticketsParam) {
        router.push(`${redirectTo}?tickets=${ticketsParam}`);
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, redirectTo, ticketsParam, router]);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!user) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (accessToken && API_BASE_URL) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) throw new Error("Backend sync failed");
        } catch {
          // Không chặn redirect; có thể mở rộng toast sau
        }
      }
    };
    syncWithBackend();
  }, [user, supabase, API_BASE_URL]);

  const handleGoogleSignIn = async () => {
    setOauthError(null);
    try {
      setLoading(true);
      await signInWithGoogle(redirectTo, ticketsParam || undefined);
    } catch {
      setOauthError(
        vi ? "Đăng nhập Google không thành công. Thử lại sau." : "Google sign-in failed. Please try again."
      );
      setLoading(false);
    }
  };

  const headerNav = [
    { href: "/community", label: vi ? "Trợ giúp" : "Help" },
    { href: "/profile", label: vi ? "Vé của tôi" : "My tickets" },
  ];

  if (user) {
    return (
      <PageLayout>
        <Header lang={lang} onLangChange={setLang} navItems={headerNav} />
        <main className="mx-auto flex min-h-[50vh] w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-6 py-16">
          <p className="text-[15px] text-[#A1A1A1]">
            {vi ? "Đang chuyển hướng…" : "Redirecting…"}
          </p>
        </main>
        <V2Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header lang={lang} onLangChange={setLang} navItems={headerNav} />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-6 py-10 pb-12">
        <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#141414] p-8">
          <h1 className="text-2xl font-semibold tracking-[-0.4px] text-[#FAFAFA]">
            {vi ? "Đăng nhập" : "Sign in"}
          </h1>
          <p className="mt-1 text-sm text-[#A1A1A1]">
            {vi ? "Chỉ hỗ trợ đăng nhập bằng Google." : "Sign in with Google only."}
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {oauthError ? (
              <p className="rounded-lg border border-[#F8717140] bg-[#F8717114] px-3 py-2 text-sm text-[#F87171]">
                {oauthError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#262626] bg-[#1A1A1A] text-[14px] font-medium text-[#FAFAFA] transition-colors hover:bg-[#212121] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span
                  className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#FAFAFA] border-t-transparent"
                  aria-hidden
                />
              ) : (
                <GoogleGlyph className="size-5 shrink-0 text-[#FAFAFA]" />
              )}
              <span>
                {loading
                  ? vi
                    ? "Đang đăng nhập…"
                    : "Signing in…"
                  : vi
                    ? "Tiếp tục với Google"
                    : "Continue with Google"}
              </span>
            </button>
          </div>

          <p className="mt-8 text-center text-[13px] leading-[1.45] text-[#737373]">
            {vi ? "Bằng cách đăng nhập, bạn đồng ý với " : "By signing in, you agree to our "}
            <Link href="#" className="text-[#FF6B1A] hover:underline">
              {vi ? "Điều khoản" : "Terms"}
            </Link>
            {vi ? " và " : " and "}
            <Link href="#" className="text-[#FF6B1A] hover:underline">
              {vi ? "Riêng tư" : "Privacy"}
            </Link>
            .
          </p>
        </div>
      </main>

      <V2Footer />
    </PageLayout>
  );
}

function LoginFallback() {
  return (
    <PageLayout>
      <div className="flex min-h-[40vh] flex-1 items-center justify-center px-6 text-sm text-[#737373]">
        Loading…
      </div>
    </PageLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
