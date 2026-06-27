import { useState } from 'react'
import type { Cotacao } from '../types/cotacao'

interface Props {
    cotacoes: Cotacao[]
}

interface Analise {
    resumo: string
    tendencias: {
        moeda: string
        tendencia: 'alta' | 'baixa' | 'estavel'
        justificativa: string
    }[]
}

export function AnaliseIA({ cotacoes }: Props) {
    const [analise, setAnalise] = useState<Analise | null>(null)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState(false)

    async function gerarAnalise() {
        setLoading(true)
        setErro(false)

        try {
            const ultimasCotacoes = ['USD', 'EUR', 'BTC', 'ETH'].map(moeda => {
                const registros = cotacoes.filter(c => c.moeda === moeda)
                const ultimo = registros[0]
                const variacaoMedia = registros.length > 0
                    ? registros.reduce((acc, c) => acc + c.variacao, 0) / registros.length
                    : 0
                return { moeda, valor: ultimo?.valor ?? 0, variacao: ultimo?.variacao ?? 0, variacaoMedia }
            })

            const prompt = `Você é um analista financeiro especializado em câmbio e criptomoedas.
Com base nos dados abaixo de cotações em reais (BRL), gere:
1. Um resumo do mercado hoje em 2-3 frases
2. A tendência de cada moeda (alta, baixa ou estável) com uma justificativa curta

Dados atuais:
${ultimasCotacoes.map(c =>
                `${c.moeda}: R$ ${c.valor.toFixed(2)} | variação atual: ${c.variacao.toFixed(2)}% | variação média do histórico: ${c.variacaoMedia.toFixed(2)}%`
            ).join('\n')}

Responda APENAS em JSON válido neste formato exato, sem texto fora do JSON:
{
  "resumo": "texto do resumo aqui",
  "tendencias": [
    { "moeda": "USD", "tendencia": "alta", "justificativa": "texto" },
    { "moeda": "EUR", "tendencia": "baixa", "justificativa": "texto" },
    { "moeda": "BTC", "tendencia": "estavel", "justificativa": "texto" },
    { "moeda": "ETH", "tendencia": "alta", "justificativa": "texto" }
  ]
}`

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 1000,
                    messages: [{ role: 'user', content: prompt }],
                }),
            })

            const data = await response.json()
            const texto = data.content[0].text.replace(/```json|```/g, '').trim()
            const parsed: Analise = JSON.parse(texto)
            setAnalise(parsed)
        } catch {
            setErro(true)
        } finally {
            setLoading(false)
        }
    }

    const tendenciaConfig = {
        alta: { cor: 'text-green-500', icone: '📈' },
        baixa: { cor: 'text-red-500', icone: '📉' },
        estavel: { cor: 'text-yellow-500', icone: '➡️' },
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-200">
                    🧠 Análise de IA
                </h2>
                <button
                    onClick={gerarAnalise}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    {loading ? 'Analisando...' : 'Gerar análise'}
                </button>
            </div>

            {erro && (
                <p className="text-red-500 text-sm">Erro ao gerar análise. Tente novamente.</p>
            )}

            {!analise && !loading && !erro && (
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Clique em "Gerar análise" para obter um resumo do mercado com tendências baseadas no histórico de hoje.
                </p>
            )}

            {loading && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <span className="animate-spin">⏳</span>
                    <span>Analisando o mercado...</span>
                </div>
            )}

            {analise && (
                <div className="flex flex-col gap-4">
                    {/* Resumo */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {analise.resumo}
                        </p>
                    </div>

                    {/* Tendências */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {analise.tendencias.map(t => {
                            const config = tendenciaConfig[t.tendencia]
                            return (
                                <div
                                    key={t.moeda}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex flex-col gap-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                            {t.moeda}
                                        </span>
                                        <span className={`text-sm font-semibold ${config.cor}`}>
                                            {config.icone} {t.tendencia}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t.justificativa}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}