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
