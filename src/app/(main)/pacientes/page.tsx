import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
    title: 'Pacientes | EstéticaApp',
}

export default async function PacientesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { q } = await searchParams

    let query = supabase
        .from('pacientes')
        .select('id, nombre, apellido, email, telefono, tipo_piel, fuente_captacion, created_at')
        .order('created_at', { ascending: false })
        .limit(50)

    if (q) {
        query = query.or(`nombre.ilike.%${q}%,apellido.ilike.%${q}%,email.ilike.%${q}%,telefono.ilike.%${q}%`)
    }

    const { data: pacientes } = await query

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Pacientes</h1>
                    <p className="text-foreground-secondary text-sm mt-1">{pacientes?.length || 0} pacientes registrados</p>
                </div>
                <Link href="/pacientes/nuevo" className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Nuevo Paciente
                </Link>
            </div>

            {/* Buscador */}
            <form method="GET" className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                    name="q"
                    defaultValue={q}
                    type="search"
                    placeholder="Buscar por nombre, email o teléfono..."
                    className="input-field pl-10 max-w-md"
                />
            </form>

            {/* Lista */}
            {!pacientes?.length ? (
                <div className="card-elevated p-12 text-center text-foreground-muted">
                    <div className="w-16 h-16 rounded-3xl bg-blush flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <p className="font-heading font-semibold text-foreground">
                        {q ? `No se encontraron pacientes para "${q}"` : 'Aún no hay pacientes registrados'}
                    </p>
                    <p className="text-sm mt-1">
                        {!q && 'Crea tu primer paciente para comenzar'}
                    </p>
                    {!q && (
                        <Link href="/pacientes/nuevo" className="btn-primary inline-flex mt-4">
                            Crear primer paciente
                        </Link>
                    )}
                </div>
            ) : (
                <div className="card-elevated overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light">
                                <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wide px-6 py-4">Paciente</th>
                                <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wide px-4 py-4 hidden md:table-cell">Contacto</th>
                                <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wide px-4 py-4 hidden lg:table-cell">Tipo piel</th>
                                <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wide px-4 py-4 hidden lg:table-cell">¿Cómo nos conociste?</th>
                                <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wide px-4 py-4 hidden xl:table-cell">Ingresó</th>
                                <th className="px-4 py-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {pacientes.map(p => (
                                <tr key={p.id} className="table-row">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600 flex-shrink-0">
                                                {p.nombre?.[0]}{p.apellido?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{p.nombre} {p.apellido}</p>
                                                <p className="text-xs text-foreground-muted">{p.email || 'Sin email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell">
                                        <p className="text-sm text-foreground-secondary">{p.telefono || '—'}</p>
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        {p.tipo_piel ? (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blush text-primary-600 border border-primary-200 capitalize">
                                                {p.tipo_piel}
                                            </span>
                                        ) : <span className="text-foreground-muted text-sm">—</span>}
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        <p className="text-sm text-foreground-secondary capitalize">{p.fuente_captacion || '—'}</p>
                                    </td>
                                    <td className="px-4 py-4 hidden xl:table-cell">
                                        <p className="text-xs text-foreground-muted">
                                            {new Date(p.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link href={`/pacientes/${p.id}`}
                                                className="text-xs font-medium text-primary-500 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-blush transition-colors">
                                                Ver ficha
                                            </Link>
                                            <Link href={`/citas/nueva?paciente=${p.id}`}
                                                className="text-xs font-medium text-secondary-600 hover:text-secondary-800 px-3 py-1.5 rounded-lg hover:bg-secondary-50 transition-colors">
                                                + Cita
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
