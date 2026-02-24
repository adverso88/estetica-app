// ============================================
// TIPOS DEL DOMINIO - APP CLÍNICA ESTÉTICA
// ============================================

export type UserRole = 'admin' | 'profesional' | 'recepcionista'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Profesional {
  id: string
  user_id: string | null
  nombre: string
  especialidad: string
  bio: string | null
  foto_url: string | null
  experiencia_anos: number
  tarifa_hora: number
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Relaciones
  profile?: Profile | null
  tratamientos?: Tratamiento[]
  // Aliases de retrocompatibilidad
  specialty?: string
  experience_years?: number
  hourly_rate?: number
}

export interface Tratamiento {
  id: string
  nombre: string
  descripcion: string | null
  duracion_minutos: number
  precio: number
  categoria: string
  is_active: boolean
  created_at: string
}

export interface Disponibilidad {
  id: string
  profesional_id: string
  dia_semana: number // 0=Domingo, 1=Lunes...6=Sábado
  hora_inicio: string // "09:00"
  hora_fin: string // "17:00"
  is_disponible: boolean
  created_at: string
}

export interface Paciente {
  id: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  fecha_nacimiento: string | null
  foto_url: string | null
  alergias: string | null
  medicamentos: string | null
  condiciones: string | null
  tipo_piel: string | null // seca, grasa, mixta, sensible, normal
  fuente_captacion: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export type CitaEstado =
  | 'agendada'
  | 'confirmada'
  | 'en_sala'
  | 'completada'
  | 'no_show'
  | 'cancelada'

export interface Cita {
  id: string
  paciente_id: string
  profesional_id: string
  tratamiento_id: string | null
  fecha_hora: string
  duracion_minutos: number
  precio: number
  estado: CitaEstado
  notas: string | null
  notas_paciente: string | null
  razon_cancelacion: string | null
  created_at: string
  updated_at: string
  // Relaciones expandidas
  paciente?: Paciente
  profesional?: Profesional & { profile?: Profile | null }
  tratamiento?: Tratamiento | null
  // Aliases de retrocompatibilidad
  lawyer?: Profesional & { profile?: Profile | null }
  client?: Paciente
}

export interface HistorialClinico {
  id: string
  cita_id: string | null
  paciente_id: string
  profesional_id: string
  tratamiento_id: string | null
  fecha: string
  unidades_usadas: number | null
  producto_nombre: string | null
  producto_lote: string | null
  zonas_tratadas: string | null
  notas_clinicas: string | null
  proxima_cita_recomendada_dias: number | null
  created_at: string
  // Relaciones
  paciente?: Paciente
  profesional?: Profesional
  tratamiento?: Tratamiento | null
}

export interface FotoPaciente {
  id: string
  paciente_id: string
  historial_id: string | null
  tipo: 'antes' | 'despues' | 'progreso'
  url: string
  descripcion: string | null
  created_at: string
}

export interface ConsentimientoPlantilla {
  id: string
  nombre: string
  contenido: string
  tratamiento_id: string | null
  is_active: boolean
  created_at: string
}

export interface ConsentimientoFirmado {
  id: string
  cita_id: string
  paciente_id: string
  plantilla_id: string | null
  firmado_en: string | null
  firma_data: string | null
  ip_address: string | null
  pdf_url: string | null
  created_at: string
}

export interface Seguimiento {
  id: string
  cita_id: string | null
  paciente_id: string
  fecha_programada: string
  estado: 'pendiente' | 'enviado' | 'respondido' | 'completado'
  mensaje: string | null
  respuesta: string | null
  respondido_en: string | null
  created_at: string
  // Relaciones
  paciente?: Paciente
}

export interface Notificacion {
  id: string
  user_id: string
  tipo: string
  titulo: string
  mensaje: string
  data: Record<string, unknown> | null
  leida: boolean
  created_at: string
}

export type NotificationType =
  | 'appointment_created'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'payment_received'
  | 'case_update'
  | 'document_request'
  | string

/** @deprecated usar Notificacion */
export type Notification = Notificacion

// ============================================
// DTOs
// ============================================

export interface CreateCitaDTO {
  paciente_id: string
  profesional_id: string
  tratamiento_id?: string
  fecha_hora: string
  duracion_minutos?: number
  precio?: number
  notas_paciente?: string
}

export interface UpdateCitaDTO {
  estado?: CitaEstado
  notas?: string
  fecha_hora?: string
  razon_cancelacion?: string
  precio?: number
}

export interface CreatePacienteDTO {
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  fecha_nacimiento?: string
  alergias?: string
  medicamentos?: string
  condiciones?: string
  tipo_piel?: string
  fuente_captacion?: string
  notas?: string
}

export interface CreateProfesionalDTO {
  nombre: string
  especialidad: string
  bio?: string
  experiencia_anos?: number
  tarifa_hora?: number
}

// ============================================
// Constantes de dominio
// ============================================

export const ESTADO_CITA_COLORS: Record<CitaEstado, { bg: string; text: string; border: string; label: string }> = {
  agendada: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', label: 'Agendada' },
  confirmada: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', label: 'Confirmada' },
  en_sala: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', label: 'En Sala' },
  completada: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', label: 'Completada' },
  no_show: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', label: 'No Show' },
  cancelada: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-300', label: 'Cancelada' },
}

export const CATEGORIAS_TRATAMIENTO = [
  'facial',
  'inyectables',
  'laser',
  'mesoterapia',
  'corporal',
  'micropigmentacion',
  'general',
] as const

export const TIPOS_PIEL = ['normal', 'seca', 'grasa', 'mixta', 'sensible'] as const

export const FUENTES_CAPTACION = [
  'instagram',
  'facebook',
  'google',
  'referido',
  'directa',
  'otro',
] as const

export const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// ============================================
// Aliases de retrocompatibilidad con LexAgenda
// (para que archivos no migrados sigan compilando)
// ============================================

/** @deprecated usar CitaEstado */
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

/** Respuesta de la tabla appointments (lawyers/clients); puede usar status o estado según esquema */
export type AppointmentWithRelations = Cita & {
  status?: AppointmentStatus
  scheduled_at?: string
  client_id?: string
  lawyer_id?: string
  appointment_type_id?: string
}

/** @deprecated usar UpdateCitaDTO */
export interface UpdateAppointmentDTO {
  estado?: CitaEstado
  notas?: string
  fecha_hora?: string
  razon_cancelacion?: string
  cancellation_reason?: string
  status?: AppointmentStatus
}

/** @deprecated usar CreateCitaDTO */
export interface CreateAppointmentDTO extends Partial<CreateCitaDTO> {
  lawyer_id?: string
  appointment_type_id?: string
  scheduled_at?: string
  notes?: string
}

/** @deprecated usar Tratamiento */
export interface AppointmentType extends Partial<Tratamiento> {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
}

/** @deprecated usar Disponibilidad */
export interface Availability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface Lawyer {
  id: string
  user_id: string
  nombre: string
}

export type CreateLawyerDTO = Partial<Profesional> & { user_id: string }
export type UpdateLawyerDTO = Partial<Profesional>
export type LawyerWithProfile = Profesional
export type CreateClientDTO = CreatePacienteDTO
export type ClientProfile = Paciente

// Tipos de Proyectos (Legacy LexAgenda)
export type ProjectStatus = 'pending' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  title: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  budget: number
  amount_paid: number
  due_date: string | null
  case_type: string | null
  lawyer_id: string | null
  client_id: string | null
  created_at: string
  updated_at: string
}

export interface ProjectWithRelations extends Project {
  lawyer?: Profesional & { profile?: Profile | null }
  client?: Paciente & { profile?: Profile | null } & { full_name?: string }
  paciente?: Paciente
  profesional?: Profesional & { profile?: Profile | null }
}
