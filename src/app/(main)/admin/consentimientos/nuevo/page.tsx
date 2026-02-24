import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NuevaPlantillaForm } from './NuevaPlantillaForm'

export const metadata = { title: 'Nueva Plantilla de Consentimiento | EstéticaApp' }

export default async function NuevaPlantillaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/consentimientos" className="text-sm text-primary-500 hover:underline mb-2 inline-block">← Volver a Consentimientos</Link>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Nueva Plantilla de Consentimiento</h1>
        <p className="text-foreground-secondary text-sm mt-1">Crea una plantilla legal para un tratamiento estético</p>
      </div>

      <NuevaPlantillaForm />
    </div>
  )
}
