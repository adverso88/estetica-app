'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CreateCitaDTO, UpdateCitaDTO, CitaEstado } from '@/types/database'

export async function crearCita(data: CreateCitaDTO) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('citas').insert({
    ...data,
    estado: 'agendada',
  })

  if (error) return { error: error.message }

  revalidatePath('/agenda')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function actualizarEstadoCita(
  id: string,
  estado: CitaEstado,
  razon_cancelacion?: string
) {
  const supabase = await createClient()

  const updateData: UpdateCitaDTO = { estado }
  if (razon_cancelacion) updateData.razon_cancelacion = razon_cancelacion

  const { error } = await supabase
    .from('citas')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/agenda')
  revalidatePath('/dashboard')
  revalidatePath(`/citas/${id}`)
  return { success: true }
}

export async function actualizarNotasCita(id: string, notas: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('citas')
    .update({ notas })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/citas/${id}`)
  return { success: true }
}

export async function reprogramarCita(id: string, nuevaFechaHora: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('citas')
    .update({ fecha_hora: nuevaFechaHora, estado: 'agendada' })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/agenda')
  revalidatePath(`/citas/${id}`)
  return { success: true }
}

// =====================================================
// Aliases de compatibilidad con el template LexAgenda
// (para evitar errores en archivos no migrados aún)
// =====================================================
type _AppointmentStatusLegacy = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export async function createAppointment(data: Record<string, unknown>) {
  return crearCita(data as unknown as import('@/types/database').CreateCitaDTO)
}

export async function updateAppointmentStatus(
  id: string,
  status: _AppointmentStatusLegacy,
  cancellationReason?: string
) {
  const estadoMap: Record<_AppointmentStatusLegacy, import('@/types/database').CitaEstado> = {
    pending: 'agendada',
    confirmed: 'confirmada',
    completed: 'completada',
    cancelled: 'cancelada',
  }
  return actualizarEstadoCita(id, estadoMap[status] || 'agendada', cancellationReason)
}

export async function addAppointmentNotes(id: string, notes: string) {
  return actualizarNotasCita(id, notes)
}

export async function rescheduleAppointment(id: string, newDate: string) {
  return reprogramarCita(id, newDate)
}
