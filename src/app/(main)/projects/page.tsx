import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectsList } from '@/features/projects/components/ProjectsList'

export const metadata = {
  title: 'Proyectos | EstéticaApp'
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role as any

  // Recepcionistas don't have access to projects view (if applicable)
  if (userRole === 'recepcionista') {
    redirect('/dashboard')
  }

  // Get projects
  let projectsQuery = supabase
    .from('projects')
    .select(`
      *,
      profesional:profesionales(*, profile:profiles(*)),
      paciente:pacientes(id, nombre, apellido, email)
    `)
    .order('updated_at', { ascending: false })

  // Profesionales only see their own projects
  if (userRole === 'profesional') {
    const { data: profesional } = await supabase
      .from('profesionales')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profesional) {
      projectsQuery = projectsQuery.eq('profesional_id', profesional.id)
    }
  }

  const { data: projects } = await projectsQuery

  // Get lawyers for filter (admin only)
  let lawyers: { id: string; profile: { full_name: string } }[] = []
  if (userRole === 'admin') {
    const { data } = await supabase
      .from('profesionales')
      .select('id, profile:profiles(full_name)')
      .eq('is_active', true)

    lawyers = (data || []).map((l: { id: string; profile: { full_name: string }[] | { full_name: string } }) => ({
      id: l.id,
      profile: Array.isArray(l.profile) ? l.profile[0] : l.profile
    }))
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ProjectsList
        projects={projects || []}
        lawyers={lawyers}
        userRole={userRole}
      />
    </div>
  )
}
