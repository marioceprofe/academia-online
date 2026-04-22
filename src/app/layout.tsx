import type { Metadata } from 'next'
import { Sora, Lora } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: { default: 'ByteOpos — Oposiciones de Informática', template: '%s | ByteOpos' },
  description: 'La academia online para oposiciones de informática. Cursos, tests y simulacros para superar el examen.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'ByteOpos',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${lora.variable}`}>
      <body className="bg-ink-50 text-ink-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
