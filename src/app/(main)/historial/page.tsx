import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Historial Clínico | EstéticaApp' }

export default async function HistorialPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: registros } = await supabase
        .from('historial_clinico')
        .select(`
      id, fecha, notas, tratamiento_id, 
      paciente:pacientes(id, nombre, apellido),
      tratamiento:tratamientos(nombre)
    `)
        .order('fecha', { ascending: false })
        .limit(20)

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Historial Clínico</h1>
                    <p className="text-foreground-secondary text-sm mt-1">Registros de evolución y tratamientos realizados</p>
                </div>
            </div>

            <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blush/50 border-b border-border-light">
                                <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase tracking-wider">Tratamiento</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase tracking-wider">Notas / Evolución</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {registros?.map((reg: any) => (
                                <tr key={reg.id} className="hover:bg-blush/20 transition-colors">
                                    <td className="px-6 py-4 text-sm text-foreground">
                                        {new Date(reg.fecha).toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-foreground">{reg.paciente?.nombre} {reg.paciente?.apellido}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-lg font-medium">
                                            {reg.tratamiento?.nombre || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-foreground-secondary line-clamp-1 max-w-md">{reg.notas}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/pacientes/${reg.paciente?.id}`} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                                            Ver Ficha →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!registros || registros.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-foreground-muted">
                                        No hay registros clínicos recientes.
                                        <p className="text-xs mt-1">Los registros aparecen cuando se completa una cita o se agrega una nota en la ficha del paciente.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
