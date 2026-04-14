// src/app/pages/admin/AdminAgendamentos.tsx
import { Calendar } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { EmptyState } from '@/app/consultor/components/EmptyState'

export default function AdminAgendamentos() {
  return (
    <>
      <Topbar title="Agendamentos" />
      <div className="p-7">
        <EmptyState
          icon={Calendar}
          titulo="Agendamentos em breve"
          descricao="Calendário de entradas agendadas, bloqueio de horário por elevador, confirmação via WhatsApp. Será liberado em V2."
        />
      </div>
    </>
  )
}
