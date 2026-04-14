# Portal Consultor V1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o Portal Consultor V1 do DAP 4.0 (6 telas funcionais com mocks persistentes) sob padrão world-class, via reforma cirúrgica das telas existentes.

**Architecture:** Reforma cirúrgica preservando rotas/filenames. Nova pasta `src/app/consultor/` com tokens, componentes híbridos (Radix+custom), stores Zustand persistentes e tipos. TDD rigoroso em libs/stores.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, Radix UI, Zustand + persist, Framer Motion, Vitest + Testing Library, Inter Variable + Geist Mono Variable.

**Spec**: `docs/superpowers/specs/2026-04-14-portal-consultor-v1-design.md` — leia antes de começar.

---

## Estrutura de arquivos

### Novos
```
src/app/consultor/
  tokens/theme.css
  tokens/motion.ts
  types/index.ts
  lib/formatters.ts
  lib/idGenerator.ts
  lib/__tests__/formatters.test.ts
  lib/__tests__/idGenerator.test.ts
  store/seed.ts
  store/authStore.ts
  store/clientesStore.ts
  store/veiculosStore.ts
  store/osStore.ts
  store/__tests__/authStore.test.ts
  store/__tests__/clientesStore.test.ts
  store/__tests__/veiculosStore.test.ts
  store/__tests__/osStore.test.ts
  store/__tests__/testUtils.ts
  components/Button.tsx
  components/StatusBadge.tsx
  components/SearchInput.tsx
  components/EmptyState.tsx
  components/StatCard.tsx
  components/Stepper.tsx
  components/DataTable.tsx
  components/SidePanel.tsx
  components/WizardDrawer.tsx
  components/Tabs.tsx
  components/Sidebar.tsx
  components/Topbar.tsx
  components/__tests__/*.test.tsx
  bootstrap.ts              # initializeSeedIfEmpty
src/app/pages/admin/AdminVeiculos.tsx
src/app/pages/admin/AdminVeiculoDetalhe.tsx
tests/integration/wizardNovaOS.test.tsx
tests/integration/checklist.test.tsx
tests/integration/login.test.tsx
vitest.config.ts
vitest.setup.ts
```

### Reescritos (path preservado)
```
src/app/pages/Login.tsx
src/app/pages/Dashboard.tsx
src/app/pages/admin/AdminClientes.tsx
src/app/pages/admin/AdminClienteDetalhe.tsx
src/app/pages/admin/AdminOrdensServico.tsx
src/app/pages/admin/AdminOSDetalhes.tsx
src/app/pages/admin/AdminNovaOS.tsx    # vira redirect
src/app/components/ConsultorLayout.tsx
src/main.tsx                           # importa tokens + fontes + bootstrap
src/app/routes.tsx                     # adiciona /veiculos e /veiculos/:id
```

---

## Fases

- **Fase 0** — Setup (este arquivo)
- **Fase 1** — Fundação TDD: types, lib, stores (este arquivo)
- **Fase 2** — Componentes → `2026-04-14-portal-consultor-v1-phase2.md`
- **Fase 3** — Layout → `2026-04-14-portal-consultor-v1-phase3.md`
- **Fase 4** — Telas → `2026-04-14-portal-consultor-v1-phase4.md`
- **Fase 5** — Polimento → `2026-04-14-portal-consultor-v1-phase5.md`

Cada fase termina com checkpoint verde (`npm test` + smoke manual quando aplicável) antes da próxima.

---

# Fase 0 — Setup

### Task 0.1: Instalar dependências

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Instalar deps de runtime e dev**

```bash
npm install zustand@4.5.5 @fontsource-variable/inter@5.1.0 @fontsource-variable/geist-mono@5.1.0
npm install -D vitest@2.1.0 @vitest/ui@2.1.0 jsdom@25.0.0 @testing-library/react@16.0.1 @testing-library/user-event@14.5.2 @testing-library/jest-dom@6.5.0 @types/node@22.7.0
```

Expected: `package.json` updated with new deps, install completes sem erros.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add zustand, vitest, testing-library, fontes Inter/Geist Mono"
```

### Task 0.2: Configurar Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Criar vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/app/consultor/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
    },
  },
})
```

- [ ] **Step 2: Criar vitest.setup.ts**

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  const store = new Map<string, string>()
  const mock: Storage = {
    get length() { return store.size },
    clear: () => store.clear(),
    getItem: (k) => store.get(k) ?? null,
    key: (i) => Array.from(store.keys())[i] ?? null,
    removeItem: (k) => { store.delete(k) },
    setItem: (k, v) => { store.set(k, String(v)) },
  }
  vi.stubGlobal('localStorage', mock)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
```

- [ ] **Step 3: Adicionar scripts em package.json**

Editar o bloco `scripts` de `package.json` pra incluir:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 4: Smoke test do setup**

```bash
npx vitest run --reporter=verbose
```

Expected: `No test files found` (sem testes ainda), sai com exit 0.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json
git commit -m "chore: configurar vitest + testing-library + localStorage mock"
```

### Task 0.3: Tokens de tema e fontes

**Files:**
- Create: `src/app/consultor/tokens/theme.css`
- Create: `src/app/consultor/tokens/motion.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Criar theme.css**

```css
/* src/app/consultor/tokens/theme.css */
.consultor {
  --bg-0: #09090b;
  --bg-1: #0c0c0f;
  --bg-2: #131318;
  --bg-3: #1a1a20;
  --border: #26262d;
  --border-strong: #35353f;

  --text-0: #fafafa;
  --text-1: #a1a1aa;
  --text-2: #71717a;
  --text-3: #52525b;

  --brand: #e5323b;
  --brand-hover: #f0474f;
  --brand-subtle: rgba(229, 50, 59, 0.12);
  --brand-ring: rgba(229, 50, 59, 0.35);

  --success: #22c55e;
  --warning: #f59e0b;
  --info: #3b82f6;
  --danger: #ef4444;
  --vip: #c084fc;

  --radius-input: 6px;
  --radius-card: 10px;
  --radius-panel: 14px;

  --shadow-panel: 0 20px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--border);

  background: var(--bg-0);
  color: var(--text-0);
  font-family: 'Inter Variable', system-ui, -apple-system, sans-serif;
  font-feature-settings: 'cv11', 'ss01', 'ss03';
}

.consultor .mono {
  font-family: 'Geist Mono Variable', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}

.consultor *:focus-visible {
  outline: 2px solid var(--brand-ring);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 2: Criar motion.ts**

```ts
// src/app/consultor/tokens/motion.ts
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.64, 0, 0.78, 0] as const,
}

export const dur = {
  fast: 0.14,
  base: 0.22,
  slow: 0.36,
}

export const stagger = {
  list: 0.018,
}

export const spring = {
  panel: { type: 'spring' as const, stiffness: 320, damping: 34 },
}
```

- [ ] **Step 3: Importar fontes + tokens em main.tsx**

Editar `src/main.tsx`. Adicionar no topo (após imports existentes de CSS):

```ts
import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'
import './app/consultor/tokens/theme.css'
```

- [ ] **Step 4: Commit**

```bash
git add src/app/consultor/tokens/ src/main.tsx
git commit -m "feat(consultor): tokens de tema dark + fontes Inter/Geist Mono"
```

---

# Fase 1 — Fundação (TDD)

## Task 1.1: Types

**Files:**
- Create: `src/app/consultor/types/index.ts`

- [ ] **Step 1: Criar types/index.ts**

```ts
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

export interface OS {
  id: string
  clienteId: UUID
  veiculoId: UUID
  status: StatusOS
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/types/
git commit -m "feat(consultor): types do domínio (Cliente, Veiculo, OS, Checklist)"
```

## Task 1.2: Formatters (TDD)

**Files:**
- Create: `src/app/consultor/lib/__tests__/formatters.test.ts`
- Create: `src/app/consultor/lib/formatters.ts`

- [ ] **Step 1: Escrever testes (failing)**

```ts
// src/app/consultor/lib/__tests__/formatters.test.ts
import { describe, it, expect } from 'vitest'
import {
  formatCPF,
  formatTelefone,
  formatPlaca,
  formatMoeda,
  formatKm,
  formatDataRelativa,
  formatDataExtensa,
  normalizaPlaca,
  normalizaDigitos,
} from '../formatters'

describe('formatCPF', () => {
  it('formats 11 digits into XXX.XXX.XXX-XX', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })
  it('accepts partially formatted input', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
  })
  it('returns original when invalid length', () => {
    expect(formatCPF('123')).toBe('123')
  })
})

describe('formatTelefone', () => {
  it('formats 11 digits into (XX) XXXXX-XXXX', () => {
    expect(formatTelefone('11987654321')).toBe('(11) 98765-4321')
  })
  it('formats 10 digits into (XX) XXXX-XXXX', () => {
    expect(formatTelefone('1133334444')).toBe('(11) 3333-4444')
  })
})

describe('formatPlaca', () => {
  it('uppercases and inserts hyphen at position 3', () => {
    expect(formatPlaca('abc1d23')).toBe('ABC-1D23')
  })
  it('accepts already formatted placa', () => {
    expect(formatPlaca('ABC-1D23')).toBe('ABC-1D23')
  })
})

describe('normalizaPlaca', () => {
  it('remove hyphens e caixa alta', () => {
    expect(normalizaPlaca('abc-1d23')).toBe('ABC1D23')
  })
})

describe('formatMoeda', () => {
  it('formats centavos as BRL', () => {
    expect(formatMoeda(12345)).toBe('R$ 123,45')
  })
  it('formats zero', () => {
    expect(formatMoeda(0)).toBe('R$ 0,00')
  })
  it('formats milhar', () => {
    expect(formatMoeda(1234567)).toBe('R$ 12.345,67')
  })
})

describe('formatKm', () => {
  it('separates milhar with dot', () => {
    expect(formatKm(123456)).toBe('123.456 km')
  })
  it('handles zero', () => {
    expect(formatKm(0)).toBe('0 km')
  })
})

describe('formatDataRelativa', () => {
  it('returns "hoje" for same day', () => {
    const now = new Date()
    expect(formatDataRelativa(now.toISOString(), now)).toBe('hoje')
  })
  it('returns "há 3 dias"', () => {
    const now = new Date('2026-04-14T12:00:00Z')
    const past = new Date('2026-04-11T12:00:00Z')
    expect(formatDataRelativa(past.toISOString(), now)).toBe('há 3 dias')
  })
  it('returns "ontem" for -1 day', () => {
    const now = new Date('2026-04-14T12:00:00Z')
    const past = new Date('2026-04-13T12:00:00Z')
    expect(formatDataRelativa(past.toISOString(), now)).toBe('ontem')
  })
})

describe('normalizaDigitos', () => {
  it('keeps only digits', () => {
    expect(normalizaDigitos('(11) 98765-4321')).toBe('11987654321')
  })
})
```

- [ ] **Step 2: Rodar testes e ver falhar**

```bash
npx vitest run src/app/consultor/lib/__tests__/formatters.test.ts
```

Expected: FAIL ("Cannot find module '../formatters'").

- [ ] **Step 3: Implementar formatters.ts**

```ts
// src/app/consultor/lib/formatters.ts
export function normalizaDigitos(input: string): string {
  return input.replace(/\D/g, '')
}

export function formatCPF(input: string): string {
  const digits = normalizaDigitos(input)
  if (digits.length !== 11) return input
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

export function formatTelefone(input: string): string {
  const d = normalizaDigitos(input)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6, 10)}`
  return input
}

export function normalizaPlaca(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

export function formatPlaca(input: string): string {
  const n = normalizaPlaca(input)
  if (n.length !== 7) return input.toUpperCase()
  return `${n.slice(0, 3)}-${n.slice(3, 7)}`
}

export function formatMoeda(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100)
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('pt-BR').format(km)} km`
}

export function formatDataExtensa(iso: string, locale = 'pt-BR'): string {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDataRelativa(iso: string, now: Date = new Date()): string {
  const then = new Date(iso)
  const msPerDay = 86_400_000
  const days = Math.floor((startOfDay(now).getTime() - startOfDay(then).getTime()) / msPerDay)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days > 1 && days < 30) return `há ${days} dias`
  if (days >= 30 && days < 365) return `há ${Math.floor(days / 30)} meses`
  if (days >= 365) return `há ${Math.floor(days / 365)} anos`
  if (days === -1) return 'amanhã'
  return `em ${Math.abs(days)} dias`
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
```

- [ ] **Step 4: Rodar testes e ver passar**

```bash
npx vitest run src/app/consultor/lib/__tests__/formatters.test.ts
```

Expected: PASS, 13+ checks.

- [ ] **Step 5: Commit**

```bash
git add src/app/consultor/lib/
git commit -m "feat(consultor): formatters (cpf, telefone, placa, moeda, km, data)"
```

## Task 1.3: idGenerator (TDD)

**Files:**
- Create: `src/app/consultor/lib/__tests__/idGenerator.test.ts`
- Create: `src/app/consultor/lib/idGenerator.ts`

- [ ] **Step 1: Escrever testes**

```ts
// src/app/consultor/lib/__tests__/idGenerator.test.ts
import { describe, it, expect } from 'vitest'
import { nextOSId, uuid } from '../idGenerator'

describe('nextOSId', () => {
  it('retorna OS-YYYY-0001 quando lista vazia', () => {
    expect(nextOSId([], 2026)).toBe('OS-2026-0001')
  })
  it('incrementa do maior existente do mesmo ano', () => {
    expect(nextOSId(['OS-2026-0001', 'OS-2026-0005'], 2026)).toBe('OS-2026-0006')
  })
  it('reinicia a sequência em novo ano', () => {
    expect(nextOSId(['OS-2025-0099'], 2026)).toBe('OS-2026-0001')
  })
  it('pad 4 dígitos', () => {
    expect(nextOSId(['OS-2026-0042'], 2026)).toBe('OS-2026-0043')
  })
  it('ignora IDs com formato estranho', () => {
    expect(nextOSId(['foo', 'OS-2026-0003'], 2026)).toBe('OS-2026-0004')
  })
})

describe('uuid', () => {
  it('gera string de 36 chars (v4)', () => {
    const id = uuid()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
  it('gera valores únicos', () => {
    const a = uuid()
    const b = uuid()
    expect(a).not.toBe(b)
  })
})
```

- [ ] **Step 2: Rodar, ver falhar**

```bash
npx vitest run src/app/consultor/lib/__tests__/idGenerator.test.ts
```

- [ ] **Step 3: Implementar**

```ts
// src/app/consultor/lib/idGenerator.ts
export function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function nextOSId(existing: ReadonlyArray<string>, year: number): string {
  const prefix = `OS-${year}-`
  const nums = existing
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)))
    .filter((n) => Number.isFinite(n))
  const next = (nums.length ? Math.max(...nums) : 0) + 1
  return `${prefix}${String(next).padStart(4, '0')}`
}
```

- [ ] **Step 4: Rodar, ver passar**

```bash
npx vitest run src/app/consultor/lib/__tests__/idGenerator.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/app/consultor/lib/idGenerator.ts src/app/consultor/lib/__tests__/idGenerator.test.ts
git commit -m "feat(consultor): nextOSId + uuid helpers"
```

## Task 1.4: Seed data

**Files:**
- Create: `src/app/consultor/store/seed.ts`

- [ ] **Step 1: Criar seed.ts**

```ts
// src/app/consultor/store/seed.ts
import type {
  Cliente,
  Veiculo,
  OS,
  Consultor,
  ChecklistItem,
} from '../types'
import { CHECKLIST_TEMPLATE } from '../types'
import { uuid } from '../lib/idGenerator'

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
  return {
    id,
    clienteId,
    veiculoId,
    status,
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/store/seed.ts
git commit -m "feat(consultor): seed com 15 clientes, 20 veiculos, 25 OS"
```

## Task 1.5: testUtils helper

**Files:**
- Create: `src/app/consultor/store/__tests__/testUtils.ts`

- [ ] **Step 1: Criar helper**

```ts
// src/app/consultor/store/__tests__/testUtils.ts
export function resetAllStores(): void {
  localStorage.clear()
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/store/__tests__/testUtils.ts
git commit -m "test(consultor): helper resetAllStores"
```

## Task 1.6: authStore (TDD)

**Files:**
- Create: `src/app/consultor/store/__tests__/authStore.test.ts`
- Create: `src/app/consultor/store/authStore.ts`

- [ ] **Step 1: Escrever testes**

```ts
// src/app/consultor/store/__tests__/authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'
import { resetAllStores } from './testUtils'

describe('authStore', () => {
  beforeEach(() => {
    resetAllStores()
    useAuthStore.setState({ consultor: null, loading: false, error: null })
  })

  it('inicia deslogado', () => {
    expect(useAuthStore.getState().consultor).toBeNull()
  })

  it('login seta consultor e persiste', async () => {
    await useAuthStore.getState().login('thales@doctor.com', 'senha')
    expect(useAuthStore.getState().consultor?.nome).toBe('Thales Oliveira')
    const persisted = JSON.parse(localStorage.getItem('dap-consultor/auth') || '{}')
    expect(persisted.state.consultor?.nome).toBe('Thales Oliveira')
  })

  it('login rejeita email vazio', async () => {
    await expect(useAuthStore.getState().login('', 'senha')).rejects.toThrow('Email obrigatório')
  })

  it('login rejeita senha vazia', async () => {
    await expect(useAuthStore.getState().login('a@b.com', '')).rejects.toThrow('Senha obrigatória')
  })

  it('logout limpa consultor', async () => {
    await useAuthStore.getState().login('a@b.com', 'x')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().consultor).toBeNull()
  })
})
```

- [ ] **Step 2: Rodar, ver falhar**

```bash
npx vitest run src/app/consultor/store/__tests__/authStore.test.ts
```

- [ ] **Step 3: Implementar**

```ts
// src/app/consultor/store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Consultor } from '../types'
import { SEED_CONSULTOR } from './seed'

interface AuthState {
  consultor: Consultor | null
  loading: boolean
  error: string | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      consultor: null,
      loading: false,
      error: null,
      login: async (email, senha) => {
        if (!email.trim()) throw new Error('Email obrigatório')
        if (!senha.trim()) throw new Error('Senha obrigatória')
        set({ loading: true, error: null })
        await new Promise((r) => setTimeout(r, 400))
        set({ consultor: SEED_CONSULTOR, loading: false })
      },
      logout: () => set({ consultor: null, error: null }),
    }),
    {
      name: 'dap-consultor/auth',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

- [ ] **Step 4: Rodar, ver passar**

```bash
npx vitest run src/app/consultor/store/__tests__/authStore.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/app/consultor/store/authStore.ts src/app/consultor/store/__tests__/authStore.test.ts
git commit -m "feat(consultor): authStore com login mock e persist"
```

## Task 1.7: clientesStore (TDD)

**Files:**
- Create: `src/app/consultor/store/__tests__/clientesStore.test.ts`
- Create: `src/app/consultor/store/clientesStore.ts`

- [ ] **Step 1: Testes**

```ts
// src/app/consultor/store/__tests__/clientesStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useClientesStore } from '../clientesStore'
import { resetAllStores } from './testUtils'
import type { Cliente } from '../../types'

const makeCliente = (over: Partial<Cliente> = {}): Cliente => ({
  id: 'c-1',
  nome: 'Teste',
  cpf: '11111111111',
  telefone: '11999990000',
  status: 'ativo',
  criadoEm: new Date().toISOString(),
  ...over,
})

describe('clientesStore', () => {
  beforeEach(() => {
    resetAllStores()
    useClientesStore.setState({ items: [] })
  })

  it('add insere cliente', () => {
    useClientesStore.getState().add(makeCliente())
    expect(useClientesStore.getState().items).toHaveLength(1)
  })

  it('update altera por id', () => {
    useClientesStore.getState().add(makeCliente())
    useClientesStore.getState().update('c-1', { nome: 'Novo' })
    expect(useClientesStore.getState().getById('c-1')?.nome).toBe('Novo')
  })

  it('remove apaga por id', () => {
    useClientesStore.getState().add(makeCliente())
    useClientesStore.getState().remove('c-1')
    expect(useClientesStore.getState().items).toHaveLength(0)
  })

  it('search por nome case-insensitive', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a', nome: 'Rafael Moreira' }))
    useClientesStore.getState().add(makeCliente({ id: 'b', nome: 'Juliana Tavares' }))
    const result = useClientesStore.getState().search('rafa')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('search por cpf parcial (ignorando máscara)', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a', cpf: '12345678901' }))
    const result = useClientesStore.getState().search('123.456')
    expect(result).toHaveLength(1)
  })

  it('search por telefone parcial', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a', telefone: '11987654321' }))
    const result = useClientesStore.getState().search('98765')
    expect(result).toHaveLength(1)
  })

  it('search vazio retorna tudo', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a' }))
    useClientesStore.getState().add(makeCliente({ id: 'b' }))
    expect(useClientesStore.getState().search('')).toHaveLength(2)
  })

  it('persiste em localStorage key dap-consultor/clientes', () => {
    useClientesStore.getState().add(makeCliente())
    const raw = localStorage.getItem('dap-consultor/clientes')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.state.items).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Rodar, ver falhar**

```bash
npx vitest run src/app/consultor/store/__tests__/clientesStore.test.ts
```

- [ ] **Step 3: Implementar**

```ts
// src/app/consultor/store/clientesStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Cliente } from '../types'
import { normalizaDigitos } from '../lib/formatters'

interface ClientesState {
  items: Cliente[]
  add: (c: Cliente) => void
  update: (id: string, patch: Partial<Cliente>) => void
  remove: (id: string) => void
  getById: (id: string) => Cliente | undefined
  search: (query: string) => Cliente[]
}

export const useClientesStore = create<ClientesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (c) => set((s) => ({ items: [...s.items, c] })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((c) => c.id !== id) })),
      getById: (id) => get().items.find((c) => c.id === id),
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const qDigits = normalizaDigitos(q)
        return get().items.filter((c) => {
          if (c.nome.toLowerCase().includes(q)) return true
          if (qDigits && normalizaDigitos(c.cpf).includes(qDigits)) return true
          if (qDigits && normalizaDigitos(c.telefone).includes(qDigits)) return true
          if (c.email?.toLowerCase().includes(q)) return true
          return false
        })
      },
    }),
    {
      name: 'dap-consultor/clientes',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

- [ ] **Step 4: Ver passar + commit**

```bash
npx vitest run src/app/consultor/store/__tests__/clientesStore.test.ts
git add src/app/consultor/store/clientesStore.ts src/app/consultor/store/__tests__/clientesStore.test.ts
git commit -m "feat(consultor): clientesStore com search multi-campo e persist"
```

## Task 1.8: veiculosStore (TDD)

**Files:**
- Create: `src/app/consultor/store/__tests__/veiculosStore.test.ts`
- Create: `src/app/consultor/store/veiculosStore.ts`

- [ ] **Step 1: Testes**

```ts
// src/app/consultor/store/__tests__/veiculosStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useVeiculosStore } from '../veiculosStore'
import { resetAllStores } from './testUtils'
import type { Veiculo } from '../../types'

const makeVeiculo = (over: Partial<Veiculo> = {}): Veiculo => ({
  id: 'v-1',
  clienteId: 'c-1',
  marca: 'BMW',
  modelo: '330i',
  ano: 2022,
  placa: 'ABC1D23',
  cor: 'Preto',
  km: 10000,
  remap: 'stock',
  ...over,
})

describe('veiculosStore', () => {
  beforeEach(() => {
    resetAllStores()
    useVeiculosStore.setState({ items: [] })
  })

  it('add + getById', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    expect(useVeiculosStore.getState().getById('v-1')?.modelo).toBe('330i')
  })

  it('update patcheia km', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    useVeiculosStore.getState().update('v-1', { km: 25000 })
    expect(useVeiculosStore.getState().getById('v-1')?.km).toBe(25000)
  })

  it('remove apaga', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    useVeiculosStore.getState().remove('v-1')
    expect(useVeiculosStore.getState().items).toHaveLength(0)
  })

  it('getByCliente retorna só do cliente', () => {
    useVeiculosStore.getState().add(makeVeiculo({ id: 'a', clienteId: 'c-1' }))
    useVeiculosStore.getState().add(makeVeiculo({ id: 'b', clienteId: 'c-2' }))
    useVeiculosStore.getState().add(makeVeiculo({ id: 'c', clienteId: 'c-1' }))
    expect(useVeiculosStore.getState().getByCliente('c-1')).toHaveLength(2)
  })

  it('search por placa normalizada', () => {
    useVeiculosStore.getState().add(makeVeiculo({ id: 'a', placa: 'ABC1D23' }))
    expect(useVeiculosStore.getState().search('abc-1d23')).toHaveLength(1)
    expect(useVeiculosStore.getState().search('abc1')).toHaveLength(1)
  })

  it('search por modelo', () => {
    useVeiculosStore.getState().add(makeVeiculo({ id: 'a', modelo: 'M340i' }))
    expect(useVeiculosStore.getState().search('m340')).toHaveLength(1)
  })

  it('persiste key dap-consultor/veiculos', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    expect(localStorage.getItem('dap-consultor/veiculos')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Rodar, ver falhar**

```bash
npx vitest run src/app/consultor/store/__tests__/veiculosStore.test.ts
```

- [ ] **Step 3: Implementar**

```ts
// src/app/consultor/store/veiculosStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Veiculo } from '../types'
import { normalizaPlaca } from '../lib/formatters'

interface VeiculosState {
  items: Veiculo[]
  add: (v: Veiculo) => void
  update: (id: string, patch: Partial<Veiculo>) => void
  remove: (id: string) => void
  getById: (id: string) => Veiculo | undefined
  getByCliente: (clienteId: string) => Veiculo[]
  search: (query: string) => Veiculo[]
}

export const useVeiculosStore = create<VeiculosState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (v) => set((s) => ({ items: [...s.items, v] })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((v) => v.id !== id) })),
      getById: (id) => get().items.find((v) => v.id === id),
      getByCliente: (clienteId) => get().items.filter((v) => v.clienteId === clienteId),
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const placaQ = normalizaPlaca(q)
        return get().items.filter((v) => {
          if (placaQ && normalizaPlaca(v.placa).includes(placaQ)) return true
          if (v.modelo.toLowerCase().includes(q)) return true
          if (v.marca.toLowerCase().includes(q)) return true
          return false
        })
      },
    }),
    {
      name: 'dap-consultor/veiculos',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

- [ ] **Step 4: Passar + commit**

```bash
npx vitest run src/app/consultor/store/__tests__/veiculosStore.test.ts
git add src/app/consultor/store/veiculosStore.ts src/app/consultor/store/__tests__/veiculosStore.test.ts
git commit -m "feat(consultor): veiculosStore com search placa normalizada e getByCliente"
```

## Task 1.9: osStore (TDD — coração)

**Files:**
- Create: `src/app/consultor/store/__tests__/osStore.test.ts`
- Create: `src/app/consultor/store/osStore.ts`

- [ ] **Step 1: Testes**

```ts
// src/app/consultor/store/__tests__/osStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useOSStore } from '../osStore'
import { resetAllStores } from './testUtils'
import type { OS, CreateOSDraft } from '../../types'

const baseDraft: CreateOSDraft = {
  clienteId: 'c-1',
  veiculoId: 'v-1',
  tipoServico: 'revisao',
  kmEntrada: 10000,
  queixa: 'Revisão',
}

describe('osStore', () => {
  beforeEach(() => {
    resetAllStores()
    useOSStore.setState({ items: [] })
  })

  describe('create', () => {
    it('gera id OS-YYYY-0001 quando vazio', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.id).toMatch(/^OS-\d{4}-0001$/)
    })

    it('incrementa id na criação subsequente', () => {
      useOSStore.getState().create(baseDraft)
      const os = useOSStore.getState().create(baseDraft)
      expect(os.id).toMatch(/0002$/)
    })

    it('inicializa checklist template com 14 itens', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.checklist).toHaveLength(14)
      expect(os.checklist[0].status).toBeNull()
    })

    it('inicializa orcamento pendente vazio', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.orcamento.linhas).toEqual([])
      expect(os.orcamento.aprovacao).toBe('pendente')
    })

    it('status inicial aguardando', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.status).toBe('aguardando')
    })
  })

  describe('updateStatus — transições', () => {
    it('aguardando → em_andamento OK', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'em_andamento')
      expect(useOSStore.getState().getById(os.id)?.status).toBe('em_andamento')
    })

    it('aguardando → concluida inválido', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(() => useOSStore.getState().updateStatus(os.id, 'concluida')).toThrow(/transição inválida/i)
    })

    it('em_andamento → concluida OK', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'em_andamento')
      useOSStore.getState().updateStatus(os.id, 'concluida')
      expect(useOSStore.getState().getById(os.id)?.status).toBe('concluida')
    })

    it('concluida é terminal', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'em_andamento')
      useOSStore.getState().updateStatus(os.id, 'concluida')
      expect(() => useOSStore.getState().updateStatus(os.id, 'em_andamento')).toThrow()
    })

    it('cancelada é terminal', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'cancelada')
      expect(() => useOSStore.getState().updateStatus(os.id, 'em_andamento')).toThrow()
    })

    it('aguardando → cancelada OK', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'cancelada')
      expect(useOSStore.getState().getById(os.id)?.status).toBe('cancelada')
    })
  })

  describe('updateChecklist', () => {
    it('substitui checklist', () => {
      const os = useOSStore.getState().create(baseDraft)
      const updated = os.checklist.map((i, idx) => ({ ...i, status: idx === 0 ? 'ok' as const : null }))
      useOSStore.getState().updateChecklist(os.id, updated)
      expect(useOSStore.getState().getById(os.id)?.checklist[0].status).toBe('ok')
    })
  })

  describe('updateOrcamento', () => {
    it('atualiza linhas', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateOrcamento(os.id, {
        linhas: [{ id: 'l1', tipo: 'servico', descricao: 'X', quantidade: 1, valorUnitario: 10000 }],
        aprovacao: 'pendente',
      })
      expect(useOSStore.getState().getById(os.id)?.orcamento.linhas).toHaveLength(1)
    })

    it('aprovado seta aprovadoEm', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateOrcamento(os.id, { linhas: [], aprovacao: 'aprovado' })
      expect(useOSStore.getState().getById(os.id)?.orcamento.aprovadoEm).toBeTruthy()
    })
  })

  describe('updateEntrega', () => {
    it('grava dados de entrega', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateEntrega(os.id, {
        kmSaida: 10100,
        formaPagamento: 'pix',
        observacoes: 'ok',
      })
      const after = useOSStore.getState().getById(os.id)!
      expect(after.entrega.kmSaida).toBe(10100)
      expect(after.entrega.formaPagamento).toBe('pix')
    })
  })

  describe('filterByStatus', () => {
    it('filtra por status único', () => {
      const a = useOSStore.getState().create(baseDraft)
      useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(a.id, 'em_andamento')
      expect(useOSStore.getState().filterByStatus('em_andamento')).toHaveLength(1)
      expect(useOSStore.getState().filterByStatus('aguardando')).toHaveLength(1)
    })
  })

  describe('search', () => {
    beforeEach(() => {
      useOSStore.getState().create(baseDraft)
    })
    it('busca por id parcial', () => {
      expect(useOSStore.getState().search('0001')).toHaveLength(1)
    })
    it('busca case-insensitive', () => {
      expect(useOSStore.getState().search('os-')).toHaveLength(1)
    })
    it('vazio retorna tudo', () => {
      expect(useOSStore.getState().search('')).toHaveLength(1)
    })
  })

  describe('metrics', () => {
    it('conta OS do dia', () => {
      useOSStore.getState().create(baseDraft)
      expect(useOSStore.getState().metrics().doDia).toBe(1)
    })
    it('conta em_andamento', () => {
      const o = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(o.id, 'em_andamento')
      expect(useOSStore.getState().metrics().emAndamento).toBe(1)
    })
    it('soma faturamento do mês (concluídas)', () => {
      const o = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateOrcamento(o.id, {
        linhas: [{ id: 'l', tipo: 'servico', descricao: 'X', quantidade: 2, valorUnitario: 50000 }],
        aprovacao: 'aprovado',
      })
      useOSStore.getState().updateStatus(o.id, 'em_andamento')
      useOSStore.getState().updateStatus(o.id, 'concluida')
      expect(useOSStore.getState().metrics().faturamentoMes).toBe(100000)
    })
  })
})
```

- [ ] **Step 2: Rodar, ver falhar**

```bash
npx vitest run src/app/consultor/store/__tests__/osStore.test.ts
```

- [ ] **Step 3: Implementar**

```ts
// src/app/consultor/store/osStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { OS, CreateOSDraft, StatusOS, Orcamento, Entrega, ChecklistItem } from '../types'
import { nextOSId } from '../lib/idGenerator'
import { buildChecklist, SEED_CONSULTOR } from './seed'
import { normalizaPlaca } from '../lib/formatters'

const VALID_TRANSITIONS: Record<StatusOS, StatusOS[]> = {
  aguardando: ['em_andamento', 'cancelada'],
  em_andamento: ['concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
}

interface OSMetrics {
  doDia: number
  emAndamento: number
  concluidasMes: number
  faturamentoMes: number
}

interface OSState {
  items: OS[]
  create: (draft: CreateOSDraft) => OS
  updateStatus: (id: string, next: StatusOS) => void
  updateChecklist: (id: string, items: ChecklistItem[]) => void
  updateOrcamento: (id: string, orc: Omit<Orcamento, 'aprovadoEm'> & { aprovadoEm?: string }) => void
  updateEntrega: (id: string, entrega: Entrega) => void
  getById: (id: string) => OS | undefined
  search: (query: string) => OS[]
  filterByStatus: (status: StatusOS | 'todos') => OS[]
  getByCliente: (clienteId: string) => OS[]
  getByVeiculo: (veiculoId: string) => OS[]
  metrics: () => OSMetrics
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
}

function isThisMonth(iso: string): boolean {
  const d = new Date(iso)
  const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth()
}

function totalOrcamento(o: Orcamento): number {
  return o.linhas.reduce((acc, l) => acc + l.quantidade * l.valorUnitario, 0)
}

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      items: [],
      create: (draft) => {
        const now = new Date().toISOString()
        const id = nextOSId(get().items.map((o) => o.id), new Date().getFullYear())
        const os: OS = {
          id,
          clienteId: draft.clienteId,
          veiculoId: draft.veiculoId,
          tipoServico: draft.tipoServico,
          kmEntrada: draft.kmEntrada,
          queixa: draft.queixa,
          status: 'aguardando',
          checklist: buildChecklist(),
          orcamento: { linhas: [], aprovacao: 'pendente' },
          entrega: {},
          criadoEm: now,
          atualizadoEm: now,
          consultorId: SEED_CONSULTOR.id,
        }
        set((s) => ({ items: [...s.items, os] }))
        return os
      },
      updateStatus: (id, nextStatus) => {
        const os = get().items.find((o) => o.id === id)
        if (!os) throw new Error('OS não encontrada')
        const allowed = VALID_TRANSITIONS[os.status]
        if (!allowed.includes(nextStatus)) {
          throw new Error(`Transição inválida: ${os.status} → ${nextStatus}`)
        }
        set((s) => ({
          items: s.items.map((o) =>
            o.id === id ? { ...o, status: nextStatus, atualizadoEm: new Date().toISOString() } : o,
          ),
        }))
      },
      updateChecklist: (id, items) =>
        set((s) => ({
          items: s.items.map((o) =>
            o.id === id ? { ...o, checklist: items, atualizadoEm: new Date().toISOString() } : o,
          ),
        })),
      updateOrcamento: (id, orc) => {
        const now = new Date().toISOString()
        set((s) => ({
          items: s.items.map((o) => {
            if (o.id !== id) return o
            const aprovadoEm = orc.aprovacao === 'aprovado' ? orc.aprovadoEm ?? now : undefined
            return {
              ...o,
              orcamento: { linhas: orc.linhas, aprovacao: orc.aprovacao, aprovadoEm },
              atualizadoEm: now,
            }
          }),
        }))
      },
      updateEntrega: (id, entrega) =>
        set((s) => ({
          items: s.items.map((o) =>
            o.id === id ? { ...o, entrega: { ...o.entrega, ...entrega }, atualizadoEm: new Date().toISOString() } : o,
          ),
        })),
      getById: (id) => get().items.find((o) => o.id === id),
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const placaQ = normalizaPlaca(q)
        return get().items.filter((o) => {
          if (o.id.toLowerCase().includes(q)) return true
          if (placaQ && o.id.replace(/-/g, '').toLowerCase().includes(placaQ.toLowerCase())) return true
          return false
        })
      },
      filterByStatus: (status) =>
        status === 'todos' ? get().items : get().items.filter((o) => o.status === status),
      getByCliente: (clienteId) => get().items.filter((o) => o.clienteId === clienteId),
      getByVeiculo: (veiculoId) => get().items.filter((o) => o.veiculoId === veiculoId),
      metrics: () => {
        const items = get().items
        const doDia = items.filter((o) => isToday(o.criadoEm)).length
        const emAndamento = items.filter((o) => o.status === 'em_andamento').length
        const concluidasMes = items.filter((o) => o.status === 'concluida' && isThisMonth(o.atualizadoEm)).length
        const faturamentoMes = items
          .filter((o) => o.status === 'concluida' && isThisMonth(o.atualizadoEm))
          .reduce((acc, o) => acc + totalOrcamento(o.orcamento), 0)
        return { doDia, emAndamento, concluidasMes, faturamentoMes }
      },
    }),
    {
      name: 'dap-consultor/os',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

- [ ] **Step 4: Passar + commit**

```bash
npx vitest run src/app/consultor/store/__tests__/osStore.test.ts
git add src/app/consultor/store/osStore.ts src/app/consultor/store/__tests__/osStore.test.ts
git commit -m "feat(consultor): osStore (coração) — transições, checklist, orçamento, métricas"
```

## Task 1.10: Bootstrap + search por cliente/veículo em osStore.search

**Files:**
- Create: `src/app/consultor/bootstrap.ts`
- Modify: `src/app/consultor/store/osStore.ts` (estender search)
- Modify: `src/app/consultor/store/__tests__/osStore.test.ts` (adicionar casos)

- [ ] **Step 1: Adicionar testes de search cross-store**

Adicionar ao `osStore.test.ts` dentro de `describe('search')`:

```ts
    it('busca por nome do cliente', () => {
      useClientesStore.getState().add({
        id: 'c-1', nome: 'Rafael Moreira', cpf: '11111111111',
        telefone: '11999990000', status: 'ativo', criadoEm: new Date().toISOString(),
      })
      expect(useOSStore.getState().search('rafael')).toHaveLength(1)
    })

    it('busca por placa do veículo', () => {
      useVeiculosStore.getState().add({
        id: 'v-1', clienteId: 'c-1', marca: 'BMW', modelo: '330i',
        ano: 2022, placa: 'ABC1D23', cor: 'Preto', km: 10000, remap: 'stock',
      })
      expect(useOSStore.getState().search('abc1d23')).toHaveLength(1)
    })
```

Adicionar imports no topo do arquivo de teste:

```ts
import { useClientesStore } from '../clientesStore'
import { useVeiculosStore } from '../veiculosStore'
```

E no `beforeEach` externo, também:

```ts
    useClientesStore.setState({ items: [] })
    useVeiculosStore.setState({ items: [] })
```

- [ ] **Step 2: Rodar, ver falhar**

```bash
npx vitest run src/app/consultor/store/__tests__/osStore.test.ts
```

- [ ] **Step 3: Estender search em osStore.ts**

Substituir o método `search` por:

```ts
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const clientes = useClientesStore.getState().items
        const veiculos = useVeiculosStore.getState().items
        const placaQ = normalizaPlaca(q)
        return get().items.filter((o) => {
          if (o.id.toLowerCase().includes(q)) return true
          const cli = clientes.find((c) => c.id === o.clienteId)
          if (cli?.nome.toLowerCase().includes(q)) return true
          const vei = veiculos.find((v) => v.id === o.veiculoId)
          if (vei && placaQ && normalizaPlaca(vei.placa).includes(placaQ)) return true
          if (vei?.modelo.toLowerCase().includes(q)) return true
          return false
        })
      },
```

Adicionar imports no topo:

```ts
import { useClientesStore } from './clientesStore'
import { useVeiculosStore } from './veiculosStore'
```

- [ ] **Step 4: Passar**

```bash
npx vitest run src/app/consultor/store/__tests__/osStore.test.ts
```

- [ ] **Step 5: Criar bootstrap.ts**

```ts
// src/app/consultor/bootstrap.ts
import { SEED_CLIENTES, SEED_VEICULOS, SEED_OS } from './store/seed'
import { useClientesStore } from './store/clientesStore'
import { useVeiculosStore } from './store/veiculosStore'
import { useOSStore } from './store/osStore'

export function initializeSeedIfEmpty(): void {
  if (useClientesStore.getState().items.length === 0) {
    SEED_CLIENTES.forEach((c) => useClientesStore.getState().add(c))
  }
  if (useVeiculosStore.getState().items.length === 0) {
    SEED_VEICULOS.forEach((v) => useVeiculosStore.getState().add(v))
  }
  if (useOSStore.getState().items.length === 0) {
    useOSStore.setState({ items: SEED_OS })
  }
}

export function resetConsultorMocks(): void {
  localStorage.removeItem('dap-consultor/auth')
  localStorage.removeItem('dap-consultor/clientes')
  localStorage.removeItem('dap-consultor/veiculos')
  localStorage.removeItem('dap-consultor/os')
  window.location.reload()
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/consultor/bootstrap.ts src/app/consultor/store/osStore.ts src/app/consultor/store/__tests__/osStore.test.ts
git commit -m "feat(consultor): bootstrap seed + search cross-store em osStore"
```

## Task 1.11: Checkpoint Fase 1

- [ ] **Step 1: Rodar toda a suite**

```bash
npm test
```

Expected: PASS em todos os arquivos de lib/store. 0 falhas.

- [ ] **Step 2: Build smoke**

```bash
npm run build
```

Expected: build sem erros de TS em `src/app/consultor/**`.

- [ ] **Step 3: Tag no git**

```bash
git tag consultor-v1-phase1-green
```

---

## Próximas fases

Ver arquivos separados:
- `2026-04-14-portal-consultor-v1-phase2.md` (Componentes)
- `2026-04-14-portal-consultor-v1-phase3.md` (Layout)
- `2026-04-14-portal-consultor-v1-phase4.md` (Telas)
- `2026-04-14-portal-consultor-v1-phase5.md` (Polimento)

Parar aqui, rodar checkpoint verde, e só então proceder.
