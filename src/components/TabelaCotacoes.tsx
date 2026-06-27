import type { Cotacao } from '../types/cotacao'

interface Props {
    cotacoes: Cotacao[]
}

export function TabelaCotacoes({ cotacoes }: Props) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
                Cotações
            </h2>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="pb-2 text-gray-400 dark:text-gray-500">Moeda</th>
                        <th className="pb-2 text-gray-400 dark:text-gray-500">Valor</th>
                        <th className="pb-2 text-gray-400 dark:text-gray-500">Variação</th>
                        <th className="pb-2 text-gray-400 dark:text-gray-500 hidden md:table-cell">Atualização</th>
                    </tr>
                </thead>
                <tbody>
                    {cotacoes.map(c => (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-2 font-semibold text-gray-800 dark:text-gray-200">{c.moeda}</td>
                            <td className="py-2 text-gray-700 dark:text-gray-300">{c.valor.toFixed(2)}</td>
                            <td className={`py-2 font-semibold ${c.variacao >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {c.variacao >= 0 ? '+' : ''}{c.variacao.toFixed(2)}%
                            </td>
                            <td className="py-2 text-gray-400 dark:text-gray-500 hidden md:table-cell">
                                {new Date(c.criado_em).toLocaleString('pt-BR')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}