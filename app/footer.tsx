'use client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { TextLoop } from '@/components/ui/text-loop'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const THEMES_OPTIONS = [
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: 'System',
    id: 'system',
    icon: <MonitorIcon className="h-4 w-4" />,
  },
]

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        setTheme(id as string)
      }}
    >
      {THEMES_OPTIONS.map((theme) => {
        return (
          <button
            key={theme.id}
            className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
            type="button"
            aria-label={`Switch to ${theme.label} theme`}
            data-id={theme.id}
          >
            {theme.icon}
          </button>
        )
      })}
    </AnimatedBackground>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-8 dark:border-zinc-800">
      <div className="space-y-6">
        {/* Main footer content */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2025 Nana Asante. Built with Motion-Primitives.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Open DPIA Assistant - Simplify GDPR compliance with intelligent assessments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitch />
          </div>
        </div>
        
        {/* Legal links */}
        <div className="flex flex-wrap gap-6 text-xs text-zinc-500 dark:text-zinc-500">
          <a href="/privacy" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
            Privacy Policy
          </a>
          <a href="/terms" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
            Terms of Service
          </a>
          <a href="/gdpr" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
            GDPR Compliance
          </a>
          <a href="/security" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
            Security
          </a>
          <a href="/support" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
