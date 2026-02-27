import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NuevoProfesionalForm } from './NuevoProfesionalForm'

export const metadata = { title: 'Agregar Profesional | EstéticaApp' }

export default async function NuevoProfesionalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/admin/profesionales" className="text-sm text-primary-500 hover:underline mb-2 inline-block">← Volver a Profesionales</Link>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Agregar Profesional</h1>
        <p className="text-foreground-secondary text-sm mt-1">Registra un médico o esteticista del equipo</p>
      </div>

      <NuevoProfesionalForm />
    </div>
  )
}
