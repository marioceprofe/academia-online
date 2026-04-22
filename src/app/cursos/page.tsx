import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Clock, Lock, ChevronRight, Terminal } from 'lucide-react'

export const metadata = { title: 'Temario y cursos' }

const bloques = [
  { id: 'todos', label: 'Todos' },
  { id: 'sistemas', label: 'Sistemas Operativos' },
  { id: 'redes', label: 'Redes' },
  { id: 'bbdd', label: 'Bases de datos' },
  { id: 'programacion', label: 'Programación' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'legislacion', label: 'Legislación TIC' },
]

export default async function CursosPage() {
  const supabase = await createClient()

  const { data: cursos } = await supabase
    .from('cursos')
    .select('*')
    .eq('publicado', true)
    .order('orden')

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-white border-b border-ink-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-ink-400 font-body mb-4">
              <Link href="/" className="hover:text-ink-600">Inicio</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-ink-600">Cursos</span>
            </div>
            <h1 className="section-title mb-3">Temario completo de informática</h1>
            <p className="text-ink-500 font-body max-w-2xl">
              Todos los bloques del temario oficial para las oposiciones de informática de la Administración Pública.
            </p>
          </div>
        </section>

        {/* Filtros + Grid */}
        <section className="py-10 bg-ink-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Filtros de bloque */}
            <div className="flex flex-wrap gap-2 mb-8">
              {bloques.map(b => (
                <button
                  key={b.id}
                  className="px-4 py-2 rounded-full text-sm font-display font-medium border border-ink-200
                             bg-white text-ink-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700
                             transition-colors first:bg-brand-600 first:text-white first:border-brand-600"
                >
                  {b.label}
                </button>
              ))}
            </div>

            {cursos && cursos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {cursos.map(curso => (
                  <CursoCard key={curso.id} curso={curso} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function CursoCard({ curso }: { curso: any }) {
  const isPremium = curso.plan_requerido !== 'gratuito'

  return (
    <Link
      href={`/cursos/${curso.id}`}
      className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="h-36 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center relative overflow-hidden">
        <Terminal className="w-10 h-10 text-brand-300" />
        {isPremium && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-ink-900/80 text-white
                          text-xs px-2 py-1 rounded-lg font-display font-medium">
            <Lock className="w-3 h-3" />
            Premium
          </div>
        )}
        {curso.plan_requerido === 'gratuito' && (
          <div className="absolute top-2.5 right-2.5 badge-success text-xs">Gratis</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-ink-900 text-sm leading-snug mb-2
                       group-hover:text-brand-700 transition-colors line-clamp-2">
          {curso.titulo}
        </h3>
        {curso.descripcion && (
          <p className="text-xs text-ink-400 font-body line-clamp-2 mb-3 leading-relaxed">
            {curso.descripcion}
          </p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-ink-100">
          <span className="text-xs text-ink-400 font-body flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Ver curso
          </span>
          <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-brand-500 transition-colors" />
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-7 h-7 text-brand-400" />
      </div>
      <h3 className="font-display font-semibold text-ink-900 mb-2">Cursos próximamente</h3>
      <p className="text-ink-500 font-body text-sm max-w-xs mx-auto">
        Estamos preparando el contenido. Regístrate para recibir un aviso cuando estén disponibles.
      </p>
      <Link href="/auth/registro" className="btn-primary mt-6 inline-flex">
        Avisarme
      </Link>
    </div>
  )
}
