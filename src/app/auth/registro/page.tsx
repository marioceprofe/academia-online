'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?'
        : 'Error al crear la cuenta. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-ink-900 mb-3">
            ¡Revisa tu email!
          </h2>
          <p className="text-ink-500 font-body mb-6">
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>.
            Haz clic en él para activar tu cuenta.
          </p>
          <Link href="/auth/login" className="btn-primary">
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-ink-900 text-xl">
              ByteOpos<span className="text-brand-600">Pro</span>
            </span>
          </Link>
          <h1 className="font-display font-semibold text-2xl text-ink-900 mt-6 mb-1">
            Crea tu cuenta gratis
          </h1>
          <p className="text-ink-500 text-sm font-body">
            Empieza a estudiar en menos de 2 minutos
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleRegistro} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-body">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-display font-semibold text-ink-700 mb-2 uppercase tracking-wide">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="input-field"
                placeholder="Tu nombre"
                required
                autoComplete="given-name"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink-700 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink-700 mb-2 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-11"
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 2
                          ? password.length >= 10 ? 'bg-green-500' : 'bg-amber-400'
                          : 'bg-ink-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-xs text-ink-400 font-body mt-5 leading-relaxed">
            Al registrarte aceptas nuestros{' '}
            <Link href="/terminos" className="text-brand-600 hover:underline">Términos de uso</Link>
            {' '}y{' '}
            <Link href="/privacidad" className="text-brand-600 hover:underline">Política de privacidad</Link>.
          </p>

          <p className="text-center text-sm text-ink-500 font-body mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-brand-600 font-display font-medium hover:text-brand-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
