import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SettingsProvider } from '@/app/settings-context'
import BiblePage from './bible-page'

describe('BiblePage', () => {
  it('mostra os dois testamentos e filtra livros', async () => {
    render(<MemoryRouter><SettingsProvider><BiblePage /></SettingsProvider></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Antigo Testamento' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Novo Testamento' })).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Pesquisar livro'), 'João')
    expect(screen.getByText('João').closest('a')).toHaveAttribute('href', '/biblia/joao')
    expect(screen.queryByRole('link', { name: /Gênesis/ })).not.toBeInTheDocument()
  })
})
