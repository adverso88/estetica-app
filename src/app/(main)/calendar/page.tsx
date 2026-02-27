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
    .from('citas')
    .select(`
      id,
      paciente_id,
      profesional_id,
      tratamiento_id,
      fecha_hora,
      duracion_minutos,
      precio,
      estado,
      notas,
      notas_paciente,
      razon_cancelacion,
      created_at,
      updated_at,
      paciente:pacientes(id, nombre, apellido, email, telefono),
      profesional:profesionales(id, nombre),
      tratamiento:tratamientos(id, nombre, precio)
    `)
    .gte('fecha_hora', startOfMonth.toISOString())
    .lte('fecha_hora', endOfMonth.toISOString())
    .order('fecha_hora', { ascending: true })

  // Si es especialista, solo sus citas
  if (profile?.role === 'profesional') {
    const { data: pro } = await supabase
      .from('profesionales')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (pro) {
      appointmentsQuery = appointmentsQuery.eq('profesional_id', pro.id)
    }
  }

  const { data: appointments } = await appointmentsQuery

  // Obtener lista de especialistas para filtro (admin/master/recepcionista)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lawyers: any[] = []
  if (profile?.role === 'admin' || profile?.role === 'master' || profile?.role === 'recepcionista') {
    const { data } = await supabase
      .from('profesionales')
      .select('id, nombre')
      .eq('is_active', true)

    lawyers = (data || []).map((p: any) => ({
      id: p.id,
      profile: { full_name: p.nombre }
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
