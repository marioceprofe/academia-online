'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Cpu, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/cursos', label: 'Temario' },
  { href: '/tests', label: 'Tests' },
  { href: '/precios', label: 'Precios' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-700 transition-colors">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-ink-900 text-lg tracking-tight">
              Byte<span className="text-brand-600">Opos</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={cn('px-4 py-2 rounded-lg text-sm font-display font-medium transition-colors',
                  pathname === link.href ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50')}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Entrar</Link>
            <Link href="/auth/registro" className="btn-primary text-sm px-5 py-2.5">Empezar gratis</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100 transition-colors">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-ink-100 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={cn('block px-4 py-3 rounded-xl text-sm font-display font-medium',
                  pathname === link.href ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50')}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-1">
              <Link href="/auth/login" className="btn-secondary w-full" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link href="/auth/registro" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>Empezar gratis</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
