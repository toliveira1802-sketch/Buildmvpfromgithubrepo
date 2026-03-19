import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acuufrgoyjwzlyhopaus.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjI5ODgsImV4cCI6MjA4MzgzODk4OH0.V7CgRaRFI8QAblr3TysttxPAY5E-e2vWEpmdu_2au4A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface KVStore {
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

export const kvStore = {
  async get(key: string) {
    const { data, error } = await supabase
      .from('kv_store_0092e077')
      .select('value')
      .eq('key', key)
      .single();
    if (error) throw error;
    return data?.value;
  },
  async set(key: string, value: any) {
    const { error } = await supabase
      .from('kv_store_0092e077')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
  async delete(key: string) {
    const { error } = await supabase
      .from('kv_store_0092e077')
      .delete()
      .eq('key', key);
    if (error) throw error;
  },
  async getByPrefix(prefix: string) {
    const { data, error } = await supabase
      .from('kv_store_0092e077')
      .select('*')
      .like('key', `${prefix}%`);
    if (error) throw error;
    return data;
  },
  async getAll() {
    const { data, error } = await supabase
      .from('kv_store_0092e077')
      .select('*')
      .order('key');
    if (error) throw error;
    return data;
  }
};
