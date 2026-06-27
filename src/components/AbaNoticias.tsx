import { useEffect, useState } from 'react'

interface Noticia {
  title: string
  description: string
  link: string
  source_name: string
  pubDate: string
}

export function AbaNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    async function buscarNoticias() {
      try {
        const key = import.meta.env.VITE_GNEWS_API_KEY
        const res = await fetch(
          `https://newsdata.io/api/1/news?apikey=${key}&q=bitcoin+crypto+finance&language=en`
        )
        const data = await res.json()
        setNoticias(data.results ?? [])
      } catch {
        setErro(true)
      } finally {
        setLoading(false)
      }
    }

    buscarNoticias()
  }, [])

  if (loading) return <p className="text-gray-500">Carregando notícias...</p>
  if (erro) return <p className="text-red-500">Erro ao carregar notícias.</p>
  if (noticias.length === 0) return <p className="text-gray-500">Nenhuma notícia encontrada.</p>

  return (
    <div className="flex flex-col gap-4">
      {noticias.map((n, i) => (
        <a
          key={i}
          href={n.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-5 hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">
              {n.source_name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(n.pubDate).toLocaleString('pt-BR')}
            </span>
          </div>
          <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white mb-1 leading-snug">
            {n.title}
          </h3>
          {
            n.description && (
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {n.description}
              </p>
            )
          }
          <span className="text-xs text-blue-400 mt-2 inline-block">Ler mais →</span>
        </a>
      ))}
    </div>
  )
}