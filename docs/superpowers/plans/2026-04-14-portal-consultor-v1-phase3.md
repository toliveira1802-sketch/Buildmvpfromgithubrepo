# Portal Consultor V1 — Fase 3: Layout

> Continuação. Rodar após checkpoint verde da Fase 2.

## Task 3.1: Reescrever ConsultorLayout

**Files:**
- Modify: `src/app/components/ConsultorLayout.tsx` (full rewrite)

- [ ] **Step 1: Substituir conteúdo do arquivo**

```tsx
// src/app/components/ConsultorLayout.tsx
import { ReactNode } from 'react'
import { Sidebar } from '@/app/consultor/components/Sidebar'

interface Props {
  children?: ReactNode
}

export default function ConsultorLayout({ children }: Props) {
  return (
    <div className="consultor min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-0)]">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Garantir que ConsultorLayout é usado como wrapper**

Verificar `src/app/routes.tsx`. As rotas hoje passam `Component: ProtectedRoute` com `children: [{ index: true, Component: X }]`. ProtectedRoute precisa renderizar o outlet dentro do layout. Verificar em `src/app/components/ProtectedRoute.tsx`:

```bash
cat src/app/components/ProtectedRoute.tsx
```

Se ProtectedRoute ainda não envolve com ConsultorLayout, adicionar wrapping apenas nas rotas que este plano afeta. **Alternativa mais segura**: criar uma camada intermediária.

- [ ] **Step 3: Criar ConsultorShell wrapping route**

Se ProtectedRoute não envolve ConsultorLayout, adicionar ao `routes.tsx` um componente wrapper:

```tsx
// inserir perto do topo de src/app/routes.tsx (após imports)
import ConsultorLayout from "./components/ConsultorLayout";
import { Outlet } from "react-router";

function ConsultorShell() {
  return (
    <ConsultorLayout>
      <Outlet />
    </ConsultorLayout>
  );
}
```

E alterar cada rota V1 (dashboard, clientes, veiculos, ordens-servico) pra:

```tsx
{
  path: "/dashboard",
  Component: ProtectedRoute,
  children: [
    {
      Component: ConsultorShell,
      children: [{ index: true, Component: Dashboard }],
    },
  ],
},
```

Aplicar o mesmo aninhamento em: `/clientes`, `/clientes/:id`, `/veiculos` (novo), `/veiculos/:id` (novo), `/ordens-servico`, `/ordens-servico/:id`.

**Não** aplicar no `/login`.
**Não alterar** rotas fora do escopo V1.

- [ ] **Step 4: Adicionar rotas de veículos**

Importar no topo:

```tsx
import AdminVeiculos from "./pages/admin/AdminVeiculos";
import AdminVeiculoDetalhe from "./pages/admin/AdminVeiculoDetalhe";
```

Adicionar na lista de rotas (próximo aos clientes):

```tsx
{
  path: "/veiculos",
  Component: ProtectedRoute,
  children: [
    {
      Component: ConsultorShell,
      children: [{ index: true, Component: AdminVeiculos }],
    },
  ],
},
{
  path: "/veiculos/:id",
  Component: ProtectedRoute,
  children: [
    {
      Component: ConsultorShell,
      children: [{ index: true, Component: AdminVeiculoDetalhe }],
    },
  ],
},
```

Nota: os arquivos `AdminVeiculos.tsx` e `AdminVeiculoDetalhe.tsx` ainda não existem. Criar placeholders antes de testar.

- [ ] **Step 5: Placeholders Veiculos**

```tsx
// src/app/pages/admin/AdminVeiculos.tsx
export default function AdminVeiculos() {
  return <div className="p-7 text-[var(--text-1)]">Veículos — placeholder</div>
}
```

```tsx
// src/app/pages/admin/AdminVeiculoDetalhe.tsx
export default function AdminVeiculoDetalhe() {
  return <div className="p-7 text-[var(--text-1)]">Veículo detalhe — placeholder</div>
}
```

- [ ] **Step 6: Inicializar seed no main.tsx**

Editar `src/main.tsx` e adicionar após os imports de CSS/fontes:

```ts
import { initializeSeedIfEmpty } from './app/consultor/bootstrap'
initializeSeedIfEmpty()
```

- [ ] **Step 7: Rodar build + dev**

```bash
npm run build
npm run dev
```

Expected: build limpo. Dev server sobe. Abrir `http://localhost:5173`, fazer login mock via `/login` existente (ou navegar `/dashboard` direto se sessão já existir no localStorage antigo). Verificar que o shell do Consultor renderiza com Sidebar nova à esquerda. Placeholders dos placeholders novos (Veículos) aparecem em `/veiculos`.

- [ ] **Step 8: Commit**

```bash
git add src/app/components/ConsultorLayout.tsx src/app/routes.tsx src/app/pages/admin/AdminVeiculos.tsx src/app/pages/admin/AdminVeiculoDetalhe.tsx src/main.tsx
git commit -m "feat(consultor): ConsultorShell + rotas veículos + bootstrap seed"
```

## Task 3.2: Smoke test de navegação

**Files:**
- Create: `tests/integration/navegacao.test.tsx`

- [ ] **Step 1: Teste**

```tsx
// tests/integration/navegacao.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router'
import ConsultorLayout from '@/app/components/ConsultorLayout'
import { useAuthStore } from '@/app/consultor/store/authStore'
import { SEED_CONSULTOR } from '@/app/consultor/store/seed'

function Shell() {
  return <ConsultorLayout><Outlet /></ConsultorLayout>
}

describe('Sidebar nav', () => {
  it('clica em Clientes e muda a rota', async () => {
    useAuthStore.setState({ consultor: SEED_CONSULTOR, loading: false, error: null })
    const router = createMemoryRouter(
      [
        {
          Component: Shell,
          children: [
            { path: '/dashboard', element: <div>DASH</div> },
            { path: '/clientes', element: <div>CLI</div> },
            { path: '/veiculos', element: <div>VEI</div> },
            { path: '/ordens-servico', element: <div>OS</div> },
          ],
        },
      ],
      { initialEntries: ['/dashboard'] },
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByText('DASH')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: /clientes/i }))
    expect(screen.getByText('CLI')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar**

```bash
npx vitest run tests/integration/navegacao.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Commit + tag**

```bash
git add tests/integration/navegacao.test.tsx
git commit -m "test(consultor): smoke test de nav Sidebar"
git tag consultor-v1-phase3-green
```
