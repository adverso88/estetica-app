import { createClient } from '@/lib/supabase/server'
import { AppointmentsCalendar } from '@/features/appointments/components/AppointmentsCalendar'
import type { AppointmentWithRelations } from '@/types/database'

type ServerRole = 'client' | 'lawyer' | 'admin'
type CalendarRole = 'cliente' | 'especialista' | 'admin'

const roleToCalendar: Record<ServerRole, CalendarRole> = {
  client: 'cliente',
  lawyer: 'especialista',
  admin: 'admin',
}

interface AppointmentsListServerProps {
  userId: string
  userRole: ServerRole
}

export async function AppointmentsListServer({ userId, userRole }: AppointmentsListServerProps) {
  const supabase = await createClient()
  const calendarRole = roleToCalendar[userRole]

  let query = supabase
    .from('appointments')
    .select(`
      *,
      client:clients(*, profile:profiles(*)),
      lawyer:lawyers(*, profile:profiles(*)),
      appointment_type:appointment_types(*)
    `)
    .order('scheduled_at', { ascending: true })

  if (userRole === 'client') {
    // Obtener client_id del usuario
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (client) {
      query = query.eq('client_id', client.id)
    } else {
      return (
        <AppointmentsCalendar
          appointments={[]}
          userRole={calendarRole}
        />
      )
    }
  } else if (userRole === 'lawyer') {
    // Obtener lawyer_id del usuario
    const { data: lawyer } = await supabase
      .from('lawyers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (lawyer) {
      query = query.eq('lawyer_id', lawyer.id)
    } else {
      return (
        <AppointmentsCalendar
          appointments={[]}
          userRole={calendarRole}
        />
      )
    }
  }
  // Admin sees all appointments

  const { data: appointments, error } = await query

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error-500">Error al cargar citas: {error.message}</p>
      </div>
    )
  }

  return (
    <AppointmentsCalendar
      appointments={appointments as AppointmentWithRelations[]}
      userRole={calendarRole}
    />
  )
}
