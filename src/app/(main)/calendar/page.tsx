import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarView } from '@/features/calendar/components/CalendarView'

export const metadata = {
  title: 'Calendario | EstéticaApp'
}

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar rol (solo admin y lawyer)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'client') {
    redirect('/dashboard')
  }

  // Obtener citas del mes actual
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  let appointmentsQuery = supabase
    .from('appointments')
    .select(`
      id,
      paciente_id:client_id,
      profesional_id:lawyer_id,
      tratamiento_id:appointment_type_id,
      fecha_hora:scheduled_at,
      duracion_minutos:duration_minutes,
      precio:price,
      estado:status,
      notas:notes,
      notas_paciente:notes_client,
      razon_cancelacion:cancellation_reason,
      created_at,
      updated_at,
      paciente:clients(id, nombre:full_name, email, telefono:phone, notas:notes, profile:profiles(*)),
      profesional:lawyers(id, nombre:full_name, especialidad:specialty, profile:profiles(*)),
      tratamiento:appointment_types(id, nombre:name, descripcion:description, duracion_minutos:duration_minutes, precio:price)
    `)
    .gte('scheduled_at', startOfMonth.toISOString())
    .lte('scheduled_at', endOfMonth.toISOString())
    .order('scheduled_at', { ascending: true })

  // Si es especialista, solo sus citas
  if (profile?.role === 'lawyer') {
    const { data: lawyer } = await supabase
      .from('lawyers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (lawyer) {
      appointmentsQuery = appointmentsQuery.eq('lawyer_id', lawyer.id)
    }
  }

  const { data: appointments } = await appointmentsQuery

  // Obtener lista de especialistas para filtro (solo admin)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lawyers: any[] = []
  if (profile?.role === 'admin') {
    const { data } = await supabase
      .from('lawyers')
      .select('id, profile:profiles(full_name)')
      .eq('is_active', true)

    // Transform the data to match expected format
    lawyers = (data || []).map((l: { id: string; profile: { full_name: string }[] | { full_name: string } }) => ({
      id: l.id,
      profile: Array.isArray(l.profile) ? l.profile[0] : l.profile
    }))
  }

  return (
    <div className="p-6 md:p-8">
      <CalendarView
        initialAppointments={(appointments as any) || []}
        lawyers={lawyers}
        userRole={profile?.role || 'client'}
      />
    </div>
  )
}
