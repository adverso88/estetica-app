'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TIPOS_PIEL, FUENTES_CAPTACION } from '@/types/database'
import type { CreatePacienteDTO } from '@/types/database'

export default function NuevoPacientePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState<CreatePacienteDTO>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        alergias: '',
        medicamentos: '',
        condiciones: '',
        tipo_piel: '',
        fuente_captacion: 'directa',
        notas: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nombre || !form.apellido) {
            setError('Nombre y apellido son requeridos')
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            const supabase = createClient()
            // Limpiar campos vacíos
            const data = Object.fromEntries(
                Object.entries(form).filter(([, v]) => v !== '' && v !== null && v !== undefined)
            )
            console.log('Insertando paciente:', data)
            const { error: err } = await supabase.from('pacientes').insert(data)
            if (err) throw err
            router.push('/pacientes')
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al guardar')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <button onClick={() => router.back()} className="btn-ghost mb-4 -ml-2">
                    ← Volver
                </button>
                <h1 className="font-heading text-3xl font-semibold text-foreground">Nuevo Paciente</h1>
                <p className="text-foreground-secondary text-sm mt-1">Registra los datos del paciente en la ficha clínica</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos personales */}
                <div className="card-elevated p-6 space-y-5">
                    <h2 className="font-heading font-semibold text-foreground text-lg border-b border-border-light pb-3">
                        Datos Personales
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                                Nombre <span className="text-primary-500">*</span>
                            </label>
                            <input name="nombre" value={form.nombre} onChange={handleChange}
                                type="text" className="input-field" placeholder="María" required />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                                Apellido <span className="text-primary-500">*</span>
                            </label>
                            <input name="apellido" value={form.apellido} onChange={handleChange}
                                type="text" className="input-field" placeholder="García" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                                Email
                            </label>
                            <input name="email" value={form.email} onChange={handleChange}
                                type="email" className="input-field" placeholder="maria@email.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                                Teléfono / WhatsApp
                            </label>
                            <input name="telefono" value={form.telefono} onChange={handleChange}
                                type="tel" className="input-field" placeholder="+57 300 123 4567" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                                Fecha de nacimiento
                            </label>
                            <input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange}
                                type="date" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                                Tipo de piel
                            </label>
                            <select name="tipo_piel" value={form.tipo_piel} onChange={handleChange} className="input-field">
                                <option value="">Seleccionar...</option>
                                {TIPOS_PIEL.map(t => (
                                    <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            ¿Cómo nos conociste?
                        </label>
                        <select name="fuente_captacion" value={form.fuente_captacion} onChange={handleChange} className="input-field">
                            {FUENTES_CAPTACION.map(f => (
                                <option key={f} value={f} className="capitalize">{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ficha clínica */}
                <div className="card-elevated p-6 space-y-5">
                    <h2 className="font-heading font-semibold text-foreground text-lg border-b border-border-light pb-3">
                        Información Médica
                    </h2>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            Alergias conocidas
                        </label>
                        <textarea name="alergias" value={form.alergias} onChange={handleChange}
                            className="input-field resize-none" rows={2}
                            placeholder="Ej: alergia al yodo, látex..." />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            Medicamentos actuales
                        </label>
                        <textarea name="medicamentos" value={form.medicamentos} onChange={handleChange}
                            className="input-field resize-none" rows={2}
                            placeholder="Ej: anticoagulantes, aspirina..." />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            Condiciones médicas
                        </label>
                        <textarea name="condiciones" value={form.condiciones} onChange={handleChange}
                            className="input-field resize-none" rows={2}
                            placeholder="Ej: diabetes, hipertensión, embarazo..." />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            Notas internas
                        </label>
                        <textarea name="notas" value={form.notas} onChange={handleChange}
                            className="input-field resize-none" rows={3}
                            placeholder="Notas adicionales sobre el paciente..." />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                        ⚠️ {error}
                    </div>
                )}

                {/* Acciones */}
                <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => router.back()} className="btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Guardando...
                            </>
                        ) : 'Guardar Paciente'}
                    </button>
                </div>
            </form>
        </div>
    )
}
