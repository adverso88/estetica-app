'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPlantilla } from '@/actions/consentimientos'

export function NuevaPlantillaForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [contenido, setContenido] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setError('El nombre de la plantilla es requerido')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const err = await createPlantilla({ nombre: nombre.trim(), contenido: contenido.trim() })
      if (err) throw new Error(err)
      router.push('/consentimientos')
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
        <label className="block text-sm font-semibold text-foreground mb-1.5">Nombre de la plantilla</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Consentimiento Botox Facial"
          className="input-field w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Contenido (texto o Markdown)</label>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Descripción del tratamiento, riesgos, autorizaciones..."
          className="input-field w-full min-h-[200px] resize-y"
          rows={10}
        />
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-error-50 text-error-700 text-sm">{error}</div>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Guardando...' : 'Crear plantilla'}
        </button>
        <Link href="/consentimientos" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
