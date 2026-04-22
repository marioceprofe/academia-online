'use client'

import { useRef, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  titulo: string
  leccionId: string
  cursoId: string
}

export default function VideoPlayer({ videoUrl, titulo, leccionId, cursoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [completado, setCompletado] = useState(false)
  const [marcando, setMarcando] = useState(false)

  async function marcarCompletada() {
    if (completado || marcando) return
    setMarcando(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMarcando(false); return }

    await supabase.from('progreso_lecciones').upsert({
      usuario_id: user.id,
      leccion_id: leccionId,
      completado: true,
    }, { onConflict: 'usuario_id,leccion_id' })

    setCompletado(true)
    setMarcando(false)
  }

  // Marcar automáticamente al llegar al 90%
  function handleTimeUpdate() {
    const video = videoRef.current
    if (!video || completado) return
    if (video.currentTime / video.duration > 0.9) {
      marcarCompletada()
    }
  }

  // Si es URL de Bunny.net o similar, usar iframe
  const isBunny = videoUrl.includes('iframe.mediadelivery.net') || videoUrl.includes('video.bunnycdn.com')

  return (
    <div className="card overflow-hidden">
      {isBunny ? (
        <div className="aspect-video">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={marcarCompletada}
          />
        </div>
      )}

      <div className="px-5 py-4 flex items-center justify-between">
        <h2 className="font-display font-semibold text-ink-900 text-sm">{titulo}</h2>

        <button
          onClick={marcarCompletada}
          disabled={completado || marcando}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-display font-medium transition-all
            ${completado
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-ink-100 text-ink-600 hover:bg-brand-50 hover:text-brand-700'
            }`}
        >
          {marcando ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
          {completado ? 'Completada' : 'Marcar completada'}
        </button>
      </div>
    </div>
  )
}
