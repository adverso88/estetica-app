import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
    User,
    Phone,
    Mail,
    Calendar,
    Clock,
    FileText,
    Plus,
    ChevronLeft,
    Syringe,
    ShieldCheck,
    Camera,
    MessageCircle,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'

export default async function PacienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { id } = await params

    const { data: paciente } = await supabase
        .from('pacientes')
        .select(`
      *,
      citas (
        id, fecha_hora, estado, precio,
        tratamiento:tratamientos(nombre)
      ),
      historial_clinico (
        id, fecha, notas, unidades_usadas, nombre_producto, lote_producto, zonas_tratadas,
        tratamiento:tratamientos(nombre)
      ),
      consentimientos_firmados (
        id, firmado_en, 
        plantilla:consentimientos_plantillas(nombre, titulo)
      )
    `)
        .eq('id', id)
        .single()

    if (!paciente) notFound()

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <Link href="/pacientes" className="flex items-center gap-2 text-foreground-secondary hover:text-primary-500 transition-colors text-sm font-medium">
                <ChevronLeft size={16} /> Volver a Pacientes
            </Link>

            {/* Header Principal */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="card-elevated p-6 text-center space-y-4 border-t-4 border-primary-500">
                        <div className="w-24 h-24 rounded-full bg-blush mx-auto flex items-center justify-center text-primary-500 text-3xl font-bold border-2 border-white shadow-rose">
                            {paciente.nombre[0]}{paciente.apellido[0]}
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-foreground">
                                {paciente.nombre} {paciente.apellido}
                            </h1>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
                                Paciente VIP
                            </span>
                        </div>

                        <div className="pt-4 border-t border-border-light grid grid-cols-2 gap-4">
                            <div className="text-left">
                                <p className="text-[10px] text-foreground-muted uppercase font-bold">Tipo de Piel</p>
                                <p className="text-sm font-semibold">{paciente.tipo_piel || 'No registrado'}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-foreground-muted uppercase font-bold">Alergias</p>
                                <p className="text-sm font-semibold text-error-600">{paciente.alergias || 'Ninguna'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-foreground-secondary">
                                <Phone size={16} /> <span className="text-sm">{paciente.telefono}</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground-secondary">
                                <Mail size={16} /> <span className="text-sm">{paciente.email || 'Sin correo'}</span>
                            </div>
                        </div>

                        <button className="w-full btn-primary flex items-center justify-center gap-2 py-3 shadow-rose">
                            <MessageCircle size={18} /> Contactar WhatsApp
                        </button>
                    </div>

                    <div className="card-elevated p-6 space-y-6">
                        <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                            <ShieldCheck size={18} className="text-primary-500" /> Seguridad Legal
                        </h3>
                        <div className="space-y-3">
                            {paciente.consentimientos_firmados?.map((c: any) => (
                                <ConsentStatus
                                    key={c.id}
                                    label={c.plantilla?.titulo || c.plantilla?.nombre || 'Consentimiento'}
                                    signed={true}
                                    date={new Date(c.firmado_en).toLocaleDateString()}
                                />
                            ))}
                            {(!paciente.consentimientos_firmados || paciente.consentimientos_firmados.length === 0) && (
                                <p className="text-xs text-foreground-muted text-center py-4">No hay consentimientos firmados aún.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timeline Médico */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-heading text-2xl font-bold text-foreground">Historia Clínica Evolutiva</h2>
                        <button className="btn-secondary text-xs flex items-center gap-2">
                            <Plus size={14} /> Nueva Entrada
                        </button>
                    </div>

                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-8 before:w-px before:bg-border-light">
                        {paciente.historial_clinico?.map((reg: any) => (
                            <div key={reg.id} className="relative pl-16 group">
                                {/* Dot */}
                                <div className="absolute left-[30px] top-2 w-4 h-4 rounded-full bg-white border-2 border-primary-500 z-10 group-hover:scale-150 transition-transform shadow-rose" />

                                <div className="card-elevated p-6 space-y-4 hover:border-primary-200 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-primary-600">
                                                {new Date(reg.fecha).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <h4 className="font-heading font-bold text-lg text-foreground">{reg.tratamiento?.nombre}</h4>
                                        </div>
                                        <span className="text-xs text-foreground-muted">Dr. Profesional Asignado</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blush/20 p-4 rounded-2xl border border-primary-50 border-dashed">
                                        <DataPoint label="Producto" value={reg.nombre_producto || 'N/A'} icon={<Syringe size={12} />} />
                                        <DataPoint label="Lote / Batch" value={reg.lote_producto || 'N/A'} />
                                        <DataPoint label="Unidades" value={reg.unidades_usadas || '0'} />
                                        <DataPoint label="Zonas" value={reg.zonas_tratadas || 'General'} />
                                    </div>

                                    <p className="text-sm text-foreground-secondary italic leading-relaxed">
                                        "{reg.notes || 'Sin notas adicionales en esta sesión.'}"
                                    </p>

                                    <div className="flex gap-2">
                                        <div className="w-20 h-14 bg-foreground-muted rounded-lg flex items-center justify-center text-[10px] text-white overflow-hidden relative group/img">
                                            <Camera size={14} />
                                            <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">Antes</span>
                                        </div>
                                        <div className="w-20 h-14 bg-foreground-muted rounded-lg flex items-center justify-center text-[10px] text-white overflow-hidden relative group/img">
                                            <Camera size={14} />
                                            <span className="absolute inset-0 bg-primary-500/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">Después</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!paciente.historial_clinico || paciente.historial_clinico.length === 0) && (
                            <div className="ml-16 py-10 text-center card-elevated">
                                <p className="text-foreground-muted">No hay registros clínicos previos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function DataPoint({ label, value, icon }: any) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-primary-400 flex items-center gap-1">
                {icon} {label}
            </p>
            <p className="text-xs font-bold text-foreground truncate">{value}</p>
        </div>
    )
}

function ConsentStatus({ label, signed, date }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border border-border-light">
            <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-foreground-muted font-medium">
                    {signed ? `Firmado el ${date}` : 'Pendiente de firma'}
                </p>
            </div>
            {signed ? (
                <CheckCircle2 size={18} className="text-green-500" />
            ) : (
                <AlertCircle size={18} className="text-error-500 animate-pulse" />
            )}
        </div>
    )
}
