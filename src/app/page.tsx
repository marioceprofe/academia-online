import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowRight, CheckCircle, BookOpen, FileText, Users, Star, TrendingUp, Award } from 'lucide-react'

const stats = [
  { valor: '+2.400', label: 'Alumnos activos' },
  { valor: '98%', label: 'Tasa de aprobados' },
  { valor: '+150', label: 'Horas de contenido' },
  { valor: '4.9/5', label: 'Valoración media' },
]

const features = [
  {
    icon: BookOpen,
    titulo: 'Cursos en vídeo HD',
    desc: 'Lecciones grabadas por expertos. Estudia a tu ritmo, sin horarios fijos.',
  },
  {
    icon: FileText,
    titulo: 'Tests y simulacros',
    desc: 'Más de 5.000 preguntas tipo examen con corrección automática y explicaciones.',
  },
  {
    icon: Users,
    titulo: 'Foro de comunidad',
    desc: 'Resuelve dudas, comparte apuntes y estudia junto a otros opositores.',
  },
  {
    icon: TrendingUp,
    titulo: 'Seguimiento de progreso',
    desc: 'Visualiza tu evolución, identifica tus puntos débiles y mejora cada día.',
  },
  {
    icon: Award,
    titulo: 'Certificados de curso',
    desc: 'Obtén tu certificado al completar cada curso y demuestra tu formación.',
  },
  {
    icon: Star,
    titulo: 'Contenido actualizado',
    desc: 'Temario al día con los últimos cambios normativos y convocatorias.',
  },
]

const testimonios = [
  {
    nombre: 'María González',
    cargo: 'Aprobó Administrativo del Estado',
    texto: 'Gracias a los simulacros llegué al examen con una seguridad total. El método funciona.',
    avatar: 'MG',
  },
  {
    nombre: 'Carlos Ruiz',
    cargo: 'Aprobó Policía Nacional',
    texto: 'La calidad del contenido y la comunidad de estudiantes marcan la diferencia.',
    avatar: 'CR',
  },
  {
    nombre: 'Laura Martín',
    cargo: 'Aprobó Auxiliar de la AGE',
    texto: 'Estudié 4 meses con la academia y aprobé a la primera. Lo recomiendo al 100%.',
    avatar: 'LM',
  },
]

const planIncludes = [
  'Acceso a todos los cursos del plan',
  'Tests ilimitados con corrección instantánea',
  'Simulacros cronometrados',
  'Foro de comunidad activo',
  'Materiales PDF descargables',
  'Actualizaciones de contenido incluidas',
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ─── HERO ─── */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_theme(colors.brand.50)_0%,_transparent_60%)]" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-60" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
            <div className="max-w-3xl">
              <span className="badge-brand mb-6 inline-flex">
                <Star className="w-3 h-3" />
                La academia número 1 en oposiciones
              </span>

              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl
                             text-ink-950 leading-[1.05] tracking-tight text-balance mb-8">
                Aprueba tus{' '}
                <span className="text-brand-600 relative">
                  oposiciones
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 9 Q75 2 150 7 Q225 12 298 5" stroke="#4a5fff" strokeWidth="3"
                          strokeLinecap="round" fill="none" opacity="0.4"/>
                  </svg>
                </span>{' '}
                a la primera
              </h1>

              <p className="font-body text-xl text-ink-500 leading-relaxed mb-10 max-w-2xl">
                Cursos en vídeo, tests interactivos y simulacros reales.
                Todo lo que necesitas para prepararte con garantías.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/auth/registro" className="btn-primary text-base px-8 py-4">
                  Empezar gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/cursos" className="btn-secondary text-base px-8 py-4">
                  Ver cursos
                </Link>
              </div>

              <p className="mt-5 text-sm text-ink-400">
                Sin tarjeta de crédito · Acceso inmediato · Cancela cuando quieras
              </p>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="bg-brand-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                    {stat.valor}
                  </p>
                  <p className="text-sm text-brand-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-24 bg-ink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Todo lo que necesitas para aprobar</h2>
              <p className="text-ink-500 text-lg max-w-2xl mx-auto font-body">
                Hemos diseñado cada herramienta pensando en cómo aprenden los opositores de verdad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={f.titulo}
                  className="card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center
                                  justify-center mb-4">
                    <f.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-display font-semibold text-ink-900 mb-2">{f.titulo}</h3>
                  <p className="text-sm text-ink-500 font-body leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIOS ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Lo que dicen nuestros alumnos</h2>
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-2 text-sm text-ink-500 font-body">4.9 de media en +1.200 reseñas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonios.map(t => (
                <div key={t.nombre} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center
                                    justify-center font-display font-semibold text-brand-700 text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-ink-900 text-sm">{t.nombre}</p>
                      <p className="text-xs text-brand-600">{t.cargo}</p>
                    </div>
                  </div>
                  <p className="text-sm text-ink-600 font-body leading-relaxed">"{t.texto}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA FINAL ─── */}
        <section className="py-24 bg-brand-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 text-balance">
              Empieza hoy. Tu plaza te está esperando.
            </h2>
            <p className="text-brand-200 text-lg font-body mb-10 max-w-xl mx-auto">
              Únete a miles de opositores que ya están estudiando con la academia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10">
              {planIncludes.map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-brand-100">
                  <CheckCircle className="w-4 h-4 text-brand-300 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/auth/registro"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl
                         bg-white text-brand-700 font-display font-semibold text-base
                         hover:bg-brand-50 active:scale-95 transition-all duration-150"
            >
              Crear cuenta gratuita
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
