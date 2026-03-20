/**
 * SUPABASE EXTENDED - Multi-tenant helpers com suporte a oficina_config
 * OPÇÃO 1: Uma oficina por empresa
 * 
 * A segmentação funciona assim:
 * 1. Usuário faz login e seu empresa_id é armazenado
 * 2. A empresa tem UMA única oficina_config
 * 3. Todas as queries filtram por empresa_id
 * 4. A oficina_config é fetched automaticamente baseada na empresa
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://acuufrgoyjwzlyhopaus.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjI5ODgsImV4cCI6MjA4MzgzODk4OH0.V7CgRaRFI8QAblr3TysttxPAY5E-e2vWEpmdu_2au4A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// HELPERS EMPRESA (existente, mantém compatibilidade)
// ============================================================================

export const sbEmpresa = () => {
  return localStorage.getItem('empresa_id') || '';
};

export const empresaPayload = () => ({
  empresa_id: sbEmpresa(),
});

// ============================================================================
// HELPERS OFICINA (novo - extrai oficina_config baseado na empresa)
// ============================================================================

/**
 * Retorna o ID da oficina_config para a empresa atual
 * Em OPÇÃO 1, cada empresa tem exatamente 1 oficina_config
 * Geralmente o ID é armazenado em localStorage durante o login
 */
export const sbOficina = () => {
  return localStorage.getItem('oficina_id') || '';
};

/**
 * Payload com empresa_id para queries
 * Inclui tanto empresa_id quanto oficina_id se disponível
 */
export const oficinaPayload = () => ({
  empresa_id: sbEmpresa(),
  oficina_id: sbOficina(),
});

/**
 * Fetch completo da oficina_config para a empresa atual
 * Usa o oficina_id armazenado no localStorage
 */
export const fetchOficinaConfig = async () => {
  const oficina_id = sbOficina();
  
  if (!oficina_id) {
    console.warn('Nenhuma oficina_id encontrada em localStorage');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('oficina_config')
      .select('*')
      .eq('id', oficina_id)
      .single();

    if (error) {
      console.error('Erro ao buscar oficina_config:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao buscar oficina_config:', error);
    return null;
  }
};

/**
 * Fetch de oficina_config por empresa_id
 * Útil durante o login para descobrir qual é a oficina da empresa
 */
export const fetchOficinaByEmpresa = async (empresa_id: string) => {
  if (!empresa_id) {
    console.warn('empresa_id vazio para fetchOficinaByEmpresa');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('oficina_config')
      .select('*')
      .eq('id', empresa_id) // IMPORTANTE: na OPÇÃO 1, o ID da oficina_config é igual ao empresa_id
      .single();

    if (error) {
      console.error('Erro ao buscar oficina por empresa:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return null;
  }
};

// ============================================================================
// HELPERS LOGIN - Armazenar contexto após autenticação
// ============================================================================

/**
 * Chamado APÓS o login bem-sucedido
 * Extrai empresa_id e oficina_id do usuário autenticado e armazena
 * 
 * @param userId - user.id do auth
 * @param userRole - 'colaborador' | 'mecanico' | 'admin'
 */
export const setupUserContext = async (userId: string, userRole: 'colaborador' | 'mecanico' | 'admin') => {
  try {
    let empresaId = '';
    let oficinaId = '';

    // Buscar empresa_id baseado no user_id
    if (userRole === 'colaborador') {
      const { data } = await supabase
        .from('01_colaboradores')
        .select('empresa_id')
        .eq('auth_user_id', userId)
        .single();
      
      empresaId = data?.empresa_id || '';
    } else if (userRole === 'mecanico') {
      const { data } = await supabase
        .from('12_MECANICOS')
        .select('empresa_id')
        .eq('auth_user_id', userId)
        .single();
      
      empresaId = data?.empresa_id || '';
    }

    if (!empresaId) {
      console.error('Não foi possível encontrar empresa_id para o usuário');
      return false;
    }

    // Armazenar empresa_id
    localStorage.setItem('empresa_id', empresaId);

    // Em OPÇÃO 1, o ID da oficina_config é igual ao empresa_id
    // Poderíamos fazer uma validação aqui buscando a oficina_config
    localStorage.setItem('oficina_id', empresaId);

    console.log('✅ Contexto de usuário configurado:', { empresaId, oficinaId: empresaId });
    return true;
  } catch (error) {
    console.error('Erro ao configurar contexto do usuário:', error);
    return false;
  }
};

// ============================================================================
// PATTERN DE QUERIES COM SEGMENTAÇÃO
// ============================================================================

/**
 * EXEMPLO: Buscar colaboradores apenas da empresa atual
 * Use esse pattern em qualquer query que precisa de segmentação
 */
export const fetchColaboradoresSegmentado = async () => {
  const { empresa_id } = empresaPayload();

  if (!empresa_id) {
    console.warn('Nenhuma empresa_id para filtrar colaboradores');
    return [];
  }

  const { data, error } = await supabase
    .from('01_colaboradores')
    .select('*')
    .eq('empresa_id', empresa_id);

  if (error) {
    console.error('Erro ao buscar colaboradores:', error);
    return [];
  }

  return data || [];
};

/**
 * EXEMPLO: Buscar mecânicos apenas da empresa atual
 */
export const fetchMecanicosSegmentado = async () => {
  const { empresa_id } = empresaPayload();

  if (!empresa_id) {
    console.warn('Nenhuma empresa_id para filtrar mecânicos');
    return [];
  }

  const { data, error } = await supabase
    .from('12_MECANICOS')
    .select('*')
    .eq('empresa_id', empresa_id);

  if (error) {
    console.error('Erro ao buscar mecânicos:', error);
    return [];
  }

  return data || [];
};

/**
 * EXEMPLO: Buscar OS (service orders) apenas da empresa atual
 */
export const fetchOSSegmentado = async () => {
  const { empresa_id } = empresaPayload();

  if (!empresa_id) {
    console.warn('Nenhuma empresa_id para filtrar OS');
    return [];
  }

  const { data, error } = await supabase
    .from('06_OS')
    .select('*')
    .eq('empresa_id', empresa_id);

  if (error) {
    console.error('Erro ao buscar OS:', error);
    return [];
  }

  return data || [];
};

// ============================================================================
// HELPER: Limpar contexto ao fazer logout
// ============================================================================

export const clearUserContext = () => {
  localStorage.removeItem('empresa_id');
  localStorage.removeItem('oficina_id');
  localStorage.removeItem('auth_token');
  // ... remova outros dados de usuário conforme necessário
};

// ============================================================================
// CONTEXT REACT (opcional - para facilitar acesso em toda a app)
// ============================================================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OficinaContextType {
  empresa_id: string;
  oficina_id: string;
  oficina_config: any | null;
  isLoading: boolean;
}

export const OficinaContext = createContext<OficinaContextType | null>(null);

export const OficinaProvider = ({ children }: { children: ReactNode }) => {
  const [empresa_id, setEmpresaId] = useState(() => sbEmpresa());
  const [oficina_id, setOficinaId] = useState(() => sbOficina());
  const [oficina_config, setOficinaConfig] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOficinaConfig = async () => {
      const config = await fetchOficinaConfig();
      setOficinaConfig(config);
      setIsLoading(false);
    };

    if (oficina_id) {
      loadOficinaConfig();
    } else {
      setIsLoading(false);
    }
  }, [oficina_id]);

  return (
    <OficinaContext.Provider value={{ empresa_id, oficina_id, oficina_config, isLoading }}>
      {children}
    </OficinaContext.Provider>
  );
};

/**
 * Hook para usar o contexto de oficina em qualquer componente
 * Exemplo:
 * const { empresa_id, oficina_config } = useOficinaContext();
 */
export const useOficinaContext = () => {
  const context = useContext(OficinaContext);
  if (!context) {
    throw new Error('useOficinaContext deve ser usado dentro de OficinaProvider');
  }
  return context;
};
