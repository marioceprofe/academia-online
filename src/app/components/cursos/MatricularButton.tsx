'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'

interface MatricularButtonProps {
  cursoId: string
  precio: number
  planRequerido: string
  estaLogado: boolean
}

export default function MatricularButton({ cursoId, precio, planRequerido, estaLogado }: MatricularButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  if (!estaLogado) {
    return (
      <Link
        href={`/auth/registro?redirect=/cursos/${cursoId}`}
        className="btn-primary w-full text-sm py-3 justify-center"
      >
        <LogIn className="w-4 h-4" />
        Regístrate para acceder
      </Link>
    )
  }

  async function handleMatricular() {
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    if (precio === 0) {
      // Curso gratuito — matricularse directamente
      const { error: err } = await supabase
        .from('matriculas')
        .insert({ usuario_id: user.id, curso_id: cursoId })

      if (err && err.code !== '23505') {
        setError('Error al matricularse. Inténtalo de nuevo.')
        setLoading(false)
        return
      }

      router.refresh()
    } else {
      // Curso de pago — redirigir a Stripe (Fase 3)
      router.push(`/checkout?curso=${cursoId}`)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-red-600 text-xs font-body">{error}</p>}
      <button
        onClick={handleMatricular}
        disabled={loading}
        className="btn-primary w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Procesando...' : precio === 0 ? 'Matricularse gratis' : `Acceder por ${(precio / 100).toFixed(2)} €`}
      </button>
    </div>
  )
}
