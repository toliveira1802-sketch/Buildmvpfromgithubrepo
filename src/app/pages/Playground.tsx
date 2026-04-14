// src/app/pages/Playground.tsx
import { useState } from 'react'
import { Sparkles, Users, Car, ClipboardList, Trash2, Info } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { StatCard } from '@/app/consultor/components/StatCard'
import { Stepper } from '@/app/consultor/components/Stepper'
import { DataTable } from '@/app/consultor/components/DataTable'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { WizardDrawer } from '@/app/consultor/components/WizardDrawer'
import { Tabs } from '@/app/consultor/components/Tabs'

type ColorVar =
  | '--bg-0' | '--bg-1' | '--bg-2' | '--bg-3'
  | '--border' | '--border-strong'
  | '--text-0' | '--text-1' | '--text-2' | '--text-3'
  | '--brand' | '--brand-hover' | '--brand-subtle' | '--brand-ring'
  | '--success' | '--warning' | '--info' | '--danger' | '--vip'

const colorGroups: { label: string; vars: ColorVar[] }[] = [
  { label: 'Surfaces', vars: ['--bg-0', '--bg-1', '--bg-2', '--bg-3', '--border', '--border-strong'] },
  { label: 'Text', vars: ['--text-0', '--text-1', '--text-2', '--text-3'] },
  { label: 'Brand', vars: ['--brand', '--brand-hover', '--brand-subtle', '--brand-ring'] },
  { label: 'Semantic', vars: ['--success', '--warning', '--info', '--danger', '--vip'] },
]

const typeScale = [
  { label: 'text-xs · 12/16', cls: 'text-xs' },
  { label: 'text-sm · 13/20', cls: 'text-sm' },
  { label: 'text-base · 14/22', cls: 'text-base' },
  { label: 'text-lg · 16/24', cls: 'text-lg' },
  { label: 'text-xl · 20/28', cls: 'text-xl' },
  { label: 'text-2xl · 28/36', cls: 'text-2xl' },
  { label: 'text-3xl · 36/44', cls: 'text-3xl' },
]

interface DemoRow { id: string; nome: string; status: 'ativo' | 'vip' | 'inativo'; valor: number }
const demoRows: DemoRow[] = [
  { id: '1', nome: 'Rafael Moreira', status: 'vip', valor: 452000 },
  { id: '2', nome: 'Juliana Tavares', status: 'ativo', valor: 128000 },
  { id: '3', nome: 'Eduardo Pimenta', status: 'vip', valor: 980000 },
  { id: '4', nome: 'Rogério Matos', status: 'inativo', valor: 0 },
]

export default function Playground() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [tab, setTab] = useState('btn')

  return (
    <>
      <Topbar
        title={<span className="flex items-center gap-2"><Sparkles className="size-5 text-[var(--brand)]" /> Playground</span>}
      />
      <div className="p-7 space-y-10 max-w-[1400px]">
        <header>
          <h2 className="text-2xl font-semibold text-[var(--text-0)]">Design system — Portal Consultor</h2>
          <p className="text-sm text-[var(--text-1)] mt-1">Tokens, tipografia, componentes e estados numa tela só. Não aparece em produção pro consultor — é referência de design/dev.</p>
        </header>

        {/* TOKENS — COLORS */}
        <Section titulo="Paleta">
          <div className="space-y-4">
            {colorGroups.map((g) => (
              <div key={g.label}>
                <div className="text-xs uppercase tracking-wider text-[var(--text-2)] mb-2">{g.label}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {g.vars.map((v) => (
                    <div key={v} className="rounded-[8px] bg-[var(--bg-2)] border border-[var(--border)] p-3">
                      <div className="w-full h-12 rounded-[6px] border border-[var(--border)] mb-2" style={{ backgroundColor: `var(${v})` }} />
                      <div className="mono text-[11px] text-[var(--text-0)] truncate">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section titulo="Tipografia">
          <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6 space-y-3">
            {typeScale.map((t) => (
              <div key={t.label} className="flex items-baseline gap-6">
                <span className="text-[11px] text-[var(--text-2)] uppercase tracking-wider mono w-32 shrink-0">{t.label}</span>
                <span className={`${t.cls} text-[var(--text-0)]`}>Doctor Auto Prime — alemães premium</span>
              </div>
            ))}
            <div className="pt-4 border-t border-[var(--border)] mt-4 flex items-baseline gap-6">
              <span className="text-[11px] text-[var(--text-2)] uppercase tracking-wider mono w-32 shrink-0">mono · métricas</span>
              <span className="mono text-xl text-[var(--text-0)]">R$ 452.300,00 · 28.400 km · ABC-1D23 · OS-2026-0042</span>
            </div>
          </div>
        </Section>

        {/* INTERACTIVE SHOWCASE */}
        <Section titulo="Componentes">
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: 'btn', label: 'Buttons', content: <ButtonShowcase /> },
              { value: 'badge', label: 'StatusBadge', content: <BadgeShowcase /> },
              { value: 'stat', label: 'StatCard', content: <StatShowcase /> },
              { value: 'step', label: 'Stepper', content: <StepperShowcase /> },
              { value: 'input', label: 'SearchInput', content: <InputShowcase value={searchValue} onChange={setSearchValue} /> },
              { value: 'empty', label: 'EmptyState', content: (
                <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)]">
                  <EmptyState icon={Info} titulo="Nenhum resultado" descricao="Ajuste a busca ou os filtros aplicados." acao={<Button variant="primary">Limpar filtros</Button>} />
                </div>
              )},
              { value: 'table', label: 'DataTable', content: (
                <DataTable<DemoRow>
                  data={demoRows}
                  rowKey={(r) => r.id}
                  onRowClick={(r) => alert(`row: ${r.nome}`)}
                  columns={[
                    { key: 'n', header: 'Cliente', render: (r) => r.nome },
                    { key: 's', header: 'Status', render: (r) => <StatusBadge tipo="cliente" valor={r.status} />, width: '140px' },
                    { key: 'v', header: 'Total gasto', render: (r) => <span className="mono">{fmtMoeda(r.valor)}</span>, align: 'right' },
                  ]}
                />
              )},
              { value: 'panel', label: 'SidePanel + Wizard', content: (
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setPanelOpen(true)}>Abrir SidePanel</Button>
                  <Button variant="primary" onClick={() => { setWizardStep(0); setWizardOpen(true) }}>Abrir Wizard</Button>
                </div>
              )},
              { value: 'icons', label: 'Ícones', content: <IconsShowcase /> },
            ]}
          />
        </Section>

        {/* MOTION */}
        <Section titulo="Motion & elevação">
          <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[8px] bg-[var(--bg-3)] p-4 hover:scale-[1.02] transition-transform duration-[220ms] cursor-default">
                <div className="text-xs text-[var(--text-2)] uppercase tracking-wider mb-2">hover scale</div>
                <div className="mono text-sm text-[var(--text-0)]">220ms ease-out</div>
              </div>
              <div className="rounded-[8px] bg-[var(--bg-3)] p-4 hover:bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] transition-colors duration-[140ms] cursor-default">
                <div className="text-xs text-[var(--text-2)] uppercase tracking-wider mb-2">hover tint</div>
                <div className="mono text-sm text-[var(--text-0)]">140ms brand subtle</div>
              </div>
              <div className="rounded-[8px] p-4" style={{ boxShadow: 'var(--shadow-panel)' }}>
                <div className="text-xs text-[var(--text-2)] uppercase tracking-wider mb-2">shadow-panel</div>
                <div className="mono text-sm text-[var(--text-0)]">elevation</div>
              </div>
            </div>
          </div>
        </Section>

        {/* FOCUS RING */}
        <Section titulo="Focus ring (a11y)">
          <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6">
            <p className="text-sm text-[var(--text-1)] mb-4">Use <kbd className="mono text-[11px] px-1.5 py-0.5 rounded bg-[var(--bg-3)] border border-[var(--border)]">Tab</kbd> para ver o anel de foco brand em cada interativo.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <input className="h-10 px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)]" placeholder="input" />
              <a href="#" className="h-10 px-3 inline-flex items-center text-sm text-[var(--brand)] hover:underline rounded-[6px]">link</a>
            </div>
          </div>
        </Section>
      </div>

      {/* Drawer / Panel */}
      <SidePanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        title="SidePanel de exemplo"
        subtitle={<span className="mono">460px · Radix Dialog + custom visual</span>}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPanelOpen(false)}>Fechar</Button>
            <Button variant="primary" onClick={() => setPanelOpen(false)}>OK</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-1)]">Use pra mostrar detalhe rápido sem sair da tela atual — dados do cliente, preview de OS, quick edit. Entra e sai da direita com spring.</p>
          <div className="rounded-[6px] bg-[var(--bg-2)] border border-[var(--border)] p-4 text-sm text-[var(--text-1)]">
            Qualquer conteúdo cabe aqui. Header, body scrollable, footer sticky opcional.
          </div>
        </div>
      </SidePanel>

      <WizardDrawer
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        title="Wizard de exemplo"
        steps={['Alvo', 'Detalhes', 'Confirmação']}
        current={wizardStep}
        canAdvance
        onAdvance={() => {
          if (wizardStep < 2) setWizardStep((s) => s + 1)
          else setWizardOpen(false)
        }}
        onBack={() => setWizardStep((s) => Math.max(0, s - 1))}
        onCancel={() => setWizardOpen(false)}
        advanceLabel={wizardStep === 2 ? 'Concluir' : undefined}
      >
        {wizardStep === 0 && <WizardStepBox titulo="Etapa 1" conteudo="Selecione o alvo. Normalmente: cliente existente ou novo cadastro." />}
        {wizardStep === 1 && <WizardStepBox titulo="Etapa 2" conteudo="Detalhes específicos. Forms com validação inline em tempo real." />}
        {wizardStep === 2 && <WizardStepBox titulo="Etapa 3 — resumo" conteudo="Card visual com tudo que o usuário preencheu. Botão final dispara a action." />}
      </WizardDrawer>
    </>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-4">{titulo}</h3>
      {children}
    </section>
  )
}

function ButtonShowcase() {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6 space-y-5">
      <Row label="primary"><Button size="sm" variant="primary">Small</Button><Button variant="primary">Medium</Button><Button size="lg" variant="primary">Large</Button><Button variant="primary" loading>Loading</Button><Button variant="primary" disabled>Disabled</Button></Row>
      <Row label="secondary"><Button variant="secondary">Secondary</Button><Button variant="secondary" disabled>Disabled</Button></Row>
      <Row label="ghost"><Button variant="ghost">Ghost</Button></Row>
      <Row label="danger"><Button variant="danger"><Trash2 className="size-4" /> Remover</Button></Row>
    </div>
  )
}

function BadgeShowcase() {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6 space-y-4">
      <Row label="OS"><StatusBadge tipo="os" valor="aguardando" /><StatusBadge tipo="os" valor="em_andamento" /><StatusBadge tipo="os" valor="concluida" /><StatusBadge tipo="os" valor="cancelada" /></Row>
      <Row label="Cliente"><StatusBadge tipo="cliente" valor="ativo" /><StatusBadge tipo="cliente" valor="vip" /><StatusBadge tipo="cliente" valor="inativo" /></Row>
      <Row label="Aprovação"><StatusBadge tipo="aprovacao" valor="pendente" /><StatusBadge tipo="aprovacao" valor="aprovado" /><StatusBadge tipo="aprovacao" valor="rejeitado" /></Row>
    </div>
  )
}

function StatShowcase() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="OS do dia" valor="12" delta={{ valor: 18.4, direcao: 'up' }} />
      <StatCard label="Em andamento" valor="7" />
      <StatCard label="Concluídas/mês" valor="84" delta={{ valor: 4.2, direcao: 'up' }} />
      <StatCard label="Faturamento" valor="R$ 452.300" delta={{ valor: 2.1, direcao: 'down' }} />
    </div>
  )
}

function StepperShowcase() {
  const all = ['Cliente', 'Veículo', 'Serviço', 'Resumo']
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6 space-y-6">
      {[0, 1, 2, 3].map((c) => (
        <div key={c}>
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-2)] mono mb-2">current = {c}</div>
          <Stepper steps={all} current={c} />
        </div>
      ))}
    </div>
  )
}

function InputShowcase({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6 space-y-3">
      <SearchInput value={value} onChange={onChange} placeholder="Digite ou use ⌘K" />
      <p className="text-xs text-[var(--text-2)]">Valor: <span className="mono text-[var(--text-1)]">{value || '(vazio)'}</span></p>
    </div>
  )
}

function IconsShowcase() {
  const icons = [
    { I: Users, l: 'Users' }, { I: Car, l: 'Car' }, { I: ClipboardList, l: 'ClipboardList' },
    { I: Sparkles, l: 'Sparkles' }, { I: Trash2, l: 'Trash2' }, { I: Info, l: 'Info' },
  ]
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
      {icons.map(({ I, l }) => (
        <div key={l} className="flex flex-col items-center gap-2 p-3 rounded-[6px] bg-[var(--bg-3)]">
          <I className="size-5 text-[var(--text-0)]" />
          <span className="mono text-[10px] text-[var(--text-2)]">{l}</span>
        </div>
      ))}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-[11px] uppercase tracking-wider text-[var(--text-2)] mono w-24 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  )
}

function WizardStepBox({ titulo, conteudo }: { titulo: string; conteudo: string }) {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-6">
      <h4 className="text-base font-semibold text-[var(--text-0)] mb-2">{titulo}</h4>
      <p className="text-sm text-[var(--text-1)]">{conteudo}</p>
    </div>
  )
}

function fmtMoeda(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(centavos / 100).replace(/\u00a0/g, ' ')
}
