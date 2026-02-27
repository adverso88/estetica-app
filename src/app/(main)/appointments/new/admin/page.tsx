import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminBookingForm } from '@/features/booking/components/AdminBookingForm'

export const metadata = {
  title: 'Nueva Cita (Admin) | EstéticaApp'
}

export default async function AdminNewAppointmentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'master' && profile?.role !== 'recepcionista') {
    redirect('/dashboard')
  }

  // Get all active profesionales
  const { data: profesionales } = await supabase
    .from('profesionales')
    .select('id, especialidad, nombre, profile:profiles(email)')
    .eq('is_active', true)

  // Get tratamientos
  const { data: tratamientos } = await supabase
    .from('tratamientos')
    .select('*')
    .eq('is_active', true)
    .order('nombre')

  // Get existing pacientes for autocomplete
  const { data: pacientes } = await supabase
    .from('pacientes')
    .select('id, nombre, apellido, email, telefono')
    .order('nombre')
    .limit(100)

  const formattedLawyers = (profesionales || []).map((l: any) => ({
    id: l.id,
    specialty: l.especialidad,
    name: l.nombre,
    email: l.profile?.email || ''
  }))

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Agendar Cita (Staff)</h1>
        <p className="text-foreground-secondary mt-1">
          Crea una cita para cualquier especialista de la clínica
        </p>
      </div>

      <AdminBookingForm
        lawyers={formattedLawyers}
        appointmentTypes={tratamientos || []}
        existingClients={pacientes || []}
      />
    </div>
  )
}
