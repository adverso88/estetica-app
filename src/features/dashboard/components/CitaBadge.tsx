'use client'
import type { CitaEstado } from '@/types/database'
import { ESTADO_CITA_COLORS } from '@/types/database'

export function CitaBadge({ estado }: { estado: CitaEstado }) {
    const colors = ESTADO_CITA_COLORS[estado]
    return (
        <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
            {colors.label}
        </span>
    )
}
