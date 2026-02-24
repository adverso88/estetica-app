import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { EditarPlantillaForm } from './EditarPlantillaForm'

export const metadata = { title: 'Editar Plantilla | EstéticaApp' }

export default async function EditarPlantillaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plantilla } = await supabase
    .from('consentimientos_plantillas')
    .select('*')
    .eq('id', id)
    .single()

  if (!plantilla) notFound()

  const nombre = (plantilla as { titulo?: string; nombre?: string }).titulo ?? (plantilla as { nombre?: string }).nombre ?? 'Sin título'
  const contenido = (plantilla as { contenido?: string }).contenido ?? ''

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/consentimientos" className="text-sm text-primary-500 hover:underline mb-2 inline-block">← Volver a Consentimientos</Link>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Editar Plantilla</h1>
        <p className="text-foreground-secondary text-sm mt-1">{nombre}</p>
      </div>

      <EditarPlantillaForm id={id} nombreInicial={nombre} contenidoInicial={contenido} />
    </div>
  )
}
