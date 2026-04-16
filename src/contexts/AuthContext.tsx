import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase, UserProfile } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginDemo: (email: string) => void;
  sendEmailOtp: (args: { email: string; username?: string; mode: 'login' | 'register' }) => Promise<void>;
  verifyEmailOtp: (args: { email: string; token: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  loginDemo: () => {},
  sendEmailOtp: async () => {},
  verifyEmailOtp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const DEMO_USERS: Record<string, UserProfile> = {
  'admin@kali.web': {
    id: 'admin-001',
    email: 'admin@kali.web',
    username: 'KaliAdmin',
    role: 'dios_admin',
    created_at: new Date().toISOString(),
    banned: false,
    word_count: 0,
    photo_count: 0,
    is_demo: true,
  },
  'pro@kali.web': {
    id: 'pro-001',
    email: 'pro@kali.web',
    username: 'CompiPro_777',
    role: 'compi_pro',
    created_at: new Date().toISOString(),
    banned: false,
    word_count: 0,
    photo_count: 0,
    is_demo: true,
  },
  'free@kali.web': {
    id: 'free-001',
    email: 'free@kali.web',
    username: 'Pelado_Dev',
    role: 'super_pobre',
    created_at: new Date().toISOString(),
    banned: false,
    word_count: 0,
    photo_count: 2,
    is_demo: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const demoUserIds = useMemo(() => new Set(Object.values(DEMO_USERS).map(u => u.id)), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // 1) Prefer real Supabase session if present
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session?.user) {
        await hydrateFromSupabase();
        if (!cancelled) setLoading(false);
        return;
      }

      // 2) Fallback to demo/local user (Phase 1)
      const stored = localStorage.getItem('kali_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('kali_user');
        }
      }
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        await hydrateFromSupabase();
      } else {
        // If a demo user is active, keep it. Otherwise clear.
        setUser(prev => (prev && demoUserIds.has(prev.id) ? prev : null));
      }
    });

    load();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const hydrateFromSupabase = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const authUser = sessionData.session?.user;
    if (!authUser) return;

    // Try to load profile row (Phase 2). If missing, create a minimal one.
    const { data: existing, error: selectErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!selectErr && existing) {
      setUser(existing as UserProfile);
      localStorage.setItem('kali_user', JSON.stringify(existing));
      return;
    }

    const pendingUsernameKey = `kali_pending_username:${authUser.email ?? ''}`;
    const pendingUsername = localStorage.getItem(pendingUsernameKey) || '';
    if (pendingUsername) localStorage.removeItem(pendingUsernameKey);

    const fallbackUsername =
      pendingUsername ||
      (authUser.email ? authUser.email.split('@')[0] : `user_${authUser.id.slice(0, 6)}`);

    const draft: UserProfile = {
      id: authUser.id,
      email: authUser.email ?? '',
      username: fallbackUsername,
      role: 'super_pobre',
      created_at: new Date().toISOString(),
      banned: false,
      word_count: 0,
      photo_count: 0,
    };

    // Upsert profile (will succeed once DB is created).
    const { data: upserted } = await supabase
      .from('profiles')
      .upsert(draft, { onConflict: 'id' })
      .select('*')
      .single();

    setUser((upserted ?? draft) as UserProfile);
    localStorage.setItem('kali_user', JSON.stringify(upserted ?? draft));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('kali_user');
    setUser(null);
  };

  const refreshUser = async () => {
    await hydrateFromSupabase();
    const stored = localStorage.getItem('kali_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  };

  const loginDemo = (email: string) => {
    const u = DEMO_USERS[email];
    if (u) {
      localStorage.setItem('kali_user', JSON.stringify(u));
      setUser(u);
    }
  };

  const sendEmailOtp: AuthContextType['sendEmailOtp'] = async ({ email, username, mode }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error('Email inválido');

    if (mode === 'register') {
      if (username?.trim()) {
        localStorage.setItem(`kali_pending_username:${cleanEmail}`, username.trim());
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: mode === 'register',
      },
    });

    if (error) throw error;
  };

  const verifyEmailOtp: AuthContextType['verifyEmailOtp'] = async ({ email, token }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();
    const { error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'email',
    });
    if (error) throw error;
    await hydrateFromSupabase();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser, loginDemo, sendEmailOtp, verifyEmailOtp }}>
      {children}
    </AuthContext.Provider>
  );
}
