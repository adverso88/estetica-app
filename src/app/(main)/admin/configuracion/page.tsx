import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, Building2, Bell, Shield } from 'lucide-react'

export const metadata = { title: 'Configuración | EstéticaApp' }

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Configuración</h1>
        <p className="text-foreground-secondary text-sm mt-1">Ajustes generales de la clínica y la cuenta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-elevated p-6 flex items-center gap-4 opacity-75">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground">Datos de la clínica</h2>
            <p className="text-sm text-foreground-secondary">Próximamente: nombre, dirección, horarios y contacto</p>
          </div>
        </div>

        <div className="card-elevated p-6 flex items-center gap-4 opacity-75">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground">Notificaciones</h2>
            <p className="text-sm text-foreground-secondary">Próximamente: recordatorios y alertas</p>
          </div>
        </div>

        <div className="card-elevated p-6 flex items-center gap-4 opacity-75">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground">Privacidad y seguridad</h2>
            <p className="text-sm text-foreground-secondary">Próximamente: 2FA y sesiones</p>
          </div>
        </div>
      </div>

      <div className="card-elevated p-6 border-primary-100 bg-blush/10">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading font-semibold text-foreground">Más opciones en camino</h3>
            <p className="text-sm text-foreground-secondary mt-1">
              Esta sección se irá completando en próximas versiones: integración WhatsApp, facturación, reportes y personalización de la app.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
