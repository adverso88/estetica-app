'use server'

import { createClient } from '@/lib/supabase/server'

export async function createPlantilla(data: { nombre: string; contenido: string }): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase.from('consentimientos_plantillas').insert({
    nombre: data.nombre,
    contenido: data.contenido,
    is_active: true,
  })
  if (error) return error.message
  return null
}

export async function updatePlantilla(
  id: string,
  data: { nombre?: string; contenido?: string; is_active?: boolean }
): Promise<string | null> {
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (data.nombre !== undefined) payload.nombre = data.nombre
  if (data.contenido !== undefined) payload.contenido = data.contenido
  if (data.is_active !== undefined) payload.is_active = data.is_active
  const { error } = await supabase.from('consentimientos_plantillas').update(payload).eq('id', id)
  if (error) return error.message
  return null
}
