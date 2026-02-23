import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CitaBadge } from '@/features/dashboard/components/CitaBadge'
import type { CitaEstado } from '@/types/database'
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    MessageCircle,
    Search,
    User,
    Plus,
    Zap
} from 'lucide-react'

export const metadata = { title: 'Agenda | EstéticaApp' }

export default async function AgendaPage({
    searchParams
}: { searchParams: Promise<{ fecha?: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { fecha } = await searchParams
    const hoy = new Date()
    const fechaBase = fecha ? new Date(fecha + 'T12:00:00') : hoy
    const inicioDia = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), fechaBase.getDate()).toISOString()
    const finDia = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), fechaBase.getDate() + 1).toISOString()

    const { data: citas } = await supabase
        .from('citas')
        .select(`
      id, fecha_hora, estado, precio, duracion_minutos, notas_paciente,
      paciente:pacientes(id, nombre, apellido, telefono),
      profesional:profesionales(id, nombre, especialidad),
      tratamiento:tratamientos(id, nombre, duracion_minutos)
    `)
        .gte('fecha_hora', inicioDia)
        .lt('fecha_hora', finDia)
        .order('fecha_hora', { ascending: true })

    const semana = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(fechaBase)
        d.setDate(fechaBase.getDate() - fechaBase.getDay() + i)
        return d
    })

    const fechaLabel = fechaBase.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
    const esHoy = inicioDia <= hoy.toISOString() && hoy.toISOString() < finDia
    const formatPeso = (v: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

    const totalCitas = citas?.length || 0
    const confirmadas = citas?.filter(c => c.estado === 'confirmada').length || 0
    const completadas = citas?.filter(c => c.estado === 'completada').length || 0
    const ingresosDia = citas?.filter(c => c.estado === 'completada').reduce((s, c) => s + (c.precio || 0), 0) || 0

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground">Agenda Diaria</h1>
                    <p className="text-sm text-foreground-secondary mt-1 capitalize flex items-center gap-2">
                        <CalendarIcon size={14} className="text-primary-500" /> {fechaLabel}
                    </p>
                </div>
                <Link href="/citas/nueva" className="btn-primary shadow-rose flex items-center gap-2">
                    <Plus size={18} /> Nueva Cita
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-border-light shadow-sm">
                <NavButton dir="prev" fechaBase={fechaBase} />
                <div className="flex gap-1 flex-1 justify-center overflow-x-auto no-scrollbar">
                    {semana.map((dia, i) => {
                        const fechaStr = dia.toISOString().split('T')[0]
                        const esSeleccionado = dia.toDateString() === fechaBase.toDateString()
                        const esDiaHoy = dia.toDateString() === hoy.toDateString()
                        const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
                        return (
                            <Link key={i} href={`/agenda?fecha=${fechaStr}`}
                                className={`flex flex-col items-center min-w-[56px] py-3 rounded-xl transition-all text-sm ${esSeleccionado
                                    ? 'gradient-rose text-white font-bold shadow-rose'
                                    : esDiaHoy
                                        ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-100'
                                        : 'text-foreground-secondary hover:bg-blush'
                                    }`}>
                                <span className="text-[10px] uppercase tracking-tighter mb-1 opacity-80">{DIAS[i]}</span>
                                <span className="text-base font-bold">{dia.getDate()}</span>
                            </Link>
                        )
                    })}
                </div>
                <NavButton dir="next" fechaBase={fechaBase} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MiniStat label="Total Citas" value={totalCitas} color="bg-primary-500 text-white shadow-rose" />
                <MiniStat label="Confirmadas" value={confirmadas} color="bg-white text-foreground border border-border-light" />
                <MiniStat label="Completas" value={completadas} color="bg-white text-foreground border border-border-light" />
                <MiniStat label="Ingresos" value={formatPeso(ingresosDia)} color="bg-white text-primary-600 border border-primary-100" />
            </div>

            {!citas?.length ? (
                <div className="card-elevated p-16 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mx-auto shadow-inner text-primary-300">
                        <CalendarIcon size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className="font-heading font-bold text-xl text-foreground">
                            {esHoy ? 'No tienes citas para hoy' : `Sin agenda el ${fechaLabel}`}
                        </p>
                        <p className="text-foreground-secondary">Añade pacientes a tu lista para este día.</p>
                    </div>
                    <Link href="/citas/nueva" className="btn-primary inline-flex mt-4">+ Iniciar Agenda</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {citas.map((cita: any) => (
                        <div key={cita.id}
                            className="card-elevated p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-primary-200 transition-all border-l-4 border-l-primary-500">
                            <div className="text-center md:min-w-[80px]">
                                <p className="text-2xl font-bold text-foreground font-heading">
                                    {new Date(cita.fecha_hora).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs font-bold text-primary-500 bg-primary-50 rounded-full px-2 py-0.5 mt-1">
                                    {cita.duracion_minutos} min
                                </p>
                            </div>

                            <div className="hidden md:block w-px h-12 bg-border-light" />

                            <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                                <div className="w-14 h-14 rounded-2xl bg-blush flex-shrink-0 flex items-center justify-center text-primary-500 font-bold text-lg shadow-sm border border-white">
                                    {cita.paciente?.nombre?.[0]}{cita.paciente?.apellido?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-bold text-foreground truncate">
                                            {cita.paciente?.nombre} {cita.paciente?.apellido}
                                        </p>
                                        <CitaBadge estado={cita.estado as CitaEstado} />
                                    </div>
                                    <p className="text-sm font-medium text-foreground-secondary flex items-center gap-1">
                                        <Zap size={12} className="text-primary-400" /> {cita.tratamiento?.nombre} · {cita.profesional?.nombre}
                                    </p>
                                    {cita.notas_paciente && (
                                        <p className="text-xs text-foreground-muted italic mt-2 line-clamp-1 bg-foreground-muted/5 p-1 rounded">
                                            "{cita.notas_paciente}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary-600">
                                        {cita.precio > 0 ? formatPeso(cita.precio) : '—'}
                                    </p>
                                    <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">Valor</p>
                                </div>
                                <div className="flex gap-2">
                                    {cita.paciente?.telefono && (
                                        <a href={`https://wa.me/${cita.paciente.telefono.replace(/\D/g, '')}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-200 transition-all"
                                            title="WhatsApp">
                                            <MessageCircle size={18} />
                                        </a>
                                    )}
                                    <Link href={`/citas/${cita.id}`}
                                        className="w-10 h-10 rounded-xl bg-white border border-border-light hover:bg-blush flex items-center justify-center text-foreground-muted hover:text-primary-500 transition-all"
                                        title="Ver detalle">
                                        <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className={`rounded-2xl p-5 flex flex-col justify-center ${color}`}>
            <p className="text-2xl font-heading font-extrabold">{value}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-80">{label}</p>
        </div>
    )
}

function NavButton({ dir, fechaBase }: { dir: 'prev' | 'next'; fechaBase: Date }) {
    const d = new Date(fechaBase)
    dir === 'prev' ? d.setDate(d.getDate() - 7) : d.setDate(d.getDate() + 7)
    const fechaStr = d.toISOString().split('T')[0]
    return (
        <Link href={`/agenda?fecha=${fechaStr}`}
            className="w-10 h-10 rounded-xl bg-white border border-border-light hover:border-primary-200 flex items-center justify-center transition-all text-foreground-secondary hover:text-primary-500 shadow-sm">
            {dir === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Link>
    )
}

