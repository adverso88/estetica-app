import { createClient } from '@/lib/supabase/server'

export const dashboardService = {
  async getStatsAdmin() {
    const supabase = await createClient()
    const hoy = new Date()
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString()
    const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toISOString()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString()

    const [
      { count: citasHoy },
      { count: citasConfirmadas },
      { count: citasPendientes },
      { count: noShowsMes },
      { count: pacientesTotal },
      { count: citasCompletadasMes },
      citasHoyData,
    ] = await Promise.all([
      supabase.from('citas').select('*', { count: 'exact', head: true })
        .gte('fecha_hora', inicioHoy).lt('fecha_hora', finHoy),
      supabase.from('citas').select('*', { count: 'exact', head: true })
        .gte('fecha_hora', inicioHoy).lt('fecha_hora', finHoy).eq('estado', 'confirmada'),
      supabase.from('citas').select('*', { count: 'exact', head: true })
        .gte('fecha_hora', inicioHoy).lt('fecha_hora', finHoy).eq('estado', 'agendada'),
      supabase.from('citas').select('*', { count: 'exact', head: true })
        .gte('fecha_hora', inicioMes).eq('estado', 'no_show'),
      supabase.from('pacientes').select('*', { count: 'exact', head: true }),
      supabase.from('citas').select('*', { count: 'exact', head: true })
        .gte('fecha_hora', inicioMes).eq('estado', 'completada'),
      supabase.from('citas')
        .select('precio, estado, paciente:pacientes(nombre, apellido), profesional:profesionales(nombre), tratamiento:tratamientos(nombre), fecha_hora')
        .gte('fecha_hora', inicioHoy).lt('fecha_hora', finHoy)
        .order('fecha_hora', { ascending: true })
        .limit(20),
    ])

    // Ingresos del mes
    const { data: citasMesPagadas } = await supabase
      .from('citas')
      .select('precio')
      .gte('fecha_hora', inicioMes)
      .in('estado', ['completada'])

    const ingresosMes = citasMesPagadas?.reduce((sum, c) => sum + (c.precio || 0), 0) || 0

    // Costo estimado no-shows (precio promedio * no shows)
    const precioPromedio = ingresosMes / Math.max(citasCompletadasMes || 1, 1)
    const costoNoShows = (noShowsMes || 0) * precioPromedio

    return {
      citasHoy: citasHoy || 0,
      citasConfirmadas: citasConfirmadas || 0,
      citasPendientes: citasPendientes || 0,
      noShowsMes: noShowsMes || 0,
      pacientesTotal: pacientesTotal || 0,
      citasCompletadasMes: citasCompletadasMes || 0,
      ingresosMes,
      costoNoShows,
      citasHoyList: (citasHoyData.data || []) as unknown[],
    }
  },

  async getCitasProximas(limit = 8) {
    const supabase = await createClient()
    const ahora = new Date().toISOString()
    const { data } = await supabase
      .from('citas')
      .select(`
        id, fecha_hora, estado, precio, duracion_minutos,
        paciente:pacientes(id, nombre, apellido, telefono),
        profesional:profesionales(id, nombre, especialidad),
        tratamiento:tratamientos(id, nombre, duracion_minutos)
      `)
      .gte('fecha_hora', ahora)
      .in('estado', ['agendada', 'confirmada', 'en_sala'])
      .order('fecha_hora', { ascending: true })
      .limit(limit)
    return data || []
  },

  async getSeguimientosPendientes() {
    const supabase = await createClient()
    const ahora = new Date().toISOString()
    const { data } = await supabase
      .from('seguimientos')
      .select(`
        id, fecha_programada, estado,
        paciente:pacientes(id, nombre, apellido, telefono)
      `)
      .lte('fecha_programada', ahora)
      .eq('estado', 'pendiente')
      .order('fecha_programada', { ascending: true })
      .limit(10)
    return data || []
  },
}
