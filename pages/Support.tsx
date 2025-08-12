import { RouteContext } from '../components/Router';
import { Phone } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Support({ setCurrentPage }: Partial<RouteContext>) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Phone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">{t('customerSupport')}</h1>
        <p className="text-muted-foreground">صفحة الدعم الفني قيد التطوير</p>
        <button 
          onClick={() => setCurrentPage && setCurrentPage('home')} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {t('home')}
        </button>
      </div>
    </div>
  );
}