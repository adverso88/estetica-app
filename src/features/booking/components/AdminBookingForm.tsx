'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { AppointmentType } from '@/types/database'

interface Lawyer {
  id: string
  name: string
  email: string
  specialty: string
}

interface ExistingClient {
  id: string
  nombre: string
  apellido: string
  email?: string | null
  telefono?: string | null
}

interface AdminBookingFormProps {
  lawyers: Lawyer[]
  appointmentTypes: AppointmentType[]
  existingClients: ExistingClient[]
}

export function AdminBookingForm({ lawyers, appointmentTypes, existingClients }: AdminBookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [selectedLawyer, setSelectedLawyer] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')

  // Client state
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('new')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const selectedAppointmentType = appointmentTypes.find(t => t.id === selectedType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      let clientId: string

      if (clientMode === 'existing' && selectedClientId) {
        clientId = selectedClientId
      } else {
        // Create new client
        if (!clientName || !clientEmail || !clientPhone) {
          setError('Por favor complete todos los datos del paciente')
          setLoading(false)
          return
        }

        // Dividir nombre y apellido
        const nameParts = clientName.trim().split(' ')
        const nombre = nameParts[0]
        const apellido = nameParts.slice(1).join(' ') || ' '

        // Check if client email already exists
        const { data: existingClient } = await supabase
          .from('pacientes')
          .select('id')
          .eq('email', clientEmail)
          .single()

        if (existingClient) {
          clientId = existingClient.id
          // Update client info
          await supabase
            .from('pacientes')
            .update({ nombre, apellido, telefono: clientPhone })
            .eq('id', clientId)
        } else {
          // Create new client
          const { data: newClient, error: clientError } = await supabase
            .from('pacientes')
            .insert({
              nombre,
              apellido,
              email: clientEmail,
              telefono: clientPhone,
            })
            .select('id')
            .single()

          if (clientError) {
            throw new Error('Error al crear paciente: ' + clientError.message)
          }
          clientId = newClient.id
        }
      }

      // Build scheduled_at datetime
      const scheduledAt = `${selectedDate}T${selectedTime}:00`

      // Create appointment
      const { error: appointmentError } = await supabase
        .from('citas')
        .insert({
          profesional_id: selectedLawyer,
          paciente_id: clientId,
          tratamiento_id: selectedType,
          fecha_hora: scheduledAt,
          duracion_minutos: selectedAppointmentType?.duracion_minutos || 30,
          precio: selectedAppointmentType?.precio || 0,
          estado: 'agendada',
          notas: notes || null
        })

      if (appointmentError) {
        throw new Error('Error al crear cita: ' + appointmentError.message)
      }

      // Send email notification
      const lawyer = lawyers.find(l => l.id === selectedLawyer)
      try {
        const baseUrl = window.location.origin
        await fetch(`${baseUrl}/api/email/appointment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'created',
            appointmentId: 'admin-created',
            clientName: clientMode === 'existing'
              ? `${existingClients.find(c => c.id === selectedClientId)?.nombre} ${existingClients.find(c => c.id === selectedClientId)?.apellido}`
              : clientName,
            clientEmail: clientMode === 'existing'
              ? existingClients.find(c => c.id === selectedClientId)?.email
              : clientEmail,
            lawyerName: lawyer?.name || 'Especialista',
            lawyerEmail: lawyer?.email || '',
            appointmentDate: new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            appointmentTime: selectedTime,
            appointmentType: selectedAppointmentType?.name || 'Consulta',
            duration: selectedAppointmentType?.duration_minutes || 30,
          }),
        })
      } catch {
        // Email failed but appointment was created
        console.error('Failed to send email notification')
      }

      router.push('/calendar')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cita')
    } finally {
      setLoading(false)
    }
  }

  // Generate time slots
  const timeSlots = []
  for (let h = 8; h < 19; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`)
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`)
  }

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lawyer Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">1. Seleccionar Especialista</h3>
        <select
          value={selectedLawyer}
          onChange={(e) => setSelectedLawyer(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Seleccione un especialista</option>
          {lawyers.map(lawyer => (
            <option key={lawyer.id} value={lawyer.id}>
              {lawyer.name} - {lawyer.specialty}
            </option>
          ))}
        </select>
      </Card>

      {/* Client Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">2. Datos del Paciente</h3>

        {/* Toggle between existing/new client */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setClientMode('new')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${clientMode === 'new'
              ? 'bg-accent-500 text-white'
              : 'bg-gray-100 text-foreground-secondary hover:bg-gray-200'
              }`}
          >
            Nuevo Paciente
          </button>
          <button
            type="button"
            onClick={() => setClientMode('existing')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${clientMode === 'existing'
              ? 'bg-accent-500 text-white'
              : 'bg-gray-100 text-foreground-secondary hover:bg-gray-200'
              }`}
          >
            Paciente Existente
          </button>
        </div>

        {clientMode === 'existing' ? (
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            required
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">Seleccione un paciente</option>
            {existingClients.map(client => (
              <option key={client.id} value={client.id}>
                {client.nombre} {client.apellido} {client.telefono ? `(${client.telefono})` : ''}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre completo"
              required={clientMode === 'new'}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Email"
              required={clientMode === 'new'}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Telefono"
              required={clientMode === 'new'}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        )}
      </Card>

      {/* Appointment Type */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">3. Tipo de Cita</h3>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Seleccione tipo de cita</option>
          {appointmentTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.duration_minutes} min - ${type.price}
            </option>
          ))}
        </select>
      </Card>

      {/* Date & Time */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">4. Fecha y Hora</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground-secondary mb-2">Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              required
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-secondary mb-2">Hora</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="">Seleccione hora</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">5. Notas (Opcional)</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas adicionales sobre la cita..."
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
        />
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-xl p-4">
          <p className="text-error-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Cita'}
        </Button>
      </div>
    </form>
  )
}
