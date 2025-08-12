'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import { Globe } from 'lucide-react'

const languages = {
  ar: { name: 'العربية', flag: '🇸🇦' },
  en: { name: 'English', flag: '🇺🇸' }
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Extract current locale from pathname
  const safePath = (pathname ?? '/ar') as string
  const currentLocale = safePath.split('/')[1] || 'ar'
  
  const switchLanguage = (newLocale: string) => {
    // Persist selection so hooks can read it
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale)
      }
    } catch {
      // ignore storage errors
    }
    // Replace only the locale segment and preserve query/hash
    const segments = safePath.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    const query = searchParams?.toString()
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const url = query && query.length > 0 ? `${newPath}?${query}${hash}` : `${newPath}${hash}`
    router.push(url)
  }
  
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <div className="flex gap-1">
        {Object.entries(languages).map(([locale, { name, flag }]) => (
          <Button
            key={locale}
            variant={currentLocale === locale ? 'default' : 'ghost'}
            size="sm"
            onClick={() => switchLanguage(locale)}
            className="h-8 px-2 text-xs"
          >
            <span className="mr-1">{flag}</span>
            {name}
          </Button>
        ))}
      </div>
    </div>
  )
}