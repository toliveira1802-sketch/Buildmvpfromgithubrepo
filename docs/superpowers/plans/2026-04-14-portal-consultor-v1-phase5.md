# Portal Consultor V1 — Fase 5: Polimento

> Roda só após checkpoint verde da Fase 4.

## Task 5.1: Motion review

**Arquivos a revisar**:
- `src/app/consultor/components/SidePanel.tsx`
- `src/app/consultor/components/WizardDrawer.tsx`
- `src/app/consultor/components/Tabs.tsx`
- `src/app/consultor/components/Stepper.tsx`

- [ ] **Step 1: Verificar durações**

Abrir `npm run dev`, abrir `/clientes`, clicar em uma linha. O SidePanel deve entrar com animação de slide-in em ~300ms suave. Fechar com ESC deve ter slide-out da mesma duração. Sem jank.

Testar WizardDrawer em `/ordens-servico?wizard=open`. Stepper deve animar a linha de preenchimento entre etapas (~360ms).

Testar Tabs na tela de detalhe de OS — clicar entre 4 tabs. Underline brand desliza entre abas com animação suave.

- [ ] **Step 2: Se houver algo travado**

Verificar que os classes Tailwind `data-[state=open]:animate-in`, `slide-in-from-right` estão resolvendo via `tw-animate-css` (já instalado). Se não, importar explicitamente em `src/styles/tailwind.css`:

```css
@import 'tw-animate-css';
```

- [ ] **Step 3: Commit se mudou**

```bash
git add -A
git commit -m "polish(consultor): motion review"
```

## Task 5.2: A11y pass

- [ ] **Step 1: Keyboard nav**

Sem usar mouse:
- `/login`: Tab passa por Email → Senha → Entrar. Enter submete.
- `/dashboard`: Tab passa pelos StatCards (não focáveis) e atalhos (focáveis). Tab nos itens da sidebar funciona.
- `/clientes`: `cmd+k` foca o SearchInput. Setas do teclado não navegam linhas (ok em V1, mas row deve estar focável via Tab). **Se linhas não são focáveis**, alterar `DataTable` para adicionar `tabIndex={0}` e `onKeyDown` para Enter acionar onRowClick.
- SidePanel: abre e foco vai pro botão close. ESC fecha.
- WizardDrawer: Tab navega pelos inputs da etapa. Enter não submete prematuramente.

- [ ] **Step 2: Tornar linhas da DataTable focáveis**

Editar `src/app/consultor/components/DataTable.tsx`. No `<tr>` do `pageData.map`, adicionar:

```tsx
tabIndex={onRowClick ? 0 : undefined}
onKeyDown={(e) => {
  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    onRowClick(row)
  }
}}
role={onRowClick ? 'button' : undefined}
```

- [ ] **Step 3: ARIA labels críticos**

Verificar:
- Sidebar logout button: `aria-label="Sair"` (já tem).
- SidePanel close: `aria-label="Fechar"` (já tem).
- WizardDrawer close: idem.
- Filtro pills em OS: sem aria-label necessário (texto visível).

- [ ] **Step 4: Rodar suite**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add src/app/consultor/components/DataTable.tsx
git commit -m "polish(consultor): a11y keyboard nav em DataTable"
```

## Task 5.3: Empty states + loading

- [ ] **Step 1: Cobertura**

Cada lista deve ter empty state claro:
- `/clientes` sem resultados → EmptyState com ícone Users (já tem)
- `/veiculos` sem resultados → EmptyState com ícone Car (já tem)
- `/ordens-servico` sem resultados → EmptyState com ícone ClipboardList (já tem)
- Dashboard últimas OS vazias → Tabela mostra EmptyState automaticamente via DataTable emptyState (adicionar se faltar).

Adicionar, se necessário, em `Dashboard.tsx` onde o DataTable é renderizado:

```tsx
emptyState={<div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] px-5 py-8 text-center text-sm text-[var(--text-2)]">Nenhuma OS ainda. Use o atalho acima para criar a primeira.</div>}
```

- [ ] **Step 2: Loading no login**

Login já usa `loading` do store no botão (já tem).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "polish(consultor): empty states garantidos em todas as listas"
```

## Task 5.4: Verificação final

- [ ] **Step 1: Suite completa**

```bash
npm test
```

Expected: 100% verde. Zero falhas. Zero testes pulados.

- [ ] **Step 2: Build produção**

```bash
npm run build
```

Expected: zero erros TS. Bundle gerado em `dist/`.

- [ ] **Step 3: Verificação manual de cada tela**

```bash
npm run dev
```

Checklist no browser:

- [ ] `/login` — form funciona, gradient sutil visível, focus ring brand
- [ ] `/dashboard` — saudação correta, 4 StatCards com valores, 2 atalhos, tabela últimas 5 OS
- [ ] Sidebar: 4 itens, item ativo com barra lateral, iniciais do consultor, logout
- [ ] `/clientes` — busca filtra em tempo real, clique abre SidePanel, "Ver perfil completo" navega, "Nova OS" abre wizard pré-selecionado
- [ ] `/clientes/:id` — 3 tabs, observações editáveis, histórico de OS clicável
- [ ] `/veiculos` — busca por placa/modelo/proprietário, SidePanel com dados e histórico
- [ ] `/veiculos/:id` — cartão com placa grande Geist Mono, tabs
- [ ] `/ordens-servico` — 5 pills de filtro com contagem, busca, clique na linha
- [ ] Wizard completo — 4 etapas com cliente novo + veículo novo → OS criada → detalhe
- [ ] Reload após criar OS → OS persiste
- [ ] `/ordens-servico/:id` — 4 tabs, dropdown alterar status respeita transições
- [ ] Checklist: marcar item, progresso sobe, reload mantém
- [ ] Orçamento: adicionar linhas, total calcula, aprovar
- [ ] Entrega: finalizar OS só habilita quando em_andamento + aprovado
- [ ] Reset mocks na sidebar zera e re-semeia

- [ ] **Step 4: Zero console warnings em navegação normal**

Abrir DevTools Console. Navegar por todas as telas. Nenhum warning React ou erro.

- [ ] **Step 5: Commit final + tag**

```bash
git commit --allow-empty -m "release: Portal Consultor V1 — padrão world-class"
git tag consultor-v1-complete
```

---

## Critérios de pronto V1 (conforme spec)

- [x] Todas as 6 telas navegáveis em `/login`, `/dashboard`, `/clientes`, `/veiculos`, `/ordens-servico`, `/ordens-servico/:id`.
- [x] Wizard cria OS que aparece na lista, persiste no reload, abre detalhe.
- [x] Checklist salva e hidrata.
- [x] Orçamento calcula total corretamente.
- [x] Finalizar OS respeita regra (em_andamento + orçamento aprovado).
- [x] `npm test` 100% verde.
- [x] Nenhuma console warning em navegação normal.
- [x] Focus ring brand visível em todo interativo.
- [x] Reset mocks zera e re-semeia.
