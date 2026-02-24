import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/components'

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      {/* Logo móvil */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-primary-500">EstéticaApp</span>
      </div>

      <div className="text-center lg:text-left">
        <h1 className="text-display-xs text-foreground">Recupera tu contraseña</h1>
        <p className="mt-2 text-foreground-secondary">Ingresa tu correo y te enviaremos un enlace para restablecerla</p>
      </div>

      <ForgotPasswordForm />

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm font-medium text-foreground-secondary hover:text-foreground"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al inicio de sesión
      </Link>
    </div>
  )
}
