// src/app/consultor/lib/slaHelpers.ts
import type { EtapaOS, OS } from '../types'
import { SLA_POR_ETAPA_MINUTOS } from '../types'

export function minutosNaEtapa(os: OS, now: Date = new Date()): number {
  const atual = os.etapaHistorico[os.etapaHistorico.length - 1]
  if (!atual) return 0
  return Math.floor((now.getTime() - new Date(atual.entradaEm).getTime()) / 60_000)
}

export type SLAStatus = 'ok' | 'atencao' | 'critico' | 'terminal'

/** SLA status baseado em % do alvo consumido:
 * ≤75% → ok
 * ≤100% → atencao
 * >100% → critico
 * terminal (sem SLA) → 'terminal'
 */
export function slaStatusFor(etapa: EtapaOS, minutosDecorridos: number): SLAStatus {
  const alvo = SLA_POR_ETAPA_MINUTOS[etapa]
  if (alvo === null) return 'terminal'
  const pct = minutosDecorridos / alvo
  if (pct <= 0.75) return 'ok'
  if (pct <= 1) return 'atencao'
  return 'critico'
}

/** Formata minutos em "2h 15min", "1d 4h", "35min". */
export function formatSLA(minutos: number): string {
  if (minutos < 60) return `${minutos}min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) {
    const m = minutos % 60
    return m === 0 ? `${horas}h` : `${horas}h ${m}min`
  }
  const dias = Math.floor(horas / 24)
  const h = horas % 24
  return h === 0 ? `${dias}d` : `${dias}d ${h}h`
}
