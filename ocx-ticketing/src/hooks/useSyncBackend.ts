import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useSyncBackend(user: User | null) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const supabase = createClient();

  useEffect(() => {
    const syncWithBackend = async () => {
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (accessToken && API_BASE_URL) {
          try {
            await fetch(`${API_BASE_URL}/auth/me`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
          } catch (err) {
            console.error("Backend sync error:", err);
          }
        }
      }
    };
    syncWithBackend();
  }, [user, supabase, API_BASE_URL]);
} 