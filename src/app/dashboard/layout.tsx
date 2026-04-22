import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  BookOpen, LayoutDashboard, GraduationCap,
  FileText, Users, User, LogOut, Settings
} from 'lucide-react'

const sidebarLinks = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/cursos', label: 'Mis cursos', icon: GraduationCap },
  { href: '/dashboard/tests', label: 'Tests', icon: FileText },
  { href: '/dashboard/foro', label: 'Comunidad', icon: Users },
  { href: '/dashboard/perfil', label: 'Perfil', icon: User },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, plan')
    .eq('id', user.id)
    .single()

  const nombreMostrado = perfil?.nombre || user.email?.split('@')[0] || 'Alumno'
  const inicial = nombreMostrado.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-ink-50 flex">

      {/* ─── Sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-ink-100 fixed h-full">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-ink-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-ink-900">
              ByteOpos<span className="text-brand-600">Pro</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {sidebarLinks.map(link => (
            <SidebarLink key={link.href} {...link} />
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-ink-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-ink-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center
                            font-display font-semibold text-brand-700 text-sm shrink-0">
              {inicial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-ink-900 text-sm truncate">{nombreMostrado}</p>
              <p className="text-xs text-brand-600 capitalize">{perfil?.plan || 'gratuito'}</p>
            </div>
          </div>

          <form action="/auth/logout" method="post">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                         text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors font-display"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-ink-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-semibold text-ink-900">ByteOpos</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center
                          font-display font-semibold text-brand-700 text-sm">
            {inicial}
          </div>
        </div>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, label, icon: Icon, exact }: {
  href: string; label: string; icon: React.ElementType; exact?: boolean
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium
                 text-ink-600 hover:text-ink-900 hover:bg-ink-50 transition-colors group"
    >
      <Icon className="w-4 h-4 text-ink-400 group-hover:text-brand-600 transition-colors" />
      {label}
    </Link>
  )
}
