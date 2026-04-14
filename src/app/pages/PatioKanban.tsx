// src/app/pages/PatioKanban.tsx
import { Wrench } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { EmptyState } from '@/app/consultor/components/EmptyState'

export default function PatioKanban() {
  return (
    <>
      <Topbar title="Pátio" />
      <div className="p-7">
        <EmptyState
          icon={Wrench}
          titulo="Pátio Kanban em breve"
          descricao="Visualização do fluxo operacional do pátio — quais carros estão na baia, em diagnóstico, aguardando peça ou prontos para retirada. Será liberado em V2."
        />
      </div>
    </>
  )
}
