'use client'

import { Button } from './ui/button'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  // Derive current locale from URL path (fallback to 'ar')
  const getPath = () => {
    if (typeof window === 'undefined') return '/ar'
    try { return window.location.pathname || '/ar' } catch { return '/ar' }
  }
  const safePath = getPath()
  const currentLocale = (safePath.split('/')[1] || 'ar') as 'ar' | 'en'

  const switchLanguage = (newLocale: 'ar' | 'en') => {
    // 1) Persist selection
    try { localStorage.setItem('locale', newLocale) } catch {}

    // 2) Update URL locale segment without navigating
    try {
      const url = new URL(window.location.href)
      const segments = url.pathname.split('/')
      segments[1] = newLocale
      url.pathname = segments.join('/')
      window.history.replaceState({}, '', url.toString())
    } catch {}

    // 3) Notify app in same tab
    try { window.dispatchEvent(new CustomEvent('locale-changed', { detail: newLocale })) } catch {}
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={currentLocale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      title={currentLocale === 'ar' ? 'English' : 'العربية'}
      className="h-8 w-8"
      onClick={() => switchLanguage(currentLocale === 'ar' ? 'en' : 'ar')}
    >
      <Globe className="h-5 w-5" />
    </Button>
  )
}