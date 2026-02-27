import { createClient } from '@/lib/supabase/server'
import { AppointmentsCalendar } from '@/features/appointments/components/AppointmentsCalendar'
import type { AppointmentWithRelations } from '@/types/database'

const roleToCalendar: Record<string, string> = {
  paciente: 'cliente',
  profesional: 'especialista',
  admin: 'admin',
  master: 'admin',
  recepcionista: 'admin',
}

interface AppointmentsListServerProps {
  userId: string
  userRole: string
}

export async function AppointmentsListServer({ userId, userRole }: AppointmentsListServerProps) {
  const supabase = await createClient()
  const calendarRole = roleToCalendar[userRole] || 'cliente'

  let query = supabase
    .from('citas')
    .select(`
      *,
      paciente:pacientes(*),
      profesional:profesionales(*),
      tratamiento:tratamientos(*)
    `)
    .order('fecha_hora', { ascending: true })

  if (userRole === 'paciente') {
    // Obtener paciente_id del usuario
    const { data: pac } = await supabase
      .from('pacientes')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (pac) {
      query = query.eq('paciente_id', pac.id)
    } else {
      return (
        <AppointmentsCalendar
          appointments={[]}
          userRole={calendarRole as any}
        />
      )
    }
  } else if (userRole === 'profesional') {
    // Obtener profesional_id del usuario
    const { data: pro } = await supabase
      .from('profesionales')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (pro) {
      query = query.eq('profesional_id', pro.id)
    } else {
      return (
        <AppointmentsCalendar
          appointments={[]}
          userRole={calendarRole as any}
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
      userRole={calendarRole as any}
    />
  )
}
