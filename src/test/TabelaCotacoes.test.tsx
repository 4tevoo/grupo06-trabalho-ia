import { render, screen } from '@testing-library/react'
import { TabelaCotacoes } from '../components/TabelaCotacoes'

const cotacoesMock = [
  { id: '1', moeda: 'USD', valor: 5.23, variacao: 0.45, criado_em: new Date().toISOString() },
  { id: '2', moeda: 'BTC', valor: 310000, variacao: -1.20, criado_em: new Date().toISOString() },
]

describe('TabelaCotacoes', () => {
  it('renderiza todas as moedas', () => {
    render(<TabelaCotacoes cotacoes={cotacoesMock} />)
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.getByText('BTC')).toBeInTheDocument()
  })

  it('renderiza o título', () => {
    render(<TabelaCotacoes cotacoes={cotacoesMock} />)
    expect(screen.getByText(/Cotações/)).toBeInTheDocument()
  })

  it('mostra apenas o header quando lista está vazia', () => {
    render(<TabelaCotacoes cotacoes={[]} />)
    expect(screen.getByText('Moeda')).toBeInTheDocument()
    expect(screen.queryByText('USD')).not.toBeInTheDocument()
  })
})