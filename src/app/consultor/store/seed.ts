// src/app/consultor/store/seed.ts
import type {
  Cliente,
  Veiculo,
  OS,
  Consultor,
  ChecklistItem,
  EtapaOS,
  Agendamento,
} from '../types'
import { CHECKLIST_TEMPLATE } from '../types'
import { uuid } from '../lib/idGenerator'

function etapaPorStatus(status: OS['status']): EtapaOS {
  switch (status) {
    case 'aguardando': return 'diagnostico'
    case 'em_andamento': return 'em_execucao'
    case 'concluida': return 'entregue'
    case 'cancelada': return 'cancelada'
  }
}

export const SEED_CONSULTOR: Consultor = {
  id: 'consultor-thales',
  nome: 'Thales Oliveira',
  email: 'thales@doctorautoprime.com',
}

export function buildChecklist(): ChecklistItem[] {
  return CHECKLIST_TEMPLATE.map((t) => ({ ...t, id: uuid() }))
}

// IDs fixos pra seed ser determinística dentro da mesma execução inicial
const ids = {
  c1: 'cli-0001', c2: 'cli-0002', c3: 'cli-0003', c4: 'cli-0004', c5: 'cli-0005',
  c6: 'cli-0006', c7: 'cli-0007', c8: 'cli-0008', c9: 'cli-0009', c10: 'cli-0010',
  c11: 'cli-0011', c12: 'cli-0012', c13: 'cli-0013', c14: 'cli-0014', c15: 'cli-0015',
  v1: 'vei-0001', v2: 'vei-0002', v3: 'vei-0003', v4: 'vei-0004', v5: 'vei-0005',
  v6: 'vei-0006', v7: 'vei-0007', v8: 'vei-0008', v9: 'vei-0009', v10: 'vei-0010',
  v11: 'vei-0011', v12: 'vei-0012', v13: 'vei-0013', v14: 'vei-0014', v15: 'vei-0015',
  v16: 'vei-0016', v17: 'vei-0017', v18: 'vei-0018', v19: 'vei-0019', v20: 'vei-0020',
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const SEED_CLIENTES: Cliente[] = [
  { id: ids.c1, nome: 'Rafael Moreira', cpf: '12345678901', telefone: '11987654321', email: 'rafael@empresa.com.br', status: 'vip', criadoEm: daysAgo(420) },
  { id: ids.c2, nome: 'Juliana Tavares', cpf: '23456789012', telefone: '11976543210', email: 'juliana.t@icloud.com', status: 'ativo', criadoEm: daysAgo(280) },
  { id: ids.c3, nome: 'Eduardo Pimenta', cpf: '34567890123', telefone: '11965432109', status: 'vip', criadoEm: daysAgo(510) },
  { id: ids.c4, nome: 'Marcela Coutinho', cpf: '45678901234', telefone: '11954321098', email: 'marcela.c@gmail.com', status: 'ativo', criadoEm: daysAgo(190) },
  { id: ids.c5, nome: 'Bruno Falcão', cpf: '56789012345', telefone: '11943210987', status: 'ativo', criadoEm: daysAgo(95) },
  { id: ids.c6, nome: 'Patrícia Lemos', cpf: '67890123456', telefone: '11932109876', email: 'patricia@studio.co', status: 'vip', criadoEm: daysAgo(620) },
  { id: ids.c7, nome: 'André Barroso', cpf: '78901234567', telefone: '11921098765', status: 'ativo', criadoEm: daysAgo(310) },
  { id: ids.c8, nome: 'Camila Ferraz', cpf: '89012345678', telefone: '11910987654', email: 'camila.f@protonmail.com', status: 'ativo', criadoEm: daysAgo(45) },
  { id: ids.c9, nome: 'Rogério Matos', cpf: '90123456789', telefone: '11909876543', status: 'inativo', criadoEm: daysAgo(780) },
  { id: ids.c10, nome: 'Larissa Pedroso', cpf: '01234567890', telefone: '11998765432', email: 'larissa@agency.com', status: 'ativo', criadoEm: daysAgo(150) },
  { id: ids.c11, nome: 'Gustavo Aragão', cpf: '11223344556', telefone: '11987651234', status: 'ativo', criadoEm: daysAgo(220) },
  { id: ids.c12, nome: 'Fernanda Sanches', cpf: '22334455667', telefone: '11976541234', email: 'fesanches@outlook.com', status: 'ativo', criadoEm: daysAgo(65) },
  { id: ids.c13, nome: 'Thiago Nogueira', cpf: '33445566778', telefone: '11965431234', status: 'inativo', criadoEm: daysAgo(900) },
  { id: ids.c14, nome: 'Beatriz Caldeira', cpf: '44556677889', telefone: '11954321234', email: 'biacaldeira@me.com', status: 'ativo', criadoEm: daysAgo(30) },
  { id: ids.c15, nome: 'Henrique Souto', cpf: '55667788990', telefone: '11943211234', status: 'ativo', criadoEm: daysAgo(175) },
]

export const SEED_VEICULOS: Veiculo[] = [
  { id: ids.v1, clienteId: ids.c1, marca: 'BMW', modelo: 'M340i', ano: 2023, placa: 'RAF2M34', cor: 'Preto Carbon', km: 28400, remap: 'stage_2' },
  { id: ids.v2, clienteId: ids.c1, marca: 'BMW', modelo: 'X5 M50i', ano: 2024, placa: 'RAF5X50', cor: 'Branco Alpino', km: 12800, remap: 'stock' },
  { id: ids.v3, clienteId: ids.c2, marca: 'Porsche', modelo: '911 Carrera S', ano: 2022, placa: 'JUL911S', cor: 'Vermelho Guardas', km: 31200, remap: 'stage_1' },
  { id: ids.v4, clienteId: ids.c3, marca: 'Mercedes-Benz', modelo: 'C63 AMG', ano: 2021, placa: 'EDU63MG', cor: 'Cinza Selenite', km: 46800, remap: 'stage_3' },
  { id: ids.v5, clienteId: ids.c3, marca: 'Audi', modelo: 'RS6 Avant', ano: 2023, placa: 'EDURS6A', cor: 'Azul Nogaro', km: 18500, remap: 'stage_2' },
  { id: ids.v6, clienteId: ids.c4, marca: 'Audi', modelo: 'S4', ano: 2022, placa: 'MARS4AU', cor: 'Preto Mito', km: 34100, remap: 'stage_1' },
  { id: ids.v7, clienteId: ids.c5, marca: 'VW', modelo: 'Golf GTI', ano: 2020, placa: 'BRUGTI0', cor: 'Branco Puro', km: 58900, remap: 'stage_2' },
  { id: ids.v8, clienteId: ids.c6, marca: 'Porsche', modelo: 'Cayenne Turbo', ano: 2023, placa: 'PATCYNT', cor: 'Preto Jet', km: 22700, remap: 'stock' },
  { id: ids.v9, clienteId: ids.c6, marca: 'BMW', modelo: 'M4 Competition', ano: 2024, placa: 'PATM4CP', cor: 'Azul Portimão', km: 8400, remap: 'stock' },
  { id: ids.v10, clienteId: ids.c7, marca: 'Mercedes-Benz', modelo: 'E53 AMG', ano: 2022, placa: 'ANDE53A', cor: 'Prata', km: 41300, remap: 'stage_1' },
  { id: ids.v11, clienteId: ids.c8, marca: 'VW', modelo: 'Golf R', ano: 2023, placa: 'CAMGLFR', cor: 'Azul Lapiz', km: 15200, remap: 'stage_1' },
  { id: ids.v12, clienteId: ids.c9, marca: 'BMW', modelo: '330i', ano: 2019, placa: 'ROG330I', cor: 'Cinza Mineral', km: 82400, remap: 'stock' },
  { id: ids.v13, clienteId: ids.c10, marca: 'Audi', modelo: 'A4 Quattro', ano: 2021, placa: 'LARA4QU', cor: 'Branco Glacial', km: 38900, remap: 'stock' },
  { id: ids.v14, clienteId: ids.c11, marca: 'BMW', modelo: 'M2', ano: 2024, placa: 'GUSM2CS', cor: 'Amarelo São Paulo', km: 6200, remap: 'stock' },
  { id: ids.v15, clienteId: ids.c12, marca: 'Mercedes-Benz', modelo: 'A45 AMG', ano: 2023, placa: 'FERA45A', cor: 'Preto Cosmos', km: 19800, remap: 'stage_2' },
  { id: ids.v16, clienteId: ids.c13, marca: 'Audi', modelo: 'Q5', ano: 2018, placa: 'THIQ5AU', cor: 'Cinza Daytona', km: 114300, remap: 'stock' },
  { id: ids.v17, clienteId: ids.c14, marca: 'Porsche', modelo: 'Macan GTS', ano: 2024, placa: 'BIAMCGT', cor: 'Verde Python', km: 4100, remap: 'stock' },
  { id: ids.v18, clienteId: ids.c15, marca: 'BMW', modelo: 'M3', ano: 2022, placa: 'HENM3CS', cor: 'Vermelho Toronto', km: 27600, remap: 'stage_1' },
  { id: ids.v19, clienteId: ids.c2, marca: 'Audi', modelo: 'S3 Sedan', ano: 2021, placa: 'JULS3AU', cor: 'Branco', km: 42000, remap: 'stage_1' },
  { id: ids.v20, clienteId: ids.c4, marca: 'VW', modelo: 'Jetta GLI', ano: 2020, placa: 'MARGLIC', cor: 'Cinza Platinum', km: 61400, remap: 'stage_2' },
]

function buildSeedOS(
  id: string,
  clienteId: string,
  veiculoId: string,
  status: OS['status'],
  tipoServico: OS['tipoServico'],
  queixa: string,
  daysOffset: number,
  kmEntrada: number,
  orcamentoLinhas: OS['orcamento']['linhas'] = [],
  aprovacao: OS['orcamento']['aprovacao'] = 'pendente',
): OS {
  const criado = daysAgo(daysOffset)
  const etapa = etapaPorStatus(status)
  return {
    id,
    clienteId,
    veiculoId,
    status,
    etapa,
    etapaHistorico: [{ etapa, entradaEm: criado }],
    tipoServico,
    kmEntrada,
    queixa,
    checklist: buildChecklist(),
    orcamento: {
      linhas: orcamentoLinhas,
      aprovacao,
      aprovadoEm: aprovacao === 'aprovado' ? criado : undefined,
    },
    entrega: status === 'concluida'
      ? { kmSaida: kmEntrada + 10, formaPagamento: 'pix', finalizadaEm: criado, observacoes: 'Entrega sem intercorrências.' }
      : {},
    criadoEm: criado,
    atualizadoEm: criado,
    consultorId: SEED_CONSULTOR.id,
  }
}

export const SEED_OS: OS[] = [
  buildSeedOS('OS-2026-0001', ids.c1, ids.v1, 'concluida', 'remap_ecu', 'Upgrade Stage 2 na M340i', 45, 28200, [
    { id: uuid(), tipo: 'servico', descricao: 'Remap ECU Stage 2', quantidade: 1, valorUnitario: 450000 },
    { id: uuid(), tipo: 'peca', descricao: 'Filtro de ar esportivo', quantidade: 1, valorUnitario: 89000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0002', ids.c2, ids.v3, 'concluida', 'revisao', 'Revisão dos 30.000 km', 38, 30800, [
    { id: uuid(), tipo: 'servico', descricao: 'Revisão completa 30k', quantidade: 1, valorUnitario: 380000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0003', ids.c3, ids.v4, 'concluida', 'freios', 'Troca de pastilhas e discos', 30, 46200, [
    { id: uuid(), tipo: 'peca', descricao: 'Jogo pastilhas diant.', quantidade: 1, valorUnitario: 240000 },
    { id: uuid(), tipo: 'peca', descricao: 'Discos ventilados diant.', quantidade: 2, valorUnitario: 180000 },
    { id: uuid(), tipo: 'servico', descricao: 'Mão de obra freios', quantidade: 1, valorUnitario: 120000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0004', ids.c4, ids.v6, 'concluida', 'diagnostico', 'Luz de injeção acesa', 28, 33900, [
    { id: uuid(), tipo: 'servico', descricao: 'Scanner + diagnóstico', quantidade: 1, valorUnitario: 45000 },
    { id: uuid(), tipo: 'peca', descricao: 'Sonda lambda', quantidade: 1, valorUnitario: 65000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0005', ids.c5, ids.v7, 'concluida', 'remap_tcu', 'Remap TCU no Golf GTI', 22, 58600, [
    { id: uuid(), tipo: 'servico', descricao: 'Remap TCU DQ250', quantidade: 1, valorUnitario: 350000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0006', ids.c6, ids.v8, 'concluida', 'manutencao', 'Troca de óleo e filtros', 20, 22500, [
    { id: uuid(), tipo: 'servico', descricao: 'Troca óleo Porsche', quantidade: 1, valorUnitario: 180000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0007', ids.c1, ids.v2, 'concluida', 'revisao', 'Primeira revisão X5', 18, 12500, [
    { id: uuid(), tipo: 'servico', descricao: 'Revisão 10k BMW', quantidade: 1, valorUnitario: 280000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0008', ids.c7, ids.v10, 'em_andamento', 'suspensao', 'Barulho na suspensão dianteira', 3, 41200, [
    { id: uuid(), tipo: 'peca', descricao: 'Bieleta estabilizadora', quantidade: 2, valorUnitario: 42000 },
    { id: uuid(), tipo: 'servico', descricao: 'Alinhamento e balanceamento', quantidade: 1, valorUnitario: 18000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0009', ids.c8, ids.v11, 'em_andamento', 'remap_ecu', 'Stage 1 no Golf R', 2, 15100, [
    { id: uuid(), tipo: 'servico', descricao: 'Remap ECU Stage 1', quantidade: 1, valorUnitario: 350000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0010', ids.c10, ids.v13, 'em_andamento', 'diagnostico', 'Consumo elevado', 1, 38800),
  buildSeedOS('OS-2026-0011', ids.c11, ids.v14, 'em_andamento', 'revisao', 'Revisão inaugural M2', 1, 6100, [
    { id: uuid(), tipo: 'servico', descricao: 'Revisão entrega BMW M', quantidade: 1, valorUnitario: 220000 },
  ], 'pendente'),
  buildSeedOS('OS-2026-0012', ids.c12, ids.v15, 'aguardando', 'remap_ecu', 'Upgrade Stage 2 A45', 0, 19800),
  buildSeedOS('OS-2026-0013', ids.c14, ids.v17, 'aguardando', 'revisao', 'Revisão inicial Macan GTS', 0, 4100),
  buildSeedOS('OS-2026-0014', ids.c15, ids.v18, 'aguardando', 'freios', 'Trepidação na frenagem', 0, 27600),
  buildSeedOS('OS-2026-0015', ids.c6, ids.v9, 'aguardando', 'outro', 'Instalação de película', 0, 8400),
  buildSeedOS('OS-2026-0016', ids.c9, ids.v12, 'cancelada', 'diagnostico', 'Cliente cancelou orçamento', 55, 82100),
  buildSeedOS('OS-2026-0017', ids.c13, ids.v16, 'cancelada', 'manutencao', 'Cliente sumiu', 48, 114000),
  buildSeedOS('OS-2026-0018', ids.c2, ids.v19, 'concluida', 'suspensao', 'Troca de amortecedores', 14, 41800, [
    { id: uuid(), tipo: 'peca', descricao: 'Amortecedores dianteiros', quantidade: 2, valorUnitario: 180000 },
    { id: uuid(), tipo: 'servico', descricao: 'Mão de obra suspensão', quantidade: 1, valorUnitario: 90000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0019', ids.c4, ids.v20, 'concluida', 'remap_ecu', 'Stage 2 Jetta GLI', 12, 61300, [
    { id: uuid(), tipo: 'servico', descricao: 'Remap ECU Stage 2', quantidade: 1, valorUnitario: 420000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0020', ids.c5, ids.v7, 'em_andamento', 'manutencao', 'Troca de kit de embreagem', 4, 58900, [
    { id: uuid(), tipo: 'peca', descricao: 'Kit embreagem Sachs', quantidade: 1, valorUnitario: 280000 },
    { id: uuid(), tipo: 'servico', descricao: 'Mão de obra embreagem', quantidade: 1, valorUnitario: 150000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0021', ids.c1, ids.v1, 'concluida', 'manutencao', 'Alinhamento pós-remap', 8, 28350, [
    { id: uuid(), tipo: 'servico', descricao: 'Alinhamento 3D', quantidade: 1, valorUnitario: 25000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0022', ids.c3, ids.v5, 'concluida', 'revisao', 'Revisão RS6', 6, 18400, [
    { id: uuid(), tipo: 'servico', descricao: 'Revisão Audi Sport', quantidade: 1, valorUnitario: 480000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0023', ids.c7, ids.v10, 'concluida', 'diagnostico', 'Vibração em alta rotação', 25, 40800, [
    { id: uuid(), tipo: 'peca', descricao: 'Coxim do motor', quantidade: 1, valorUnitario: 95000 },
    { id: uuid(), tipo: 'servico', descricao: 'Substituição coxim', quantidade: 1, valorUnitario: 60000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0024', ids.c14, ids.v17, 'concluida', 'outro', 'Películas e proteção PPF', 40, 2100, [
    { id: uuid(), tipo: 'servico', descricao: 'PPF dianteiro premium', quantidade: 1, valorUnitario: 850000 },
  ], 'aprovado'),
  buildSeedOS('OS-2026-0025', ids.c8, ids.v11, 'concluida', 'freios', 'Pastilhas cerâmicas', 10, 14900, [
    { id: uuid(), tipo: 'peca', descricao: 'Pastilha cerâmica dianteira', quantidade: 1, valorUnitario: 140000 },
    { id: uuid(), tipo: 'servico', descricao: 'Instalação pastilhas', quantidade: 1, valorUnitario: 40000 },
  ], 'aprovado'),
]

function daysFromNowAt(days: number, hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const SEED_AGENDAMENTOS: Agendamento[] = [
  { id: 'ag-0001', clienteId: ids.c1, veiculoId: ids.v1, dataHora: daysFromNowAt(0, 9, 0), duracaoMinutos: 120, tipoServico: 'revisao', status: 'confirmado', observacoes: 'Revisão programada 30k', criadoEm: daysAgo(5) },
  { id: 'ag-0002', clienteId: ids.c4, veiculoId: ids.v6, dataHora: daysFromNowAt(0, 14, 30), duracaoMinutos: 60, tipoServico: 'diagnostico', status: 'agendado', criadoEm: daysAgo(2) },
  { id: 'ag-0003', clienteId: ids.c12, veiculoId: ids.v15, dataHora: daysFromNowAt(1, 10, 0), duracaoMinutos: 240, tipoServico: 'remap_ecu', status: 'confirmado', observacoes: 'Stage 2 A45 AMG', criadoEm: daysAgo(3) },
  { id: 'ag-0004', clienteId: ids.c14, veiculoId: ids.v17, dataHora: daysFromNowAt(1, 15, 0), duracaoMinutos: 60, tipoServico: 'revisao', status: 'agendado', criadoEm: daysAgo(1) },
  { id: 'ag-0005', clienteId: ids.c5, veiculoId: ids.v7, dataHora: daysFromNowAt(2, 9, 30), duracaoMinutos: 180, tipoServico: 'manutencao', status: 'agendado', observacoes: 'Troca kit embreagem — peça já chegou', criadoEm: daysAgo(6) },
  { id: 'ag-0006', clienteId: ids.c11, veiculoId: ids.v14, dataHora: daysFromNowAt(3, 11, 0), duracaoMinutos: 120, tipoServico: 'revisao', status: 'confirmado', observacoes: 'Revisão inaugural M2', criadoEm: daysAgo(4) },
  { id: 'ag-0007', clienteId: ids.c2, veiculoId: ids.v3, dataHora: daysFromNowAt(-1, 10, 0), duracaoMinutos: 60, tipoServico: 'freios', status: 'compareceu', observacoes: 'Verificar pastilhas', criadoEm: daysAgo(7), osIdGerada: 'OS-2026-0025' },
  { id: 'ag-0008', clienteId: ids.c9, veiculoId: ids.v12, dataHora: daysFromNowAt(-2, 14, 0), duracaoMinutos: 60, tipoServico: 'diagnostico', status: 'faltou', criadoEm: daysAgo(10) },
]
