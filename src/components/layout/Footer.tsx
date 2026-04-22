import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const footerLinks = {
  Academia: [
    { href: '/cursos', label: 'Todos los cursos' },
    { href: '/tests', label: 'Tests y simulacros' },
    { href: '/precios', label: 'Precios' },
    { href: '/foro', label: 'Comunidad' },
  ],
  Cuenta: [
    { href: '/auth/login', label: 'Iniciar sesión' },
    { href: '/auth/registro', label: 'Registrarse' },
    { href: '/dashboard', label: 'Mi área' },
  ],
  Legal: [
    { href: '/privacidad', label: 'Privacidad' },
    { href: '/terminos', label: 'Términos de uso' },
    { href: '/cookies', label: 'Cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">
                Academia<span className="text-brand-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed">
              Prepara tus oposiciones con cursos en vídeo, tests interactivos
              y una comunidad de estudio activa.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-display font-semibold text-white text-sm mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ink-800 flex flex-col md:flex-row
                        items-center justify-between gap-4 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} Academia Online. Todos los derechos reservados.</p>
          <p>Hecho con cuidado para los que estudian duro.</p>
        </div>
      </div>
    </footer>
  )
}
