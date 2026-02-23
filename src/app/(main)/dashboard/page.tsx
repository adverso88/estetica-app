import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  Wallet,
  TrendingDown,
  MessageCircle,
  CheckCircle2
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Simulamos datos para el MVP (En producción vendrían de dashboardService)
  const stats = {
    citasHoy: 12,
    confirmadas: 8,
    ingresosHoy: 850,
    noShowsMes: 4,
    valorPromedioCita: 120,
    pendientesConfirmar: 3
  }

  const dineroPerdido = stats.noShowsMes * stats.valorPromedioCita

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

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Calendar className="text-primary-500" />}
          title="Citas para Hoy"
          value={stats.citasHoy}
          subValue={`${stats.confirmadas} confirmadas`}
        />
        <StatCard
          icon={<Wallet className="text-primary-500" />}
          title="Ingresos Hoy"
          value={`$${stats.ingresosHoy}`}
          subValue="75% de la meta diaria"
          trend="+12%"
        />
        <StatCard
          icon={<Users className="text-primary-500" />}
          title="Nuevos Pacientes"
          value="5"
          subValue="Este mes"
          trend="+2"
        />
        {/* LA MÉTRICA WOW: DINERO PERDIDO */}
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
            <span className="text-2xl font-bold text-error-700 font-heading">${dineroPerdido}</span>
            <span className="text-[11px] text-error-600 mt-1 font-medium">Por no-shows este mes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Citas de hoy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">Agenda de Hoy</h2>
            <Link href="/agenda" className="text-sm text-primary-500 font-semibold hover:underline">Ver agenda completa</Link>
          </div>
          <div className="card-elevated divide-y divide-border-light overflow-hidden">
            <AppointmentRow time="09:00" patient="Lucía Méndez" treatment="Botox Facial" status="confirmada" />
            <AppointmentRow time="10:30" patient="Andrés Castro" treatment="Limpieza Profunda" status="pendiente" />
            <AppointmentRow time="12:00" patient="Carla Rojas" treatment="Ácido Hialurónico" status="confirmada" />
          </div>
        </div>

        {/* Notificaciones y Alertas */}
        <div className="space-y-6">
          <div className="card-elevated p-6 space-y-4 bg-primary-500 text-white shadow-rose">
            <div className="flex items-center gap-3">
              <MessageCircle size={24} />
              <h2 className="font-heading font-bold">WhatsApp Engine</h2>
            </div>
            <p className="text-sm text-white/80">Tasa de confirmación automática este mes:</p>
            <div className="text-4xl font-bold font-heading">92%</div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[92%]" />
            </div>
            <p className="text-[10px] text-white/60 italic">* 24 citas confirmadas vía WhatsApp sin intervención humana.</p>
          </div>

          <div className="card-elevated p-6 space-y-4">
            <h2 className="font-heading font-bold text-foreground">Pendientes de Firma</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blush/30 rounded-xl border border-primary-100">
                <span className="text-sm font-medium text-foreground">Lucía Méndez</span>
                <span className="text-[10px] bg-error-100 text-error-700 px-2 py-1 rounded-full font-bold">SIN FIRMAR</span>
              </div>
              <button className="w-full btn-secondary text-xs py-2">Enviar Recordatorio QR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subValue, trend }: any) {
  return (
    <div className="card-elevated p-5 flex flex-col group hover:border-primary-200 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-bold text-foreground-secondary uppercase tracking-wider font-heading">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground font-heading">{value}</span>
          <span className="text-[11px] text-foreground-muted mt-1 font-medium">{subValue}</span>
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 mb-1">{trend}</span>
        )}
      </div>
    </div>
  )
}

function AppointmentRow({ time, patient, treatment, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-blush/20 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-sm font-bold text-primary-600 w-12">{time}</div>
        <div>
          <p className="text-sm font-bold text-foreground">{patient}</p>
          <p className="text-xs text-foreground-secondary">{treatment}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${status === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 animate-pulse'
          }`}>
          {status}
        </span>
        <button className="p-2 hover:bg-white rounded-lg transition-colors text-foreground-muted hover:text-primary-500">
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  )
}
