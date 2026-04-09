import { useState, useEffect } from "react";
import { syncService, type SyncSnapshot } from "@/app/core/services/sync";

type MetricKey = keyof SyncSnapshot["metrics"];

/**
 * Hook para fallback automático de dados offline no Portal Executivo.
 *
 * Tenta buscar dados via `fetcher`. Se online e sucesso, retorna os dados live.
 * Se offline ou fetcher falha, retorna o snapshot local correspondente.
 *
 * @param fetcher  - Async function que busca dados da API
 * @param cacheKey - Chave do snapshot local (ai | faturamento | servicosPopular | performanceMecanicos)
 */
export function useOfflineData<T>(
  fetcher: () => Promise<T>,
  cacheKey: MetricKey
): { data: T | null; isOffline: boolean; isLoading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      if (!navigator.onLine) {
        const snapshot = syncService.getLastSnapshot();
        if (snapshot) {
          setData(snapshot.metrics[cacheKey] as T);
        } else {
          setError("Sem dados offline disponíveis. Conecte-se e sincronize.");
        }
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetcher();
        if (!cancelled) setData(result);
      } catch (err) {
        // Fallback pro snapshot local em caso de erro
        const snapshot = syncService.getLastSnapshot();
        if (snapshot?.metrics[cacheKey]) {
          if (!cancelled) {
            setData(snapshot.metrics[cacheKey] as T);
            setIsOffline(true);
          }
        } else {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : "Erro ao carregar dados");
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fetcher, cacheKey, isOffline]);

  return { data, isOffline, isLoading, error };
}
