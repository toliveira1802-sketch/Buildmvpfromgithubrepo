import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  it('chama onChange', async () => {
    const fn = vi.fn()
    render(<SearchInput value="" onChange={fn} placeholder="Buscar" />)
    await userEvent.type(screen.getByPlaceholderText('Buscar'), 'a')
    expect(fn).toHaveBeenCalled()
  })
})
