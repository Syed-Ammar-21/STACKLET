import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async verifyEmail(token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });
    return { data, error };
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data?.full_name;
  },

  async profileExists(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
    return !!data;
  },

  async createProfile({ id, email, full_name }: { id: string; email: string; full_name?: string }) {
    const now = new Date().toISOString();
    const { error } = await supabase.from('profiles').insert([
      {
        id,
        email,
        full_name: full_name || null,
        created_at: now,
        updated_at: now,
      },
    ]);
    if (error) throw error;
    return true;
  }
};
