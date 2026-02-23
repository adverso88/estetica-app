'use client'

import { useState, useEffect } from 'react'
import { profesionalService } from '../services/lawyerService'
import type { Profesional } from '@/types/database'

export function useLawyer(id: string) {
  const [profesional, setProfesional] = useState<Profesional | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfesional() {
      try {
        setLoading(true)
        setError(null)
        const data = await profesionalService.getById(id)
        setProfesional(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar profesional')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProfesional()
    }
  }, [id])

  return { profesional, loading, error }
}
