// src/app/consultor/components/DataTable.tsx
import { ReactNode, useMemo, useState } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
  align?: 'left' | 'right' | 'center'
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  rowKey: (r: T) => string
  onRowClick?: (r: T) => void
  emptyState?: ReactNode
  pageSize?: number
}

export function DataTable<T>({ data, columns, rowKey, onRowClick, emptyState, pageSize = 20 }: Props<T>) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(data.length / pageSize))
  const pageData = useMemo(
    () => data.slice(page * pageSize, (page + 1) * pageSize),
    [data, page, pageSize],
  )

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[var(--bg-2)]">
            <tr className="border-b border-[var(--border)]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-2)]"
                  style={{ width: c.width, textAlign: c.align ?? 'left' }}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onRowClick(row)
                  }
                }}
                className={`border-b border-[var(--border)] last:border-b-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-[var(--bg-3)]' : ''
                } transition-colors duration-[140ms]`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="px-4 py-3.5 text-[var(--text-0)]"
                    style={{ textAlign: c.align ?? 'left' }}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] text-xs text-[var(--text-2)]">
          <span>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.length)} de {data.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 px-3 rounded-[6px] hover:bg-[var(--bg-3)] disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page >= pages - 1}
              className="h-8 px-3 rounded-[6px] hover:bg-[var(--bg-3)] disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
