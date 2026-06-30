import { useState, useEffect, useCallback } from 'react'
import type { Cotacao } from '../types/cotacao'
import { useDarkMode } from '../hooks/useDarkMode'
import { getStyles } from './PortfolioSimulado.styles'

interface Props {
    cotacoes: Cotacao[]
}

interface Ativo {
    moeda: string
    quantidade: number
    precoMedio: number
}

const STORAGE_KEY = 'portfolio-simulado'
const MOEDAS = ['USD', 'EUR', 'BTC', 'ETH']
const moedaEmoji: Record<string, string> = { USD: '🇺🇸', EUR: '🇪🇺', BTC: '₿', ETH: 'Ξ' }

function carregarPortfolio(): Ativo[] {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY)
        return salvo ? JSON.parse(salvo) : []
    } catch { return [] }
}

export function PortfolioSimulado({ cotacoes }: Props) {
    const { dark } = useDarkMode()
    const st = getStyles(dark)
    const [ativos, setAtivos] = useState<Ativo[]>(carregarPortfolio)
    const [moedaSel, setMoedaSel] = useState('USD')
    const [qtdInput, setQtdInput] = useState('')
    const [modo, setModo] = useState<'comprar' | 'vender'>('comprar')

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(ativos)) }, [ativos])

    const preco = useCallback(
        (moeda: string) => cotacoes.find(c => c.moeda === moeda)?.valor ?? 0,
        [cotacoes]
    )

    function executar() {
        const qtd = parseFloat(qtdInput)
        if (isNaN(qtd) || qtd <= 0) return
        const p = preco(moedaSel)

        if (modo === 'comprar') {
            if (p === 0) return
            setAtivos(prev => {
                const ex = prev.find(a => a.moeda === moedaSel)
                if (ex) {
                    const nQtd = ex.quantidade + qtd
                    const nPM = (ex.precoMedio * ex.quantidade + p * qtd) / nQtd
                    return prev.map(a => a.moeda === moedaSel ? { ...a, quantidade: nQtd, precoMedio: nPM } : a)
                }
                return [...prev, { moeda: moedaSel, quantidade: qtd, precoMedio: p }]
            })
        } else {
            const ex = ativos.find(a => a.moeda === moedaSel)
            if (!ex || ex.quantidade < qtd) return
            setAtivos(prev => {
                const nQtd = ex.quantidade - qtd
                return nQtd <= 0
                    ? prev.filter(a => a.moeda !== moedaSel)
                    : prev.map(a => a.moeda === moedaSel ? { ...a, quantidade: nQtd } : a)
            })
        }
        setQtdInput('')
    }

    const resumo = ativos.map(a => {
        const atual = preco(a.moeda)
        const investido = a.quantidade * a.precoMedio
        const valorAtual = a.quantidade * atual
        const lucro = valorAtual - investido
        const pct = investido > 0 ? (lucro / investido) * 100 : 0
        return { ...a, atual, investido, valorAtual, lucro, pct }
    })

    const totalInv = resumo.reduce((a, r) => a + r.investido, 0)
    const totalAtual = resumo.reduce((a, r) => a + r.valorAtual, 0)
    const lucroTotal = totalAtual - totalInv
    const pctTotal = totalInv > 0 ? (lucroTotal / totalInv) * 100 : 0
    const podeVender = ativos.some(a => a.moeda === moedaSel && a.quantidade > 0)
    const cor = (v: number) => v >= 0 ? st.positivo : st.negativo
    const seta = (v: number) => v >= 0 ? '▲' : '▼'
    const brl = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

    return (
        <div style={st.container}>
            <div style={st.header}>
                <h2 style={st.titulo}>📊 Portfólio Simulado</h2>
                {ativos.length > 0 && (
                    <button onClick={() => setAtivos([])} style={st.limpar}>Limpar tudo</button>
                )}
            </div>

            <div style={st.form}>
                <div style={st.modoGroup}>
                    <button onClick={() => setModo('comprar')}
                        style={{ ...st.modoBtn, ...(modo === 'comprar' ? st.modoBtnComprar : st.modoBtnInativo) }}>
                        Comprar
                    </button>
                    <button onClick={() => setModo('vender')}
                        style={{ ...st.modoBtn, ...(modo === 'vender' ? st.modoBtnVender : st.modoBtnInativo) }}>
                        Vender
                    </button>
                </div>
                <div style={st.inputs}>
                    <select value={moedaSel} onChange={e => setMoedaSel(e.target.value)} style={st.select}>
                        {MOEDAS.map(m => (
                            <option key={m} value={m}>{moedaEmoji[m]} {m} — R$ {brl(preco(m))}</option>
                        ))}
                    </select>
                    <input type="number" min="0" step="any" placeholder="Quantidade" value={qtdInput}
                        onChange={e => setQtdInput(e.target.value)} style={st.inputQtd} />
                    <button onClick={executar}
                        disabled={!qtdInput || parseFloat(qtdInput) <= 0 || (modo === 'vender' && !podeVender)}
                        style={modo === 'comprar' ? st.btnAcaoComprar : st.btnAcaoVender}>
                        {modo === 'comprar' ? 'Comprar' : 'Vender'}
                    </button>
                </div>
                {qtdInput && parseFloat(qtdInput) > 0 && (
                    <p style={st.custo}>Custo total: R$ {brl(parseFloat(qtdInput) * preco(moedaSel))}</p>
                )}
            </div>

            {ativos.length === 0 ? (
                <p style={st.vazio}>Nenhum ativo na carteira. Compre um ativo acima para começar a simular.</p>
            ) : (
                <div style={st.resumo}>
                    <div style={st.total}>
                        <div style={st.totalHeader}>
                            <span style={st.totalLabel}>Valor total da carteira</span>
                            <span style={{ ...st.totalVar, ...cor(lucroTotal) }}>{seta(lucroTotal)} {Math.abs(pctTotal).toFixed(2)}%</span>
                        </div>
                        <span style={st.totalValor}>R$ {brl(totalAtual)}</span>
                        <div style={st.totalDetalhe}>
                            <span>Investido: R$ {brl(totalInv)}</span>
                            <span style={cor(lucroTotal)}>Lucro: R$ {brl(lucroTotal)}</span>
                        </div>
                    </div>
                    <div style={st.grid}>
                        {resumo.map(a => (
                            <div key={a.moeda} style={st.ativo}>
                                <div style={st.ativoHeader}>
                                    <span style={st.ativoNome}>{moedaEmoji[a.moeda]} {a.moeda}</span>
                                    <span style={{ ...st.ativoVar, ...cor(a.lucro) }}>{seta(a.lucro)} {Math.abs(a.pct).toFixed(2)}%</span>
                                </div>
                                <div style={st.ativoRow}>
                                    <span>Qtd: {a.quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}</span>
                                    <span>PM: R$ {brl(a.precoMedio)}</span>
                                </div>
                                <div style={st.ativoRow}>
                                    <span>Investido: R$ {brl(a.investido)}</span>
                                    <span>Atual: R$ {brl(a.valorAtual)}</span>
                                </div>
                                <span style={{ ...st.ativoLucro, ...cor(a.lucro) }}>Lucro: R$ {brl(a.lucro)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
