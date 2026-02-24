import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Consentimientos | EstéticaApp' }

export default async function ConsentimientosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: plantillas } = await supabase
        .from('consentimientos_plantillas')
        .select('*')
        .order('titulo')

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Consentimientos Informados</h1>
                    <p className="text-foreground-secondary text-sm mt-1">Plantillas legales para tratamientos estéticos</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/consentimientos/demo-sign" className="btn-secondary">
                        Probar firma digital
                    </Link>
                    <Link href="/admin/consentimientos/nuevo" className="btn-primary">
                        + Nueva Plantilla
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plantillas?.map((p: { id: string; titulo?: string; nombre?: string; version?: string; contenido?: string }) => {
                    const titulo = p.titulo ?? p.nombre ?? 'Sin título'
                    const contenido = typeof p.contenido === 'string' ? p.contenido : ''
                    return (
                    <div key={p.id} className="card-elevated p-6 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blush flex items-center justify-center text-primary-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            {p.version != null && <span className="text-[10px] bg-secondary-50 text-secondary-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider">v{p.version}</span>}
                        </div>

                        <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary-600 transition-colors">{titulo}</h3>
                        <p className="text-sm text-foreground-secondary line-clamp-3 mb-6">
                            {contenido.replace(/[#*]/g, '').slice(0, 150)}{contenido.length > 150 ? '...' : ''}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border-light mt-auto">
                            <Link href={`/admin/consentimientos/${p.id}`} className="text-xs font-semibold text-primary-500 hover:underline">
                                Editar Plantilla
                            </Link>
                            <Link href={`/consentimientos/demo-sign?plantilla=${p.id}`} className="btn-ghost text-[11px] py-1 px-3">
                                Previsualizar
                            </Link>
                        </div>
                    </div>
                )})}

                {(!plantillas || plantillas.length === 0) && (
                    <div className="col-span-full py-20 text-center card-elevated">
                        <p className="text-foreground-muted">No tienes plantillas de consentimiento aún.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
