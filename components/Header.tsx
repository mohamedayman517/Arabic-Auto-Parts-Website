"use client";

import { Search, ShoppingCart, User, Menu, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';
import type { RouteContext } from './Router';

interface HeaderProps extends Partial<RouteContext> {
  currentPage?: string;
}

export default function Header({ currentPage, setCurrentPage, cartItems }: HeaderProps) {
  const { t, locale } = useTranslation();
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const go = (page: string) => setCurrentPage?.(page);
  
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

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => go('home')} className="text-foreground hover:text-primary transition-colors">{t('home')}</button>
              <button onClick={() => go('products')} className="text-foreground hover:text-primary transition-colors">{t('products')}</button>
              <button onClick={() => go('offers')} className="text-foreground hover:text-primary transition-colors">{t('offers')}</button>
              <button onClick={() => go('about')} className="text-foreground hover:text-primary transition-colors">{t('about')}</button>
              <button onClick={() => go('contact')} className="text-foreground hover:text-primary transition-colors">{t('contact')}</button>
              <button onClick={() => go('login')} className="text-foreground hover:text-primary transition-colors">
                {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </button>
            </nav>

            {/* Contact info & actions */}
            <div className="flex items-center gap-4">
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
              
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setCurrentPage && setCurrentPage('cart')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full px-1 flex items-center justify-center text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => go('profile')}>
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
