import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useSyncBackend(user: User | null, signOut: () => Promise<void>) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const supabase = createClient();
  const [isBackendAuthenticated, setIsBackendAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (user) {
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
            if (!res.ok) {
              if (res.status === 401 || res.status === 403) {
                setIsBackendAuthenticated(false);
                await signOut();
              }
              return;
            }
            setIsBackendAuthenticated(true);
          } catch {
            setIsBackendAuthenticated(false);
            await signOut();
          }
        }
      } else {
        setIsBackendAuthenticated(false);
      }
    };
    syncWithBackend();
  }, [user, supabase, API_BASE_URL, signOut]);

  return isBackendAuthenticated;
} 