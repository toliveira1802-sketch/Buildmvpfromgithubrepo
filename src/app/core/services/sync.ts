import { aiAPI, relatoriosAPI } from './api';
import { supabase } from '@/lib/supabase';

/**
 * SERVICO DE SINCRONIZACAO (SyncService)
 *
 * 1. Snapshot Read  — captura metricas online p/ visualizacao offline (executivo)
 * 2. Write Queue    — persiste operacoes criadas offline e flushes quando volta online
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface SyncSnapshot {
  timestamp: string;
  empresa_id: string;
  metrics: {
    ai: any;
    faturamento: any;
    servicosPopular: any;
    performanceMecanicos: any;
  };
}

export interface PendingOp {
  id: string;
  table: string;
  type: 'insert' | 'update' | 'delete';
  payload: Record<string, any>;
  createdAt: string;
  retries: number;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const SYNC_STORAGE_KEY = 'dap-sync-snapshot';
const PENDING_OPS_KEY = 'dap-pending-ops';

// ============================================================================
// SNAPSHOT (READ — Portal Executivo)
// ============================================================================

async function syncNow(): Promise<SyncSnapshot | null> {
  const empresa_id = localStorage.getItem('empresa_id');

  if (!empresa_id) {
    console.error('Nenhuma empresa selecionada para sincronizacao');
    return null;
  }

  try {
    const [aiMetrics, faturamento, servicos, performance] = await Promise.all([
      aiAPI.getMetrics(),
      relatoriosAPI.getFaturamento(),
      relatoriosAPI.getServicosPopulares(),
      relatoriosAPI.getPerformanceMecanicos()
    ]);

    const snapshot: SyncSnapshot = {
      timestamp: new Date().toISOString(),
      empresa_id,
      metrics: { ai: aiMetrics, faturamento, servicosPopular: servicos, performanceMecanicos: performance }
    };

    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(snapshot));
    return snapshot;
  } catch (error) {
    console.error('Falha na sincronizacao:', error);
    return null;
  }
}

function getLastSnapshot(): SyncSnapshot | null {
  const raw = localStorage.getItem(SYNC_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as SyncSnapshot; } catch { return null; }
}

function hasLocalData(): boolean {
  return !!localStorage.getItem(SYNC_STORAGE_KEY);
}

// ============================================================================
// WRITE QUEUE (Offline Operations — Portal Operacional)
// ============================================================================

function getPendingOps(): PendingOp[] {
  const raw = localStorage.getItem(PENDING_OPS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as PendingOp[]; } catch { return []; }
}

function savePendingOps(ops: PendingOp[]): void {
  localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
}

/**
 * Enfileira uma operacao para ser executada quando voltar online.
 * Retorna o ID temporario da operacao.
 */
function enqueue(table: string, type: PendingOp['type'], payload: Record<string, any>): string {
  const id = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const op: PendingOp = { id, table, type, payload, createdAt: new Date().toISOString(), retries: 0 };

  const ops = getPendingOps();
  ops.push(op);
  savePendingOps(ops);

  return id;
}

/**
 * Tenta enviar todas as operacoes pendentes ao Supabase.
 * Retorna { flushed, failed } com contagens.
 */
async function flushQueue(): Promise<{ flushed: number; failed: number }> {
  const ops = getPendingOps();
  if (ops.length === 0) return { flushed: 0, failed: 0 };

  let flushed = 0;
  let failed = 0;
  const remaining: PendingOp[] = [];

  for (const op of ops) {
    try {
      let result;
      if (op.type === 'insert') {
        result = await supabase.from(op.table).insert(op.payload);
      } else if (op.type === 'update') {
        const { id, ...rest } = op.payload;
        result = await supabase.from(op.table).update(rest).eq('id', id);
      } else if (op.type === 'delete') {
        result = await supabase.from(op.table).delete().eq('id', op.payload.id);
      }

      if (result?.error) throw result.error;
      flushed++;
    } catch (err) {
      op.retries++;
      if (op.retries < 5) {
        remaining.push(op);
      }
      failed++;
      console.error(`Falha ao processar op ${op.id}:`, err);
    }
  }

  savePendingOps(remaining);
  return { flushed, failed };
}

/**
 * Quantidade de operacoes pendentes na fila.
 */
function pendingCount(): number {
  return getPendingOps().length;
}

/**
 * Limpa a fila (usar com cuidado — descarta operacoes nao enviadas).
 */
function clearQueue(): void {
  localStorage.removeItem(PENDING_OPS_KEY);
}

// ============================================================================
// AUTO-FLUSH: Quando o browser volta online, tenta enviar a fila
// ============================================================================

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const count = pendingCount();
    if (count > 0) {
      console.log(`Online detectado — flushing ${count} operacoes pendentes...`);
      flushQueue().then(({ flushed, failed }) => {
        console.log(`Flush completo: ${flushed} enviadas, ${failed} falharam`);
      });
    }
  });
}

// ============================================================================
// EXPORT
// ============================================================================

export const syncService = {
  // Snapshot (read)
  syncNow,
  getLastSnapshot,
  hasLocalData,

  // Write queue
  enqueue,
  flushQueue,
  getPendingOps,
  pendingCount,
  clearQueue,
};
