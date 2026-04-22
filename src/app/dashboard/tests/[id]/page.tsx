import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import TestEngine from '@/components/tests/TestEngine'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.from('tests').select('titulo').eq('id', params.id).single()
  const test = data as { titulo: string } | null
  return { title: test?.titulo || 'Test' }
}

export default async function TestPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: test } = await supabase
    .from('tests')
    .select('*')
    .eq('id', params.id)
    .eq('publicado', true)
    .single()

  if (!test) notFound()

  // Cargar preguntas con opciones
  const { data: preguntas } = await supabase
    .from('preguntas')
    .select(`
      id, enunciado, explicacion, orden,
      opciones (id, texto, es_correcta, orden)
    `)
    .eq('test_id', params.id)
    .order('orden')
    .limit(test.num_preguntas)

  if (!preguntas || preguntas.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="font-display font-semibold text-ink-600 mb-2">Test sin preguntas</p>
        <p className="text-sm text-ink-400 font-body">Este test no tiene preguntas disponibles aún.</p>
      </div>
    )
  }

  // Mezclar opciones de cada pregunta
  const preguntasConOpciones = preguntas.map(p => ({
    ...p,
    opciones: [...(p.opciones || [])].sort(() => Math.random() - 0.5),
  }))

  return (
    <div className="max-w-3xl mx-auto">
      <TestEngine
        test={test}
        preguntas={preguntasConOpciones}
        usuarioId={user.id}
      />
    </div>
  )
}
