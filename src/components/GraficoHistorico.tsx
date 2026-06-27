import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts'
import type { Cotacao } from '../types/cotacao'

interface Props {
    cotacoes: Cotacao[]
}

const CORES: Record<string, string> = {
    USD: '#3b82f6',
    EUR: '#8b5cf6',
    BTC: '#f59e0b',
    ETH: '#10b981',
}

export function GraficoHistorico({ cotacoes }: Props) {
    const dadosAgrupados = cotacoes.reduce((acc, c) => {
        const hora = new Date(c.criado_em).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        })
        const existente = acc.find(d => d.hora === hora)
        if (existente) {
            existente[c.moeda] = c.valor
        } else {
            acc.push({ hora, [c.moeda]: c.valor })
        }
        return acc
    }, [] as Record<string, any>[])

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
                Histórico de Cotações
            </h2>

            <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">💵 Moedas (USD / EUR)</p>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dadosAgrupados}>
                        <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
                        <YAxis
                            tick={{ fontSize: 10 }}
                            width={55}
                            tickFormatter={v => `R$${v.toFixed(2)}`}
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                name
                            ]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="USD" stroke={CORES.USD} dot={false} strokeWidth={2} />
                        <Line type="monotone" dataKey="EUR" stroke={CORES.EUR} dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">🪙 Cripto (BTC / ETH)</p>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dadosAgrupados}>
                        <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
                        <YAxis
                            tick={{ fontSize: 10 }}
                            width={70}
                            tickFormatter={v =>
                                v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v.toFixed(0)}`
                            }
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                name
                            ]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="BTC" stroke={CORES.BTC} dot={false} strokeWidth={2} />
                        <Line type="monotone" dataKey="ETH" stroke={CORES.ETH} dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}