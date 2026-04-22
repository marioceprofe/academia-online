import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, FileText, TrendingUp, ArrowRight, Clock } from 'lucide-react'

export const metadata = { title: 'Mi área' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, plan')
    .eq('id', user.id)
    .single()

  const { data: matriculas } = await supabase
    .from('matriculas')
    .select('curso_id, cursos(titulo, imagen_url)')
    .eq('usuario_id', user.id)
    .limit(3)

  const { data: cursosDestacados } = await supabase
    .from('cursos')
    .select('id, titulo, descripcion, imagen_url, plan_requerido')
    .eq('publicado', true)
    .order('orden')
    .limit(4)

  const nombreMostrado = perfil?.nombre || 'Alumno'
  const hora = new Date().getHours()
  const saludo = hora < 13 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Greeting */}
      <div>
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-ink-900">
          {saludo}, {nombreMostrado} 👋
        </h1>
        <p className="text-ink-500 font-body mt-1">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Cursos matriculados', value: matriculas?.length ?? 0, icon: BookOpen, color: 'brand' },
          { label: 'Tests completados', value: 0, icon: FileText, color: 'teal' },
          { label: 'Días de racha', value: 1, icon: TrendingUp, color: 'amber' },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3
              ${stat.color === 'brand' ? 'bg-brand-50' : stat.color === 'teal' ? 'bg-teal-50' : 'bg-amber-50'}`}>
              <stat.icon className={`w-4 h-4
                ${stat.color === 'brand' ? 'text-brand-600' : stat.color === 'teal' ? 'text-teal-600' : 'text-amber-600'}`} />
            </div>
            <p className="font-display font-bold text-2xl text-ink-900">{stat.value}</p>
            <p className="text-xs text-ink-500 font-body mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mis cursos recientes */}
      {matriculas && matriculas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-ink-900">Continuar estudiando</h2>
            <Link href="/dashboard/cursos" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matriculas.map((m: any) => (
              <Link key={m.curso_id} href={`/cursos/${m.curso_id}`}
                className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="h-28 bg-brand-50 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-brand-300" />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-ink-900 text-sm line-clamp-2 group-hover:text-brand-700 transition-colors">
                    {m.cursos?.titulo}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-brand-500 rounded-full" />
                    </div>
                    <span className="text-xs text-ink-400 font-body">0%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cursos recomendados */}
      {cursosDestacados && cursosDestacados.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-ink-900">Cursos disponibles</h2>
            <Link href="/cursos" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cursosDestacados.map((curso: any) => (
              <Link key={curso.id} href={`/cursos/${curso.id}`}
                className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="h-24 bg-ink-100 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-ink-300" />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-ink-900 text-sm line-clamp-2 group-hover:text-brand-700 transition-colors mb-2">
                    {curso.titulo}
                  </p>
                  <span className={`badge text-xs ${curso.plan_requerido === 'gratuito' ? 'badge-success' : 'badge-brand'}`}>
                    {curso.plan_requerido === 'gratuito' ? 'Gratuito' : 'Premium'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade CTA si plan gratuito */}
      {(!perfil?.plan || perfil.plan === 'gratuito') && (
        <div className="card p-6 bg-gradient-to-br from-brand-50 to-white border-brand-200">
          <h3 className="font-display font-semibold text-ink-900 mb-2">
            Desbloquea todo el contenido
          </h3>
          <p className="text-sm text-ink-500 font-body mb-4">
            Accede a todos los cursos, tests ilimitados y la comunidad con el plan Premium.
          </p>
          <Link href="/precios" className="btn-primary text-sm px-5 py-2.5">
            Ver planes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
