import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, UserProfile } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginDemo: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  loginDemo: () => {},
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
  },
  'free@kali.web': {
    id: 'free-001',
    email: 'free@kali.web',
    username: 'Pelado_Dev',
    role: 'super_pobre',
    created_at: new Date().toISOString(),
    banned: false,
    word_count: 12,
    photo_count: 2,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('kali_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('kali_user');
      }
    }
    setLoading(false);
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}
