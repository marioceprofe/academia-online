import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Play, Lock, CheckCircle, Clock, BookOpen, FileText, Download } from 'lucide-react'
import { formatDuracion } from '@/lib/utils'
import VideoPlayer from '@/components/cursos/VideoPlayer'
import MatricularButton from '@/components/cursos/MatricularButton'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const result: any = await supabase.from('cursos').select('titulo').eq('id', params.id).single()
  
  // Extraemos los datos de forma manual para que no haya duda
  const titulo = result.data?.titulo || 'Curso'
  
  return { 
    title: titulo 
  }
}

export default async function CursoPage({ params }: { params: { id: string } }) {

  const { data: curso }: any = await supabase
    .from('cursos')
    .select('*')
    .eq('id', params.id)
    .eq('publicado', true)
    .single()

  if (!curso) notFound()

  const { data: lecciones } = await supabase
    .from('lecciones')
    .select('*')
    .eq('curso_id', params.id)
    .order('orden')

  const { data: { user } } = await supabase.auth.getUser()

  let matriculado = false
  let progreso: string[] = []

  if (user) {
    const { data: mat } = await supabase
      .from('matriculas')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('curso_id', params.id)
      .single()

    matriculado = !!mat

    if (matriculado) {
      const { data: prog } = await supabase
        .from('progreso_lecciones')
        .select('leccion_id')
        .eq('usuario_id', user.id)
        .eq('completado', true)
      progreso = prog?.map(p => p.leccion_id) || []
    }
  }

  const tieneAcceso = matriculado || curso.plan_requerido === 'gratuito'
  const primeraLeccion = lecciones?.[0]
  const duracionTotal = lecciones?.reduce((acc, l) => acc + (l.duracion_segundos || 0), 0) || 0
  const leccionesCompletadas = progreso.length

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ink-400 font-body">
            <Link href="/" className="hover:text-ink-600">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/cursos" className="hover:text-ink-600">Cursos</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink-600 line-clamp-1">{curso.titulo}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna principal ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Vídeo o portada */}
            {tieneAcceso && primeraLeccion?.video_url ? (
              <VideoPlayer
                videoUrl={primeraLeccion.video_url}
                titulo={primeraLeccion.titulo}
                leccionId={primeraLeccion.id}
                cursoId={curso.id}
              />
            ) : (
              <div className="card overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-brand-900 to-brand-700
                                flex flex-col items-center justify-center gap-4">
                  {tieneAcceso ? (
                    <>
                      <BookOpen className="w-14 h-14 text-brand-300" />
                      <p className="text-brand-200 font-display font-medium">Selecciona una lección para empezar</p>
                    </>
                  ) : (
                    <>
                      <Lock className="w-14 h-14 text-brand-300" />
                      <p className="text-white font-display font-semibold text-lg">Contenido Premium</p>
                      <p className="text-brand-300 text-sm font-body">Matricúlate para acceder a todas las lecciones</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Info del curso */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-display font-bold text-2xl text-ink-900 leading-tight">
                  {curso.titulo}
                </h1>
                <span className={`badge shrink-0 ${curso.plan_requerido === 'gratuito' ? 'badge-success' : 'badge-brand'}`}>
                  {curso.plan_requerido === 'gratuito' ? 'Gratuito' : 'Premium'}
                </span>
              </div>

              {curso.descripcion && (
                <p className="text-ink-600 font-body leading-relaxed mb-5">{curso.descripcion}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-ink-500 font-body">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-400" />
                  {lecciones?.length || 0} lecciones
                </span>
                {duracionTotal > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-400" />
                    {formatDuracion(duracionTotal)} en total
                  </span>
                )}
                {matriculado && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {leccionesCompletadas}/{lecciones?.length} completadas
                  </span>
                )}
              </div>
            </div>

            {/* Lista de lecciones */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-ink-100">
                <h2 className="font-display font-semibold text-ink-900">Contenido del curso</h2>
              </div>
              <div className="divide-y divide-ink-50">
                {lecciones && lecciones.length > 0 ? (
                  lecciones.map((leccion, idx) => {
                    const completada = progreso.includes(leccion.id)
                    const accesible = tieneAcceso || leccion.es_preview

                    return (
                      <LeccionRow
                        key={leccion.id}
                        leccion={leccion}
                        idx={idx}
                        completada={completada}
                        accesible={accesible}
                        cursoId={curso.id}
                      />
                    )
                  })
                ) : (
                  <div className="px-6 py-8 text-center text-ink-400 font-body text-sm">
                    Las lecciones se publicarán próximamente.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* CTA matricula */}
            <div className="card p-6 sticky top-20">
              {matriculado ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700 font-display font-semibold mb-3">
                    <CheckCircle className="w-5 h-5" />
                    Matriculado
                  </div>
                  {/* Barra de progreso */}
                  <div>
                    <div className="flex justify-between text-xs text-ink-500 font-body mb-1">
                      <span>Tu progreso</span>
                      <span>{lecciones?.length ? Math.round((leccionesCompletadas / lecciones.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: lecciones?.length ? `${(leccionesCompletadas / lecciones.length) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                  <Link href={`/dashboard/cursos/${curso.id}`} className="btn-primary w-full mt-2 text-sm py-2.5">
                    Ir al curso
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-display font-bold text-2xl text-ink-900">
                      {curso.precio === 0 ? 'Gratis' : `${(curso.precio / 100).toFixed(2)} €`}
                    </p>
                    {curso.precio > 0 && (
                      <p className="text-xs text-ink-400 font-body mt-0.5">Pago único · Acceso de por vida</p>
                    )}
                  </div>

                  <MatricularButton
                    cursoId={curso.id}
                    precio={curso.precio}
                    planRequerido={curso.plan_requerido}
                    estaLogado={!!user}
                  />

                  <ul className="space-y-2 text-sm text-ink-600 font-body">
                    {[
                      `${lecciones?.length || 0} lecciones en vídeo`,
                      'Materiales PDF descargables',
                      'Acceso ilimitado',
                      'Certificado al completar',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LeccionRow({ leccion, idx, completada, accesible, cursoId }: {
  leccion: any; idx: number; completada: boolean; accesible: boolean; cursoId: string
}) {
  const content = (
    <div className={`flex items-center gap-3 px-6 py-4 transition-colors
      ${accesible ? 'hover:bg-ink-50 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-display font-semibold
        ${completada ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-400'}`}>
        {completada ? <CheckCircle className="w-4 h-4" /> : idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-medium text-ink-900 text-sm truncate">{leccion.titulo}</p>
        {leccion.duracion_segundos && (
          <p className="text-xs text-ink-400 font-body mt-0.5">{formatDuracion(leccion.duracion_segundos)}</p>
        )}
      </div>
      <div className="shrink-0">
        {accesible ? (
          leccion.es_preview ? (
            <span className="text-xs text-brand-600 font-display font-medium bg-brand-50 px-2 py-0.5 rounded-full">Preview</span>
          ) : (
            <Play className="w-4 h-4 text-brand-400" />
          )
        ) : (
          <Lock className="w-4 h-4 text-ink-300" />
        )}
      </div>
    </div>
  )

  if (accesible) {
    return (
      <Link href={`/cursos/${cursoId}/leccion/${leccion.id}`}>
        {content}
      </Link>
    )
  }

  return <div>{content}</div>
}
