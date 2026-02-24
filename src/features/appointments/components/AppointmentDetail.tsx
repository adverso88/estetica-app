'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateAppointmentStatus, addAppointmentNotes } from '@/actions/appointments'
import type { AppointmentWithRelations } from '@/types/database'

interface AppointmentDetailProps {
  appointment: AppointmentWithRelations
  userRole: 'cliente' | 'especialista' | any
}

export function AppointmentDetail({ appointment, userRole }: AppointmentDetailProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(appointment.notas || '')

  const handleStatusChange = async (status: 'confirmed' | 'cancelled' | 'completed') => {
    setLoading(true)
    const result = await updateAppointmentStatus(appointment.id, status as any)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  const handleSaveNotes = async () => {
    setLoading(true)
    const result = await addAppointmentNotes(appointment.id, notes)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    }
  }

  const scheduledDate = new Date(appointment.fecha_hora)
  const endTime = new Date(scheduledDate.getTime() + appointment.duracion_minutos * 60000)

  const statusVariant: Record<string, 'pending' | 'confirmed' | 'cancelled'> = {
    pending: 'pending',
    agendada: 'pending',
    confirmada: 'confirmed',
    cancelada: 'cancelled',
    completada: 'confirmed',
    no_show: 'cancelled'
  }

  const statusLabel: Record<string, string> = {
    agendada: 'Agendada',
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
    completada: 'Completada',
    en_sala: 'En Sala',
    no_show: 'No asistió'
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {appointment.tratamiento?.nombre || 'Cita Estética'}
            </h2>
            <p className="text-foreground-secondary">
              {appointment.tratamiento?.descripcion}
            </p>
          </div>
          <Badge variant={statusVariant[appointment.estado] || 'pending'}>
            {statusLabel[appointment.estado] || appointment.estado}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-foreground mb-3">Fecha y Hora</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {scheduledDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {scheduledDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                {' - '}
                {endTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                {' '}({appointment.duracion_minutos} min)
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3">
              {userRole === 'client' ? 'Especialista' : 'Paciente'}
            </h3>
            <div className="flex items-center gap-3">
              {userRole === 'client' ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {appointment.lawyer?.profile?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.lawyer?.profile?.full_name}</p>
                    <p className="text-sm text-foreground-secondary">{appointment.lawyer?.specialty}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {appointment.paciente?.nombre?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.paciente?.nombre} {appointment.paciente?.apellido}</p>
                    <p className="text-sm text-foreground-secondary">{appointment.paciente?.telefono || 'Sin teléfono'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {appointment.tratamiento?.precio && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-foreground-secondary">Costo del tratamiento</span>
              <span className="text-xl font-semibold text-secondary-600">
                ${appointment.tratamiento.precio}
              </span>
            </div>
          </div>
        )}
      </Card>

      {userRole === 'especialista' && (
        <Card className="p-6">
          <h3 className="font-medium text-foreground mb-3">Notas del especialista</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={4}
            placeholder="Agregar notas sobre la cita..."
          />
          <Button
            onClick={handleSaveNotes}
            disabled={loading}
            className="mt-3"
            size="sm"
          >
            Guardar notas
          </Button>
        </Card>
      )}

      {appointment.notas_paciente && (
        <Card className="p-6">
          <h3 className="font-medium text-foreground mb-3">Notas del paciente</h3>
          <p className="text-foreground-secondary">{appointment.notas_paciente}</p>
        </Card>
      )}

      {appointment.estado === 'agendada' && (
        <Card className="p-6">
          <h3 className="font-medium text-foreground mb-4">Acciones</h3>
          <div className="flex flex-wrap gap-3">
            {userRole === 'lawyer' && (
              <Button
                onClick={() => handleStatusChange('confirmed')}
                disabled={loading}
              >
                Confirmar Cita
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading}
              className="text-error-600 border-error-300 hover:bg-error-50"
            >
              Cancelar Cita
            </Button>
          </div>
        </Card>
      )}

      {appointment.estado === 'confirmada' && userRole === 'especialista' && (
        <Card className="p-6">
          <h3 className="font-medium text-foreground mb-4">Acciones</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
            >
              Marcar como Completada
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading}
              className="text-error-600 border-error-300 hover:bg-error-50"
            >
              Cancelar Cita
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
