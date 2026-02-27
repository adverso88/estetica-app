import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name?.trim() || user.email?.split('@')[0] || 'Usuario'
  const initials = displayName.split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const role = profile?.role || 'recepcionista'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        userEmail={user.email ?? ''}
        userDisplayName={displayName}
        userInitials={initials}
        userRole={role}
      />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
