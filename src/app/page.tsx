import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowRight, CheckCircle, FileText, Users, Star, TrendingUp, Terminal, Cpu, Shield } from 'lucide-react'

const stats = [
  { valor: '+1.800', label: 'Opositores activos' },
  { valor: '96%', label: 'Tasa de aprobados' },
  { valor: '+200', label: 'Horas de contenido' },
  { valor: '4.9/5', label: 'Valoración media' },
]

const features = [
  { icon: Terminal, titulo: 'Temario técnico en vídeo', desc: 'Sistemas operativos, redes, bases de datos, programación y seguridad explicados con claridad.' },
  { icon: FileText, titulo: 'Tests y simulacros', desc: 'Más de 6.000 preguntas tipo examen con corrección automática y explicaciones detalladas.' },
  { icon: Cpu, titulo: 'Prácticas con código', desc: 'Ejercicios resueltos de programación, SQL y sistemas que caen en los exámenes reales.' },
  { icon: Users, titulo: 'Comunidad de opositores', desc: 'Foro activo donde resolver dudas técnicas, compartir recursos y estudiar en grupo.' },
  { icon: TrendingUp, titulo: 'Seguimiento de progreso', desc: 'Estadísticas por bloque temático para reforzar tus puntos débiles.' },
  { icon: Shield, titulo: 'Temario actualizado', desc: 'Contenido al día con las últimas convocatorias del TAI, Técnico de Sistemas y más.' },
]

const oposiciones = [
  { nombre: 'TAI — Técnico Administración Informática', nivel: 'A2', plazas: '+200 plazas/año' },
  { nombre: 'Técnico de Sistemas e Informática', nivel: 'C1', plazas: '+150 plazas/año' },
  { nombre: 'Ingeniero de Sistemas de la AGE', nivel: 'A1', plazas: '+80 plazas/año' },
  { nombre: 'Informática CCAA y Ayuntamientos', nivel: 'Varios', plazas: '+500 plazas/año' },
]

const testimonios = [
  { nombre: 'Javier López', cargo: 'Aprobó TAI AGE — 1ª convocatoria', texto: 'Los simulacros de ByteOpos son idénticos al examen real. La sección de redes y sistemas me salvó.', avatar: 'JL' },
  { nombre: 'Sara Núñez', cargo: 'Aprobó Técnico Sistemas CCAA', texto: 'Por fin una academia que explica bien los temas técnicos sin dar por sentados conocimientos.', avatar: 'SN' },
  { nombre: 'Pablo Ortega', cargo: 'Aprobó Informática Diputación', texto: 'La comunidad de opositores es increíble. Resolví mis dudas de SQL en minutos.', avatar: 'PO' },
]

const planIncludes = [
  'Todos los bloques del temario técnico','Tests ilimitados con corrección al instante',
  'Simulacros de examen cronometrados','Foro y comunidad de estudio',
  'PDFs y esquemas descargables','Actualizaciones con nuevas convocatorias',
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_theme(colors.brand.50)_0%,_transparent_60%)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
          <div className="absolute top-24 right-10 opacity-5 font-mono text-xs text-ink-900 leading-6 select-none hidden lg:block">
            <div>SELECT * FROM temario WHERE aprobado = true;</div>
            <div className="mt-2">function estudiar() {'{ return aprobado; }'}</div>
            <div className="mt-2">$ ping examenes.gob.es — 64 bytes: tiempo=12ms</div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
            <div className="max-w-3xl">
              <span className="badge-brand mb-6 inline-flex items-center gap-1.5">
                <Terminal className="w-3 h-3" />
                La academia para oposiciones de informática
              </span>
              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-ink-950 leading-[1.05] tracking-tight text-balance mb-8">
                Prepara tu plaza de{' '}
                <span className="text-brand-600 relative">
                  informático
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 320 12" fill="none">
                    <path d="M2 9 Q80 2 160 7 Q240 12 318 5" stroke="#4a5fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
                  </svg>
                </span>{' '}en la Administración
              </h1>
              <p className="font-body text-xl text-ink-500 leading-relaxed mb-10 max-w-2xl">
                TAI, Técnico de Sistemas, Ingeniero TIC y más. Temario técnico actualizado, tests reales y la comunidad de opositores más activa.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/registro" className="btn-primary text-base px-8 py-4">Empezar gratis<ArrowRight className="w-5 h-5" /></Link>
                <Link href="/cursos" className="btn-secondary text-base px-8 py-4">Ver temario</Link>
              </div>
              <p className="mt-5 text-sm text-ink-400">Sin tarjeta de crédito · Acceso inmediato · Cancela cuando quieras</p>
            </div>
          </div>
        </section>

        {/* OPOSICIONES */}
        <section className="bg-ink-50 py-10 border-y border-ink-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-display font-semibold text-ink-400 uppercase tracking-widest mb-5">Oposiciones que preparamos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {oposiciones.map(op => (
                <div key={op.nombre} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-ink-200">
                  <span className="badge-brand mt-0.5 shrink-0">{op.nivel}</span>
                  <div>
                    <p className="font-display font-semibold text-ink-900 text-sm leading-tight">{op.nombre}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{op.plazas}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-brand-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-bold text-3xl md:text-4xl text-white mb-1">{stat.valor}</p>
                  <p className="text-sm text-brand-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 bg-ink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Todo lo que necesitas para aprobar</h2>
              <p className="text-ink-500 text-lg max-w-2xl mx-auto font-body">Diseñado para los exámenes técnicos de la Administración Pública.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (
                <div key={f.titulo} className="card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-display font-semibold text-ink-900 mb-2">{f.titulo}</h3>
                  <p className="text-sm text-ink-500 font-body leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Opositores que ya aprobaron</h2>
              <div className="flex justify-center items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                <span className="ml-2 text-sm text-ink-500 font-body">4.9 de media en +900 reseñas</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonios.map(t => (
                <div key={t.nombre} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-display font-semibold text-brand-700 text-sm shrink-0">{t.avatar}</div>
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

        {/* CTA */}
        <section className="py-24 bg-brand-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 text-balance">Tu plaza de informático te está esperando.</h2>
            <p className="text-brand-200 text-lg font-body mb-10 max-w-xl mx-auto">Únete a los opositores que estudian de forma inteligente con ByteOpos.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10">
              {planIncludes.map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-brand-100">
                  <CheckCircle className="w-4 h-4 text-brand-300 shrink-0" />{item}
                </div>
              ))}
            </div>
            <Link href="/auth/registro" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-brand-700 font-display font-semibold text-base hover:bg-brand-50 active:scale-95 transition-all duration-150">
              Crear cuenta gratuita<ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
