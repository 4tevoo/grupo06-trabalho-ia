import { useState, useEffect, useRef } from 'react'
import type { Cotacao } from '../types/cotacao'
import { useDarkMode } from '../hooks/useDarkMode'
import { getStyles } from './AlertasPreco.styles'

interface Props {
    cotacoes: Cotacao[]
}

interface Alerta {
    id: string
    moeda: string
    tipo: 'acima' | 'abaixo'
    valor: number
    ativo: boolean
}

const STORAGE_KEY = 'alertas-preco'
const MOEDAS = ['USD', 'EUR', 'BTC', 'ETH']
const moedaEmoji: Record<string, string> = { USD: '🇺🇸', EUR: '🇪🇺', BTC: '₿', ETH: 'Ξ' }

function carregarAlertas(): Alerta[] {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY)
        return salvo ? JSON.parse(salvo) : []
    } catch { return [] }
}

export function AlertasPreco({ cotacoes }: Props) {
    const { dark } = useDarkMode()
    const st = getStyles(dark)
    const [alertas, setAlertas] = useState<Alerta[]>(carregarAlertas)
    const [moedaSel, setMoedaSel] = useState('USD')
    const [tipo, setTipo] = useState<'acima' | 'abaixo'>('acima')
    const [valorInput, setValorInput] = useState('')
    const [permissao, setPermissao] = useState<NotificationPermission>('default')
    const disparados = useRef<Set<string>>(new Set())

    useEffect(() => {
        if ('Notification' in window) setPermissao(Notification.permission)
    }, [])

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(alertas)) }, [alertas])

    const preco = (moeda: string) => cotacoes.find(c => c.moeda === moeda)?.valor ?? 0
    const brl = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

    useEffect(() => {
        if (permissao !== 'granted' || cotacoes.length === 0) return

        alertas.forEach(alerta => {
            if (!alerta.ativo || disparados.current.has(alerta.id)) return
            const cot = cotacoes.find(c => c.moeda === alerta.moeda)
            if (!cot) return

            const atingiu =
                (alerta.tipo === 'acima' && cot.valor >= alerta.valor) ||
                (alerta.tipo === 'abaixo' && cot.valor <= alerta.valor)

            if (atingiu) {
                disparados.current.add(alerta.id)
                new Notification(`🔔 Alerta — ${alerta.moeda}`, {
                    body: `${moedaEmoji[alerta.moeda]} ${alerta.moeda} ${alerta.tipo === 'acima' ? 'subiu acima' : 'caiu abaixo'} de R$ ${brl(alerta.valor)}. Atual: R$ ${brl(cot.valor)}`,
                })
                setAlertas(prev => prev.map(a => a.id === alerta.id ? { ...a, ativo: false } : a))
            }
        })
    }, [cotacoes, alertas, permissao])

    function criar() {
        const valor = parseFloat(valorInput)
        if (isNaN(valor) || valor <= 0) return
        setAlertas(prev => [...prev, {
            id: `${moedaSel}-${tipo}-${valor}-${Date.now()}`,
            moeda: moedaSel, tipo, valor, ativo: true,
        }])
        setValorInput('')
    }

    function remover(id: string) {
        setAlertas(prev => prev.filter(a => a.id !== id))
        disparados.current.delete(id)
    }

    function reativar(id: string) {
        disparados.current.delete(id)
        setAlertas(prev => prev.map(a => a.id === id ? { ...a, ativo: true } : a))
    }

    return (
        <div style={st.container}>
            <div style={st.header}>
                <h2 style={st.titulo}>🔔 Alertas de Preço</h2>
                {alertas.length > 0 && (
                    <span style={st.contador}>{alertas.filter(a => a.ativo).length} ativo(s)</span>
                )}
            </div>

            {permissao !== 'granted' && (
                <div style={st.permissao}>
                    {permissao === 'denied' ? (
                        <p style={st.permissaoTexto}>⚠️ Notificações bloqueadas. Habilite nas configurações do navegador.</p>
                    ) : (
                        <div style={st.permissaoRow}>
                            <p style={st.permissaoTexto}>Permita notificações para receber alertas de preço.</p>
                            <button onClick={() => Notification.requestPermission().then(setPermissao)} style={st.permissaoBtn}>
                                Permitir
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div style={st.form}>
                <div style={st.selects}>
                    <select value={moedaSel} onChange={e => setMoedaSel(e.target.value)} style={st.selectMoeda}>
                        {MOEDAS.map(m => (
                            <option key={m} value={m}>{moedaEmoji[m]} {m} — R$ {brl(preco(m))}</option>
                        ))}
                    </select>
                    <select value={tipo} onChange={e => setTipo(e.target.value as 'acima' | 'abaixo')} style={st.selectTipo}>
                        <option value="acima">▲ Acima de</option>
                        <option value="abaixo">▼ Abaixo de</option>
                    </select>
                </div>
                <div style={st.inputRow}>
                    <div style={st.inputWrapper}>
                        <span style={st.inputPrefix}>R$</span>
                        <input type="number" min="0" step="any" placeholder="Valor alvo" value={valorInput}
                            onChange={e => setValorInput(e.target.value)} style={st.inputValor} />
                    </div>
                    <button onClick={criar} disabled={!valorInput || parseFloat(valorInput) <= 0} style={st.btnCriar}>
                        Criar alerta
                    </button>
                </div>
            </div>

            {alertas.length === 0 ? (
                <p style={st.vazio}>Nenhum alerta configurado. Crie um alerta para ser notificado.</p>
            ) : (
                <div style={st.lista}>
                    {alertas.map(alerta => {
                        const p = preco(alerta.moeda)
                        const dist = alerta.tipo === 'acima' ? alerta.valor - p : p - alerta.valor
                        const pct = p > 0 ? (dist / p) * 100 : 0

                        return (
                            <div key={alerta.id} style={{ ...st.item, ...(alerta.ativo ? {} : { opacity: 0.6 }) }}>
                                <div style={st.itemInfo}>
                                    <div style={st.itemHeader}>
                                        <span style={st.itemMoeda}>{moedaEmoji[alerta.moeda]} {alerta.moeda}</span>
                                        <span style={{ ...st.itemAlvo, ...(alerta.tipo === 'acima' ? st.positivo : st.negativo) }}>
                                            {alerta.tipo === 'acima' ? '▲' : '▼'} R$ {brl(alerta.valor)}
                                        </span>
                                    </div>
                                    <span style={st.itemDistancia}>
                                        {alerta.ativo
                                            ? `Faltam ${pct > 0 ? pct.toFixed(2) : '0.00'}% (R$ ${brl(Math.max(0, dist))})`
                                            : '✅ Alerta disparado'}
                                    </span>
                                </div>
                                <div style={st.itemAcoes}>
                                    {!alerta.ativo && (
                                        <button onClick={() => reativar(alerta.id)} style={st.btnReativar}>Reativar</button>
                                    )}
                                    <button onClick={() => remover(alerta.id)} style={st.btnRemover}>Remover</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
