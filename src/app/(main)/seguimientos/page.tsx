import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Seguimientos | EstéticaApp' }

export default async function SeguimientosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: seguimientos } = await supabase
        .from('seguimientos')
        .select(`
      id, fecha_programada, estado, tipo,
      paciente:pacientes(id, nombre, apellido, telefono)
    `)
        .eq('estado', 'pendiente')
        .order('fecha_programada', { ascending: true })

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Seguimientos Pendientes</h1>
                    <p className="text-foreground-secondary text-sm mt-1">Control post-tratamiento y fidelización</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seguimientos?.map((seg: any) => (
                    <div key={seg.id} className="card-elevated p-6 flex flex-col group hover:border-primary-200 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${seg.tipo === 'post-tratamiento' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                }`}>
                                {seg.tipo}
                            </span>
                            <span className="text-xs text-foreground-muted">
                                {new Date(seg.fecha_programada).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                            {seg.paciente?.nombre} {seg.paciente?.apellido}
                        </h3>

                        <div className="flex-1 space-y-3 mt-4">
                            {seg.paciente?.telefono && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                        </svg>
                                    </div>
                                    <a href={`https://wa.me/${seg.paciente.telefono.replace(/\D/g, '')}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-sm font-medium text-green-700 hover:underline">
                                        WhatsApp Paciente
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border-light flex gap-2">
                            <button className="flex-1 btn-primary text-xs py-2">Completar</button>
                            <Link href={`/pacientes/${seg.paciente?.id}`} className="btn-secondary text-xs py-2 px-3">
                                Ver Ficha
                            </Link>
                        </div>
                    </div>
                ))}

                {(!seguimientos || seguimientos.length === 0) && (
                    <div className="col-span-full py-20 text-center card-elevated">
                        <p className="text-foreground-muted">No hay seguimientos pendientes por hoy. ✨</p>
                    </div>
                )}
            </div>
        </div>
    )
}
