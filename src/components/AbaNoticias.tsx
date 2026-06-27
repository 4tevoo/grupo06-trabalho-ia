import { useEffect, useState, useCallback } from 'react'

interface Noticia {
  title: string
  description: string
  link: string
  source_name: string
  pubDate: string
  image_url: string | null
  category: string[]
}

interface ResumoState {
  texto: string | null
  loading: boolean
  erro: boolean
}

const CATEGORIAS = [
  { valor: '', label: '🌐 Todas' },
  { valor: 'business', label: '💼 Negócios' },
  { valor: 'technology', label: '💻 Tecnologia' },
  { valor: 'top', label: '🔥 Destaques' },
]

const BUSCAS_RAPIDAS = ['Bitcoin', 'Dollar', 'Stock Market', 'Ethereum', 'Inflation', 'Fed']

export function AbaNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [erro, setErro] = useState(false)
  const [busca, setBusca] = useState('bitcoin crypto finance')
  const [inputBusca, setInputBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [totalResultados, setTotalResultados] = useState<number | null>(null)
  const [resumos, setResumos] = useState<Record<number, ResumoState>>({})

  const buscarNoticias = useCallback(async (pagina?: string, acumular = false) => {
    if (!acumular) {
      setLoading(true)
      setErro(false)
      setNoticias([])
      setResumos({})
    } else {
      setCarregandoMais(true)
    }

    try {
      const key = import.meta.env.VITE_GNEWS_API_KEY
      const params = new URLSearchParams({ apikey: key, q: busca, language: 'en' })
      if (categoria) params.set('category', categoria)
      if (pagina) params.set('page', pagina)

      const res = await fetch(`https://newsdata.io/api/1/news?${params}`)
      const data = await res.json()

      if (data.status === 'error') throw new Error(data.results?.message ?? 'Erro desconhecido')

      const resultados: Noticia[] = (data.results ?? []).map((item: Record<string, unknown>) => ({
        title: (item.title as string) ?? '',
        description: (item.description as string) ?? '',
        link: (item.link as string) ?? '#',
        source_name: (item.source_name as string) ?? (item.source_id as string) ?? 'Fonte desconhecida',
        pubDate: (item.pubDate as string) ?? '',
        image_url: (item.image_url as string | null) ?? null,
        category: (item.category as string[]) ?? [],
      }))

      if (acumular) {
        setNoticias(prev => [...prev, ...resultados])
      } else {
        setNoticias(resultados)
      }

      setNextPage((data.nextPage as string | null) ?? null)
      setTotalResultados((data.totalResults as number | null) ?? null)
    } catch {
      setErro(true)
    } finally {
      setLoading(false)
      setCarregandoMais(false)
    }
  }, [busca, categoria])

  useEffect(() => {
    buscarNoticias()
  }, [buscarNoticias])

  function handlePesquisa(e: React.FormEvent) {
    e.preventDefault()
    setBusca(inputBusca.trim() || 'bitcoin crypto finance')
  }

  function handleBuscaRapida(termo: string) {
    setInputBusca(termo)
    setBusca(termo)
  }

  async function handleResumir(index: number, noticia: Noticia) {
    // Se já tem resumo, toggle (esconde/mostra)
    if (resumos[index]?.texto) {
      setResumos(prev => {
        const atual = prev[index]
        if (!atual) return prev
        return { ...prev, [index]: { ...atual, texto: null, loading: false, erro: false } }
      })
      return
    }

    setResumos(prev => ({ ...prev, [index]: { texto: null, loading: true, erro: false } }))

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

      const prompt = `Você é um analista financeiro. Acesse e analise o conteúdo da seguinte notícia financeira.

Título: ${noticia.title}
Fonte: ${noticia.source_name}
Descrição: ${noticia.description}
Link: ${noticia.link}

Com base nessas informações, gere:
1. Um resumo claro e objetivo da notícia em 2-3 frases
2. Os 3 principais pontos ou destaques da notícia
3. Uma breve análise do possível impacto no mercado financeiro

Responda em português brasileiro. Seja direto e conciso.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!response.ok) throw new Error('Erro na API')

      const data = await response.json()
      const texto = data.content?.[0]?.text ?? 'Não foi possível gerar o resumo.'

      setResumos(prev => ({ ...prev, [index]: { texto, loading: false, erro: false } }))
    } catch {
      setResumos(prev => ({ ...prev, [index]: { texto: null, loading: false, erro: true } }))
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Barra de busca e filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-200">
            📰 Notícias Financeiras
          </h2>
          <button
            onClick={() => buscarNoticias()}
            disabled={loading}
            className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:opacity-40 transition-opacity"
            title="Atualizar notícias"
          >
            🔄 Atualizar
          </button>
        </div>

        <form onSubmit={handlePesquisa} className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputBusca}
            onChange={e => setInputBusca(e.target.value)}
            placeholder="Pesquisar notícias..."
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            🔍
          </button>
        </form>

        {/* Buscas rápidas */}
        <div className="flex flex-wrap gap-2 mb-3">
          {BUSCAS_RAPIDAS.map(termo => (
            <button
              key={termo}
              onClick={() => handleBuscaRapida(termo)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${busca === termo
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {termo}
            </button>
          ))}
        </div>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.valor}
              onClick={() => setCategoria(cat.valor)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${categoria === cat.valor
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contador de resultados */}
      {totalResultados !== null && !erro && !loading && (
        <p className="text-xs text-gray-400 dark:text-gray-500 px-1">
          {totalResultados.toLocaleString('pt-BR')} resultado{totalResultados !== 1 ? 's' : ''} encontrado{totalResultados !== 1 ? 's' : ''} · mostrando {noticias.length}
        </p>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado de erro */}
      {erro && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <p className="text-red-500 font-semibold mb-2">❌ Erro ao carregar notícias</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
            Verifique sua chave de API (<code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">VITE_GNEWS_API_KEY</code>) e conexão com a internet.
          </p>
          <button
            onClick={() => buscarNoticias()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            🔄 Tentar novamente
          </button>
        </div>
      )}

      {/* Estado vazio */}
      {!loading && !erro && noticias.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            📭 Nenhuma notícia encontrada para "<strong>{busca}</strong>".
          </p>
        </div>
      )}

      {/* Lista de notícias */}
      {!loading && noticias.map((n, i) => {
        const resumo = resumos[i]
        return (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {n.image_url && (
                <img
                  src={n.image_url}
                  alt={n.title}
                  className="w-24 h-20 md:w-32 md:h-24 object-cover rounded-xl flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full truncate max-w-[140px]">
                    {n.source_name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                    {n.pubDate ? new Date(n.pubDate).toLocaleString('pt-BR') : '—'}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white mb-1 leading-snug line-clamp-2">
                  {n.title}
                </h3>
                {n.description && (
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {n.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    Ler mais →
                  </a>
                  {n.category.length > 0 && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">
                      {n.category[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botão Resumir */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => handleResumir(i, n)}
                disabled={resumo?.loading}
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-60 ${
                  resumo?.texto
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/60'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {resumo?.loading ? (
                  <>
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Analisando...
                  </>
                ) : resumo?.texto ? (
                  <>🧠 Ocultar resumo</>
                ) : (
                  <>🧠 Resumir</>
                )}
              </button>

              {/* Área do resumo */}
              {resumo?.loading && (
                <div className="mt-3 space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
              )}

              {resumo?.erro && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
                  ❌ Não foi possível gerar o resumo. Verifique a chave <code className="font-mono">VITE_ANTHROPIC_API_KEY</code>.
                </div>
              )}

              {resumo?.texto && (
                <div className="mt-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">🧠 Resumo IA</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {resumo.texto}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Botão carregar mais */}
      {nextPage && !erro && !loading && (
        <button
          onClick={() => buscarNoticias(nextPage, true)}
          disabled={carregandoMais}
          className="w-full py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-2xl shadow hover:shadow-md transition-shadow disabled:opacity-60"
        >
          {carregandoMais ? '⏳ Carregando...' : '⬇️ Carregar mais notícias'}
        </button>
      )}

    </div>
  )
}