import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Profesionales | EstéticaApp' }

export default async function ProfesionalesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profesionales } = await supabase
        .from('profesionales')
        .select('*, profile:profiles(email, full_name, role)')
        .order('nombre')

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Profesionales</h1>
                    <p className="text-foreground-secondary text-sm mt-1">Equipo médico y esteticistas de la clínica</p>
                </div>
                <Link href="/admin/profesionales/nuevo" className="btn-primary">
                    + Agregar Profesional
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profesionales?.map((prof) => (
                    <div key={prof.id} className="card-elevated p-6 flex flex-col items-center text-center group transition-all hover:shadow-lg">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-3xl font-bold text-primary-500 mb-4 border-2 border-primary-100 group-hover:border-primary-300 transition-colors">
                                {prof.nombre[0]}
                            </div>
                            <div className={`absolute bottom-5 right-1 w-5 h-5 rounded-full border-4 border-white ${prof.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>

                        <h3 className="font-heading text-xl font-semibold text-foreground">{prof.nombre}</h3>
                        <p className="text-primary-600 text-sm font-medium mb-2">{prof.especialidad}</p>

                        <div className="space-y-1 mb-6">
                            <p className="text-xs text-secondary-600 font-semibold uppercase tracking-wider">
                                {prof.experiencia_anos} años de experiencia
                            </p>
                            <p className="text-xs text-foreground-muted">
                                Tarifa base: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(prof.tarifa_hora)}/h
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border-light w-full flex gap-2 justify-center">
                            <Link href={`/admin/profesionales/${prof.id}`} className="btn-ghost text-xs">Editar</Link>
                            <Link href={`/agenda?profesional=${prof.id}`} className="btn-secondary text-xs">Ver Agenda</Link>
                        </div>
                    </div>
                ))}
                {(!profesionales || profesionales.length === 0) && (
                    <div className="col-span-full py-12 text-center card-elevated">
                        <p className="text-foreground-muted">No hay profesionales registrados aún.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
