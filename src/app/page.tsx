import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'EstéticaApp - Gestión Premium de Clínicas Estéticas',
  description: 'Sistema integral para la gestión de citas, pacientes e historial clínico en clínicas de estética.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-8 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl gradient-rose flex items-center justify-center shadow-rose rotate-3">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>

      <div className="max-w-2xl space-y-4">
        <h1 className="font-heading text-5xl font-bold text-foreground leading-tight">
          Eleva la gestión de tu <span className="text-primary-500">Clínica Estética</span>
        </h1>
        <p className="text-xl text-foreground-secondary">
          EstéticaApp es la herramienta definitiva para profesionales que buscan excelencia en el seguimiento de pacientes y agendamiento premium.
        </p>
      </div>

      <div className="flex gap-4">
        <a href="/login" className="btn-primary text-lg px-10 py-4 shadow-rose">
          Iniciar Sesión
        </a>
        <a href="/register" className="btn-secondary text-lg px-10 py-4">
          Comenzar Gratis
        </a>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard
          icon="📅"
          title="Agenda Inteligente"
          desc="Gestión visual de citas con recordatorios automáticos."
        />
        <FeatureCard
          icon="🧬"
          title="Ficha Clínica"
          desc="Historial detallado, tipo de piel, alergias y evoluciones."
        />
        <FeatureCard
          icon="✨"
          title="Branding Premium"
          desc="Una interfaz a la altura de tus tratamientos estéticos."
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-blush/30 border border-primary-100 text-left">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-heading font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-foreground-secondary">{desc}</p>
    </div>
  )
}
