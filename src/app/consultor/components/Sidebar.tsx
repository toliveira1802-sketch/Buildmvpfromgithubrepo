// src/app/consultor/components/Sidebar.tsx
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
  LayoutDashboard, Users, ClipboardList, LogOut, RotateCcw,
  PlusCircle, Wrench, Calendar, ChevronDown, FolderOpen, Sparkles,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { resetConsultorMocks } from '../bootstrap'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  emphasis?: boolean
}

const topItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ordens-servico?wizard=open', label: 'Nova OS', icon: PlusCircle, emphasis: true },
]

const cadastrosItems: NavItem[] = [
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/ordens-servico', label: 'Ordens de Serviço', icon: ClipboardList },
]

const bottomItems: NavItem[] = [
  { to: '/patio', label: 'Pátio', icon: Wrench },
  { to: '/agendamentos', label: 'Agendamentos', icon: Calendar },
]

function renderLink({ to, label, icon: Icon, emphasis }: NavItem) {
  // active match ignora a query string. NavLink casa rota base sozinho.
  const baseTo = to.split('?')[0]
  return (
    <NavLink
      key={to}
      to={to}
      end={baseTo === '/ordens-servico' && to.includes('?wizard=open')}
      className={({ isActive }) =>
        `relative flex items-center gap-3 h-9 px-3 rounded-[6px] text-sm transition-colors duration-[140ms] ${
          emphasis
            ? 'bg-[var(--brand-subtle)] text-[var(--brand)] hover:bg-[color-mix(in_srgb,var(--brand)_20%,transparent)] font-medium'
            : isActive
            ? 'bg-[var(--bg-3)] text-[var(--text-0)] font-medium'
            : 'text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !emphasis && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--brand)] rounded-r" />}
          <Icon className="size-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const consultor = useAuthStore((s) => s.consultor)
  const logout = useAuthStore((s) => s.logout)
  const [cadastrosOpen, setCadastrosOpen] = useState(true)

  const iniciais = (consultor?.nome ?? 'C')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="w-[220px] shrink-0 bg-[var(--bg-1)] border-r border-[var(--border)] flex flex-col">
      <div className="px-5 h-14 flex items-center gap-2 border-b border-[var(--border)]">
        <div className="size-2 rounded-full bg-[var(--brand)]" aria-hidden />
        <span className="font-semibold tracking-tight text-[var(--text-0)]">DAP</span>
        <span className="text-xs text-[var(--text-2)] ml-1">Consultor</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {topItems.map(renderLink)}

        <div className="pt-4">
          <button
            onClick={() => setCadastrosOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
            aria-expanded={cadastrosOpen}
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="size-3.5 opacity-70" />
              Cadastros
            </span>
            <ChevronDown
              className={`size-3.5 transition-transform duration-[180ms] ${cadastrosOpen ? '' : '-rotate-90'}`}
            />
          </button>
          {cadastrosOpen && (
            <div className="mt-1 space-y-0.5 pl-2 ml-3 border-l border-[var(--border)]">
              {cadastrosItems.map(renderLink)}
            </div>
          )}
        </div>

        <div className="pt-4 space-y-0.5">
          {bottomItems.map(renderLink)}
        </div>
      </nav>

      <div className="px-3 py-3 border-t border-[var(--border)] space-y-2">
        <NavLink
          to="/playground"
          className={({ isActive }) =>
            `w-full flex items-center gap-2 h-8 px-3 rounded-[6px] text-xs transition-colors ${
              isActive
                ? 'text-[var(--brand)] bg-[var(--brand-subtle)]'
                : 'text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]'
            }`
          }
        >
          <Sparkles className="size-3.5" />
          Playground
        </NavLink>
        <button
          onClick={resetConsultorMocks}
          className="w-full flex items-center gap-2 h-8 px-3 rounded-[6px] text-xs text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]"
          title="Resetar mocks para seed inicial"
        >
          <RotateCcw className="size-3.5" />
          Resetar mocks
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-[var(--bg-2)] border border-[var(--border)]">
          <div className="size-8 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center text-xs font-semibold">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[var(--text-0)] truncate">{consultor?.nome ?? '—'}</div>
            <div className="text-[11px] text-[var(--text-2)]">Consultor</div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            aria-label="Sair"
            className="size-7 rounded-[6px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--danger)] hover:bg-[var(--bg-3)]"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
