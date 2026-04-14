// src/app/consultor/types/index.ts
export type UUID = string
export type ISO = string

export type StatusCliente = 'ativo' | 'inativo' | 'vip'
export type StatusOS = 'aguardando' | 'em_andamento' | 'concluida' | 'cancelada'
export type TipoServico =
  | 'revisao'
  | 'remap_ecu'
  | 'remap_tcu'
  | 'diagnostico'
  | 'manutencao'
  | 'freios'
  | 'suspensao'
  | 'outro'
export type FormaPagamento = 'pix' | 'credito' | 'debito' | 'dinheiro' | 'transferencia'
export type RemapStage = 'stock' | 'stage_1' | 'stage_2' | 'stage_3'
export type ChecklistStatus = 'ok' | 'atencao' | 'critico' | 'nao_aplicavel' | null
export type AprovacaoOrcamento = 'pendente' | 'aprovado' | 'rejeitado'

export interface Cliente {
  id: UUID
  nome: string
  cpf: string
  telefone: string
  email?: string
  status: StatusCliente
  criadoEm: ISO
  observacoes?: string
}

export interface Veiculo {
  id: UUID
  clienteId: UUID
  marca: string
  modelo: string
  ano: number
  placa: string
  cor: string
  km: number
  remap: RemapStage
  chassi?: string
}

export interface ChecklistItem {
  id: UUID
  categoria: string
  item: string
  status: ChecklistStatus
  observacao?: string
}

export interface OrcamentoLinha {
  id: UUID
  tipo: 'servico' | 'peca'
  descricao: string
  quantidade: number
  valorUnitario: number // centavos
}

export interface Orcamento {
  linhas: OrcamentoLinha[]
  aprovacao: AprovacaoOrcamento
  aprovadoEm?: ISO
}

export interface Entrega {
  kmSaida?: number
  formaPagamento?: FormaPagamento
  observacoes?: string
  finalizadaEm?: ISO
}

export type EtapaOS =
  | 'criar'
  | 'diagnostico'
  | 'em_orcamento'
  | 'aguardando_aprovar'
  | 'aguardando_peca'
  | 'em_execucao'
  | 'teste'
  | 'pronta'
  | 'entregue'
  | 'cancelada'

export interface EtapaHistoricoItem {
  etapa: EtapaOS
  entradaEm: ISO
  saidaEm?: ISO
}

/** SLA alvo (em minutos) por etapa. Etapas terminais (entregue, cancelada) são null. */
export const SLA_POR_ETAPA_MINUTOS: Record<EtapaOS, number | null> = {
  criar: 60,
  diagnostico: 240,
  em_orcamento: 1440,
  aguardando_aprovar: 2880,
  aguardando_peca: 4320,
  em_execucao: 480,
  teste: 120,
  pronta: 1440,
  entregue: null,
  cancelada: null,
}

/** Ordem oficial das etapas no Kanban. */
export const ETAPAS_ORDENADAS: EtapaOS[] = [
  'criar',
  'diagnostico',
  'em_orcamento',
  'aguardando_aprovar',
  'aguardando_peca',
  'em_execucao',
  'teste',
  'pronta',
  'entregue',
  'cancelada',
]

/** Labels pt-BR pra cada etapa (usado em UI). */
export const ETAPA_LABELS: Record<EtapaOS, string> = {
  criar: 'Criar',
  diagnostico: 'Diagnóstico',
  em_orcamento: 'Em orçamento',
  aguardando_aprovar: 'Aguardando aprovar',
  aguardando_peca: 'Aguardando peça',
  em_execucao: 'Em execução',
  teste: 'Teste',
  pronta: 'Pronta',
  entregue: 'Entregue',
  cancelada: 'Cancelada',
}

/** Mapeia etapa → status coarse (pra compat com lista de OS existente). */
export const ETAPA_TO_STATUS: Record<EtapaOS, StatusOS> = {
  criar: 'aguardando',
  diagnostico: 'aguardando',
  em_orcamento: 'aguardando',
  aguardando_aprovar: 'aguardando',
  aguardando_peca: 'aguardando',
  em_execucao: 'em_andamento',
  teste: 'em_andamento',
  pronta: 'concluida',
  entregue: 'concluida',
  cancelada: 'cancelada',
}

export interface OS {
  id: string
  clienteId: UUID
  veiculoId: UUID
  status: StatusOS
  etapa: EtapaOS
  etapaHistorico: EtapaHistoricoItem[]
  tipoServico: TipoServico
  kmEntrada: number
  queixa: string
  checklist: ChecklistItem[]
  orcamento: Orcamento
  entrega: Entrega
  criadoEm: ISO
  atualizadoEm: ISO
  consultorId: UUID
}

export interface Consultor {
  id: UUID
  nome: string
  email: string
  avatar?: string
}

export interface CreateOSDraft {
  clienteId: UUID
  veiculoId: UUID
  tipoServico: TipoServico
  kmEntrada: number
  queixa: string
}

export const CHECKLIST_TEMPLATE: ReadonlyArray<Omit<ChecklistItem, 'id'>> = [
  { categoria: 'Motor', item: 'Nível de óleo', status: null },
  { categoria: 'Motor', item: 'Filtro de ar', status: null },
  { categoria: 'Motor', item: 'Correia dentada', status: null },
  { categoria: 'Motor', item: 'Velas de ignição', status: null },
  { categoria: 'Freios/Suspensão', item: 'Pastilhas dianteiras', status: null },
  { categoria: 'Freios/Suspensão', item: 'Pastilhas traseiras', status: null },
  { categoria: 'Freios/Suspensão', item: 'Discos de freio', status: null },
  { categoria: 'Freios/Suspensão', item: 'Amortecedores', status: null },
  { categoria: 'Elétrica', item: 'Bateria (tensão)', status: null },
  { categoria: 'Elétrica', item: 'Alternador', status: null },
  { categoria: 'Elétrica', item: 'Iluminação externa', status: null },
  { categoria: 'Carroceria', item: 'Pneus (desgaste)', status: null },
  { categoria: 'Carroceria', item: 'Lataria (avarias)', status: null },
  { categoria: 'Carroceria', item: 'Parabrisa', status: null },
]
