import { RouteContext } from '../components/Router';
import { FileText } from 'lucide-react';

export default function MyOrders(context: RouteContext) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">طلباتي</h1>
        <p className="text-muted-foreground">صفحة الطلبات قيد التطوير</p>
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