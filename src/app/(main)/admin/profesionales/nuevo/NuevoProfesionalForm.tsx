'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProfesional } from '@/actions/profesionales'

export function NuevoProfesionalForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombre: '',
    especialidad: '',
    bio: '',
    experiencia_anos: 5,
    tarifa_hora: 150000,
    is_active: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.especialidad.trim()) {
      setError('Nombre y especialidad son requeridos')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const err = await createProfesional({
        nombre: form.nombre,
        especialidad: form.especialidad,
        bio: form.bio || undefined,
        experiencia_anos: form.experiencia_anos,
        tarifa_hora: form.tarifa_hora,
        is_active: form.is_active,
      })
      if (err) throw new Error(err)
      router.push('/admin/profesionales')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Nombre completo *</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
          placeholder="Ej. Dra. María García"
          className="input-field w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Especialidad *</label>
        <input
          type="text"
          value={form.especialidad}
          onChange={(e) => setForm((p) => ({ ...p, especialidad: e.target.value }))}
          placeholder="Ej. Medicina Estética, Dermatología"
          className="input-field w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Bio (opcional)</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          placeholder="Breve descripción profesional..."
          className="input-field w-full min-h-[80px] resize-y"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Años de experiencia</label>
          <input
            type="number"
            min={0}
            max={50}
            value={form.experiencia_anos}
            onChange={(e) => setForm((p) => ({ ...p, experiencia_anos: parseInt(e.target.value, 10) || 0 }))}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Tarifa por hora (COP)</label>
          <input
            type="number"
            min={0}
            step={10000}
            value={form.tarifa_hora}
            onChange={(e) => setForm((p) => ({ ...p, tarifa_hora: parseInt(e.target.value, 10) || 0 }))}
            className="input-field w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={form.is_active}
          onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
          className="rounded border-border"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-foreground">Activo (visible en agenda y citas)</label>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-error-50 text-error-700 text-sm">{error}</div>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Guardando...' : 'Agregar profesional'}
        </button>
        <Link href="/admin/profesionales" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
