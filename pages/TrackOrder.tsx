import { RouteContext } from '../components/Router';
import { Truck } from 'lucide-react';

export default function TrackOrder(context: RouteContext) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">تتبع الطلب</h1>
        <p className="text-muted-foreground">صفحة تتبع الطلب قيد التطوير</p>
        <button 
          onClick={() => context.setCurrentPage('home')} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}