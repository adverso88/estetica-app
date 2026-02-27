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
              {['admin', 'master', 'recepcionista'].includes(userRole) ? 'Profesional / Paciente' : userRole === 'paciente' ? 'Profesional' : 'Paciente'}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                  {appointment.profesional?.nombre?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="font-medium">{appointment.profesional?.nombre}</p>
                  <p className="text-sm text-foreground-secondary">{appointment.profesional?.especialidad}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {appointment.paciente?.nombre?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-medium">{appointment.paciente?.nombre} {appointment.paciente?.apellido}</p>
                  <p className="text-sm text-foreground-secondary">{appointment.paciente?.telefono || 'Sin teléfono'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {appointment.precio && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-foreground-secondary">Costo del tratamiento</span>
              <span className="text-xl font-semibold text-primary-600">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(appointment.precio)}
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
          <h3 className="font-medium text-foreground mb-4">Acciones Disponibles</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStatusChange('confirmada' as any)}
              disabled={loading}
              className="bg-primary-600"
            >
              Confirmar Cita
            </Button>
            {appointment.paciente?.telefono && (
              <a
                href={`https://wa.me/${appointment.paciente.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${appointment.paciente.nombre}, te confirmamos tu cita para ${appointment.tratamiento?.nombre} el día ${scheduledDate.toLocaleDateString()} a las ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. ¿Confirmas tu asistencia?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 1.056 3.738 1.613 5.713 1.614h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Confirmar p/ WhatsApp
              </a>
            )}
            <Button
              variant="outline"
              onClick={() => handleStatusChange('cancelada' as any)}
              disabled={loading}
              className="text-error-600 border-error-300 hover:bg-error-50"
            >
              Cancelar Cita
            </Button>
          </div>
        </Card>
      )}

      {appointment.estado === 'confirmada' && (
        <Card className="p-6">
          <h3 className="font-medium text-foreground mb-4">Acciones de Atención</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStatusChange('completada' as any)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Finalizar Atención
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange('cancelada' as any)}
              disabled={loading}
              className="text-error-600 border-error-300 hover:bg-error-50"
            >
              Cancelar Cita
            </Button>
          </div>
        </Card>
      )}

      {appointment.estado === 'completada' && (
        <Card className="p-6">
          <h3 className="font-medium text-foreground mb-4">Gestión de Cobro</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-foreground-secondary uppercase mb-1">Método de Pago</label>
              <select className="input-field w-full" id="payment_method">
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="transferencia">Transferencia</option>
                <option value="bre-b">Bre-B</option>
              </select>
            </div>
            <Button
              onClick={async () => {
                const method = (document.getElementById('payment_method') as HTMLSelectElement).value
                setLoading(true)
                const supabase = (await import('@/lib/supabase/client')).createClient()
                const { error } = await supabase.from('payments').insert({
                  appointment_id: appointment.id,
                  amount: appointment.precio || 0,
                  status: 'completed',
                  payment_method: method,
                  paid_at: new Date().toISOString()
                })
                setLoading(false)
                if (error) alert(error.message)
                else {
                  alert('Pago registrado con éxito')
                  router.refresh()
                }
              }}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Registrar Pago
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
