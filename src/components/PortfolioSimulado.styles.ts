import type { CSSProperties } from 'react'

type Styles = Record<string, CSSProperties>

export function getStyles(dark: boolean): Styles {
    const bg = dark ? '#1f2937' : '#fff'
    const bgSub = dark ? '#374151' : '#f9fafb'
    const bgInput = dark ? '#374151' : '#f3f4f6'
    const txt = dark ? '#e5e7eb' : '#374151'
    const txtSub = dark ? '#9ca3af' : '#6b7280'
    const txtMuted = dark ? '#6b7280' : '#9ca3af'
    const txtBold = dark ? '#fff' : '#111827'

    return {
        container: {
            background: bg,
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1rem',
        },

        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
        },

        titulo: {
            fontSize: '1.125rem',
            fontWeight: 700,
            color: txt,
            margin: 0,
        },

        limpar: {
            fontSize: '0.75rem',
            color: '#f87171',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },

        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.25rem',
        },

        modoGroup: {
            display: 'flex',
            gap: '0.5rem',
        },

        modoBtn: {
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
        },

        modoBtnComprar: {
            background: '#16a34a',
            color: '#fff',
        },

        modoBtnVender: {
            background: '#dc2626',
            color: '#fff',
        },

        modoBtnInativo: {
            background: bgInput,
            color: txt,
        },

        inputs: {
            display: 'flex',
            gap: '0.5rem',
        },

        select: {
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.75rem',
            background: bgInput,
            color: txt,
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
        },

        inputQtd: {
            width: '7rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.75rem',
            background: bgInput,
            color: txt,
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
        },

        btnAcaoComprar: {
            padding: '0.5rem 1rem',
            background: '#16a34a',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
        },

        btnAcaoVender: {
            padding: '0.5rem 1rem',
            background: '#dc2626',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
        },

        custo: {
            fontSize: '0.75rem',
            color: txtMuted,
        },

        vazio: {
            fontSize: '0.875rem',
            color: txtMuted,
        },

        resumo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },

        total: {
            background: bgSub,
            borderRadius: '0.75rem',
            padding: '1rem',
        },

        totalHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
        },

        totalLabel: {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: txtSub,
        },

        totalVar: {
            fontSize: '0.875rem',
            fontWeight: 700,
        },

        totalValor: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: txtBold,
            display: 'block',
        },

        totalDetalhe: {
            display: 'flex',
            gap: '1rem',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: txtMuted,
        },

        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '0.75rem',
        },

        ativo: {
            background: bgSub,
            borderRadius: '0.75rem',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
        },

        ativoHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        ativoNome: {
            fontSize: '0.875rem',
            fontWeight: 700,
            color: txt,
        },

        ativoVar: {
            fontSize: '0.75rem',
            fontWeight: 600,
        },

        ativoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: txtSub,
        },

        ativoLucro: {
            fontSize: '0.75rem',
            fontWeight: 600,
        },

        positivo: {
            color: '#22c55e',
        },

        negativo: {
            color: '#ef4444',
        },
    }
}
