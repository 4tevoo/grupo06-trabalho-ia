import { useState } from "react";
import type { Cotacao } from "../types/cotacao";

interface Props {
  cotacoes: Cotacao[];
}

export function ComparadorIA({ cotacoes }: Props) {
  const [ativo1, setAtivo1] = useState("BTC");
  const [ativo2, setAtivo2] = useState("ETH");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparando, setComparando] = useState(false);

  const comparar = async () => {
    setComparando(true);
    setLoading(true);
    try {
      const moeda1 = cotacoes.find((c) => c.moeda === ativo1);
      const moeda2 = cotacoes.find((c) => c.moeda === ativo2);

      const prompt = `
        Você é um especialista em mercado financeiro.
        Compare os dois ativos abaixo.

        ATIVO 1
        Nome: ${moeda1?.moeda}
        Preço: ${moeda1?.valor}
        Variação: ${moeda1?.variacao}

        ATIVO 2
        Nome: ${moeda2?.moeda}
        Preço: ${moeda2?.valor}
        Variação: ${moeda2?.variacao}

        Responda em tópicos curtos e diretos, usando este formato EXATO:

        🔍 DIFERENÇAS
        • [diferença 1]
        • [diferença 2]

        ✅ VANTAGENS DE ${moeda1?.moeda}
        • [vantagem 1]
        • [vantagem 2]

        ✅ VANTAGENS DE ${moeda2?.moeda}
        • [vantagem 1]
        • [vantagem 2]

        🛡️ MAIS ESTÁVEL
        • [qual e por quê, em 1 linha]

        📌 CONCLUSÃO
        • [conclusão em 1 ou 2 linhas]

        Seja direto. Sem introdução, sem texto fora dos tópicos.
        `;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      setResultado(data.choices[0].message.content);
    } finally {
      setLoading(false);
    }
  };

  const sair = () => {
    setComparando(false);
    setResultado("");
  };

  const renderResultado = () => {
    return resultado.split("\n").map((linha, i) => {
      const ehTitulo = /^[🔍✅🛡️📌]/.test(linha);
      const ehBullet = linha.trim().startsWith("•");

      if (ehTitulo) {
        return (
          <p key={i} className="font-bold text-gray-800 dark:text-white mt-4 mb-1 text-sm">
            {linha}
          </p>
        );
      }
      if (ehBullet) {
        return (
          <p key={i} className="text-gray-600 dark:text-gray-300 text-sm pl-2">
            {linha}
          </p>
        );
      }
      if (linha.trim() === "") return <div key={i} className="h-1" />;
      return (
        <p key={i} className="text-gray-600 dark:text-gray-300 text-sm">
          {linha}
        </p>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">📈 Comparador Inteligente</h2>
      </div>

      {!comparando && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <select
              value={ativo1}
              onChange={(e) => setAtivo1(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
            >
              <option>BTC</option>
              <option>ETH</option>
              <option>USD</option>
              <option>EUR</option>
            </select>

            <select
              value={ativo2}
              onChange={(e) => setAtivo2(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
            >
              <option>BTC</option>
              <option>ETH</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>

          <button
            onClick={comparar}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Comparar
          </button>
        </div>
      )}

      {comparando && (
        <div className="mt-2">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
              Comparando {ativo1} e {ativo2}...
            </p>
          ) : (
            <div className="mb-4">{renderResultado()}</div>
          )}

          <button
            onClick={sair}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors mt-2"
          >
            ✕ Sair
          </button>
        </div>
      )}
    </div>
  );
}