import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Catálogo de Tratamientos | EstéticaApp' }

export default async function TratamientosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: tratamientos } = await supabase
        .from('tratamientos')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true })

    const formatPeso = (v: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

    const categorias = [...new Set(tratamientos?.map(t => t.categoria) || [])]

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Catálogo de Tratamientos</h1>
                    <p className="text-foreground-secondary text-sm mt-1">Servicios, precios y duraciones configuradas</p>
                </div>
                <Link href="/admin/tratamientos/nuevo" className="btn-primary">
                    + Nuevo Tratamiento
                </Link>
            </div>

            {categorias.map(cat => (
                <div key={cat} className="space-y-4">
                    <h2 className="font-heading text-xl font-semibold text-primary-700 capitalize flex items-center gap-2">
                        <span className="w-8 h-px bg-primary-200" />
                        {cat}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tratamientos?.filter(t => t.categoria === cat).map(t => (
                            <div key={t.id} className="card-elevated p-5 hover:border-primary-200 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-foreground group-hover:text-primary-600 transition-colors">
                                        {t.nombre}
                                    </h3>
                                    {!t.is_active && (
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactivo</span>
                                    )}
                                </div>
                                <p className="text-xs text-foreground-secondary line-clamp-2 mb-4 h-8">
                                    {t.descripcion || 'Sin descripción'}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-blush text-primary-600 px-2 py-1 rounded-lg font-medium">
                                            ⏱ {t.duracion_minutos} min
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-secondary-600">
                                        {formatPeso(t.precio)}
                                    </span>
                                </div>
                                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/tratamientos/${t.id}`} className="text-xs text-primary-500 hover:underline">Editar detalles</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {(!tratamientos || tratamientos.length === 0) && (
                <div className="py-20 text-center card-elevated">
                    <p className="text-foreground-muted">No hay tratamientos registrados.</p>
                    <Link href="/admin/tratamientos/nuevo" className="text-primary-500 hover:underline mt-2 block">
                        Comienza agregando tu primer servicio médico o estético →
                    </Link>
                </div>
            )}
        </div>
    )
}
