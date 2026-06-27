import { render, screen } from '@testing-library/react'
import { CotacaoCard } from '../components/CotacaoCard'

const cotacaoMock = {
  id: '1',
  moeda: 'USD',
  valor: 5.23,
  variacao: 0.45,
  criado_em: new Date().toISOString(),
}

describe('CotacaoCard', () => {
  it('renderiza o nome da moeda', () => {
    render(<CotacaoCard cotacao={cotacaoMock} max={5.50} min={5.10} />)
    expect(screen.getByText(/USD/)).toBeInTheDocument()
  })

  it('renderiza o valor formatado', () => {
    render(<CotacaoCard cotacao={cotacaoMock} max={5.50} min={5.10} />)
    expect(screen.getByText(/5\.23/)).toBeInTheDocument()
  })

  it('mostra variação positiva em verde', () => {
    render(<CotacaoCard cotacao={cotacaoMock} max={5.50} min={5.10} />)
    expect(screen.getByText(/0\.45/)).toHaveClass('text-green-500')
  })

  it('mostra variação negativa em vermelho', () => {
    const cotacaoNegativa = { ...cotacaoMock, variacao: -0.30 }
    render(<CotacaoCard cotacao={cotacaoNegativa} max={5.50} min={5.10} />)
    expect(screen.getByText(/0\.30/)).toHaveClass('text-red-500')
  })

  it('renderiza máxima e mínima do dia', () => {
    render(<CotacaoCard cotacao={cotacaoMock} max={5.50} min={5.10} />)
    expect(screen.getByText(/Max: R\$ 5\.50/)).toBeInTheDocument()
    expect(screen.getByText(/Min: R\$ 5\.10/)).toBeInTheDocument()
  })
})