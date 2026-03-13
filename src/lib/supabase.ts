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

const LOCAL_STORAGE_PREFIX = 'kv_store_';

// Fallback localStorage helpers
const localKV = {
  getAll(): Record<string, any> {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'data');
    return raw ? JSON.parse(raw) : {};
  },
  save(store: Record<string, any>) {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'data', JSON.stringify(store));
  },
};

// Funções helper para KV Store com fallback localStorage
export const kvStore = {
  async get(key: string) {
    try {
      const { data, error } = await supabase
        .from('kv_store_0092e077')
        .select('value')
        .eq('key', key)
        .single();

      if (error) throw error;
      return data?.value;
    } catch {
      const store = localKV.getAll();
      return store[key] ?? null;
    }
  },

  async set(key: string, value: any) {
    try {
      const { error } = await supabase
        .from('kv_store_0092e077')
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) throw error;
    } catch {
      const store = localKV.getAll();
      store[key] = value;
      localKV.save(store);
    }
  },

  async delete(key: string) {
    try {
      const { error } = await supabase
        .from('kv_store_0092e077')
        .delete()
        .eq('key', key);

      if (error) throw error;
    } catch {
      const store = localKV.getAll();
      delete store[key];
      localKV.save(store);
    }
  },

  async getByPrefix(prefix: string) {
    try {
      const { data, error } = await supabase
        .from('kv_store_0092e077')
        .select('*')
        .like('key', `${prefix}%`);

      if (error) throw error;
      return data;
    } catch {
      const store = localKV.getAll();
      return Object.entries(store)
        .filter(([k]) => k.startsWith(prefix))
        .map(([key, value]) => ({ key, value }));
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('kv_store_0092e077')
        .select('*')
        .order('key');

      if (error) throw error;
      return data;
    } catch {
      const store = localKV.getAll();
      return Object.entries(store)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => ({ key, value }));
    }
  }
};
