import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { formatDuracion } from '@/lib/utils'

export const metadata = { title: 'Mis cursos' }

export default async function MisCursosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: matriculas } = await supabase
    .from('matriculas')
    .select(`
      curso_id,
      creado_en,
      cursos (
        id, titulo, descripcion, imagen_url, plan_requerido
      )
    `)
    .eq('usuario_id', user.id)
    .order('creado_en', { ascending: false })

  const { data: progreso } = await supabase
    .from('progreso_lecciones')
    .select('leccion_id, completado, lecciones(curso_id)')
    .eq('usuario_id', user.id)

  // Calcular progreso por curso
  function getProgresoCurso(cursoId: string) {
    const del_curso = progreso?.filter((p: any) => p.lecciones?.curso_id === cursoId) || []
    const completadas = del_curso.filter(p => p.completado).length
    return { completadas, total: del_curso.length }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink-900">Mis cursos</h1>
          <p className="text-ink-500 font-body text-sm mt-1">
            {matriculas?.length || 0} curso{matriculas?.length !== 1 ? 's' : ''} matriculado{matriculas?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/cursos" className="btn-secondary text-sm px-4 py-2">
          Ver más cursos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {matriculas && matriculas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matriculas.map((m: any) => {
            const curso = m.cursos
            if (!curso) return null
            const { completadas, total } = getProgresoCurso(curso.id)
            const pct = total > 0 ? Math.round((completadas / total) * 100) : 0

            return (
              <Link
                key={m.curso_id}
                href={`/cursos/${curso.id}`}
                className="card group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-32 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center relative">
                  <BookOpen className="w-8 h-8 text-brand-300" />
                  {pct === 100 && (
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-green-500
                                    flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-display font-semibold text-ink-900 text-sm leading-snug mb-3
                                 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {curso.titulo}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-ink-400 font-body">
                      <span>{completadas} de {total} lecciones</span>
                      <span className={pct === 100 ? 'text-green-600 font-display font-medium' : ''}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-brand-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-brand-400" />
          </div>
          <h3 className="font-display font-semibold text-ink-900 mb-2">Aún no tienes cursos</h3>
          <p className="text-ink-500 font-body text-sm mb-6">
            Explora el catálogo y matricúlate en el primero de forma gratuita.
          </p>
          <Link href="/cursos" className="btn-primary inline-flex">
            Ver cursos disponibles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
