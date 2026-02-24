import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Calendar,
  AlertCircle,
  Wallet,
  TrendingDown,
  MessageCircle,
} from 'lucide-react'
import { dashboardService } from '@/features/dashboard/services/dashboardService'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const stats = await dashboardService.getStatsAdmin()
  const valorAgendaHoy =
    (stats.citasHoyList as { precio?: number }[])?.reduce((s, c) => s + (c.precio ?? 0), 0) ?? 0
  const tasaConfirmacion =
    stats.citasHoy > 0
      ? Math.round((stats.citasConfirmadas / stats.citasHoy) * 100)
      : 0

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Panel de Control</h1>
          <p className="text-foreground-secondary">Bienvenido a EstéticaApp. Esto es lo que sucede hoy en tu clínica.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/citas/nueva" className="btn-primary shadow-rose">
            + Nueva Cita
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Calendar className="text-primary-500" />}
          title="Citas para Hoy"
          value={stats.citasHoy}
          subValue={`${stats.citasConfirmadas} confirmadas`}
        />
        <StatCard
          icon={<Wallet className="text-primary-500" />}
          title="Valor agenda hoy"
          value={`$${valorAgendaHoy.toLocaleString('es-CO')}`}
          subValue={`Ingresos del mes: $${stats.ingresosMes.toLocaleString('es-CO')}`}
        />
        <StatCard
          icon={<Users className="text-primary-500" />}
          title="Pacientes"
          value={stats.pacientesTotal}
          subValue="Total registrados"
        />
        <div className="card-elevated p-5 bg-error-50 border-error-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingDown size={48} className="text-error-600" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-error-100 flex items-center justify-center text-error-600">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-bold text-error-700 uppercase tracking-wider font-heading">Dinero Perdido</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-error-700 font-heading">${Math.round(stats.costoNoShows).toLocaleString('es-CO')}</span>
            <span className="text-[11px] text-error-600 mt-1 font-medium">Por no-shows este mes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">Agenda de Hoy</h2>
            <Link href="/agenda" className="text-sm text-primary-500 font-semibold hover:underline">Ver agenda completa</Link>
          </div>
          <div className="card-elevated divide-y divide-border-light overflow-hidden">
            {(stats.citasHoyList as { fecha_hora?: string; paciente?: { nombre?: string; apellido?: string }; tratamiento?: { nombre?: string }; estado?: string }[])?.length
              ? (stats.citasHoyList as { fecha_hora?: string; paciente?: { nombre?: string; apellido?: string }; tratamiento?: { nombre?: string }; estado?: string }[]).map((c: { fecha_hora?: string; paciente?: { nombre?: string; apellido?: string }; tratamiento?: { nombre?: string }; estado?: string }) => (
                <AppointmentRow
                  key={c.fecha_hora + (c.paciente?.nombre ?? '')}
                  time={c.fecha_hora ? new Date(c.fecha_hora).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                  patient={`${c.paciente?.nombre ?? ''} ${c.paciente?.apellido ?? ''}`.trim() || 'Sin asignar'}
                  treatment={c.tratamiento?.nombre ?? 'General'}
                  status={c.estado === 'confirmada' ? 'confirmada' : 'pendiente'}
                />
              ))
              : (
                <div className="p-6 text-center text-foreground-muted text-sm">
                  No hay citas programadas para hoy.
                </div>
              )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6 space-y-4 bg-primary-500 text-white shadow-rose">
            <div className="flex items-center gap-3">
              <MessageCircle size={24} />
              <h2 className="font-heading font-bold">Confirmaciones hoy</h2>
            </div>
            <p className="text-sm text-white/80">Citas confirmadas sobre total de hoy:</p>
            <div className="text-4xl font-bold font-heading">{tasaConfirmacion}%</div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all" style={{ width: `${tasaConfirmacion}%` }} />
            </div>
          </div>

          <div className="card-elevated p-6 space-y-4">
            <h2 className="font-heading font-bold text-foreground">Acciones rápidas</h2>
            <div className="space-y-2">
              <Link href="/consentimientos/demo-sign" className="block w-full btn-secondary text-xs py-2 text-center">
                Probar firma digital
              </Link>
              <Link href="/pacientes/nuevo" className="block w-full btn-ghost text-xs py-2 text-center border border-border-light rounded-lg">
                Nuevo paciente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  subValue,
}: {
  icon: React.ReactNode
  title: string
  value: React.ReactNode
  subValue?: string
}) {
  return (
    <div className="card-elevated p-5 flex flex-col group hover:border-primary-200 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-bold text-foreground-secondary uppercase tracking-wider font-heading">{title}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-foreground font-heading">{value}</span>
        {subValue && <span className="text-[11px] text-foreground-muted mt-1 font-medium">{subValue}</span>}
      </div>
    </div>
  )
}

function AppointmentRow({
  time,
  patient,
  treatment,
  status,
}: {
  time: string
  patient: string
  treatment: string
  status: string
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-blush/20 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-sm font-bold text-primary-600 w-12">{time}</div>
        <div>
          <p className="text-sm font-bold text-foreground">{patient}</p>
          <p className="text-xs text-foreground-secondary">{treatment}</p>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
          status === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}
      >
        {status === 'confirmada' ? 'Confirmada' : 'Pendiente'}
      </span>
    </div>
  )
}
