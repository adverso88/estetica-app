'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ProjectWithRelations, ProjectStatus, ProjectPriority, UserRole } from '@/types/database'

interface ProjectsListProps {
  projects: ProjectWithRelations[]
  lawyers: { id: string; profile: { full_name: string } }[]
  userRole: UserRole
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  on_hold: 'En espera',
  completed: 'Completado',
  cancelled: 'Cancelado'
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
  pending: 'bg-warning-100 text-warning-700',
  active: 'bg-success-100 text-success-700',
  on_hold: 'bg-gray-100 text-gray-700',
  completed: 'bg-accent-100 text-accent-700',
  cancelled: 'bg-error-100 text-error-700'
}

const PRIORITY_LABELS: Record<ProjectPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
}

const PRIORITY_COLORS: Record<ProjectPriority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
}

// Helper to get paciente name
const getPacienteName = (paciente: ProjectWithRelations['client'] | ProjectWithRelations['paciente']): string => {
  if (!paciente) return 'Sin paciente'
  return (paciente as any).nombre ? `${(paciente as any).nombre} ${(paciente as any).apellido || ''}` : (paciente as any).profile?.full_name || (paciente as any).full_name || 'Sin nombre'
}

export function ProjectsList({ projects, lawyers, userRole }: ProjectsListProps) {
  const [selectedLawyer, setSelectedLawyer] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const p_id = (project as any).profesional_id || project.lawyer_id
      if (selectedLawyer !== 'all' && p_id !== selectedLawyer) return false
      if (selectedStatus !== 'all' && project.status !== selectedStatus) return false
      if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
  }, [projects, selectedLawyer, selectedStatus, searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Calculate totals
  const totals = useMemo(() => {
    return filteredProjects.reduce((acc, p) => ({
      budget: acc.budget + (p.budget || 0),
      paid: acc.paid + (p.amount_paid || 0),
      pending: acc.pending + ((p.budget || 0) - (p.amount_paid || 0))
    }), { budget: 0, paid: 0, pending: 0 })
  }, [filteredProjects])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planes de Tratamiento</h1>
          <p className="text-foreground-secondary mt-1">
            Gestiona los procedimientos y seguimientos a largo plazo
          </p>
        </div>
        {userRole === 'admin' && (
          <Link href="/projects/new">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nuevo Plan
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary-50">
          <p className="text-sm text-foreground-secondary">Total Planes</p>
          <p className="text-2xl font-bold text-foreground">{filteredProjects.length}</p>
        </Card>
        <Card className="p-4 bg-success-50">
          <p className="text-sm text-foreground-secondary">Presupuesto Total</p>
          <p className="text-xl font-bold text-success-700">{formatCurrency(totals.budget)}</p>
        </Card>
        <Card className="p-4 bg-accent-50">
          <p className="text-sm text-foreground-secondary">Cobrado</p>
          <p className="text-xl font-bold text-accent-700">{formatCurrency(totals.paid)}</p>
        </Card>
        <Card className="p-4 bg-warning-50">
          <p className="text-sm text-foreground-secondary">Por Cobrar</p>
          <p className="text-xl font-bold text-warning-700">{formatCurrency(totals.pending)}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar plan o paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          {/* Lawyer filter (admin only) */}
          {userRole === 'admin' && lawyers.length > 0 && (
            <select
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
              className="px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">Todos los profesionales</option>
              {lawyers.map(l => (
                <option key={l.id} value={l.id}>{l.profile.full_name}</option>
              ))}
            </select>
          )}

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | 'all')}
            className="px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              userRole={userRole}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No hay planes activos</h3>
          <p className="text-foreground-secondary mb-6">
            {searchTerm || selectedStatus !== 'all' || selectedLawyer !== 'all'
              ? 'No se encontraron proyectos con los filtros seleccionados'
              : 'Comienza creando tu primer plan de tratamiento estético'}
          </p>
          {userRole === 'admin' && (
            <Link href="/projects/new">
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Crear Primer Proyecto
              </Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  )
}

function ProjectCard({
  project,
  formatCurrency,
  formatDate,
  userRole
}: {
  project: ProjectWithRelations
  formatCurrency: (n: number) => string
  formatDate: (d: string | null) => string
  userRole: any
}) {
  const progress = project.budget > 0
    ? Math.min((project.amount_paid / project.budget) * 100, 100)
    : 0

  const profesional = project.profesional || project.lawyer
  const paciente = project.paciente || project.client

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/projects/${project.id}`}
            className="font-semibold text-foreground hover:text-accent-600 truncate block"
          >
            {project.title}
          </Link>
          {project.case_type && (
            <p className="text-xs text-foreground-secondary mt-0.5">{project.case_type}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[project.status]}`}>
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <UserIcon className="w-4 h-4 text-foreground-secondary" />
          <span className="text-foreground-secondary truncate">
            {getPacienteName(paciente)}
          </span>
        </div>

        {userRole === 'admin' && profesional && (
          <div className="flex items-center gap-2 text-sm">
            <UserIcon className="w-4 h-4 text-foreground-secondary" />
            <span className="text-foreground-secondary truncate">
              Dr(a). {profesional.profile?.full_name || profesional.nombre || 'Especialista'}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="w-4 h-4 text-foreground-secondary" />
          <span className="text-foreground-secondary">
            {project.due_date ? `Vence: ${formatDate(project.due_date)}` : 'Sin fecha límite'}
          </span>
        </div>
      </div>

      {/* Priority badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_COLORS[project.priority]}`}>
          Prioridad: {PRIORITY_LABELS[project.priority]}
        </span>
      </div>

      {/* Financial progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-secondary">Progreso de cobro</span>
          <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-foreground-secondary">
          <span>{formatCurrency(project.amount_paid)} cobrado</span>
          <span>{formatCurrency(project.budget)} total</span>
        </div>
      </div>
    </Card>
  )
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
