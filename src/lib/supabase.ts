import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acuufrgoyjwzlyhopaus.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MjQ1NzcsImV4cCI6MjA1MjIwMDU3N30.8kPZHf_YXZCrqhOF0uXlXGqEuuDlT0pz5vGPTlz2qGM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipo para a tabela kv_store
export interface KVStore {
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

// Funções helper para KV Store
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
