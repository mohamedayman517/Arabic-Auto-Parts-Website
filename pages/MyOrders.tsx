import { useState } from 'react';
import Swal from 'sweetalert2';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

type OrderStatus = 'delivered' | 'shipped' | 'processing';
interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
  statusText: string;
}

const seedOrders: Order[] = [
  { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 450, items: 3, statusText: 'تم التوصيل' },
  { id: 'ORD-002', date: '2024-01-10', status: 'shipped', total: 230, items: 2, statusText: 'في الطريق' },
  { id: 'ORD-003', date: '2024-01-05', status: 'processing', total: 180, items: 1, statusText: 'قيد المعالجة' }
];

export default function MyOrders({ user, setCurrentPage, goBack }: RouteContext) {
  const { locale } = useTranslation();

  const orderKey = user ? `mock_orders_${user.id}` : '';
  const readLS = (key: string) => {
    try { const raw = key && localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
  };
  const writeLS = (key: string, val: unknown) => {
    try { if (key) localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };
  const normalizeOrders = (raw: any): Order[] => {
    if (!Array.isArray(raw)) return seedOrders;
    const ok: OrderStatus[] = ['delivered','shipped','processing'];
    return raw.map((o: any): Order => ({
      id: String(o?.id ?? Date.now()),
      date: String(o?.date ?? ''),
      status: (ok.includes(o?.status) ? (o.status as OrderStatus) : ('processing' as OrderStatus)),
      total: Number(o?.total ?? 0),
      items: Number(o?.items ?? 0),
      statusText: typeof o?.statusText === 'string' ? o.statusText : ''
    }));
  };

  const [orders, setOrders] = useState<Order[]>(() => (user && normalizeOrders(readLS(orderKey))) || seedOrders);
  const persistOrders = (next: Order[]) => { setOrders(next); if (user) writeLS(orderKey, next); };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  const getStatusText = (status: OrderStatus) => {
    const map: Record<string, { ar: string; en: string }> = {
      delivered: { ar: 'تم التوصيل', en: 'Delivered' },
      shipped: { ar: 'في الطريق', en: 'Shipped' },
      processing: { ar: 'قيد المعالجة', en: 'Processing' }
    };
    const entry = map[status];
    return locale === 'en' ? entry.en : entry.ar;
  };

  const cancelOrder = async (id: string) => {
    const o = orders.find(x=>x.id===id); if (!o) return;
    if (o.status !== 'processing') { Swal.fire({ title: locale==='en'?'Cannot cancel':'لا يمكن الإلغاء', text: locale==='en'?'Only processing orders can be cancelled':'يمكن إلغاء الطلبات قيد المعالجة فقط', icon: 'info' }); return; }
    const go = await Swal.fire({ title: locale==='en'?'Cancel order?':'إلغاء الطلب؟', icon: 'warning', showCancelButton: true, confirmButtonText: locale==='en'?'Cancel Order':'إلغاء الطلب', cancelButtonText: locale==='en'?'Back':'رجوع' });
    if (!go.isConfirmed) return;
    persistOrders(orders.map((x: Order) => x.id===id ? { ...x, status: 'delivered' as OrderStatus, statusText: locale==='en'?'Cancelled':'ملغي', total: 0, items: 0 } : x));
  };
  const confirmDelivered = (id: string) => {
    const o = orders.find(x=>x.id===id); if (!o) return;
    if (o.status === 'delivered') return;
    persistOrders(orders.map((x: Order) => x.id===id ? { ...x, status: 'delivered' as OrderStatus, statusText: locale==='en'?'Delivered':'تم التوصيل' } : x));
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="my-orders" setCurrentPage={setCurrentPage} user={user} goBack={goBack} />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'en' ? 'My Orders' : 'طلباتي'}</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {locale === 'en' ? 'No orders yet.' : 'لا توجد طلبات بعد.'}
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: Order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{locale === 'en' ? 'Order #' : 'طلب رقم '} {order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <p className="text-sm text-muted-foreground">{order.items} {locale === 'en' ? 'item(s)' : 'منتج'}</p>
                    </div>
                    <div className="text-left">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <p className="font-medium mt-2">{order.total} {locale === 'en' ? 'SAR' : 'ر.س'}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => confirmDelivered(order.id)}>{locale==='en'?'Confirm Delivery':'تأكيد الاستلام'}</Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => cancelOrder(order.id)}>{locale==='en'?'Cancel':'إلغاء'}</Button>
                        <Button size="sm" onClick={() => setCurrentPage('track-order')}>{locale==='en'?'Track Order':'تتبع الطلب'}</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}