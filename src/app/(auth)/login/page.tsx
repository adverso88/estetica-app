import Link from 'next/link'
import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Logo móvil */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-rose flex items-center justify-center shadow-rose">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-primary-500 font-heading">EstéticaApp</span>
      </div>

      <div className="text-center lg:text-left">
        <h1 className="text-display-xs text-foreground">Bienvenido de vuelta</h1>
        <p className="mt-2 text-foreground-secondary">Inicia sesión en tu cuenta para continuar</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-foreground-secondary">
        ¿No tienes una cuenta?{' '}
        <Link href="/signup" className="font-medium text-primary-500 hover:text-primary-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
