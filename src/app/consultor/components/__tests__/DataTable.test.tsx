import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from '../DataTable'

interface Row { id: string; nome: string; idade: number }
const data: Row[] = [
  { id: '1', nome: 'Ana', idade: 30 },
  { id: '2', nome: 'Bruno', idade: 25 },
]

describe('DataTable', () => {
  it('renderiza linhas', () => {
    render(
      <DataTable
        data={data}
        columns={[
          { key: 'nome', header: 'Nome', render: (r) => r.nome },
          { key: 'idade', header: 'Idade', render: (r) => r.idade },
        ]}
        rowKey={(r) => r.id}
      />,
    )
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })

  it('dispara onRowClick', async () => {
    const fn = vi.fn()
    render(
      <DataTable
        data={data}
        columns={[{ key: 'nome', header: 'Nome', render: (r) => r.nome }]}
        rowKey={(r) => r.id}
        onRowClick={fn}
      />,
    )
    await userEvent.click(screen.getByText('Ana'))
    expect(fn).toHaveBeenCalledWith(data[0])
  })

  it('mostra emptyState quando vazio', () => {
    render(
      <DataTable
        data={[]}
        columns={[{ key: 'nome', header: 'Nome', render: (r: Row) => r.nome }]}
        rowKey={(r) => r.id}
        emptyState={<div>Sem dados</div>}
      />,
    )
    expect(screen.getByText('Sem dados')).toBeInTheDocument()
  })
})
