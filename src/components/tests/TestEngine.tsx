'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Clock, ChevronLeft, ChevronRight, CheckCircle,
  XCircle, AlertCircle, Trophy, RotateCcw, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Opcion { id: string; texto: string; es_correcta: boolean }
interface Pregunta { id: string; enunciado: string; explicacion: string | null; opciones: Opcion[] }
interface Test { id: string; titulo: string; tiempo_limite: number | null; es_simulacro: boolean }

interface TestEngineProps {
  test: Test
  preguntas: Pregunta[]
  usuarioId: string
}

type Estado = 'en_curso' | 'revisando' | 'finalizado'

export default function TestEngine({ test, preguntas, usuarioId }: TestEngineProps) {
  const router = useRouter()
  const [estado, setEstado] = useState<Estado>('en_curso')
  const [actual, setActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({}) // preguntaId → opcionId
  const [tiempoRestante, setTiempoRestante] = useState(test.tiempo_limite || null)
  const [tiempoEmpleado, setTiempoEmpleado] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [intentoId, setIntentoId] = useState<string | null>(null)

  const preguntaActual = preguntas[actual]
  const totalPreguntas = preguntas.length
  const respondidas = Object.keys(respuestas).length

  // Timer
  useEffect(() => {
    if (estado !== 'en_curso') return
    const t = setInterval(() => {
      setTiempoEmpleado(s => s + 1)
      if (tiempoRestante !== null) {
        setTiempoRestante(s => {
          if (s === null) return null
          if (s <= 1) { finalizarTest(); return 0 }
          return s - 1
        })
      }
    }, 1000)
    return () => clearInterval(t)
  }, [estado, tiempoRestante])

  function formatTiempo(s: number) {
    const m = Math.floor(s / 60)
    const seg = s % 60
    return `${m}:${seg.toString().padStart(2, '0')}`
  }

  function responder(opcionId: string) {
    if (estado !== 'en_curso') return
    setRespuestas(prev => ({ ...prev, [preguntaActual.id]: opcionId }))
  }

  function calcularResultados() {
    let aciertos = 0
    preguntas.forEach(p => {
      const opcionSeleccionada = p.opciones.find(o => o.id === respuestas[p.id])
      if (opcionSeleccionada?.es_correcta) aciertos++
    })
    return aciertos
  }

  const finalizarTest = useCallback(async () => {
    if (estado === 'finalizado') return
    setEstado('finalizado')
    setGuardando(true)

    const aciertos = calcularResultados()
    const supabase = createClient()

    const { data: intento } = await supabase
      .from('intentos_test')
      .insert({
        usuario_id: usuarioId,
        test_id: test.id,
        puntuacion: aciertos,
        total_preguntas: totalPreguntas,
        tiempo_segundos: tiempoEmpleado,
        completado: true,
      })
      .select('id')
      .single()

    if (intento) {
      setIntentoId(intento.id)
      const respuestasArr = preguntas.map(p => {
        const opcionId = respuestas[p.id] || null
        const opcion = p.opciones.find(o => o.id === opcionId)
        return {
          intento_id: intento.id,
          pregunta_id: p.id,
          opcion_id: opcionId,
          es_correcta: opcion?.es_correcta || false,
        }
      })
      await supabase.from('respuestas_intento').insert(respuestasArr)
    }

    setGuardando(false)
  }, [estado, respuestas, tiempoEmpleado])

  // ── PANTALLA DE RESULTADOS ──────────────────────────
  if (estado === 'finalizado') {
    const aciertos = calcularResultados()
    const pct = Math.round((aciertos / totalPreguntas) * 100)
    const aprobado = pct >= 60

    return (
      <div className="space-y-6">
        {/* Header resultado */}
        <div className={`card p-8 text-center ${aprobado ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
            ${aprobado ? 'bg-green-100' : 'bg-red-100'}`}>
            {aprobado
              ? <Trophy className="w-8 h-8 text-green-600" />
              : <XCircle className="w-8 h-8 text-red-500" />
            }
          </div>
          <h2 className="font-display font-bold text-2xl text-ink-900 mb-1">
            {aprobado ? '¡Buen trabajo!' : 'Sigue practicando'}
          </h2>
          <p className="text-ink-500 font-body text-sm mb-6">{test.titulo}</p>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <p className={`font-display font-bold text-3xl ${aprobado ? 'text-green-600' : 'text-red-500'}`}>{pct}%</p>
              <p className="text-xs text-ink-400 font-body mt-1">Puntuación</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-ink-900">{aciertos}/{totalPreguntas}</p>
              <p className="text-xs text-ink-400 font-body mt-1">Aciertos</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-ink-900">{formatTiempo(tiempoEmpleado)}</p>
              <p className="text-xs text-ink-400 font-body mt-1">Tiempo</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setEstado('revisando'); setActual(0) }}
            className="btn-secondary text-sm flex-1"
          >
            Ver respuestas y explicaciones
          </button>
          <button
            onClick={() => router.push('/dashboard/tests')}
            className="btn-ghost text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a tests
          </button>
        </div>
      </div>
    )
  }

  // ── PANTALLA DE REVISIÓN ────────────────────────────
  if (estado === 'revisando') {
    const p = preguntas[actual]
    const opcionElegida = p.opciones.find(o => o.id === respuestas[p.id])
    const opcionCorrecta = p.opciones.find(o => o.es_correcta)

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => setEstado('finalizado')} className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> Resultados
          </button>
          <span className="text-sm text-ink-400 font-body">{actual + 1} / {totalPreguntas}</span>
        </div>

        <div className="card p-6">
          <p className="font-display font-semibold text-ink-900 mb-5 leading-relaxed">{p.enunciado}</p>

          <div className="space-y-2.5">
            {p.opciones.map(opcion => {
              const elegida = respuestas[p.id] === opcion.id
              const correcta = opcion.es_correcta

              return (
                <div key={opcion.id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors
                  ${correcta
                    ? 'bg-green-50 border-green-300'
                    : elegida && !correcta
                      ? 'bg-red-50 border-red-300'
                      : 'bg-ink-50 border-ink-200'
                  }`}>
                  <div className="shrink-0 mt-0.5">
                    {correcta
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : elegida
                        ? <XCircle className="w-5 h-5 text-red-500" />
                        : <div className="w-5 h-5 rounded-full border-2 border-ink-300" />
                    }
                  </div>
                  <p className={`text-sm font-body leading-relaxed
                    ${correcta ? 'text-green-800' : elegida ? 'text-red-700' : 'text-ink-500'}`}>
                    {opcion.texto}
                  </p>
                </div>
              )
            })}
          </div>

          {p.explicacion && (
            <div className="mt-5 p-4 bg-brand-50 border border-brand-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-display font-semibold text-brand-800 mb-1">Explicación</p>
                  <p className="text-sm text-brand-700 font-body leading-relaxed">{p.explicacion}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setActual(a => Math.max(0, a - 1))}
            disabled={actual === 0}
            className="btn-secondary text-sm disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button
            onClick={() => setActual(a => Math.min(totalPreguntas - 1, a + 1))}
            disabled={actual === totalPreguntas - 1}
            className="btn-secondary text-sm disabled:opacity-40"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // ── TEST EN CURSO ───────────────────────────────────
  const opcionSeleccionada = respuestas[preguntaActual.id]

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-ink-900 text-lg">{test.titulo}</h1>
          <p className="text-sm text-ink-400 font-body mt-0.5">
            Pregunta {actual + 1} de {totalPreguntas} · {respondidas} respondidas
          </p>
        </div>
        {tiempoRestante !== null && (
          <div className={`flex items-center gap-1.5 font-display font-semibold text-sm px-3 py-1.5 rounded-xl
            ${tiempoRestante < 120 ? 'bg-red-100 text-red-700' : 'bg-ink-100 text-ink-700'}`}>
            <Clock className="w-4 h-4" />
            {formatTiempo(tiempoRestante)}
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${((actual + 1) / totalPreguntas) * 100}%` }}
        />
      </div>

      {/* Pregunta */}
      <div className="card p-6">
        <p className="font-display font-semibold text-ink-900 text-base leading-relaxed mb-6">
          {preguntaActual.enunciado}
        </p>

        <div className="space-y-3">
          {preguntaActual.opciones.map((opcion, i) => {
            const seleccionada = opcionSeleccionada === opcion.id
            const letras = ['A', 'B', 'C', 'D']

            return (
              <button
                key={opcion.id}
                onClick={() => responder(opcion.id)}
                className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all
                  ${seleccionada
                    ? 'bg-brand-50 border-brand-400 shadow-sm'
                    : 'bg-white border-ink-200 hover:border-brand-300 hover:bg-brand-50/50'
                  }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold shrink-0
                  ${seleccionada ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                  {letras[i]}
                </span>
                <span className={`text-sm font-body leading-relaxed ${seleccionada ? 'text-brand-900' : 'text-ink-700'}`}>
                  {opcion.texto}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setActual(a => Math.max(0, a - 1))}
          disabled={actual === 0}
          className="btn-secondary text-sm disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {actual < totalPreguntas - 1 ? (
          <button
            onClick={() => setActual(a => a + 1)}
            className="btn-primary text-sm"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={finalizarTest}
            disabled={guardando}
            className="btn-primary text-sm bg-green-600 hover:bg-green-700"
          >
            {guardando ? 'Guardando...' : 'Finalizar test'}
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mapa de preguntas */}
      <div className="card p-4">
        <p className="text-xs font-display font-semibold text-ink-500 uppercase tracking-wide mb-3">
          Mapa de preguntas
        </p>
        <div className="flex flex-wrap gap-1.5">
          {preguntas.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActual(i)}
              className={`w-8 h-8 rounded-lg text-xs font-display font-semibold transition-colors
                ${i === actual
                  ? 'bg-brand-600 text-white'
                  : respuestas[p.id]
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-ink-100 text-ink-400 hover:bg-ink-200'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-400 font-body mt-3">
          {respondidas} de {totalPreguntas} respondidas
          {respondidas < totalPreguntas && <span className="text-amber-600"> · {totalPreguntas - respondidas} sin responder</span>}
        </p>
      </div>
    </div>
  )
}
