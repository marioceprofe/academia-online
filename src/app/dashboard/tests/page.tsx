import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, Lock, ArrowRight, Zap } from 'lucide-react'

export const metadata = { title: 'Tests y simulacros' }

const bloqueColors: Record<string, string> = {
  sistemas:     'bg-blue-50 text-blue-700',
  redes:        'bg-teal-50 text-teal-700',
  bbdd:         'bg-amber-50 text-amber-700',
  programacion: 'bg-purple-50 text-purple-700',
  seguridad:    'bg-red-50 text-red-700',
  legislacion:  'bg-ink-100 text-ink-600',
}

export default async function TestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { data: tests } = await supabase
    .from('tests')
    .select('*')
    .eq('publicado', true)
    .order('es_simulacro')
    .order('bloque')

  const { data: intentos } = await supabase
    .from('intentos_test')
    .select('test_id, puntuacion, total_preguntas, completado')
    .eq('usuario_id', user.id)
    .eq('completado', true)

  const mejorIntento: Record<string, any> = {}
  intentos?.forEach(i => {
    if (!mejorIntento[i.test_id] || (i.puntuacion || 0) > mejorIntento[i.test_id].puntuacion) {
      mejorIntento[i.test_id] = i
    }
  })

  const simulacros = tests?.filter(t => t.es_simulacro) || []
  const testsPorBloque = tests?.filter(t => !t.es_simulacro) || []

  function tieneAcceso(planRequerido: string) {
    if (planRequerido === 'gratuito') return true
    if (planRequerido === 'basico' && ['basico', 'premium'].includes(perfil?.plan || '')) return true
    if (planRequerido === 'premium' && perfil?.plan === 'premium') return true
    return false
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <h1 className="font-display font-semibold text-2xl text-ink-900">Tests y simulacros</h1>
        <p className="text-ink-500 font-body text-sm mt-1">Practica con preguntas tipo examen y mide tu nivel.</p>
      </div>

      {/* Simulacros */}
      {simulacros.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-lg text-ink-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Simulacros de examen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulacros.map(test => (
              <TestCard
                key={test.id}
                test={test}
                mejor={mejorIntento[test.id]}
                acceso={tieneAcceso(test.plan_requerido)}
                isSimulacro
              />
            ))}
          </div>
        </div>
      )}

      {/* Tests por bloque */}
      {testsPorBloque.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-lg text-ink-900 mb-4">Tests por bloque temático</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testsPorBloque.map(test => (
              <TestCard
                key={test.id}
                test={test}
                mejor={mejorIntento[test.id]}
                acceso={tieneAcceso(test.plan_requerido)}
                bloqueColors={bloqueColors}
              />
            ))}
          </div>
        </div>
      )}

      {(!tests || tests.length === 0) && (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 text-ink-300 mx-auto mb-4" />
          <p className="font-display font-semibold text-ink-600 mb-1">Tests próximamente</p>
          <p className="text-sm text-ink-400 font-body">Estamos preparando el banco de preguntas.</p>
        </div>
      )}
    </div>
  )
}

function TestCard({ test, mejor, acceso, isSimulacro, bloqueColors }: {
  test: any; mejor: any; acceso: boolean; isSimulacro?: boolean; bloqueColors?: Record<string, string>
}) {
  const pct = mejor ? Math.round((mejor.puntuacion / mejor.total_preguntas) * 100) : null

  return (
    <div className={`card p-5 ${!acceso ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          {test.bloque && bloqueColors && (
            <span className={`text-xs font-display font-medium px-2 py-0.5 rounded-full mb-2 inline-block
              ${bloqueColors[test.bloque] || 'bg-ink-100 text-ink-600'}`}>
              {test.bloque.charAt(0).toUpperCase() + test.bloque.slice(1)}
            </span>
          )}
          <h3 className="font-display font-semibold text-ink-900 text-sm leading-snug">{test.titulo}</h3>
        </div>
        {!acceso && <Lock className="w-4 h-4 text-ink-300 shrink-0 mt-0.5" />}
      </div>

      {test.descripcion && (
        <p className="text-xs text-ink-400 font-body leading-relaxed mb-4">{test.descripcion}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-ink-400 font-body mb-4">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {test.num_preguntas} preguntas
        </span>
        {test.tiempo_limite && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.round(test.tiempo_limite / 60)} min
          </span>
        )}
      </div>

      {/* Resultado anterior */}
      {mejor && (
        <div className="mb-4 p-3 bg-ink-50 rounded-xl">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-ink-500 font-body">Mejor resultado</span>
            <span className={`font-display font-semibold ${pct! >= 70 ? 'text-green-600' : pct! >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {mejor.puntuacion}/{mejor.total_preguntas} — {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${pct! >= 70 ? 'bg-green-500' : pct! >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {acceso ? (
        <Link
          href={`/dashboard/tests/${test.id}`}
          className="btn-primary w-full text-xs py-2.5 justify-center"
        >
          {mejor ? 'Volver a intentarlo' : 'Empezar test'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <Link href="/precios" className="btn-secondary w-full text-xs py-2.5 justify-center">
          <Lock className="w-3.5 h-3.5" />
          Desbloquear con Premium
        </Link>
      )}
    </div>
  )
}
