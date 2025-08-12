import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Send,
  Clock
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const { t, locale } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Newsletter section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('newsletterTitle')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('newsletterDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder={t('emailPlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 text-right"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                <Send className="w-4 h-4 ml-1" />
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white text-primary p-2 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                    ع
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('companyFullName')}</h3>
                  <p className="text-sm text-gray-400">{t('brandSubtitle')}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t('storeDescription')}
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t('quickLinks')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition-colors">{t('home')}</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-white transition-colors">{t('about')}</button></li>
                <li><button onClick={() => setCurrentPage('products')} className="text-gray-300 hover:text-white transition-colors">{t('products')}</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition-colors">{t('offers')}</button></li>
                {/* Removed blog key as it's not present in translations */}
                <li><button onClick={() => setCurrentPage('contact')} className="text-gray-300 hover:text-white transition-colors">{t('contact')}</button></li>
              </ul>
            </div>

            {/* Customer service */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t('customerService')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('support')} className="text-gray-300 hover:text-white transition-colors">{t('helpSupport') || 'المساعدة والدعم'}</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition-colors">{t('returnPolicy')}</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition-colors">{t('privacyPolicy')}</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition-colors">{t('termsOfService')}</button></li>
                <li><button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition-colors">{t('paymentMethods') || 'طرق الدفع'}</button></li>
                <li><button onClick={() => setCurrentPage('track-order')} className="text-gray-300 hover:text-white transition-colors">{t('trackOrder') || 'تتبع الطلب'}</button></li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t('contactInfo')}</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">{t('address')}</p>
                    <p className="text-gray-300">{t('cityCountry') || 'الرياض 12333، السعودية'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-gray-300">{t('phone')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-gray-300">{t('email') || 'info@al-aref.com'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">{t('workingHoursWeekdays') || 'الأحد - الخميس: 8ص - 10م'}</p>
                    <p className="text-gray-300">{t('workingHoursWeekend') || 'الجمعة - السبت: 2م - 10م'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 {t('companyFullName')}. {t('allRightsReserved') || 'جميع الحقوق محفوظة.'}
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </button>
              <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition-colors">
                {t('termsOfService')}
              </button>
              <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition-colors">
                {t('siteMap') || 'خريطة الموقع'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
