
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';

export interface AuthContextType {
  user: User | null;
  attendant: Attendant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: string }>;
  isEnvironmentValid: boolean;
}

export interface SignUpUserData {
  storeName?: string;
  ownerName?: string;
  phone?: string;
  currency?: string;
}
