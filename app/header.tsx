'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="text-lg font-semibold text-black dark:text-white">
          Open DPIA Assistant
        </Link>
      </div>
      <nav className="flex items-center gap-6">
        <Link href="/assessments" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Assessments
        </Link>
        <Link href="/blog" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Resources
        </Link>
      </nav>
    </header>
  )
}
