import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { EditarProfesionalForm } from './EditarProfesionalForm'

export const metadata = { title: 'Editar Profesional | EstéticaApp' }

export default async function EditarProfesionalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: prof } = await supabase
    .from('profesionales')
    .select('*')
    .eq('id', id)
    .single()

  if (!prof) notFound()

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/admin/profesionales" className="text-sm text-primary-500 hover:underline mb-2 inline-block">← Volver a Profesionales</Link>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Editar Profesional</h1>
        <p className="text-foreground-secondary text-sm mt-1">{prof.nombre}</p>
      </div>

      <EditarProfesionalForm
        id={id}
        initial={{
          nombre: prof.nombre,
          especialidad: prof.especialidad,
          bio: prof.bio ?? '',
          experiencia_anos: prof.experiencia_anos ?? 0,
          tarifa_hora: prof.tarifa_hora ?? 0,
          is_active: prof.is_active ?? true,
        }}
      />
    </div>
  )
}
