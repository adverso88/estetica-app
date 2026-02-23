import { createClient } from '@/lib/supabase/client'
import type { Profesional } from '@/types/database'

export interface ProfesionalFilters {
  especialidad?: string
  isActive?: boolean
}

export const profesionalService = {
  async getAll(filters?: ProfesionalFilters): Promise<Profesional[]> {
    const supabase = createClient()
    let query = supabase
      .from('profesionales')
      .select(`
        *,
        profile:profiles(id, full_name, email, avatar_url, role)
      `)
      .order('nombre', { ascending: true })

    if (filters?.especialidad) {
      query = query.eq('especialidad', filters.especialidad)
    }
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Profesional[]
  },

  async getById(id: string): Promise<Profesional | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profesionales')
      .select(`
        *,
        profile:profiles(id, full_name, email, avatar_url, role)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as Profesional
  },

  async getSpecialties(): Promise<string[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profesionales')
      .select('especialidad')
      .eq('is_active', true)

    if (error) throw error
    return [...new Set(data.filter(l => l.especialidad).map(l => l.especialidad as string))]
  }
}
