import { createClient } from '@supabase/supabase-js';

type ViteEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string; // legacy naming (still common)
  NEXT_PUBLIC_SUPABASE_URL?: string; // compatibility with Next.js tutorials
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

const env = import.meta.env as unknown as ViteEnv;

const supabaseUrl =
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder.supabase.co';

const supabasePublishableKey =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-publishable-key';

if (import.meta.env.DEV) {
  if (supabaseUrl.includes('placeholder') || supabasePublishableKey.includes('placeholder')) {
    // eslint-disable-next-line no-console
    console.warn('[kali-web] Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local');
  }
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type UserRole = 'super_pobre' | 'compi_pro' | 'dios_admin';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  banned: boolean;
  word_count: number;
  photo_count: number;
  /**
   * Local-only flag used during Phase 1 demos.
   * Real auth/users will not rely on this for authorization.
   */
  is_demo?: boolean;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: UserProfile;
}

export interface WallPhoto {
  id: string;
  user_id: string;
  url: string;
  caption?: string;
  created_at: string;
  profiles?: UserProfile;
}

export interface GlobalAnnouncement {
  id: string;
  content: string;
  active: boolean;
  created_at: string;
}
