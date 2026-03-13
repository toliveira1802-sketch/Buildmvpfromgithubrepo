import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook genérico para carregar dados da API com fallback para dados mockados
 * @param apiCall - Função assíncrona que retorna os dados da API
 * @param mockData - Dados mockados usados como fallback
 * @param dependencies - Array de dependências para recarregar os dados
 */
export function useAPI<T>(
  apiCall: () => Promise<T>,
  mockData: T,
  dependencies: any[] = []
): { data: T; isLoading: boolean; error: Error | null; reload: () => void } {
  const [data, setData] = useState<T>(mockData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      console.warn("API call failed, using mock data:", err);
      setError(err as Error);
      // Mantém os dados mockados em caso de erro
      setData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    reload: loadData,
  };
}

/**
 * Hook para operações de criação/atualização
 */
export function useAPIMutation<T, P>(
  apiCall: (params: P) => Promise<T>
): {
  mutate: (params: P) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (params: P): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall(params);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message || "Erro ao processar requisição");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
}
