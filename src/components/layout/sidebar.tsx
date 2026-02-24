'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signout } from '@/actions/auth'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Stethoscope,
  Clock,
  ClipboardCheck,
  Zap
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
    roles: ['admin', 'recepcionista']
  },
  {
    label: 'Agenda',
    href: '/agenda',
    icon: <Calendar size={20} />,
    roles: ['admin', 'recepcionista', 'profesional']
  },
  {
    label: 'Pacientes',
    href: '/pacientes',
    icon: <Users size={20} />,
    roles: ['admin', 'recepcionista', 'profesional']
  },
  {
    label: 'Historial Médico',
    href: '/historial',
    icon: <Stethoscope size={20} />,
    roles: ['admin', 'profesional']
  },
  {
    label: 'Consentimientos',
    href: '/consentimientos',
    icon: <ClipboardCheck size={20} />,
    roles: ['admin', 'recepcionista', 'profesional']
  },
  {
    label: 'Seguimientos',
    href: '/seguimientos',
    icon: <Zap size={20} />,
    roles: ['admin', 'profesional']
  },
  {
    label: 'Tratamientos',
    href: '/admin/tratamientos',
    icon: <Clock size={20} />,
    roles: ['admin']
  },
  {
    label: 'Configuración',
    href: '/admin/configuracion',
    icon: <Settings size={20} />,
    roles: ['admin']
  }
]

interface SidebarProps {
  userEmail?: string
  userDisplayName?: string
  userInitials?: string
}

export function Sidebar({ userEmail = 'admin@estetica.com', userDisplayName = 'Admin Clínica', userInitials = 'AD' }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border-light flex flex-col z-40 transition-all">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-rose flex items-center justify-center shadow-rose rotate-3 group-hover:rotate-0 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary-600 font-heading">EstéticaApp</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                  ? 'bg-blush text-primary-600 shadow-sm border border-primary-100 shadow-rose/10'
                  : 'text-foreground-secondary hover:bg-blush/30 hover:text-primary-500'
                }`}
            >
              <span className={`${isActive ? 'text-primary-500' : 'text-foreground-muted group-hover:text-primary-400'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer / User */}
      <div className="p-4 border-t border-border-light">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blush/20">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{userDisplayName}</p>
            <p className="text-[10px] text-foreground-muted truncate">{userEmail}</p>
          </div>
          <form action={signout}>
            <button type="submit" className="p-2 text-foreground-muted hover:text-error-500 transition-colors" title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
