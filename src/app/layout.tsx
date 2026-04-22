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
  title: { default: 'Academia Online', template: '%s | Academia Online' },
  description: 'Prepara tus oposiciones con los mejores cursos, tests y simulacros.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Academia Online',
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
