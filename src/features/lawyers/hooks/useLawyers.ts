'use client'

import { useState, useEffect } from 'react'
import { profesionalService, type ProfesionalFilters } from '../services/lawyerService'
import type { Profesional } from '@/types/database'

export function useLawyers(filters?: ProfesionalFilters) {
  const [lawyers, setLawyers] = useState<Profesional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLawyers() {
      try {
        setLoading(true)
        setError(null)
        const data = await profesionalService.getAll({
          ...filters,
          isActive: true
        })
        setLawyers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar profesionales')
      } finally {
        setLoading(false)
      }
    }

    fetchLawyers()
  }, [filters?.especialidad])

  return { lawyers, loading, error, refetch: () => { } }
}

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const data = await profesionalService.getSpecialties()
        setSpecialties(data)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  return { specialties, loading }
}
