"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function InjectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const token = searchParams?.get("token");
    const refreshToken = searchParams?.get("refresh_token");
    const postLoginRedirect = searchParams?.get("post_login_redirect") || "/";
    const tickets = searchParams?.get("tickets");

    const run = async () => {
      try {
        if (token && refreshToken) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: refreshToken,
          });
        }
      } finally {
        const redirectUrl = tickets
          ? `${postLoginRedirect}?tickets=${encodeURIComponent(tickets)}`
          : postLoginRedirect;
        router.replace(redirectUrl);
      }
    };

    run();
  }, [searchParams, router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-xl">Đang thiết lập phiên đăng nhập...</div>
    </div>
  );
}

export default function InjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><div className="text-white text-xl">Đang tải...</div></div>}>
      <InjectContent />
    </Suspense>
  );
}


