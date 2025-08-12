"use client";

import { Search, ShoppingCart, User, Menu, Phone, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';
import type { RouteContext } from './Router';
import { useState } from 'react';

interface HeaderProps extends Partial<RouteContext> {
  currentPage?: string;
}

export default function Header({ currentPage, setCurrentPage, cartItems, user, setUser, goBack }: HeaderProps) {
  const { t, locale } = useTranslation();
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  // Robust navigation: uses context when available, otherwise falls back to URL param
  const go = (page: string) => {
    if (setCurrentPage) return setCurrentPage(page);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        window.location.href = url.toString();
      } catch {
        // no-op
      }
    }
  };
  const isHome = (() => {
    if (currentPage) return currentPage === 'home';
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        return (url.searchParams.get('page') || 'home') === 'home';
      } catch {}
    }
    return false;
  })();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const isMarketer = user?.role === 'marketer';
  const isRestricted = !!(isAdmin || isMarketer);
  
  return (
    <header className="w-full">
      {/* Top promotional banner */}
      <div className="bg-red-600 text-white py-2 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            🎉 {locale === 'ar' ? 'عرض خاص: خصم 20% على جميع قطع المحرك' : 'Special Offer: 20% off all engine parts'} -
            <button onClick={() => go('offers')} className="underline hover:no-underline">{t('offers')}</button>
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {/* Back button */}
              {!isHome && (
                <button
                  onClick={() => {
                    if (goBack) return goBack();
                    if (typeof window !== 'undefined' && window.history.length > 1) {
                      try { window.history.back(); return; } catch {}
                    }
                    go('home');
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label={locale==='ar' ? 'رجوع' : 'Back'}
                  title={locale==='ar' ? 'رجوع' : 'Back'}
                >
                  {locale === 'ar' ? (
                    <ArrowRight className="w-5 h-5" />
                  ) : (
                    <ArrowLeft className="w-5 h-5" />
                  )}
                </button>
              )}

              <button onClick={() => go('home')} className="flex items-center gap-2" aria-label={t('brandLogo')}>
                <div className="bg-primary text-white p-2 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                    {t('brandName').charAt(0)}
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary">{t('brandName')}</h1>
                  <p className="text-xs text-muted-foreground">{t('brandSubtitle')}</p>
                </div>
              </button>
            </div>

            {/* Navigation */}
            {!isRestricted && (
              <nav className="hidden md:flex items-center gap-8">
                <button onClick={() => go('home')} className="text-foreground hover:text-primary transition-colors">{t('home')}</button>
                <button onClick={() => go('products')} className="text-foreground hover:text-primary transition-colors">{t('products')}</button>
                <button onClick={() => go('offers')} className="text-foreground hover:text-primary transition-colors">{t('offers')}</button>
                <button onClick={() => go('about')} className="text-foreground hover:text-primary transition-colors">{t('about')}</button>
                <button onClick={() => go('contact')} className="text-foreground hover:text-primary transition-colors">{t('contact')}</button>
              </nav>
            )}

            {/* Contact info & actions */}
            <div className="flex items-center gap-4">
              {!isRestricted && (
                <div className="hidden lg:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{t('phone')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{t('location')}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                {/* Auth area */}
                {user ? (
                  <div className="hidden md:flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ar' ? 'أهلاً،' : 'Welcome,'} <span className="font-semibold text-foreground">{user.name}</span>
                    </span>
                    {!isRestricted && (
                      <Button variant="ghost" size="icon" onClick={() => go('profile')} aria-label="Profile">
                        <User className="w-5 h-5" />
                      </Button>
                    )}
                    <button
                      onClick={() => { setUser && setUser(null); go('home'); }}
                      className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-4">
                    <button
                      onClick={() => go('login')}
                      className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                    </button>
                    <button
                      onClick={() => go('register')}
                      className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {locale === 'ar' ? 'إنشاء حساب' : 'Register'}
                    </button>
                  </div>
                )}
                {user && user.role === 'customer' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => go('cart')}
                    aria-label={locale==='ar' ? 'سلة التسوق' : 'Cart'}
                    title={locale==='ar' ? 'سلة التسوق' : 'Cart'}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full px-1 flex items-center justify-center text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                )}
                {!isRestricted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((v) => !v)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 dark:text-gray-100 border-b dark:border-gray-700 shadow-sm">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {!isRestricted && (
              <>
                <button onClick={() => { go('home'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{t('home')}</button>
                <button onClick={() => { go('products'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{t('products')}</button>
                <button onClick={() => { go('offers'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{t('offers')}</button>
                <button onClick={() => { go('about'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{t('about')}</button>
                <button onClick={() => { go('contact'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{t('contact')}</button>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              </>
            )}
            {user ? (
              <>
                {!isRestricted && (
                  <button onClick={() => { go('profile'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{locale === 'ar' ? 'الملف الشخصي' : 'Profile'}</button>
                )}
                <button onClick={() => { setUser && setUser(null); go('home'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</button>
              </>
            ) : (
              !isRestricted && (
                <>
                  <button onClick={() => { go('login'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
                  <button onClick={() => { go('register'); setMobileOpen(false); }} className="py-3 text-left text-foreground hover:text-primary transition-colors">{locale === 'ar' ? 'إنشاء حساب' : 'Register'}</button>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
