'use server'

import { createClient } from '@/lib/supabase/server'

export interface CreateProfesionalInput {
  nombre: string
  especialidad: string
  bio?: string
  experiencia_anos: number
  tarifa_hora: number
  is_active?: boolean
}

export async function createProfesional(data: CreateProfesionalInput): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase.from('profesionales').insert({
    nombre: data.nombre.trim(),
    especialidad: data.especialidad.trim(),
    bio: data.bio?.trim() || null,
    experiencia_anos: Number(data.experiencia_anos) || 0,
    tarifa_hora: Number(data.tarifa_hora) || 0,
    rating: 0,
    is_active: data.is_active ?? true,
  })
  if (error) return error.message
  return null
}

export async function updateProfesional(
  id: string,
  data: Partial<CreateProfesionalInput>
): Promise<string | null> {
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (data.nombre !== undefined) payload.nombre = data.nombre.trim()
  if (data.especialidad !== undefined) payload.especialidad = data.especialidad.trim()
  if (data.bio !== undefined) payload.bio = data.bio.trim() || null
  if (data.experiencia_anos !== undefined) payload.experiencia_anos = Number(data.experiencia_anos) || 0
  if (data.tarifa_hora !== undefined) payload.tarifa_hora = Number(data.tarifa_hora) || 0
  if (data.is_active !== undefined) payload.is_active = data.is_active

  const { error } = await supabase.from('profesionales').update(payload).eq('id', id)
  if (error) return error.message
  return null
}
