# Portal Consultor V1 — Fase 4: Telas

> Continuação. Rodar após checkpoint verde da Fase 3. Cada tela termina com verificação manual em `npm run dev` antes da próxima.

Ordem: Login → Dashboard → Clientes → Cliente detalhe → Veículos → Veículo detalhe → OS list → Wizard → OS detalhe.

**Padrão de imports nas telas** (assume sempre):

```ts
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { StatCard } from '@/app/consultor/components/StatCard'
```

---

## Task 4.1: Login

**Files:**
- Modify (rewrite): `src/app/pages/Login.tsx`

- [ ] **Step 1: Reescrever**

```tsx
// src/app/pages/Login.tsx
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/app/consultor/components/Button'
import { useAuthStore } from '@/app/consultor/store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const loading = useAuthStore((s) => s.loading)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    try {
      await login(email, senha)
      navigate('/dashboard')
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao entrar')
    }
  }

  return (
    <div className="consultor min-h-screen bg-[var(--bg-0)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[720px] h-[720px] rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--brand-subtle) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-[420px] max-w-full">
          <div className="flex items-center gap-2 mb-10">
            <div className="size-2.5 rounded-full bg-[var(--brand)]" aria-hidden />
            <span className="text-lg font-semibold tracking-tight text-[var(--text-0)]">Doctor Auto Prime</span>
          </div>

          <h1 className="text-2xl font-semibold text-[var(--text-0)] mb-1">Portal Consultor</h1>
          <p className="text-sm text-[var(--text-1)] mb-8">Entre para começar o atendimento.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-1)] uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="voce@doctorautoprime.com"
                className="h-11 w-full px-3 rounded-[6px] bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-0)] placeholder:text-[var(--text-3)] text-sm focus-visible:outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-1)] uppercase tracking-wider mb-1.5">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                className="h-11 w-full px-3 rounded-[6px] bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-0)] placeholder:text-[var(--text-3)] text-sm focus-visible:outline-none focus:border-[var(--brand)]"
              />
            </div>

            {erro && <p className="text-sm text-[var(--danger)]">{erro}</p>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Entrar
            </Button>
          </form>

          <p className="text-xs text-[var(--text-3)] mt-8 text-center">v1.0 · Doctor Auto Prime 40</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar manualmente**

```bash
npm run dev
```

Abrir `/login`. Verificar gradiente sutil no canto superior direito, form limpo, focus ring brand nos inputs, botão primary. Entrar com qualquer email/senha → redireciona `/dashboard`. Logout na sidebar → volta pra `/login`. localStorage `dap-consultor/auth` persistindo.

- [ ] **Step 3: Teste de integração**

```tsx
// tests/integration/login.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import Login from '@/app/pages/Login'
import { useAuthStore } from '@/app/consultor/store/authStore'

describe('Login integração', () => {
  it('login bem sucedido redireciona pra /dashboard', async () => {
    useAuthStore.setState({ consultor: null, loading: false, error: null })
    localStorage.clear()
    const router = createMemoryRouter(
      [
        { path: '/login', element: <Login /> },
        { path: '/dashboard', element: <div>DASH</div> },
      ],
      { initialEntries: ['/login'] },
    )
    render(<RouterProvider router={router} />)
    await userEvent.type(screen.getByPlaceholderText(/voce@doctor/i), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'senha')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => expect(screen.getByText('DASH')).toBeInTheDocument())
    expect(useAuthStore.getState().consultor?.nome).toBe('Thales Oliveira')
  })
})
```

- [ ] **Step 4: Rodar + commit**

```bash
npx vitest run tests/integration/login.test.tsx
git add src/app/pages/Login.tsx tests/integration/login.test.tsx
git commit -m "feat(consultor): Login tela + integração test"
```

## Task 4.2: Dashboard

**Files:**
- Modify (rewrite): `src/app/pages/Dashboard.tsx`

- [ ] **Step 1: Reescrever**

```tsx
// src/app/pages/Dashboard.tsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PlusCircle, ListChecks, ArrowRight } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { StatCard } from '@/app/consultor/components/StatCard'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { useAuthStore } from '@/app/consultor/store/authStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatDataExtensa, formatMoeda, formatDataRelativa } from '@/app/consultor/lib/formatters'
import type { OS } from '@/app/consultor/types'

function saudacao(d: Date): string {
  const h = d.getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const consultor = useAuthStore((s) => s.consultor)
  const metrics = useOSStore((s) => s.metrics())
  const items = useOSStore((s) => s.items)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)

  const hoje = useMemo(() => new Date(), [])
  const ultimas = useMemo(
    () => [...items].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 5),
    [items],
  )

  const primeiroNome = (consultor?.nome ?? '').split(' ')[0] || 'Consultor'

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-7 space-y-8 max-w-[1400px]">
        <div>
          <h2 className="text-[32px] leading-[40px] font-semibold text-[var(--text-0)]">
            {saudacao(hoje)}, {primeiroNome}
          </h2>
          <p className="text-sm text-[var(--text-1)] mt-1 capitalize">{formatDataExtensa(hoje.toISOString())}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="OS do dia" valor={String(metrics.doDia)} />
          <StatCard label="Em andamento" valor={String(metrics.emAndamento)} />
          <StatCard label="Concluídas no mês" valor={String(metrics.concluidasMes)} />
          <StatCard label="Faturamento do mês" valor={formatMoeda(metrics.faturamentoMes)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/ordens-servico?wizard=open')}
            className="group text-left rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--brand)] p-5 transition-all duration-[180ms]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="size-10 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center mb-4">
                  <PlusCircle className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-0)] mb-1">Nova OS</h3>
                <p className="text-sm text-[var(--text-1)]">Iniciar atendimento em 4 etapas</p>
              </div>
              <ArrowRight className="size-4 text-[var(--text-2)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          <button
            onClick={() => navigate('/ordens-servico?status=em_andamento')}
            className="group text-left rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--border-strong)] p-5 transition-all duration-[180ms]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="size-10 rounded-full bg-[var(--bg-3)] text-[var(--info)] flex items-center justify-center mb-4">
                  <ListChecks className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-0)] mb-1">Ver OS abertas</h3>
                <p className="text-sm text-[var(--text-1)]">{metrics.emAndamento} em andamento agora</p>
              </div>
              <ArrowRight className="size-4 text-[var(--text-2)] group-hover:text-[var(--text-0)] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[var(--text-1)] uppercase tracking-wider mb-3">Últimas OS</h3>
          <DataTable<OS>
            data={ultimas}
            rowKey={(o) => o.id}
            onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
            columns={[
              { key: 'id', header: 'OS', render: (o) => <span className="mono text-[var(--text-0)]">{o.id}</span>, width: '140px' },
              { key: 'cliente', header: 'Cliente', render: (o) => clientes.find((c) => c.id === o.clienteId)?.nome ?? '—' },
              { key: 'veiculo', header: 'Veículo', render: (o) => {
                const v = veiculos.find((x) => x.id === o.veiculoId)
                return v ? `${v.marca} ${v.modelo}` : '—'
              }},
              { key: 'entrada', header: 'Entrada', render: (o) => <span className="text-[var(--text-1)]">{formatDataRelativa(o.criadoEm)}</span>, width: '140px' },
              { key: 'status', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verificar**

```bash
npm run dev
```

Abrir `/dashboard`. Saudação dinâmica aparece. 4 StatCards com valores reais. 2 atalhos. Tabela de 5 OS mais recentes. Clique em Nova OS navega com `?wizard=open`. Clique na linha da tabela navega pra detalhe.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/Dashboard.tsx
git commit -m "feat(consultor): Dashboard com métricas, atalhos e últimas OS"
```

## Task 4.3: Clientes (lista + SidePanel)

**Files:**
- Modify (rewrite): `src/app/pages/admin/AdminClientes.tsx`

- [ ] **Step 1: Reescrever**

```tsx
// src/app/pages/admin/AdminClientes.tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Users } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { Button } from '@/app/consultor/components/Button'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatCPF, formatTelefone, formatDataRelativa, formatMoeda } from '@/app/consultor/lib/formatters'
import type { Cliente } from '@/app/consultor/types'

export default function AdminClientes() {
  const navigate = useNavigate()
  const clientes = useClientesStore((s) => s.items)
  const search = useClientesStore((s) => s.search)
  const veiculos = useVeiculosStore((s) => s.items)
  const osStore = useOSStore()

  const [q, setQ] = useState('')
  const [selecionado, setSelecionado] = useState<Cliente | null>(null)

  const filtrados = useMemo(() => search(q), [q, clientes, search])

  function ultimaOSData(clienteId: string): string | null {
    const os = osStore.getByCliente(clienteId).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))[0]
    return os ? os.criadoEm : null
  }

  return (
    <>
      <Topbar
        title="Clientes"
        actions={
          <>
            <SearchInput value={q} onChange={setQ} placeholder="Buscar por nome, CPF ou telefone" />
          </>
        }
      />
      <div className="p-7">
        <DataTable<Cliente>
          data={filtrados}
          rowKey={(c) => c.id}
          onRowClick={(c) => setSelecionado(c)}
          emptyState={<EmptyState icon={Users} titulo="Nenhum cliente encontrado" descricao="Ajuste a busca ou cadastre o primeiro." />}
          columns={[
            { key: 'nome', header: 'Nome', render: (c) => (
              <div>
                <div className="text-[var(--text-0)] font-medium">{c.nome}</div>
                <div className="text-xs text-[var(--text-2)] mono">{formatCPF(c.cpf)}</div>
              </div>
            )},
            { key: 'tel', header: 'Telefone', render: (c) => <span className="mono text-[var(--text-1)]">{formatTelefone(c.telefone)}</span>, width: '180px' },
            { key: 'veiculos', header: 'Veículos', render: (c) => {
              const n = veiculos.filter((v) => v.clienteId === c.id).length
              return <span className="inline-flex items-center justify-center min-w-6 h-5 px-1.5 rounded text-xs bg-[var(--bg-3)] text-[var(--text-1)]">{n}</span>
            }, width: '120px' },
            { key: 'ultima', header: 'Última OS', render: (c) => {
              const d = ultimaOSData(c.id)
              return <span className="text-[var(--text-1)]">{d ? formatDataRelativa(d) : '—'}</span>
            }, width: '140px' },
            { key: 'status', header: 'Status', render: (c) => <StatusBadge tipo="cliente" valor={c.status} />, width: '120px' },
          ]}
        />
      </div>

      <SidePanel
        open={!!selecionado}
        onOpenChange={(v) => !v && setSelecionado(null)}
        title={selecionado?.nome ?? ''}
        subtitle={selecionado && <span className="mono">{formatCPF(selecionado.cpf)}</span>}
        footer={selecionado && (
          <>
            <Button variant="secondary" onClick={() => { navigate(`/clientes/${selecionado.id}`); setSelecionado(null) }}>
              Ver perfil completo
            </Button>
            <Button variant="primary" onClick={() => {
              navigate(`/ordens-servico?wizard=open&clienteId=${selecionado.id}`)
              setSelecionado(null)
            }}>
              Nova OS
            </Button>
          </>
        )}
      >
        {selecionado && (
          <ClienteDetalheInline cliente={selecionado} onVerVeiculo={(id) => { navigate(`/veiculos/${id}`); setSelecionado(null) }} onVerOS={(id) => { navigate(`/ordens-servico/${id}`); setSelecionado(null) }} />
        )}
      </SidePanel>
    </>
  )
}

function ClienteDetalheInline({
  cliente, onVerVeiculo, onVerOS,
}: { cliente: Cliente; onVerVeiculo: (id: string) => void; onVerOS: (id: string) => void }) {
  const veiculos = useVeiculosStore((s) => s.getByCliente(cliente.id))
  const osItems = useOSStore((s) => s.getByCliente(cliente.id))

  return (
    <div className="space-y-7">
      <Bloco titulo="Dados">
        <Linha label="Telefone" valor={formatTelefone(cliente.telefone)} mono />
        {cliente.email && <Linha label="Email" valor={cliente.email} />}
        <Linha label="Status" valor={<StatusBadge tipo="cliente" valor={cliente.status} />} />
        <Linha label="Cliente desde" valor={new Date(cliente.criadoEm).toLocaleDateString('pt-BR')} />
        {cliente.observacoes && <Linha label="Observações" valor={cliente.observacoes} />}
      </Bloco>

      <Bloco titulo={`Veículos (${veiculos.length})`}>
        {veiculos.length === 0 ? (
          <p className="text-sm text-[var(--text-2)]">Sem veículos cadastrados.</p>
        ) : (
          <ul className="space-y-1">
            {veiculos.map((v) => (
              <li key={v.id}>
                <button onClick={() => onVerVeiculo(v.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)] flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[var(--text-0)]">{v.marca} {v.modelo}</div>
                    <div className="text-xs text-[var(--text-2)] mono mt-0.5">{v.placa}</div>
                  </div>
                  <span className="text-xs text-[var(--text-2)]">{v.ano}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Bloco titulo={`Histórico de OS (${osItems.length})`}>
        {osItems.length === 0 ? (
          <p className="text-sm text-[var(--text-2)]">Sem OS.</p>
        ) : (
          <ul className="space-y-1">
            {osItems.slice().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 10).map((o) => {
              const total = o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)
              return (
                <li key={o.id}>
                  <button onClick={() => onVerOS(o.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mono text-xs text-[var(--text-0)]">{o.id}</div>
                      <div className="text-xs text-[var(--text-2)]">{formatDataRelativa(o.criadoEm)}</div>
                    </div>
                    <StatusBadge tipo="os" valor={o.status} />
                    <div className="mono text-sm text-[var(--text-1)] min-w-[90px] text-right">{formatMoeda(total)}</div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Bloco>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">{titulo}</h4>
      {children}
    </section>
  )
}

function Linha({ label, valor, mono = false }: { label: string; valor: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-2)]">{label}</span>
      <span className={`text-sm text-[var(--text-0)] ${mono ? 'mono' : ''}`}>{valor}</span>
    </div>
  )
}
```

- [ ] **Step 2: Verificar + commit**

```bash
npm run dev
git add src/app/pages/admin/AdminClientes.tsx
git commit -m "feat(consultor): tela Clientes com DataTable + SidePanel"
```

## Task 4.4: Cliente detalhe

**Files:**
- Modify (rewrite): `src/app/pages/admin/AdminClienteDetalhe.tsx`

- [ ] **Step 1: Reescrever**

```tsx
// src/app/pages/admin/AdminClienteDetalhe.tsx
import { useNavigate, useParams } from 'react-router'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { Tabs } from '@/app/consultor/components/Tabs'
import { DataTable } from '@/app/consultor/components/DataTable'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatCPF, formatTelefone, formatDataRelativa, formatKm, formatMoeda, formatPlaca } from '@/app/consultor/lib/formatters'
import { useState } from 'react'
import type { Veiculo, OS } from '@/app/consultor/types'

export default function AdminClienteDetalhe() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const cliente = useClientesStore((s) => s.getById(id))
  const update = useClientesStore((s) => s.update)
  const veiculos = useVeiculosStore((s) => s.getByCliente(id))
  const osItems = useOSStore((s) => s.getByCliente(id))

  const [obs, setObs] = useState(cliente?.observacoes ?? '')
  const [tab, setTab] = useState('veiculos')

  if (!cliente) {
    return (
      <>
        <Topbar title="Cliente não encontrado" />
        <div className="p-7 text-[var(--text-1)]">Esse cliente não existe. <a className="text-[var(--brand)]" href="/clientes">Voltar</a></div>
      </>
    )
  }

  const iniciais = cliente.nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <>
      <Topbar
        title={cliente.nome}
        breadcrumbs={[{ label: 'Clientes', to: '/clientes' }]}
        actions={
          <Button variant="primary" onClick={() => navigate(`/ordens-servico?wizard=open&clienteId=${cliente.id}`)}>Nova OS</Button>
        }
      />
      <div className="p-7 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-7 max-w-[1400px]">
        <aside className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center text-2xl font-semibold mb-4">
              {iniciais}
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-0)]">{cliente.nome}</h2>
            <div className="mono text-xs text-[var(--text-2)] mt-1">{formatCPF(cliente.cpf)}</div>
            <div className="mt-3"><StatusBadge tipo="cliente" valor={cliente.status} /></div>
          </div>

          <div className="mt-6 space-y-3">
            <Field label="Telefone" value={<span className="mono">{formatTelefone(cliente.telefone)}</span>} />
            {cliente.email && <Field label="Email" value={cliente.email} />}
            <Field label="Cliente desde" value={new Date(cliente.criadoEm).toLocaleDateString('pt-BR')} />
          </div>

          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Observações</label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              onBlur={() => update(cliente.id, { observacoes: obs })}
              placeholder="Anotações internas"
              rows={4}
              className="w-full p-2.5 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
          </div>
        </aside>

        <section>
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: 'veiculos', label: `Veículos (${veiculos.length})`, content: (
                <DataTable<Veiculo>
                  data={veiculos}
                  rowKey={(v) => v.id}
                  onRowClick={(v) => navigate(`/veiculos/${v.id}`)}
                  columns={[
                    { key: 'v', header: 'Veículo', render: (v) => `${v.marca} ${v.modelo}` },
                    { key: 'p', header: 'Placa', render: (v) => <span className="mono uppercase">{formatPlaca(v.placa)}</span>, width: '130px' },
                    { key: 'a', header: 'Ano', render: (v) => v.ano, width: '80px' },
                    { key: 'k', header: 'KM', render: (v) => <span className="mono">{formatKm(v.km)}</span>, width: '120px' },
                  ]}
                />
              )},
              { value: 'historico', label: `Histórico de OS (${osItems.length})`, content: (
                <DataTable<OS>
                  data={[...osItems].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))}
                  rowKey={(o) => o.id}
                  onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
                  columns={[
                    { key: 'id', header: 'OS', render: (o) => <span className="mono">{o.id}</span>, width: '140px' },
                    { key: 'd', header: 'Entrada', render: (o) => formatDataRelativa(o.criadoEm), width: '140px' },
                    { key: 's', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
                    { key: 't', header: 'Total', render: (o) => <span className="mono">{formatMoeda(o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0))}</span>, align: 'right' },
                  ]}
                />
              )},
              { value: 'fin', label: 'Financeiro', content: (
                <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 text-sm text-[var(--text-1)]">
                  Total gasto: <span className="mono text-[var(--text-0)]">{formatMoeda(osItems.filter((o) => o.status === 'concluida').reduce((a, o) => a + o.orcamento.linhas.reduce((s, l) => s + l.valorUnitario * l.quantidade, 0), 0))}</span>
                </div>
              )},
            ]}
          />
        </section>
      </div>
    </>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-[var(--text-2)]">{label}</div>
      <div className="text-sm text-[var(--text-0)] mt-0.5">{value}</div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar + commit**

```bash
npm run dev
git add src/app/pages/admin/AdminClienteDetalhe.tsx
git commit -m "feat(consultor): Cliente detalhe com 3 tabs"
```

## Task 4.5: Veículos (lista)

**Files:**
- Modify (rewrite): `src/app/pages/admin/AdminVeiculos.tsx`

- [ ] **Step 1: Reescrever**

```tsx
// src/app/pages/admin/AdminVeiculos.tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Car } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { Button } from '@/app/consultor/components/Button'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatPlaca, formatKm, formatDataRelativa, formatMoeda } from '@/app/consultor/lib/formatters'
import type { Veiculo } from '@/app/consultor/types'

const remapLabel: Record<Veiculo['remap'], string> = {
  stock: 'Stock', stage_1: 'Stage 1', stage_2: 'Stage 2', stage_3: 'Stage 3',
}
const remapColor: Record<Veiculo['remap'], string> = {
  stock: 'var(--text-2)', stage_1: 'var(--info)', stage_2: 'var(--warning)', stage_3: 'var(--brand)',
}

export default function AdminVeiculos() {
  const navigate = useNavigate()
  const veiculos = useVeiculosStore((s) => s.items)
  const search = useVeiculosStore((s) => s.search)
  const clientes = useClientesStore((s) => s.items)
  const osStore = useOSStore()

  const [q, setQ] = useState('')
  const [selecionado, setSelecionado] = useState<Veiculo | null>(null)

  const filtrados = useMemo(() => {
    const base = search(q)
    if (!q) return base
    const qLow = q.toLowerCase()
    const extras = veiculos.filter((v) => {
      if (base.includes(v)) return false
      const c = clientes.find((cc) => cc.id === v.clienteId)
      return c?.nome.toLowerCase().includes(qLow) ?? false
    })
    return [...base, ...extras]
  }, [q, veiculos, clientes, search])

  return (
    <>
      <Topbar
        title="Veículos"
        actions={<SearchInput value={q} onChange={setQ} placeholder="Buscar por placa, modelo ou proprietário" />}
      />
      <div className="p-7">
        <DataTable<Veiculo>
          data={filtrados}
          rowKey={(v) => v.id}
          onRowClick={(v) => setSelecionado(v)}
          emptyState={<EmptyState icon={Car} titulo="Nenhum veículo encontrado" />}
          columns={[
            { key: 'v', header: 'Veículo', render: (v) => (
              <div>
                <div className="text-[var(--text-0)] font-medium">{v.marca} {v.modelo}</div>
                <div className="text-xs text-[var(--text-2)]">{v.cor}</div>
              </div>
            )},
            { key: 'p', header: 'Placa', render: (v) => <span className="mono uppercase text-[var(--text-0)]">{formatPlaca(v.placa)}</span>, width: '130px' },
            { key: 'a', header: 'Ano', render: (v) => <span className="mono text-[var(--text-1)]">{v.ano}</span>, width: '80px' },
            { key: 'pro', header: 'Proprietário', render: (v) => {
              const c = clientes.find((cc) => cc.id === v.clienteId)
              if (!c) return '—'
              return (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${c.id}`) }}
                  className="text-[var(--text-1)] hover:text-[var(--brand)] text-left"
                >
                  {c.nome}
                </button>
              )
            }},
            { key: 'km', header: 'KM', render: (v) => <span className="mono text-[var(--text-1)]">{formatKm(v.km)}</span>, width: '130px' },
            { key: 'r', header: 'Remap', render: (v) => (
              <span
                className="inline-flex items-center h-5 px-2 rounded text-xs font-medium"
                style={{
                  color: remapColor[v.remap],
                  backgroundColor: `color-mix(in srgb, ${remapColor[v.remap]} 14%, transparent)`,
                }}
              >
                {remapLabel[v.remap]}
              </span>
            ), width: '110px' },
          ]}
        />
      </div>

      <SidePanel
        open={!!selecionado}
        onOpenChange={(v) => !v && setSelecionado(null)}
        title={selecionado ? `${selecionado.marca} ${selecionado.modelo}` : ''}
        subtitle={selecionado && <span className="mono uppercase">{formatPlaca(selecionado.placa)}</span>}
        footer={selecionado && (
          <>
            <Button variant="secondary" onClick={() => { navigate(`/veiculos/${selecionado.id}`); setSelecionado(null) }}>
              Ver perfil completo
            </Button>
            <Button variant="primary" onClick={() => {
              navigate(`/ordens-servico?wizard=open&veiculoId=${selecionado.id}&clienteId=${selecionado.clienteId}`)
              setSelecionado(null)
            }}>
              Nova OS
            </Button>
          </>
        )}
      >
        {selecionado && <VeiculoPanel veiculo={selecionado} onVerCliente={(id) => { navigate(`/clientes/${id}`); setSelecionado(null) }} onVerOS={(id) => { navigate(`/ordens-servico/${id}`); setSelecionado(null) }} />}
      </SidePanel>
    </>
  )
}

function VeiculoPanel({ veiculo, onVerCliente, onVerOS }: { veiculo: Veiculo; onVerCliente: (id: string) => void; onVerOS: (id: string) => void }) {
  const cliente = useClientesStore((s) => s.getById(veiculo.clienteId))
  const osItems = useOSStore((s) => s.getByVeiculo(veiculo.id))
  return (
    <div className="space-y-7">
      <section>
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Dados</h4>
        <div className="space-y-2">
          <Row label="Ano" value={<span className="mono">{veiculo.ano}</span>} />
          <Row label="Cor" value={veiculo.cor} />
          <Row label="KM atual" value={<span className="mono">{formatKm(veiculo.km)}</span>} />
          <Row label="Remap" value={<span className="mono">{remapLabel[veiculo.remap]}</span>} />
          {veiculo.chassi && <Row label="Chassi" value={<span className="mono">{veiculo.chassi}</span>} />}
        </div>
      </section>
      <section>
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Proprietário</h4>
        {cliente ? (
          <button onClick={() => onVerCliente(cliente.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)]">
            <div className="text-sm text-[var(--text-0)]">{cliente.nome}</div>
            <div className="text-xs text-[var(--text-2)] mt-0.5">{cliente.telefone}</div>
          </button>
        ) : <p className="text-sm text-[var(--text-2)]">—</p>}
      </section>
      <section>
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Histórico de OS ({osItems.length})</h4>
        {osItems.length === 0 ? (
          <p className="text-sm text-[var(--text-2)]">Sem OS.</p>
        ) : (
          <ul className="space-y-1">
            {[...osItems].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).map((o) => {
              const total = o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)
              return (
                <li key={o.id}>
                  <button onClick={() => onVerOS(o.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)] flex items-center justify-between gap-3">
                    <div>
                      <div className="mono text-xs text-[var(--text-0)]">{o.id}</div>
                      <div className="text-xs text-[var(--text-2)] mt-0.5">{formatDataRelativa(o.criadoEm)}</div>
                    </div>
                    <StatusBadge tipo="os" valor={o.status} />
                    <div className="mono text-sm text-[var(--text-1)] min-w-[90px] text-right">{formatMoeda(total)}</div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-2)]">{label}</span>
      <span className="text-sm text-[var(--text-0)]">{value}</span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/pages/admin/AdminVeiculos.tsx
git commit -m "feat(consultor): tela Veículos com DataTable + SidePanel"
```

## Task 4.6: Veículo detalhe

**Files:**
- Modify (rewrite): `src/app/pages/admin/AdminVeiculoDetalhe.tsx`

- [ ] **Step 1: Reescrever**

```tsx
// src/app/pages/admin/AdminVeiculoDetalhe.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { Tabs } from '@/app/consultor/components/Tabs'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatPlaca, formatKm, formatDataRelativa, formatMoeda } from '@/app/consultor/lib/formatters'
import type { OS } from '@/app/consultor/types'

const remapLabel = { stock: 'Stock', stage_1: 'Stage 1', stage_2: 'Stage 2', stage_3: 'Stage 3' } as const

export default function AdminVeiculoDetalhe() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const veiculo = useVeiculosStore((s) => s.getById(id))
  const update = useVeiculosStore((s) => s.update)
  const cliente = useClientesStore((s) => s.getById(veiculo?.clienteId ?? ''))
  const osItems = useOSStore((s) => s.getByVeiculo(id))
  const [tab, setTab] = useState('historico')
  const [chassi, setChassi] = useState(veiculo?.chassi ?? '')

  if (!veiculo) {
    return (
      <>
        <Topbar title="Veículo não encontrado" />
        <div className="p-7"><a className="text-[var(--brand)]" href="/veiculos">Voltar</a></div>
      </>
    )
  }

  return (
    <>
      <Topbar
        title={`${veiculo.marca} ${veiculo.modelo}`}
        breadcrumbs={[{ label: 'Veículos', to: '/veiculos' }]}
        actions={
          <Button variant="primary" onClick={() => navigate(`/ordens-servico?wizard=open&veiculoId=${veiculo.id}&clienteId=${veiculo.clienteId}`)}>
            Nova OS
          </Button>
        }
      />
      <div className="p-7 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7 max-w-[1400px]">
        <aside className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 h-fit">
          <div className="text-center">
            <div className="mono uppercase text-3xl font-semibold tracking-wider text-[var(--text-0)] bg-[var(--bg-3)] border border-[var(--border)] rounded-[10px] py-4 px-3 mb-4">
              {formatPlaca(veiculo.placa)}
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-0)]">{veiculo.marca} {veiculo.modelo}</h2>
            <p className="text-sm text-[var(--text-1)] mt-0.5">{veiculo.ano} · {veiculo.cor}</p>
          </div>
          <div className="mt-6 space-y-2">
            <Row label="KM atual" value={<span className="mono">{formatKm(veiculo.km)}</span>} />
            <Row label="Remap" value={<span className="mono">{remapLabel[veiculo.remap]}</span>} />
            {cliente && (
              <Row label="Proprietário" value={
                <button className="text-[var(--brand)] hover:underline" onClick={() => navigate(`/clientes/${cliente.id}`)}>{cliente.nome}</button>
              } />
            )}
          </div>
        </aside>
        <section>
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: 'historico', label: `Histórico de OS (${osItems.length})`, content: (
                <DataTable<OS>
                  data={[...osItems].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))}
                  rowKey={(o) => o.id}
                  onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
                  columns={[
                    { key: 'id', header: 'OS', render: (o) => <span className="mono">{o.id}</span>, width: '140px' },
                    { key: 'd', header: 'Entrada', render: (o) => formatDataRelativa(o.criadoEm), width: '140px' },
                    { key: 's', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
                    { key: 't', header: 'Total', render: (o) => <span className="mono">{formatMoeda(o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0))}</span>, align: 'right' },
                  ]}
                />
              )},
              { value: 'tec', label: 'Técnico', content: (
                <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Chassi</label>
                    <input
                      value={chassi}
                      onChange={(e) => setChassi(e.target.value)}
                      onBlur={() => update(veiculo.id, { chassi })}
                      placeholder="ABCD1234EFGH5678"
                      className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] mono text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
                    />
                  </div>
                  <Row label="Estágio atual" value={<span className="mono">{remapLabel[veiculo.remap]}</span>} />
                </div>
              )},
            ]}
          />
        </section>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-2)]">{label}</span>
      <span className="text-sm text-[var(--text-0)]">{value}</span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/pages/admin/AdminVeiculoDetalhe.tsx
git commit -m "feat(consultor): Veículo detalhe com cartão placa e tabs"
```

## Task 4.7: Ordens de Serviço (lista)

**Files:**
- Modify (rewrite): `src/app/pages/admin/AdminOrdensServico.tsx`
- Modify (rewrite): `src/app/pages/admin/AdminNovaOS.tsx` (redirect)

- [ ] **Step 1: AdminNovaOS redirect**

```tsx
// src/app/pages/admin/AdminNovaOS.tsx
import { Navigate } from 'react-router'
export default function AdminNovaOS() {
  return <Navigate to="/ordens-servico?wizard=open" replace />
}
```

- [ ] **Step 2: AdminOrdensServico**

```tsx
// src/app/pages/admin/AdminOrdensServico.tsx
import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ClipboardList } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatDataRelativa, formatPlaca } from '@/app/consultor/lib/formatters'
import type { OS, StatusOS, TipoServico } from '@/app/consultor/types'
import { NovaOSWizard } from './NovaOSWizard'

const filtros: { key: StatusOS | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todas' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'em_andamento', label: 'Em andamento' },
  { key: 'concluida', label: 'Concluída' },
  { key: 'cancelada', label: 'Cancelada' },
]

const tipoLabel: Record<TipoServico, string> = {
  revisao: 'Revisão', remap_ecu: 'Remap ECU', remap_tcu: 'Remap TCU',
  diagnostico: 'Diagnóstico', manutencao: 'Manutenção',
  freios: 'Freios', suspensao: 'Suspensão', outro: 'Outro',
}

export default function AdminOrdensServico() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const items = useOSStore((s) => s.items)
  const filterByStatus = useOSStore((s) => s.filterByStatus)
  const search = useOSStore((s) => s.search)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)

  const initialStatus = (params.get('status') as StatusOS | 'todos') ?? 'todos'
  const [statusAtivo, setStatusAtivo] = useState<StatusOS | 'todos'>(initialStatus)
  const [q, setQ] = useState('')
  const [wizardOpen, setWizardOpen] = useState(params.get('wizard') === 'open')

  useEffect(() => {
    if (params.get('wizard') === 'open') setWizardOpen(true)
  }, [params])

  const filtrados = useMemo(() => {
    const base = q ? search(q) : items
    return statusAtivo === 'todos' ? base : base.filter((o) => o.status === statusAtivo)
  }, [q, statusAtivo, items, search])

  const contagens = useMemo(() => {
    return filtros.reduce<Record<string, number>>((acc, f) => {
      acc[f.key] = f.key === 'todos' ? items.length : filterByStatus(f.key as StatusOS).length
      return acc
    }, {})
  }, [items, filterByStatus])

  const initialCliente = params.get('clienteId') ?? undefined
  const initialVeiculo = params.get('veiculoId') ?? undefined

  function closeWizard() {
    setWizardOpen(false)
    const np = new URLSearchParams(params)
    np.delete('wizard'); np.delete('clienteId'); np.delete('veiculoId')
    setParams(np, { replace: true })
  }

  return (
    <>
      <Topbar
        title="Ordens de Serviço"
        actions={
          <>
            <SearchInput value={q} onChange={setQ} placeholder="Buscar por ID, cliente ou placa" />
            <Button variant="primary" onClick={() => setWizardOpen(true)}>+ Nova OS</Button>
          </>
        }
      />

      <div className="p-7 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          {filtros.map((f) => {
            const ativo = statusAtivo === f.key
            return (
              <button
                key={f.key}
                onClick={() => setStatusAtivo(f.key)}
                className={`h-8 px-3 rounded-full text-xs font-medium flex items-center gap-2 transition-colors duration-[140ms] ${
                  ativo
                    ? 'bg-[var(--brand-subtle)] text-[var(--brand)] border border-[var(--brand)]/30'
                    : 'bg-[var(--bg-2)] text-[var(--text-1)] border border-[var(--border)] hover:text-[var(--text-0)]'
                }`}
              >
                {f.label}
                <span className="mono opacity-70">{contagens[f.key] ?? 0}</span>
              </button>
            )
          })}
        </div>

        <DataTable<OS>
          data={filtrados}
          rowKey={(o) => o.id}
          onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
          emptyState={<EmptyState icon={ClipboardList} titulo="Nenhuma OS encontrada" />}
          columns={[
            { key: 'id', header: 'OS', render: (o) => <span className="mono text-[var(--text-0)]">{o.id}</span>, width: '140px' },
            { key: 'cli', header: 'Cliente', render: (o) => clientes.find((c) => c.id === o.clienteId)?.nome ?? '—' },
            { key: 'v', header: 'Veículo', render: (o) => {
              const v = veiculos.find((x) => x.id === o.veiculoId)
              if (!v) return '—'
              return (
                <div>
                  <div className="text-[var(--text-0)]">{v.marca} {v.modelo}</div>
                  <div className="text-xs text-[var(--text-2)] mono">{formatPlaca(v.placa)}</div>
                </div>
              )
            }},
            { key: 't', header: 'Tipo', render: (o) => <span className="text-[var(--text-1)]">{tipoLabel[o.tipoServico]}</span>, width: '140px' },
            { key: 'e', header: 'Entrada', render: (o) => <span className="text-[var(--text-1)]">{formatDataRelativa(o.criadoEm)}</span>, width: '140px' },
            { key: 's', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
          ]}
        />
      </div>

      <NovaOSWizard
        open={wizardOpen}
        onOpenChange={(v) => v ? setWizardOpen(true) : closeWizard()}
        initialClienteId={initialCliente}
        initialVeiculoId={initialVeiculo}
        onCreated={(osId) => navigate(`/ordens-servico/${osId}`)}
      />
    </>
  )
}
```

- [ ] **Step 3: Commit parcial (antes do wizard)**

```bash
git add src/app/pages/admin/AdminOrdensServico.tsx src/app/pages/admin/AdminNovaOS.tsx
git commit -m "feat(consultor): lista OS com filtros por status + redirect NovaOS"
```

## Task 4.8: Wizard Nova OS

**Files:**
- Create: `src/app/pages/admin/NovaOSWizard.tsx`
- Create: `tests/integration/wizardNovaOS.test.tsx`

- [ ] **Step 1: Implementar componente NovaOSWizard**

```tsx
// src/app/pages/admin/NovaOSWizard.tsx
import { useEffect, useMemo, useState } from 'react'
import { WizardDrawer } from '@/app/consultor/components/WizardDrawer'
import { Button } from '@/app/consultor/components/Button'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { uuid } from '@/app/consultor/lib/idGenerator'
import { formatCPF, formatTelefone, formatPlaca, normalizaDigitos, normalizaPlaca, formatKm } from '@/app/consultor/lib/formatters'
import type { Cliente, Veiculo, TipoServico } from '@/app/consultor/types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialClienteId?: string
  initialVeiculoId?: string
  onCreated: (osId: string) => void
}

type ClienteMode = 'existente' | 'novo'
type VeiculoMode = 'existente' | 'novo'

const tiposServico: { value: TipoServico; label: string }[] = [
  { value: 'revisao', label: 'Revisão' },
  { value: 'remap_ecu', label: 'Remap ECU' },
  { value: 'remap_tcu', label: 'Remap TCU' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'freios', label: 'Freios' },
  { value: 'suspensao', label: 'Suspensão' },
  { value: 'outro', label: 'Outro' },
]

export function NovaOSWizard({ open, onOpenChange, initialClienteId, initialVeiculoId, onCreated }: Props) {
  const clientes = useClientesStore((s) => s.items)
  const addCliente = useClientesStore((s) => s.add)
  const veiculos = useVeiculosStore((s) => s.items)
  const addVeiculo = useVeiculosStore((s) => s.add)
  const osStore = useOSStore()

  const [step, setStep] = useState(0)

  // Etapa 1 - Cliente
  const [clienteMode, setClienteMode] = useState<ClienteMode>('existente')
  const [clienteQuery, setClienteQuery] = useState('')
  const [clienteSelId, setClienteSelId] = useState<string | null>(initialClienteId ?? null)
  const [novoCliente, setNovoCliente] = useState<{ nome: string; cpf: string; telefone: string }>({ nome: '', cpf: '', telefone: '' })

  // Etapa 2 - Veículo
  const [veiculoMode, setVeiculoMode] = useState<VeiculoMode>('existente')
  const [veiculoSelId, setVeiculoSelId] = useState<string | null>(initialVeiculoId ?? null)
  const [novoVeiculo, setNovoVeiculo] = useState<{ marca: string; modelo: string; ano: string; placa: string; cor: string; km: string; remap: Veiculo['remap'] }>({ marca: '', modelo: '', ano: '', placa: '', cor: '', km: '', remap: 'stock' })

  // Etapa 3 - Serviço
  const [tipoServico, setTipoServico] = useState<TipoServico | null>(null)
  const [queixa, setQueixa] = useState('')
  const [kmEntrada, setKmEntrada] = useState<string>('')

  // Reset quando fecha
  useEffect(() => {
    if (!open) {
      setStep(0)
      setClienteMode('existente'); setClienteQuery(''); setClienteSelId(initialClienteId ?? null)
      setNovoCliente({ nome: '', cpf: '', telefone: '' })
      setVeiculoMode('existente'); setVeiculoSelId(initialVeiculoId ?? null)
      setNovoVeiculo({ marca: '', modelo: '', ano: '', placa: '', cor: '', km: '', remap: 'stock' })
      setTipoServico(null); setQueixa(''); setKmEntrada('')
    }
  }, [open, initialClienteId, initialVeiculoId])

  const clientesFiltrados = useMemo(() => {
    const q = clienteQuery.toLowerCase()
    const qd = normalizaDigitos(q)
    if (!q) return clientes.slice(0, 8)
    return clientes.filter((c) =>
      c.nome.toLowerCase().includes(q) ||
      (qd && normalizaDigitos(c.cpf).includes(qd)) ||
      (qd && normalizaDigitos(c.telefone).includes(qd)),
    ).slice(0, 8)
  }, [clienteQuery, clientes])

  const veiculosDoCliente = useMemo(() => clienteSelId ? veiculos.filter((v) => v.clienteId === clienteSelId) : [], [clienteSelId, veiculos])

  // Validações por etapa
  const canAdvance1 = clienteMode === 'existente'
    ? !!clienteSelId
    : novoCliente.nome.trim().length >= 3 && normalizaDigitos(novoCliente.cpf).length === 11 && normalizaDigitos(novoCliente.telefone).length >= 10

  const canAdvance2 = veiculoMode === 'existente'
    ? !!veiculoSelId
    : novoVeiculo.marca.trim() && novoVeiculo.modelo.trim() && Number(novoVeiculo.ano) >= 1990 && normalizaPlaca(novoVeiculo.placa).length === 7 && novoVeiculo.cor.trim() && Number(novoVeiculo.km) >= 0

  const canAdvance3 = tipoServico !== null && queixa.trim().length >= 5 && Number(kmEntrada) >= 0

  const canAdvance4 = true

  const canAdvance = [canAdvance1, canAdvance2, canAdvance3, canAdvance4][step]

  function handleAdvance() {
    if (step < 3) { setStep(step + 1); return }
    // Submit
    let clienteId = clienteSelId
    if (clienteMode === 'novo') {
      const c: Cliente = {
        id: uuid(),
        nome: novoCliente.nome.trim(),
        cpf: normalizaDigitos(novoCliente.cpf),
        telefone: normalizaDigitos(novoCliente.telefone),
        status: 'ativo',
        criadoEm: new Date().toISOString(),
      }
      addCliente(c)
      clienteId = c.id
    }
    let veiculoId = veiculoSelId
    if (veiculoMode === 'novo' && clienteId) {
      const v: Veiculo = {
        id: uuid(),
        clienteId,
        marca: novoVeiculo.marca.trim(),
        modelo: novoVeiculo.modelo.trim(),
        ano: Number(novoVeiculo.ano),
        placa: normalizaPlaca(novoVeiculo.placa),
        cor: novoVeiculo.cor.trim(),
        km: Number(novoVeiculo.km),
        remap: novoVeiculo.remap,
      }
      addVeiculo(v)
      veiculoId = v.id
    }
    if (!clienteId || !veiculoId || !tipoServico) return
    const os = osStore.create({
      clienteId,
      veiculoId,
      tipoServico,
      kmEntrada: Number(kmEntrada),
      queixa: queixa.trim(),
    })
    onCreated(os.id)
    onOpenChange(false)
  }

  // Preenche KM de etapa 3 do veículo selecionado se vazio
  useEffect(() => {
    if (step === 2 && !kmEntrada) {
      const v = veiculoMode === 'existente'
        ? veiculos.find((x) => x.id === veiculoSelId)
        : null
      if (v) setKmEntrada(String(v.km))
      else if (novoVeiculo.km) setKmEntrada(novoVeiculo.km)
    }
  }, [step])

  const clienteEscolhido: Cliente | null = clienteMode === 'existente'
    ? clientes.find((c) => c.id === clienteSelId) ?? null
    : (novoCliente.nome ? { id: 'preview', nome: novoCliente.nome, cpf: novoCliente.cpf, telefone: novoCliente.telefone, status: 'ativo', criadoEm: '' } : null)
  const veiculoEscolhido: Pick<Veiculo, 'marca' | 'modelo' | 'placa' | 'ano'> | null = veiculoMode === 'existente'
    ? veiculos.find((v) => v.id === veiculoSelId) ?? null
    : (novoVeiculo.marca ? { marca: novoVeiculo.marca, modelo: novoVeiculo.modelo, placa: novoVeiculo.placa, ano: Number(novoVeiculo.ano) } : null)

  return (
    <WizardDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Nova Ordem de Serviço"
      steps={['Cliente', 'Veículo', 'Serviço', 'Resumo']}
      current={step}
      canAdvance={canAdvance}
      onAdvance={handleAdvance}
      onBack={() => setStep(Math.max(0, step - 1))}
      onCancel={() => onOpenChange(false)}
    >
      {step === 0 && (
        <div className="space-y-5">
          <ModeTabs value={clienteMode} onChange={setClienteMode} options={[{ value: 'existente', label: 'Cliente existente' }, { value: 'novo', label: 'Cadastrar novo' }]} />
          {clienteMode === 'existente' ? (
            <div className="space-y-3">
              <input
                value={clienteQuery}
                onChange={(e) => setClienteQuery(e.target.value)}
                placeholder="Buscar por nome, CPF ou telefone"
                className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
              />
              <ul className="space-y-1">
                {clientesFiltrados.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setClienteSelId(c.id)}
                      className={`w-full text-left px-3 py-3 rounded-[6px] border ${clienteSelId === c.id ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'}`}
                    >
                      <div className="text-sm text-[var(--text-0)]">{c.nome}</div>
                      <div className="text-xs text-[var(--text-2)] mt-0.5 mono">{formatCPF(c.cpf)} · {formatTelefone(c.telefone)}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <Campo label="Nome completo" value={novoCliente.nome} onChange={(v) => setNovoCliente({ ...novoCliente, nome: v })} />
              <Campo label="CPF" value={novoCliente.cpf} onChange={(v) => setNovoCliente({ ...novoCliente, cpf: v })} display={formatCPF(novoCliente.cpf)} mono />
              <Campo label="Telefone" value={novoCliente.telefone} onChange={(v) => setNovoCliente({ ...novoCliente, telefone: v })} display={formatTelefone(novoCliente.telefone)} mono />
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          {clienteSelId && veiculosDoCliente.length > 0 && (
            <ModeTabs value={veiculoMode} onChange={setVeiculoMode} options={[{ value: 'existente', label: `Veículos do cliente (${veiculosDoCliente.length})` }, { value: 'novo', label: 'Cadastrar novo' }]} />
          )}
          {veiculoMode === 'existente' && veiculosDoCliente.length > 0 ? (
            <ul className="space-y-2">
              {veiculosDoCliente.map((v) => (
                <li key={v.id}>
                  <button
                    onClick={() => setVeiculoSelId(v.id)}
                    className={`w-full text-left px-4 py-3 rounded-[8px] border ${veiculoSelId === v.id ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[var(--text-0)] font-medium">{v.marca} {v.modelo}</div>
                        <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatPlaca(v.placa)} · {v.ano} · {formatKm(v.km)}</div>
                      </div>
                      <span className="text-xs text-[var(--text-2)] mono">{v.remap.replace('_', ' ')}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Marca" value={novoVeiculo.marca} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, marca: v })} />
              <Campo label="Modelo" value={novoVeiculo.modelo} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, modelo: v })} />
              <Campo label="Ano" value={novoVeiculo.ano} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, ano: v.replace(/\D/g, '').slice(0, 4) })} mono />
              <Campo label="Placa" value={novoVeiculo.placa} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, placa: v })} display={formatPlaca(novoVeiculo.placa)} mono />
              <Campo label="Cor" value={novoVeiculo.cor} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, cor: v })} />
              <Campo label="KM atual" value={novoVeiculo.km} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, km: v.replace(/\D/g, '') })} mono />
              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Remap</label>
                <div className="flex gap-2">
                  {(['stock', 'stage_1', 'stage_2', 'stage_3'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setNovoVeiculo({ ...novoVeiculo, remap: r })}
                      className={`h-9 px-3 rounded-[6px] text-xs mono ${novoVeiculo.remap === r ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-3)] text-[var(--text-1)] hover:text-[var(--text-0)]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Tipo de serviço</label>
            <div className="flex flex-wrap gap-2">
              {tiposServico.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipoServico(t.value)}
                  className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${tipoServico === t.value ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-1)] hover:text-[var(--text-0)]'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Queixa / problema reportado</label>
            <textarea
              value={queixa}
              onChange={(e) => setQueixa(e.target.value)}
              placeholder="Cliente relata que..."
              rows={5}
              className="w-full p-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <Campo label="KM de entrada" value={kmEntrada} onChange={(v) => setKmEntrada(v.replace(/\D/g, ''))} mono />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <ResumoBox titulo="Cliente">
            {clienteEscolhido ? (
              <>
                <div className="text-sm text-[var(--text-0)]">{clienteEscolhido.nome}</div>
                <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatCPF(clienteEscolhido.cpf)} · {formatTelefone(clienteEscolhido.telefone)}</div>
              </>
            ) : <em>—</em>}
          </ResumoBox>
          <ResumoBox titulo="Veículo">
            {veiculoEscolhido ? (
              <>
                <div className="text-sm text-[var(--text-0)]">{veiculoEscolhido.marca} {veiculoEscolhido.modelo}</div>
                <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatPlaca(veiculoEscolhido.placa)} · {veiculoEscolhido.ano}</div>
              </>
            ) : <em>—</em>}
          </ResumoBox>
          <ResumoBox titulo="Serviço">
            <div className="text-sm text-[var(--text-0)]">{tiposServico.find((t) => t.value === tipoServico)?.label}</div>
            <div className="text-xs text-[var(--text-2)] mt-1">{queixa}</div>
            <div className="text-xs text-[var(--text-2)] mt-2 mono">KM entrada: {formatKm(Number(kmEntrada) || 0)}</div>
          </ResumoBox>
          <div className="rounded-[10px] border border-[var(--brand)]/30 bg-[var(--brand-subtle)] p-4">
            <div className="text-xs uppercase tracking-wider text-[var(--brand)] font-medium">Nova OS</div>
            <div className="mono text-lg text-[var(--text-0)] mt-1">
              OS-{new Date().getFullYear()}-{String(osStore.items.filter((o) => o.id.startsWith(`OS-${new Date().getFullYear()}-`)).length + 1).padStart(4, '0')}
            </div>
          </div>
        </div>
      )}
    </WizardDrawer>
  )
}

function ModeTabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex bg-[var(--bg-3)] rounded-[6px] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`h-8 px-3 rounded-[4px] text-xs font-medium transition-colors ${value === o.value ? 'bg-[var(--bg-1)] text-[var(--text-0)]' : 'text-[var(--text-2)] hover:text-[var(--text-0)]'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Campo({ label, value, onChange, display, mono = false }: { label: string; value: string; onChange: (v: string) => void; display?: string; mono?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)] ${mono ? 'mono' : ''}`}
      />
      {display && value && display !== value && (
        <p className="text-xs text-[var(--text-2)] mt-1 mono">{display}</p>
      )}
    </div>
  )
}

function ResumoBox({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-4">
      <div className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">{titulo}</div>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Teste de integração**

```tsx
// tests/integration/wizardNovaOS.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import AdminOrdensServico from '@/app/pages/admin/AdminOrdensServico'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'

describe('Wizard Nova OS', () => {
  beforeEach(() => {
    localStorage.clear()
    useClientesStore.setState({ items: [] })
    useVeiculosStore.setState({ items: [] })
    useOSStore.setState({ items: [] })
  })

  it('cria OS com cliente e veículo novos', async () => {
    const router = createMemoryRouter(
      [
        { path: '/ordens-servico', element: <AdminOrdensServico /> },
        { path: '/ordens-servico/:id', element: <div>DETALHE</div> },
      ],
      { initialEntries: ['/ordens-servico?wizard=open'] },
    )
    render(<RouterProvider router={router} />)

    // Etapa 1: Novo cliente
    await userEvent.click(screen.getByRole('button', { name: /cadastrar novo/i }))
    const [nome, cpf, tel] = screen.getAllByRole('textbox')
    await userEvent.type(nome, 'João Teste')
    await userEvent.type(cpf, '99988877766')
    await userEvent.type(tel, '11999887766')
    await userEvent.click(screen.getByRole('button', { name: /continuar/i }))

    // Etapa 2: Novo veículo
    const campos = screen.getAllByRole('textbox')
    await userEvent.type(campos[0], 'BMW') // marca
    await userEvent.type(campos[1], '330i') // modelo
    await userEvent.type(campos[2], '2023') // ano
    await userEvent.type(campos[3], 'XYZ9A88') // placa
    await userEvent.type(campos[4], 'Preto') // cor
    await userEvent.type(campos[5], '15000') // km
    await userEvent.click(screen.getByRole('button', { name: /continuar/i }))

    // Etapa 3: Serviço
    await userEvent.click(screen.getByRole('button', { name: /revisão/i }))
    await userEvent.type(screen.getByPlaceholderText(/cliente relata/i), 'Revisão programada 20k')
    await userEvent.click(screen.getByRole('button', { name: /continuar/i }))

    // Etapa 4: Criar
    await userEvent.click(screen.getByRole('button', { name: /criar os/i }))

    await waitFor(() => expect(screen.getByText('DETALHE')).toBeInTheDocument())
    expect(useOSStore.getState().items).toHaveLength(1)
    expect(useClientesStore.getState().items).toHaveLength(1)
    expect(useVeiculosStore.getState().items).toHaveLength(1)
  })
})
```

- [ ] **Step 3: Rodar + commit**

```bash
npx vitest run tests/integration/wizardNovaOS.test.tsx
git add src/app/pages/admin/NovaOSWizard.tsx tests/integration/wizardNovaOS.test.tsx
git commit -m "feat(consultor): Wizard Nova OS (4 etapas) + integração test"
```

## Task 4.9: Detalhe da OS (4 tabs)

**Files:**
- Modify (rewrite): `src/app/pages/admin/AdminOSDetalhes.tsx`
- Create: `src/app/pages/admin/os-tabs/TabClienteVeiculo.tsx`
- Create: `src/app/pages/admin/os-tabs/TabChecklist.tsx`
- Create: `src/app/pages/admin/os-tabs/TabOrcamento.tsx`
- Create: `src/app/pages/admin/os-tabs/TabEntrega.tsx`
- Create: `tests/integration/checklist.test.tsx`

- [ ] **Step 1: AdminOSDetalhes (wrapper com tabs)**

```tsx
// src/app/pages/admin/AdminOSDetalhes.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Tabs } from '@/app/consultor/components/Tabs'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { Button } from '@/app/consultor/components/Button'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatPlaca, formatDataRelativa } from '@/app/consultor/lib/formatters'
import type { StatusOS } from '@/app/consultor/types'
import TabClienteVeiculo from './os-tabs/TabClienteVeiculo'
import TabChecklist from './os-tabs/TabChecklist'
import TabOrcamento from './os-tabs/TabOrcamento'
import TabEntrega from './os-tabs/TabEntrega'

const tipoLabel: Record<string, string> = {
  revisao: 'Revisão', remap_ecu: 'Remap ECU', remap_tcu: 'Remap TCU',
  diagnostico: 'Diagnóstico', manutencao: 'Manutenção',
  freios: 'Freios', suspensao: 'Suspensão', outro: 'Outro',
}

const TRANSITIONS: Record<StatusOS, StatusOS[]> = {
  aguardando: ['em_andamento', 'cancelada'],
  em_andamento: ['concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
}

const statusLabel: Record<StatusOS, string> = {
  aguardando: 'Aguardando', em_andamento: 'Em andamento', concluida: 'Concluída', cancelada: 'Cancelada',
}

export default function AdminOSDetalhes() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const os = useOSStore((s) => s.getById(id))
  const updateStatus = useOSStore((s) => s.updateStatus)
  const cliente = useClientesStore((s) => s.getById(os?.clienteId ?? ''))
  const veiculo = useVeiculosStore((s) => s.getById(os?.veiculoId ?? ''))
  const [tab, setTab] = useState('cv')
  const [erro, setErro] = useState<string | null>(null)

  if (!os) {
    return (
      <>
        <Topbar title="OS não encontrada" />
        <div className="p-7"><a className="text-[var(--brand)]" href="/ordens-servico">Voltar</a></div>
      </>
    )
  }

  function handleStatusChange(next: StatusOS) {
    setErro(null)
    try { updateStatus(id, next) } catch (e: unknown) { setErro(e instanceof Error ? e.message : 'Erro') }
  }

  const allowed = TRANSITIONS[os.status]

  return (
    <>
      <Topbar
        title={<span className="flex items-center gap-3">
          <span className="mono text-xl">{os.id}</span>
          <StatusBadge tipo="os" valor={os.status} />
        </span>}
        breadcrumbs={[{ label: 'Ordens de Serviço', to: '/ordens-servico' }]}
        actions={
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button variant="secondary" disabled={allowed.length === 0}>
                Alterar status <ChevronDown className="size-3.5 ml-1" />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content align="end" className="min-w-[200px] bg-[var(--bg-2)] border border-[var(--border)] rounded-[8px] p-1 shadow-[var(--shadow-panel)]">
                {allowed.map((s) => (
                  <Dropdown.Item
                    key={s}
                    onSelect={() => handleStatusChange(s)}
                    className="px-3 py-2 text-sm rounded-[4px] cursor-pointer text-[var(--text-0)] data-[highlighted]:bg-[var(--bg-3)] focus:outline-none"
                  >
                    → {statusLabel[s]}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        }
      />
      <div className="p-7 space-y-5 max-w-[1400px]">
        <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] px-5 py-4 flex flex-wrap items-center gap-6 text-sm">
          <InfoChip label="Cliente" value={cliente?.nome ?? '—'} onClick={() => cliente && navigate(`/clientes/${cliente.id}`)} />
          <InfoChip label="Veículo" value={veiculo ? `${veiculo.marca} ${veiculo.modelo} · ${formatPlaca(veiculo.placa)}` : '—'} onClick={() => veiculo && navigate(`/veiculos/${veiculo.id}`)} />
          <InfoChip label="Tipo" value={tipoLabel[os.tipoServico]} />
          <InfoChip label="Entrada" value={formatDataRelativa(os.criadoEm)} />
        </div>

        {erro && <div className="rounded-[6px] bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-sm px-4 py-2">{erro}</div>}

        <Tabs
          value={tab}
          onValueChange={setTab}
          tabs={[
            { value: 'cv', label: 'Cliente & Veículo', content: <TabClienteVeiculo osId={id} /> },
            { value: 'check', label: 'Checklist', content: <TabChecklist osId={id} /> },
            { value: 'orc', label: 'Orçamento', content: <TabOrcamento osId={id} /> },
            { value: 'ent', label: 'Entrega', content: <TabEntrega osId={id} /> },
          ]}
        />
      </div>
    </>
  )
}

function InfoChip({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-[var(--text-2)]">{label}</div>
      {onClick ? (
        <button onClick={onClick} className="text-sm text-[var(--text-0)] hover:text-[var(--brand)]">{value}</button>
      ) : (
        <div className="text-sm text-[var(--text-0)]">{value}</div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: TabClienteVeiculo**

```tsx
// src/app/pages/admin/os-tabs/TabClienteVeiculo.tsx
import { useState } from 'react'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatCPF, formatTelefone, formatPlaca, formatKm } from '@/app/consultor/lib/formatters'

export default function TabClienteVeiculo({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const cliente = useClientesStore((s) => s.getById(os.clienteId))
  const veiculo = useVeiculosStore((s) => s.getById(os.veiculoId))
  const [queixa, setQueixa] = useState(os.queixa)
  const updateQueixa = (v: string) => {
    useOSStore.setState((s) => ({
      items: s.items.map((o) => o.id === osId ? { ...o, queixa: v, atualizadoEm: new Date().toISOString() } : o),
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Bloco titulo="Cliente">
        {cliente ? (
          <>
            <Row label="Nome" value={cliente.nome} />
            <Row label="CPF" value={<span className="mono">{formatCPF(cliente.cpf)}</span>} />
            <Row label="Telefone" value={<span className="mono">{formatTelefone(cliente.telefone)}</span>} />
            {cliente.email && <Row label="Email" value={cliente.email} />}
          </>
        ) : <em>—</em>}
      </Bloco>
      <Bloco titulo="Veículo">
        {veiculo ? (
          <>
            <Row label="Modelo" value={`${veiculo.marca} ${veiculo.modelo}`} />
            <Row label="Placa" value={<span className="mono uppercase">{formatPlaca(veiculo.placa)}</span>} />
            <Row label="Ano" value={<span className="mono">{veiculo.ano}</span>} />
            <Row label="Cor" value={veiculo.cor} />
            <Row label="KM atual" value={<span className="mono">{formatKm(veiculo.km)}</span>} />
          </>
        ) : <em>—</em>}
      </Bloco>
      <div className="md:col-span-2">
        <Bloco titulo="Queixa do cliente">
          <textarea
            value={queixa}
            onChange={(e) => setQueixa(e.target.value)}
            onBlur={() => updateQueixa(queixa)}
            rows={4}
            className="w-full p-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
          />
          <Row label="KM de entrada" value={<span className="mono">{formatKm(os.kmEntrada)}</span>} />
        </Bloco>
      </div>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
      <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-4">{titulo}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-2)]">{label}</span>
      <span className="text-sm text-[var(--text-0)]">{value}</span>
    </div>
  )
}
```

- [ ] **Step 3: TabChecklist**

```tsx
// src/app/pages/admin/os-tabs/TabChecklist.tsx
import { useMemo } from 'react'
import { useOSStore } from '@/app/consultor/store/osStore'
import type { ChecklistItem, ChecklistStatus } from '@/app/consultor/types'

const statusOptions: { value: Exclude<ChecklistStatus, null>; label: string; color: string }[] = [
  { value: 'ok', label: 'OK', color: 'var(--success)' },
  { value: 'atencao', label: 'Atenção', color: 'var(--warning)' },
  { value: 'critico', label: 'Crítico', color: 'var(--danger)' },
  { value: 'nao_aplicavel', label: 'N/A', color: 'var(--text-2)' },
]

export default function TabChecklist({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const update = useOSStore((s) => s.updateChecklist)

  const porCategoria = useMemo(() => {
    const m = new Map<string, ChecklistItem[]>()
    os.checklist.forEach((it) => {
      const arr = m.get(it.categoria) ?? []
      arr.push(it); m.set(it.categoria, arr)
    })
    return Array.from(m.entries())
  }, [os.checklist])

  const inspecionados = os.checklist.filter((i) => i.status !== null).length
  const total = os.checklist.length
  const pct = total > 0 ? (inspecionados / total) * 100 : 0

  function patch(id: string, patchObj: Partial<ChecklistItem>) {
    const novo = os.checklist.map((i) => (i.id === id ? { ...i, ...patchObj } : i))
    update(osId, novo)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[var(--text-1)]">{inspecionados} de {total} itens inspecionados</span>
          <span className="mono text-sm text-[var(--text-0)]">{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-3)] overflow-hidden">
          <div className="h-full bg-[var(--brand)] transition-all duration-[360ms]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {porCategoria.map(([categoria, itens]) => (
        <div key={categoria} className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--text-0)]">{categoria}</h4>
            <span className="text-xs text-[var(--text-2)] mono">{itens.filter((i) => i.status !== null).length}/{itens.length}</span>
          </div>
          <ul>
            {itens.map((it) => (
              <li key={it.id} className="px-5 py-4 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                  <span className="text-sm text-[var(--text-0)]">{it.item}</span>
                  <div className="flex gap-1">
                    {statusOptions.map((opt) => {
                      const ativo = it.status === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => patch(it.id, { status: opt.value })}
                          className="h-7 px-3 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: ativo ? `color-mix(in srgb, ${opt.color} 20%, transparent)` : 'transparent',
                            color: ativo ? opt.color : 'var(--text-2)',
                            border: `1px solid ${ativo ? opt.color : 'var(--border)'}`,
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <input
                  value={it.observacao ?? ''}
                  onChange={(e) => patch(it.id, { observacao: e.target.value })}
                  placeholder="Observação (opcional)"
                  className="h-8 w-full px-2 rounded-[4px] bg-[var(--bg-3)] border border-[var(--border)] text-xs text-[var(--text-1)] focus-visible:outline-none focus:border-[var(--brand)]"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: TabOrcamento**

```tsx
// src/app/pages/admin/os-tabs/TabOrcamento.tsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/app/consultor/components/Button'
import { useOSStore } from '@/app/consultor/store/osStore'
import { uuid } from '@/app/consultor/lib/idGenerator'
import { formatMoeda } from '@/app/consultor/lib/formatters'
import type { OrcamentoLinha, AprovacaoOrcamento } from '@/app/consultor/types'

export default function TabOrcamento({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const update = useOSStore((s) => s.updateOrcamento)
  const [linhas, setLinhas] = useState<OrcamentoLinha[]>(os.orcamento.linhas)

  function save(next: OrcamentoLinha[], aprovacao: AprovacaoOrcamento = os.orcamento.aprovacao) {
    setLinhas(next)
    update(osId, { linhas: next, aprovacao })
  }
  function addLinha(tipo: 'servico' | 'peca') {
    save([...linhas, { id: uuid(), tipo, descricao: '', quantidade: 1, valorUnitario: 0 }])
  }
  function patch(id: string, p: Partial<OrcamentoLinha>) {
    save(linhas.map((l) => (l.id === id ? { ...l, ...p } : l)))
  }
  function remove(id: string) {
    save(linhas.filter((l) => l.id !== id))
  }
  const total = linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)

  return (
    <div className="space-y-5">
      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[var(--text-0)]">Linhas do orçamento</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => addLinha('servico')}><Plus className="size-3.5" /> Serviço</Button>
            <Button size="sm" variant="ghost" onClick={() => addLinha('peca')}><Plus className="size-3.5" /> Peça</Button>
          </div>
        </div>
        {linhas.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--text-2)]">Nenhuma linha ainda. Adicione um serviço ou peça.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)]">Tipo</th>
                <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)]">Descrição</th>
                <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)] w-20">Qtd</th>
                <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)] w-32">Unit.</th>
                <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)] w-32">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-2">
                    <select
                      value={l.tipo}
                      onChange={(e) => patch(l.id, { tipo: e.target.value as 'servico' | 'peca' })}
                      className="h-8 px-2 rounded-[4px] bg-[var(--bg-3)] border border-[var(--border)] text-xs text-[var(--text-0)]"
                    >
                      <option value="servico">Serviço</option>
                      <option value="peca">Peça</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input value={l.descricao} onChange={(e) => patch(l.id, { descricao: e.target.value })} className="h-8 w-full px-2 rounded-[4px] bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--brand)] text-sm text-[var(--text-0)] focus-visible:outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={1} value={l.quantidade} onChange={(e) => patch(l.id, { quantidade: Math.max(1, Number(e.target.value) || 1) })} className="h-8 w-full px-2 rounded-[4px] bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--brand)] mono text-sm text-right text-[var(--text-0)] focus-visible:outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={0} step={1} value={l.valorUnitario / 100} onChange={(e) => patch(l.id, { valorUnitario: Math.round(Number(e.target.value) * 100) || 0 })} className="h-8 w-full px-2 rounded-[4px] bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--brand)] mono text-sm text-right text-[var(--text-0)] focus-visible:outline-none" />
                  </td>
                  <td className="px-4 py-2 text-right mono text-sm text-[var(--text-0)]">{formatMoeda(l.quantidade * l.valorUnitario)}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => remove(l.id)} aria-label="Remover" className="size-7 rounded-[4px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--danger)] hover:bg-[var(--bg-3)]">
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-xs uppercase tracking-wider text-[var(--text-2)]">Total</td>
                <td className="px-4 py-3 text-right mono text-xl font-semibold text-[var(--text-0)]">{formatMoeda(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Aprovação do cliente</h4>
        <div className="flex gap-2">
          {(['pendente', 'aprovado', 'rejeitado'] as const).map((s) => {
            const ativo = os.orcamento.aprovacao === s
            const color = s === 'aprovado' ? 'var(--success)' : s === 'rejeitado' ? 'var(--danger)' : 'var(--warning)'
            return (
              <button
                key={s}
                onClick={() => save(linhas, s)}
                className="h-9 px-4 rounded-full text-xs font-medium uppercase tracking-wide"
                style={{
                  backgroundColor: ativo ? `color-mix(in srgb, ${color} 18%, transparent)` : 'transparent',
                  color: ativo ? color : 'var(--text-2)',
                  border: `1px solid ${ativo ? color : 'var(--border)'}`,
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
        {os.orcamento.aprovadoEm && (
          <p className="text-xs text-[var(--text-2)] mt-3">Aprovado em {new Date(os.orcamento.aprovadoEm).toLocaleString('pt-BR')}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: TabEntrega**

```tsx
// src/app/pages/admin/os-tabs/TabEntrega.tsx
import { useState } from 'react'
import { Button } from '@/app/consultor/components/Button'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatMoeda, formatKm } from '@/app/consultor/lib/formatters'
import type { FormaPagamento } from '@/app/consultor/types'

export default function TabEntrega({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const updateEntrega = useOSStore((s) => s.updateEntrega)
  const updateStatus = useOSStore((s) => s.updateStatus)

  const [kmSaida, setKmSaida] = useState<string>(String(os.entrega.kmSaida ?? ''))
  const [forma, setForma] = useState<FormaPagamento | ''>(os.entrega.formaPagamento ?? '')
  const [obs, setObs] = useState(os.entrega.observacoes ?? '')
  const [erro, setErro] = useState<string | null>(null)

  const total = os.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)
  const podeFinalizar = os.status === 'em_andamento' && os.orcamento.aprovacao === 'aprovado'

  function handleFinalizar() {
    setErro(null)
    try {
      updateEntrega(osId, {
        kmSaida: Number(kmSaida) || undefined,
        formaPagamento: forma || undefined,
        observacoes: obs,
        finalizadaEm: new Date().toISOString(),
      })
      updateStatus(osId, 'concluida')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro')
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 space-y-4">
        <Campo label="KM de saída" value={kmSaida} onChange={(v) => setKmSaida(v.replace(/\D/g, ''))} onBlur={() => updateEntrega(osId, { kmSaida: Number(kmSaida) || undefined })} mono placeholder={formatKm(os.kmEntrada)} />
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Forma de pagamento</label>
          <select
            value={forma}
            onChange={(e) => { const f = e.target.value as FormaPagamento | ''; setForma(f); updateEntrega(osId, { formaPagamento: f || undefined }) }}
            className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
          >
            <option value="">Selecione</option>
            <option value="pix">PIX</option>
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Observações</label>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            onBlur={() => updateEntrega(osId, { observacoes: obs })}
            rows={4}
            className="w-full p-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
          />
        </div>
      </div>

      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[var(--text-1)]">Total da OS</span>
          <span className="mono text-xl font-semibold text-[var(--text-0)]">{formatMoeda(total)}</span>
        </div>
        {!podeFinalizar && (
          <p className="text-xs text-[var(--text-2)] mb-3">Para finalizar: status deve ser <strong>Em andamento</strong> e orçamento <strong>Aprovado</strong>.</p>
        )}
        {erro && <p className="text-sm text-[var(--danger)] mb-2">{erro}</p>}
        <Button variant="primary" size="lg" onClick={handleFinalizar} disabled={!podeFinalizar} className="w-full">Finalizar OS</Button>
      </div>

      {os.entrega.finalizadaEm && (
        <div className="rounded-[10px] bg-[var(--success)]/10 border border-[var(--success)]/30 px-4 py-3 text-sm text-[var(--success)]">
          Finalizada em {new Date(os.entrega.finalizadaEm).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  )
}

function Campo({ label, value, onChange, onBlur, mono = false, placeholder }: { label: string; value: string; onChange: (v: string) => void; onBlur?: () => void; mono?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)] ${mono ? 'mono' : ''}`}
      />
    </div>
  )
}
```

- [ ] **Step 6: Teste integração checklist**

```tsx
// tests/integration/checklist.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import AdminOSDetalhes from '@/app/pages/admin/AdminOSDetalhes'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'

describe('Checklist integração', () => {
  beforeEach(() => {
    localStorage.clear()
    useClientesStore.setState({ items: [{ id: 'c-1', nome: 'Test', cpf: '11111111111', telefone: '1100000000', status: 'ativo', criadoEm: new Date().toISOString() }] })
    useVeiculosStore.setState({ items: [{ id: 'v-1', clienteId: 'c-1', marca: 'BMW', modelo: '330i', ano: 2022, placa: 'ABC1D23', cor: 'Preto', km: 10000, remap: 'stock' }] })
    useOSStore.setState({ items: [] })
    useOSStore.getState().create({ clienteId: 'c-1', veiculoId: 'v-1', tipoServico: 'revisao', kmEntrada: 10000, queixa: 'teste' })
  })

  it('marca item como OK e persiste', async () => {
    const os = useOSStore.getState().items[0]
    const router = createMemoryRouter([{ path: '/ordens-servico/:id', element: <AdminOSDetalhes /> }], { initialEntries: [`/ordens-servico/${os.id}`] })
    render(<RouterProvider router={router} />)
    await userEvent.click(screen.getByRole('tab', { name: /checklist/i }))
    const [okBtn] = screen.getAllByRole('button', { name: /^OK$/ })
    await userEvent.click(okBtn)
    const after = useOSStore.getState().getById(os.id)!
    expect(after.checklist[0].status).toBe('ok')
  })
})
```

- [ ] **Step 7: Rodar + commit**

```bash
npm test
git add src/app/pages/admin/AdminOSDetalhes.tsx src/app/pages/admin/os-tabs/ tests/integration/checklist.test.tsx
git commit -m "feat(consultor): Detalhe OS com 4 tabs (CV, Checklist, Orçamento, Entrega) + test"
git tag consultor-v1-phase4-green
```
