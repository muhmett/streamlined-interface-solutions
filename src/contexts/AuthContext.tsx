import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface DemoUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface AuthContextValue {
  /** Real Supabase user when configured, otherwise the demo user. */
  user: User | DemoUser | null;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
  displayName: string | null;
  signInWithGoogle: () => Promise<void>;
  /** Sends the OTP SMS. Phone must be E.164 (+2126XXXXXXXX). */
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_STORAGE_KEY = "m3allem.demo-user";
/** OTP accepted in demo mode. */
export const DEMO_OTP = "123456";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    try {
      const raw = localStorage.getItem(DEMO_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DemoUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const persistDemoUser = useCallback((u: DemoUser | null) => {
    setDemoUser(u);
    if (u) localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(DEMO_STORAGE_KEY);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } else {
      // Demo mode: simulate the OAuth round-trip.
      await new Promise((r) => setTimeout(r, 900));
      persistDemoUser({ id: "demo-google", name: "مستعمل گوگل", email: "demo@gmail.com" });
    }
  }, [persistDemoUser]);

  const signInWithPhone = useCallback(async (phone: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
    } else {
      await new Promise((r) => setTimeout(r, 700));
    }
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, token: string) => {
      if (supabase) {
        const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 600));
        if (token !== DEMO_OTP) throw new Error("invalid-otp");
        persistDemoUser({ id: `demo-${phone}`, name: phone, phone });
      }
    },
    [persistDemoUser],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    persistDemoUser(null);
  }, [persistDemoUser]);

  const user = session?.user ?? demoUser;

  const displayName = useMemo(() => {
    if (session?.user) {
      return (
        (session.user.user_metadata?.full_name as string | undefined) ??
        session.user.phone ??
        session.user.email ??
        null
      );
    }
    return demoUser?.name ?? null;
  }, [session, demoUser]);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    isDemo: !isSupabaseConfigured,
    displayName,
    signInWithGoogle,
    signInWithPhone,
    verifyOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
