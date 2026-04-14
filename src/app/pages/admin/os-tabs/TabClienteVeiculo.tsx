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
