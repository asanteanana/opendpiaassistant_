'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="text-sm font-medium text-black dark:text-white">
          Datera
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-sm text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Open DPIA Assistant
        </TextEffect>
      </div>
      <nav className="flex items-center gap-6">
        <Link 
          href="/assessments" 
          className={`text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 ${
            pathname === '/assessments' 
              ? 'text-zinc-900 dark:text-zinc-100' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          Assessments
          {pathname === '/assessments' && (
            <div className="mt-1 h-0.5 w-full bg-zinc-900 dark:bg-zinc-100 rounded-full" />
          )}
        </Link>
        <Link 
          href="/blog" 
          className={`text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 ${
            pathname === '/blog' 
              ? 'text-zinc-900 dark:text-zinc-100' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          Resources
          {pathname === '/blog' && (
            <div className="mt-1 h-0.5 w-full bg-zinc-900 dark:bg-zinc-100 rounded-full" />
          )}
        </Link>
      </nav>
    </header>
  )
}
