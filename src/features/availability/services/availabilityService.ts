import { createClient } from '@/lib/supabase/client'

export const availabilityService = {
  /**
   * Obtiene slots disponibles para un profesional en una fecha específica
   * Considera: disponibilidad configurada + citas ya agendadas
   */
  async getAvailableSlots(profesionalId: string, date: Date): Promise<string[]> {
    const supabase = createClient()
    const dayOfWeek = date.getDay()

    // 1. Obtener disponibilidad del día
    const { data: availability } = await supabase
      .from('disponibilidad')
      .select('*')
      .eq('profesional_id', profesionalId)
      .eq('dia_semana', dayOfWeek)
      .eq('is_disponible', true)
      .single()

    if (!availability) return []

    // 2. Obtener citas del día
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: citas } = await supabase
      .from('citas')
      .select('fecha_hora, duracion_minutos')
      .eq('profesional_id', profesionalId)
      .gte('fecha_hora', startOfDay.toISOString())
      .lte('fecha_hora', endOfDay.toISOString())
      .in('estado', ['agendada', 'confirmada'])

    // 3. Generar slots (cada 30 min por defecto)
    const allSlots = generateTimeSlots(
      availability.hora_inicio,
      availability.hora_fin,
      30
    )

    const bookedSlots = new Set(
      (citas || []).map(c =>
        new Date(c.fecha_hora).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false })
      )
    )

    return allSlots.filter(slot => !bookedSlots.has(slot))
  },

  async getProfesionalAvailability(profesionalId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('disponibilidad')
      .select('*')
      .eq('profesional_id', profesionalId)
      .order('dia_semana')

    if (error) throw error
    return data
  }
}

function generateTimeSlots(start: string, end: string, interval: number): string[] {
  const slots: string[] = []
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)

  let current = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  while (current < endMinutes) {
    const hours = Math.floor(current / 60)
    const mins = current % 60
    slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`)
    current += interval
  }

  return slots
}
