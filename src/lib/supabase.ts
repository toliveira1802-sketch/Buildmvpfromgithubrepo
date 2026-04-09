import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Supabase project URL for API calls */
export const supabaseProjectUrl = supabaseUrl;

// ─── MULTI-TENANT HELPERS ──────────────────────────────────────────
// Estrutura da sessão salva em localStorage como "dap-user"
export interface DapUser {
  id: number;
  nome: string;
  cargo: string;
  nivelAcessoId: number;
  empresa_id?: string;        // UUID da empresa
  empresa_nome?: string;
  empresa_slug?: string;
  empresa_cor?: string;
}

/** Lê o usuário logado do localStorage */
export function getUser(): DapUser | null {
  try {
    const raw = localStorage.getItem('dap-user') || sessionStorage.getItem('dap-user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/** Retorna o empresa_id do usuário logado (ou null) */
export function getEmpresaId(): string | null {
  return getUser()?.empresa_id ?? null;
}

/**
 * Wrapper de query com filtro automático por empresa.
 * Uso: sbEmpresa('clients').select('*')
 * → adiciona .eq('empresa_id', empresaId) automaticamente
 */
export function sbEmpresa(table: string) {
  const empresaId = getEmpresaId();
  const q = supabase.from(table);
  // Retorna o query builder já filtrado se tiver empresa_id
  if (empresaId) {
    return (q as any).select('*').eq('empresa_id', empresaId);
  }
  return q;
}

/** Retorna o objeto { empresa_id } para usar em INSERTs */
export function empresaPayload(): { empresa_id: string } | Record<string, never> {
  const id = getEmpresaId();
  return id ? { empresa_id: id } : {};
}

// 🔑 KEY-VALUE STORE
// Gerencia dados arbitrários armazenados em uma tabela simples de KV

interface KVRecord {
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

const KV_TABLE = 'kv_store_0092e077';

export const kvStore = {
  /**
   * Obtém todos os registros do KV store
   */
  async getAll(): Promise<KVRecord[]> {
    try {
      const { data, error } = await supabase
        .from(KV_TABLE)
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      return (data || []) as KVRecord[];
    } catch (err: any) {
      console.error('KV getAll error:', err.message);
      throw err;
    }
  },

  /**
   * Define um valor no KV store (cria ou atualiza)
   */
  async set(key: string, value: any): Promise<void> {
    try {
      // Tenta atualizar primeiro
      const { data: existing, error: selectError } = await supabase
        .from(KV_TABLE)
        .select('key')
        .eq('key', key)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existing) {
        // Atualizar registro existente
        const { error: updateError } = await supabase
          .from(KV_TABLE)
          .update({
            value,
            updated_at: new Date().toISOString(),
          })
          .eq('key', key);

        if (updateError) throw updateError;
      } else {
        // Criar novo registro
        const { error: insertError } = await supabase
          .from(KV_TABLE)
          .insert([
            {
              key,
              value,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
      }
    } catch (err: any) {
      console.error('KV set error:', err.message);
      throw err;
    }
  },

  /**
   * Deleta uma chave do KV store
   */
  async delete(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(KV_TABLE)
        .delete()
        .eq('key', key);

      if (error) throw error;
    } catch (err: any) {
      console.error('KV delete error:', err.message);
      throw err;
    }
  },
};
