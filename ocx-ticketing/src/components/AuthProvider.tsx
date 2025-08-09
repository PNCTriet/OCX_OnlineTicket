"use client";
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectTo?: string, tickets?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Centralized logout via Auth Gateway, then return to this site
    const returnUrl = `${window.location.origin}/`;
    const gatewayLogout = 'https://auth.howlstudio.tech/auth/logout?redirect_to=' + encodeURIComponent(returnUrl);
    window.location.href = gatewayLogout;
  };

  const signInWithGoogle = async (redirectTo?: string, tickets?: string) => {
    // Use Auth Gateway start route with redirect back to this site's /inject
    const postLoginRedirect = redirectTo ?? '/';
    const injectUrl = `${window.location.origin}/inject?post_login_redirect=${encodeURIComponent(postLoginRedirect)}${tickets ? `&tickets=${encodeURIComponent(tickets)}` : ''}`;
    const gatewayStart = 'https://auth.howlstudio.tech/auth/start?redirect_to=' + encodeURIComponent(injectUrl);
    window.location.href = gatewayStart;
  };

  const value = {
    user,
    loading,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 