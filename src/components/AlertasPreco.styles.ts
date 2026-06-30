import type { CSSProperties } from 'react'

type Styles = Record<string, CSSProperties>

export function getStyles(dark: boolean): Styles {
    const bg = dark ? '#1f2937' : '#fff'
    const bgSub = dark ? '#374151' : '#f9fafb'
    const bgInput = dark ? '#374151' : '#f3f4f6'
    const txt = dark ? '#e5e7eb' : '#374151'
    const txtMuted = dark ? '#6b7280' : '#9ca3af'
    const bgWarn = dark ? 'rgba(120,53,15,0.2)' : '#fefce8'
    const txtWarn = dark ? '#fbbf24' : '#a16207'

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

        contador: {
            fontSize: '0.75rem',
            color: txtMuted,
        },

        permissao: {
            background: bgWarn,
            borderRadius: '0.75rem',
            padding: '0.75rem',
            marginBottom: '1rem',
        },

        permissaoTexto: {
            fontSize: '0.75rem',
            color: txtWarn,
            margin: 0,
        },

        permissaoRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        permissaoBtn: {
            padding: '0.25rem 0.75rem',
            background: '#eab308',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
        },

        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.25rem',
        },

        selects: {
            display: 'flex',
            gap: '0.5rem',
        },

        selectMoeda: {
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.75rem',
            background: bgInput,
            color: txt,
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
        },

        selectTipo: {
            padding: '0.5rem 0.75rem',
            borderRadius: '0.75rem',
            background: bgInput,
            color: txt,
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
        },

        inputRow: {
            display: 'flex',
            gap: '0.5rem',
        },

        inputWrapper: {
            position: 'relative',
            flex: 1,
        },

        inputPrefix: {
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.875rem',
            color: txtMuted,
        },

        inputValor: {
            width: '100%',
            paddingLeft: '2.25rem',
            paddingRight: '0.75rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            borderRadius: '0.75rem',
            background: bgInput,
            color: txt,
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
        },

        btnCriar: {
            padding: '0.5rem 1rem',
            background: '#2563eb',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
        },

        vazio: {
            fontSize: '0.875rem',
            color: txtMuted,
        },

        lista: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
        },

        item: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            background: bgSub,
        },

        itemInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem',
        },

        itemHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },

        itemMoeda: {
            fontSize: '0.875rem',
            fontWeight: 700,
            color: txt,
        },

        itemAlvo: {
            fontSize: '0.75rem',
            fontWeight: 600,
        },

        itemDistancia: {
            fontSize: '0.75rem',
            color: txtMuted,
        },

        itemAcoes: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },

        btnReativar: {
            fontSize: '0.75rem',
            color: '#3b82f6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },

        btnRemover: {
            fontSize: '0.75rem',
            color: '#f87171',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },

        positivo: {
            color: '#22c55e',
        },

        negativo: {
            color: '#ef4444',
        },
    }
}
