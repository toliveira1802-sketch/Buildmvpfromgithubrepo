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
