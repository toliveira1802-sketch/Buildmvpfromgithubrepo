// src/app/consultor/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router'
import { LayoutDashboard, Users, Car, ClipboardList, LogOut, RotateCcw } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { resetConsultorMocks } from '../bootstrap'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/veiculos', label: 'Veículos', icon: Car },
  { to: '/ordens-servico', label: 'Ordens de Serviço', icon: ClipboardList },
]

export function Sidebar() {
  const navigate = useNavigate()
  const consultor = useAuthStore((s) => s.consultor)
  const logout = useAuthStore((s) => s.logout)

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

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 h-9 px-3 rounded-[6px] text-sm transition-colors duration-[140ms] ${
                isActive
                  ? 'bg-[var(--bg-3)] text-[var(--text-0)] font-medium'
                  : 'text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--brand)] rounded-r" />}
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-[var(--border)] space-y-2">
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
