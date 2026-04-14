# Portal Consultor — DAP 4.0 — V1 Design

**Data**: 2026-04-14
**Status**: Aprovado pelo usuário (Thales), pronto para plano de implementação
**Escopo**: V1 do Portal Consultor — 6 telas, mocks persistentes, sem backend

---

## 1. Contexto e decisões fundacionais

O Portal Consultor é a superfície de trabalho do consultor da Doctor Auto Prime: onde ele acolhe cliente, abre OS, conduz checklist, negocia orçamento e entrega o veículo. V1 é mock de ponta a ponta, mas com comportamento de produto real.

### Decisões aprovadas

| # | Decisão | Escolha |
|---|---|---|
| 1 | Convivência com código existente | **Reforma cirúrgica** — mantém rotas e filenames, reescreve conteúdo |
| 2 | Linguagem visual | **Híbrido** — Radix pro comportamento, componentes visuais custom |
| 3 | Persistência dos mocks | **LocalStorage** com seed inicial + reset button |
| 4 | Padrão do wizard Nova OS | **Side Drawer 680px** com stepper horizontal |
| 5 | Detalhe de Cliente/Veículo | **SidePanel lateral + página dedicada** preservada |
| 6 | Tipografia e movimento | **Inter + Geist Mono (métricas)**, motion sutil |
| 7 | Disciplina de testes | **TDD rigoroso** em libs/stores + integração de fluxos críticos |
| 8 | Store state | **Zustand + persist middleware** |

### Princípios

- **Dark-first**. Sofisticação cinematográfica. Referências: Linear, Stripe, Vercel, Apple.
- **Typography como arquitetura**. Hierarquia clara; Geist Mono para métricas, placas, IDs, KM, moeda.
- **Motion é feedback**, não decoração. Durações 140–360ms, easings definidos.
- **A11y inegociável**. Focus ring brand, trap de foco nos painéis, navegação por teclado.
- **TDD sério em lógica de negócio**. Stores e libs são 100% testadas antes de integradas.

---

## 2. Arquitetura

### Estrutura de pastas

```
src/app/consultor/
  tokens/
    theme.css            # CSS vars dark + brand
    motion.ts            # presets Framer Motion (durations, easings, springs)
  components/
    Sidebar.tsx
    Topbar.tsx
    StatCard.tsx
    DataTable.tsx
    SidePanel.tsx
    WizardDrawer.tsx
    Stepper.tsx
    Tabs.tsx
    StatusBadge.tsx
    SearchInput.tsx
    EmptyState.tsx
    Button.tsx           # wrapper do shadcn button retematizado
    __tests__/
  store/
    authStore.ts
    clientesStore.ts
    veiculosStore.ts
    osStore.ts
    seed.ts              # dados iniciais, executados 1x
    __tests__/
  types/
    index.ts
  lib/
    formatters.ts
    idGenerator.ts
    __tests__/
```

### Arquivos existentes reescritos (paths preservados)

- `src/app/pages/Login.tsx`
- `src/app/pages/Dashboard.tsx`
- `src/app/pages/admin/AdminClientes.tsx`
- `src/app/pages/admin/AdminClienteDetalhe.tsx`
- `src/app/pages/admin/AdminOrdensServico.tsx`
- `src/app/pages/admin/AdminOSDetalhes.tsx`
- `src/app/pages/admin/AdminNovaOS.tsx` → vira redirect para `/ordens-servico?wizard=open`
- `src/app/components/ConsultorLayout.tsx` → reescrito com Sidebar+Topbar novos

### Arquivos novos

- `src/app/pages/admin/AdminVeiculos.tsx`
- `src/app/pages/admin/AdminVeiculoDetalhe.tsx`
- Rotas `/veiculos` e `/veiculos/:id` em `src/app/routes.tsx`

### Rotas afetadas

```
/login                         → Login (rewrite)
/dashboard                     → Dashboard (rewrite)
/clientes                      → AdminClientes (rewrite)
/clientes/:id                  → AdminClienteDetalhe (rewrite)
/veiculos                      → AdminVeiculos (novo)
/veiculos/:id                  → AdminVeiculoDetalhe (novo)
/ordens-servico                → AdminOrdensServico (rewrite)
/ordens-servico/:id            → AdminOSDetalhes (rewrite)
/ordens-servico/nova           → redirect para /ordens-servico?wizard=open
```

Todas protegidas por `ProtectedRoute` existente e montadas sob `ConsultorLayout` reescrito.

---

## 3. Tokens de design

### Paleta (CSS vars, escopo `.consultor` em `tokens/theme.css`)

```
--bg-0: #09090b          /* app background */
--bg-1: #0c0c0f          /* sidebar, elevated dark */
--bg-2: #131318          /* card, panel */
--bg-3: #1a1a20          /* hover, input */
--border: #26262d
--border-strong: #35353f

--text-0: #fafafa        /* primary */
--text-1: #a1a1aa        /* secondary */
--text-2: #71717a        /* tertiary, labels */
--text-3: #52525b        /* disabled */

--brand: #e5323b         /* DAP red */
--brand-hover: #f0474f
--brand-subtle: rgba(229,50,59,0.12)
--brand-ring: rgba(229,50,59,0.35)

--success: #22c55e
--warning: #f59e0b
--info:    #3b82f6
--danger:  #ef4444
--vip:     #c084fc
```

### Tipografia

- **Inter Variable** (400/500/600/700) — corpo.
- **Geist Mono Variable** (400/500) — métricas, placas, IDs de OS, KM, moeda.
- Carregadas via `@fontsource-variable/inter` e `@fontsource-variable/geist-mono`.

Escala:

```
text-xs:   12/16 — labels uppercase tracking-wide
text-sm:   13/20 — corpo padrão
text-base: 14/22 — itens de tabela
text-lg:   16/24 — títulos de painel
text-xl:   20/28 — títulos de página (Topbar)
text-2xl:  28/36 — hero numbers (StatCard)
text-3xl:  36/44 — saudação do dashboard
```

### Espaço, raios, elevação

- Grid de 4px. Padding de conteúdo = 28px. Sidebar = 220px. SidePanel = 460px. WizardDrawer = 680px.
- Radii: 6 (input) / 10 (card) / 14 (panel).
- Shadow painel: `0 20px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px var(--border)`.

### Motion (`tokens/motion.ts`)

```
ease.out       cubic-bezier(0.22, 1, 0.36, 1)
ease.in        cubic-bezier(0.64, 0, 0.78, 0)
dur.fast       140ms   hovers
dur.base       220ms   paineis, tabs
dur.slow       360ms   drawer entry
stagger.list   18ms    linhas de tabela entrando
spring.panel   { stiffness: 320, damping: 34 }
```

### Focus ring

`outline: 2px solid var(--brand-ring); outline-offset: 2px` em todos os elementos interativos.

---

## 4. Biblioteca de componentes

Cada componente com API clara, testes unitários de render + interação chave.

- **Sidebar** — 220px fixa, logo DAP, nav vertical (Dashboard / Clientes / Veículos / OS), footer com consultor + logout. Item ativo: bg-3 + barra esquerda 2px brand.
- **Topbar** — 56px, título da página + breadcrumb opcional + slot de ações à direita.
- **StatCard** — label xs uppercase + valor 2xl Geist Mono tabular + delta opcional.
- **DataTable&lt;T&gt;** — genérico. Props: `columns`, `data`, `onRowClick`, `searchKeys`, `emptyState`. Header sticky, row height 52px, ordenação por header, paginação 20/página.
- **SearchInput** — 340px, ícone Search, debounce 180ms, atalho `cmd+k` foca.
- **SidePanel** — Radix Dialog variant sheet, 460px, backdrop blur(2px), spring panel, trap de foco.
- **WizardDrawer** — mesma base, 680px, header com Stepper horizontal, body por etapa com crossfade+slide, footer sticky Voltar/Continuar.
- **Stepper** — 4 dots conectados, estados ativo/completo/pendente.
- **Tabs** — Radix Tabs + visual custom com indicador deslizante.
- **StatusBadge** — pill 22px, dot 6px + label uppercase. Variantes para StatusOS e StatusCliente.
- **EmptyState** — ícone em círculo + título + subtítulo + CTA.
- **Button** — wrapper shadcn retematizado. Variants: primary, secondary, ghost, danger.

---

## 5. Modelo de dados e store

### Types (`types/index.ts`)

```ts
type UUID = string
type ISO = string

type StatusCliente = 'ativo' | 'inativo' | 'vip'
type StatusOS = 'aguardando' | 'em_andamento' | 'concluida' | 'cancelada'
type TipoServico = 'revisao' | 'remap_ecu' | 'remap_tcu' | 'diagnostico' | 'manutencao' | 'freios' | 'suspensao' | 'outro'
type FormaPagamento = 'pix' | 'credito' | 'debito' | 'dinheiro' | 'transferencia'

interface Cliente {
  id: UUID
  nome: string
  cpf: string
  telefone: string
  email?: string
  status: StatusCliente
  criadoEm: ISO
  observacoes?: string
}

interface Veiculo {
  id: UUID
  clienteId: UUID
  marca: string
  modelo: string
  ano: number
  placa: string
  cor: string
  km: number
  remap: 'stock' | 'stage_1' | 'stage_2' | 'stage_3'
  chassi?: string
}

interface ChecklistItem {
  id: UUID
  categoria: string
  item: string
  status: 'ok' | 'atencao' | 'critico' | 'nao_aplicavel' | null
  observacao?: string
}

interface OrcamentoLinha {
  id: UUID
  tipo: 'servico' | 'peca'
  descricao: string
  quantidade: number
  valorUnitario: number   // centavos
}

interface Orcamento {
  linhas: OrcamentoLinha[]
  aprovacao: 'pendente' | 'aprovado' | 'rejeitado'
  aprovadoEm?: ISO
}

interface Entrega {
  kmSaida?: number
  formaPagamento?: FormaPagamento
  observacoes?: string
  finalizadaEm?: ISO
}

interface OS {
  id: string              // "OS-2026-0001"
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

interface Consultor {
  id: UUID
  nome: string
  email: string
  avatar?: string
}
```

### Stores Zustand com persist

Chaves localStorage: `dap-consultor/auth`, `dap-consultor/clientes`, `dap-consultor/veiculos`, `dap-consultor/os`. Versão 1 em todas.

```
authStore
  consultor: Consultor | null
  login(email, senha): Promise<void>     // mock, delay 400ms, aceita qualquer credencial
  logout(): void

clientesStore
  items: Cliente[]
  add, update, remove
  search(query): Cliente[]               // nome, cpf parcial, telefone parcial
  getById(id)

veiculosStore
  items: Veiculo[]
  add, update, remove
  search(query): Veiculo[]               // placa normalizada, modelo, proprietário via join
  getByCliente(clienteId)
  getById(id)

osStore
  items: OS[]
  nextId(): string                       // OS-YYYY-NNNN incremental
  create(draft): OS                      // inicializa checklist template + orcamento vazio
  updateStatus(id, status)               // valida transições
  updateChecklist(id, items)
  updateOrcamento(id, orc)
  updateEntrega(id, entrega)
  getById, search, filterByStatus, getByCliente, getByVeiculo
  metrics(): { doDia, emAndamento, concluidasMes, faturamentoMes }
```

**Transições válidas de StatusOS**:

```
aguardando    → em_andamento, cancelada
em_andamento  → concluida, cancelada
concluida     → (terminal)
cancelada     → (terminal)
```

**Transições válidas de Orcamento.aprovacao**:

```
pendente  → aprovado, rejeitado
aprovado  → pendente (reabrir), rejeitado
rejeitado → pendente (reabrir), aprovado
```

Finalizar OS (Entrega) só habilita se `status === 'em_andamento' && orcamento.aprovacao === 'aprovado'`.

**Operações de remoção** (`remove` em clientesStore/veiculosStore/osStore): expostas na API do store mas **não acessíveis pela UI em V1**. Sem cascade logic — se um teste futuro removê-las, referências ficam órfãs (aceitável em V1 mock). A UI só cria e atualiza.

### Seed inicial

- 1 consultor: Thales Oliveira.
- ~15 clientes realistas de oficina premium em SP (BMW, Porsche, Audi, Mercedes, VW Golf GTI). 3 VIPs, 2 inativos.
- ~20 veículos distribuídos entre clientes.
- ~25 OS distribuídas entre status, com datas nos últimos 60 dias.
- Checklist template: 14 itens em 4 categorias (Motor, Freios/Suspensão, Elétrica, Carroceria).
- Executado 1x via `initializeSeedIfEmpty()` chamado no bootstrap do App (antes de renderizar).

### Reset mocks

Item no menu do avatar (dev-only, visível sempre em V1): "Resetar mocks". Limpa as 4 chaves localStorage + reload.

---

## 6. Telas

### Login (`/login`)

- Dark com gradient radial sutil brand-subtle no canto superior direito.
- Card 420px centralizado: logo DAP (wordmark + dot vermelho), título "Portal Consultor", subtítulo "Doctor Auto Prime".
- Inputs Email + Senha (h-11, focus ring brand), checkbox "Manter conectado", botão primary full-width.
- Auth mock: delay 400ms, aceita qualquer credencial, loga como Thales, redireciona `/dashboard`.
- Rodapé: `v1.0 · Doctor Auto Prime 40`.

### Dashboard (`/dashboard`)

- Saudação dinâmica (Bom dia/boa tarde/boa noite) em text-3xl + data extensa pt-BR em text-1.
- Grid 4 colunas de StatCards: OS do dia, Em andamento, Concluídas no mês, Faturamento do mês (R$ Geist Mono). Delta vs mês anterior por card.
- "Atalhos rápidos": 2 cards grandes — Nova OS (abre WizardDrawer), Ver OS abertas (navega `/ordens-servico?status=em_andamento`).
- "Últimas OS": tabela compacta das 5 últimas, row click navega para detalhe.

### Clientes (`/clientes`)

- Topbar: "Clientes" + SearchInput + botão "+ Novo cliente" (abre SidePanel de cadastro mínimo).
- DataTable: Nome / Telefone (mono) / Veículos (badge) / Última OS (relativa) / Status (StatusBadge).
- Busca: nome, CPF, telefone.
- Row click → SidePanel:
  - Header: nome + status badge + CPF (mono).
  - Bloco Dados (telefone, email, observações).
  - Bloco Veículos (lista clicável → `/veiculos/:id`).
  - Bloco Histórico de OS (ID mono + data + status + valor).
  - Footer: "Ver perfil completo" (`/clientes/:id`) + "Nova OS" (pré-seleciona cliente no wizard).

### Cliente detalhe (`/clientes/:id`)

- Topbar: breadcrumb Clientes / {nome} + ação "Nova OS".
- Layout 2 colunas. Esquerda: perfil (avatar iniciais em brand-subtle, dados, observações editáveis inline). Direita: tabs Veículos | Histórico de OS | Financeiro (mock).

### Veículos (`/veiculos`)

- Topbar: "Veículos" + SearchInput apenas (sem botão "+ Novo veículo"). Cadastro de veículo novo acontece exclusivamente dentro do wizard de Nova OS (Etapa 2).
- DataTable: Veículo (marca+modelo hierárquico) / Placa (mono uppercase) / Ano / Proprietário (clicável) / KM (mono milhar) / Remap (badge progressivo stock→stage3) / Status.
- Busca: placa, modelo, proprietário.
- Row click → SidePanel com dados, proprietário, histórico de OS, botões "Nova OS" e "Ver perfil completo".

### Veículo detalhe (`/veiculos/:id`)

- Layout espelho do cliente detalhe. Esquerda: cartão do veículo (placa grande Geist Mono, modelo, ano, cor, KM). Direita: tabs Histórico de OS | Técnico (chassi, remap, observações).

### Ordens de Serviço (`/ordens-servico`)

- Topbar: título + SearchInput + botão "+ Nova OS" (abre WizardDrawer).
- Filtro de status: 5 pills (Todas/Aguardando/Em andamento/Concluída/Cancelada) com contagem. Pill ativa: bg brand-subtle + texto brand.
- DataTable: ID (mono) / Cliente / Veículo (modelo+placa) / Tipo / Entrada (relativa) / Status.
- Busca: ID, cliente, placa.
- Row click → `/ordens-servico/:id`.
- Deep-link: `?status=em_andamento` aplica filtro ao montar. `?wizard=open` auto-abre o drawer.

### Wizard Nova OS (WizardDrawer)

- **Etapa 1 — Cliente**: radio Existente / Novo. Existente: SearchInput sobre lista (top 8 relevantes). Novo: form inline (nome, cpf, telefone) com validação em tempo real.
- **Etapa 2 — Veículo**: se cliente tem veículos, lista pra escolher. "Cadastrar novo" expande form (marca, modelo, ano, placa, cor, KM, remap).
- **Etapa 3 — Serviço**: chips de TipoServico + textarea "Queixa" + input KM atual (pré-preenche do veículo).
- **Etapa 4 — Resumo**: card visual com tudo + preview do ID. Botão "Criar OS" → `osStore.create()` → toast sucesso → fecha drawer → navega para `/ordens-servico/:id`.

### Detalhe da OS (`/ordens-servico/:id`)

- Topbar: breadcrumb + ID mono grande + StatusBadge + dropdown "Alterar status" (respeita transições válidas).
- Linha resumo: cliente (clicável), veículo+placa (clicável), tipo, entrada.
- Tabs:
  - **Cliente & Veículo**: dados completos, KM entrada, queixa (editável inline).
  - **Checklist**: 4 seções colapsáveis, cada item com 4 pills (OK/Atenção/Crítico/N/A) + observação. Progresso global no topo. Auto-save debounce 400ms.
  - **Orçamento**: tabela de linhas editável inline (serviço/peça, descrição, qtd, unit). Total Geist Mono no footer. Status: 3 pills (Pendente/Aprovado/Rejeitado) + data.
  - **Entrega**: KM saída, forma de pagamento, observações, botão "Finalizar OS" (só habilita se em_andamento + orçamento aprovado). Submete: updateEntrega + updateStatus('concluida') + toast.

---

## 7. Testes (TDD rigoroso)

### Stack

Vitest + @testing-library/react + @testing-library/user-event + jsdom + @testing-library/jest-dom.

### Camadas

**Lib (100%, test-first)**
- `formatters.test.ts`: cpf, telefone, placa, moeda (centavos→BRL), data relativa, km milhar.
- `idGenerator.test.ts`: OS-YYYY-NNNN sequencial, resume do último.

**Stores (100%, test-first)**
- `clientesStore.test.ts`: CRUD, search multi-campo, persist/rehydrate com mock de localStorage.
- `veiculosStore.test.ts`: CRUD + getByCliente, busca por placa normalizada.
- `osStore.test.ts` (coração): create gera ID, checklist inicializa template, updateStatus valida transições, updateOrcamento recalcula total, metrics retorna contagens corretas, filterByStatus, search multi-campo.
- `authStore.test.ts`: login mock com delay, logout limpa, persist.

**Componentes (paths críticos, ~80%)**
- `DataTable`: colunas render, onRowClick, busca filtra, ordenação, paginação, empty.
- `SidePanel`: abre/fecha, ESC, trap de foco, backdrop click.
- `WizardDrawer`: avança/volta, Continuar desabilitado quando inválido, Stepper sincronizado.
- `Stepper`: estados visuais.
- `StatusBadge`: variantes corretas.

**Integração (JSDOM, fluxos críticos)**
- `wizardNovaOS.integration.test.tsx`: abrir wizard, preencher 4 etapas com cliente+veículo novos, submeter, verificar store, lista e localStorage.
- `checklist.integration.test.tsx`: marcar itens, simular reload, verificar hidratação.
- `login.integration.test.tsx`: preencher, submeter, redirecionar, reload mantém logado.

### Scripts

```
npm test           # vitest run
npm run test:watch # vitest
```

---

## 8. Ordem de execução

### Fase 0 — Setup
- Dependências: `zustand`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `@fontsource-variable/inter`, `@fontsource-variable/geist-mono`.
- `vitest.config.ts` + setup file + script npm test.
- `tokens/theme.css` importado em `main.tsx`. Fontes carregadas.

### Fase 1 — Fundação (TDD)
1. `types/index.ts`
2. `lib/formatters` (test → impl)
3. `lib/idGenerator` (test → impl)
4. `store/seed`
5. Stores: auth, clientes, veiculos, os (cada: test → impl)
6. Checkpoint: `npm test` verde.

### Fase 2 — Componentes
1. Button, StatusBadge, SearchInput, EmptyState, StatCard, Stepper
2. DataTable
3. SidePanel, WizardDrawer
4. Tabs, Sidebar, Topbar

### Fase 3 — Layout
1. `ConsultorLayout` reescrito (Sidebar + Topbar + Outlet).
2. Smoke test de navegação.

### Fase 4 — Telas (uma por vez, verificação manual no browser antes da próxima)
1. Login
2. Dashboard
3. Clientes (lista + SidePanel) + Cliente detalhe
4. Veículos (lista + SidePanel) + Veículo detalhe + rotas novas
5. Ordens de Serviço (lista + filtros)
6. Wizard Nova OS (+ teste de integração)
7. Detalhe da OS — 4 tabs (+ teste de integração do checklist)

### Fase 5 — Polimento
1. Motion review em painéis, tabs, stepper.
2. A11y pass — focus, aria-labels, keyboard flows.
3. Empty states + loading states por tela.
4. `npm test` completo + verificação manual das 6 telas.

Cada fase termina com checkpoint verde antes da próxima.

---

## 9. Fora de escopo (V1)

- Backend real, Supabase, autenticação verdadeira.
- Integrações externas (Kommo, WhatsApp, NFe).
- Multi-consultor, permissões, auditoria.
- Relatórios avançados, analytics, BI.
- i18n. Tudo em pt-BR direto.
- Mobile responsivo completo. V1 mira desktop 1280px+; degrada para mobile mas não é otimizado.
- Impressão de OS/orçamento.
- Upload de fotos/anexos.

---

## 10. Critérios de pronto

- Todas as 6 telas navegáveis em `/login`, `/dashboard`, `/clientes`, `/veiculos`, `/ordens-servico`, `/ordens-servico/:id`.
- Wizard cria OS que aparece na lista, persiste no reload, abre detalhe.
- Checklist salva e hidrata.
- Orçamento calcula total corretamente.
- Finalizar OS respeita regra (em_andamento + orçamento aprovado).
- `npm test` 100% verde.
- Nenhuma console warning em navegação normal.
- Focus ring brand visível em todo interativo.
- Reset mocks zera e re-semeia.
