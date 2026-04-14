// src/app/consultor/components/Tabs.tsx
import { ReactNode } from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'

interface Tab {
  value: string
  label: string
  content: ReactNode
}

interface Props {
  tabs: Tab[]
  value: string
  onValueChange: (v: string) => void
}

export function Tabs({ tabs, value, onValueChange }: Props) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className="w-full">
      <RadixTabs.List className="flex items-center gap-1 border-b border-[var(--border)] mb-5">
        {tabs.map((t) => (
          <RadixTabs.Trigger
            key={t.value}
            value={t.value}
            className="relative px-4 py-2.5 text-sm font-medium text-[var(--text-1)] data-[state=active]:text-[var(--text-0)] hover:text-[var(--text-0)] transition-colors duration-[140ms] focus-visible:outline-none data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:inset-x-3 data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[var(--brand)]"
          >
            {t.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((t) => (
        <RadixTabs.Content key={t.value} value={t.value} className="focus-visible:outline-none">
          {t.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
