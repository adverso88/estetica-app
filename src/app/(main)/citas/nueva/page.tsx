'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Paciente, Profesional, Tratamiento } from '@/types/database'

export default function NuevaCitaPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pacienteId = searchParams.get('paciente')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [profesionales, setProfesionales] = useState<Profesional[]>([])
    const [tratamientos, setTratamientos] = useState<Tratamiento[]>([])
    const [pacienteBusqueda, setPacienteBusqueda] = useState('')
    const [form, setForm] = useState({
        paciente_id: pacienteId || '',
        profesional_id: '',
        tratamiento_id: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '09:00',
        duracion_minutos: 60,
        precio: 0,
        notas_paciente: '',
    })

    useEffect(() => {
        const load = async () => {
            const supabase = createClient()
            const [{ data: prof }, { data: trat }] = await Promise.all([
                supabase.from('profesionales').select('id, nombre, especialidad').eq('is_active', true),
                supabase.from('tratamientos').select('id, nombre, duracion_minutos, precio').eq('is_active', true).order('nombre'),
            ])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setProfesionales((prof || []) as any as Profesional[])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setTratamientos((trat || []) as any as Tratamiento[])
        }
        load()
    }, [])

    useEffect(() => {
        if (!pacienteBusqueda || pacienteBusqueda.length < 2) { setPacientes([]); return }
        const timer = setTimeout(async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('pacientes')
                .select('id, nombre, apellido, telefono, email')
                .or(`nombre.ilike.%${pacienteBusqueda}%,apellido.ilike.%${pacienteBusqueda}%,telefono.ilike.%${pacienteBusqueda}%`)
                .limit(8)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setPacientes((data || []) as any as Paciente[])
        }, 300)
        return () => clearTimeout(timer)
    }, [pacienteBusqueda])

    // Auto-fill duración y precio al seleccionar tratamiento
    const handleTratamientoChange = (id: string) => {
        const t = tratamientos.find(t => t.id === id)
        setForm(prev => ({
            ...prev,
            tratamiento_id: id,
            duracion_minutos: t?.duracion_minutos || 60,
            precio: t?.precio || 0,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.paciente_id || !form.profesional_id) {
            setError('Paciente y profesional son requeridos')
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            const supabase = createClient()
            const fecha_hora = `${form.fecha}T${form.hora}:00`
            const { error: err } = await supabase.from('citas').insert({
                paciente_id: form.paciente_id,
                profesional_id: form.profesional_id,
                tratamiento_id: form.tratamiento_id || null,
                fecha_hora,
                duracion_minutos: form.duracion_minutos,
                precio: form.precio,
                notas_paciente: form.notas_paciente || null,
                estado: 'agendada',
            })
            if (err) throw err
            router.push(`/agenda?fecha=${form.fecha}`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al guardar la cita')
        } finally {
            setIsLoading(false)
        }
    }

    const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null)

    const seleccionarPaciente = (p: Paciente) => {
        setForm(prev => ({ ...prev, paciente_id: p.id }))
        setPacienteSeleccionado(p)
        setPacientes([])
        setPacienteBusqueda('')
    }

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
            <div className="mb-8">
                <button onClick={() => router.back()} className="btn-ghost mb-4 -ml-2">← Volver</button>
                <h1 className="font-heading text-3xl font-semibold text-foreground">Nueva Cita</h1>
                <p className="text-foreground-secondary text-sm mt-1">Agenda una cita para un paciente</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Card 1: Paciente */}
                <div className="card-elevated p-6 space-y-4">
                    <h2 className="font-heading font-semibold text-foreground text-lg border-b border-border-light pb-3">
                        Paciente <span className="text-primary-500">*</span>
                    </h2>

                    {pacienteSeleccionado ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blush border border-primary-200">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-500">
                                {pacienteSeleccionado.nombre[0]}{pacienteSeleccionado.apellido[0]}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">{pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</p>
                                <p className="text-xs text-foreground-muted">{pacienteSeleccionado.telefono || pacienteSeleccionado.email}</p>
                            </div>
                            <button type="button" onClick={() => { setPacienteSeleccionado(null); setForm(prev => ({ ...prev, paciente_id: '' })) }}
                                className="text-xs text-foreground-muted hover:text-primary-500">✕</button>
                        </div>
                    ) : (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar paciente por nombre o teléfono..."
                                value={pacienteBusqueda}
                                onChange={e => setPacienteBusqueda(e.target.value)}
                                className="input-field"
                            />
                            {pacientes.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-border shadow-elevated overflow-hidden">
                                    {pacientes.map(p => (
                                        <button key={p.id} type="button" onClick={() => seleccionarPaciente(p)}
                                            className="w-full text-left px-4 py-3 hover:bg-blush transition-colors border-b border-border-light last:border-0">
                                            <p className="text-sm font-semibold text-foreground">{p.nombre} {p.apellido}</p>
                                            <p className="text-xs text-foreground-muted">{p.telefono || p.email}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="mt-2 text-xs text-foreground-muted">
                                ¿Paciente nuevo?{' '}
                                <a href="/pacientes/nuevo" className="text-primary-500 hover:underline">Crear paciente →</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Card 2: Tratamiento y Profesional */}
                <div className="card-elevated p-6 space-y-4">
                    <h2 className="font-heading font-semibold text-foreground text-lg border-b border-border-light pb-3">
                        Servicio y Profesional
                    </h2>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            Tratamiento
                        </label>
                        <select value={form.tratamiento_id} onChange={e => handleTratamientoChange(e.target.value)} className="input-field">
                            <option value="">Sin tratamiento específico</option>
                            {tratamientos.map(t => (
                                <option key={t.id} value={t.id}>{t.nombre} ({t.duracion_minutos} min · {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(t.precio)})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">
                            Profesional <span className="text-primary-500">*</span>
                        </label>
                        <select value={form.profesional_id} onChange={e => setForm(p => ({ ...p, profesional_id: e.target.value }))}
                            className="input-field" required>
                            <option value="">Seleccionar profesional...</option>
                            {profesionales.map(prof => (
                                <option key={prof.id} value={prof.id}>{prof.nombre} — {prof.especialidad}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Card 3: Fecha y hora */}
                <div className="card-elevated p-6 space-y-4">
                    <h2 className="font-heading font-semibold text-foreground text-lg border-b border-border-light pb-3">
                        Fecha y Hora
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">Fecha</label>
                            <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))}
                                className="input-field" min={new Date().toISOString().split('T')[0]} required />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">Hora</label>
                            <input type="time" value={form.hora} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))}
                                className="input-field" min="07:00" max="21:00" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">Duración (minutos)</label>
                            <input type="number" value={form.duracion_minutos} onChange={e => setForm(p => ({ ...p, duracion_minutos: parseInt(e.target.value) || 60 }))}
                                className="input-field" min={15} max={480} step={15} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">Precio (COP)</label>
                            <input type="number" value={form.precio} onChange={e => setForm(p => ({ ...p, precio: parseFloat(e.target.value) || 0 }))}
                                className="input-field" min={0} step={1000} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-1.5">Notas del paciente</label>
                        <textarea value={form.notas_paciente} onChange={e => setForm(p => ({ ...p, notas_paciente: e.target.value }))}
                            className="input-field resize-none" rows={2} placeholder="Observaciones, preferencias especiales..." />
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                        ⚠️ {error}
                    </div>
                )}

                <div className="flex gap-3 justify-end pb-8">
                    <button type="button" onClick={() => router.back()} className="btn-secondary">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Agendando...' : '✓ Agendar Cita'}
                    </button>
                </div>
            </form>
        </div>
    )
}
