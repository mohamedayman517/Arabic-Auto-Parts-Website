import { useMemo, useState } from 'react';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';

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

export default function TrackOrder({ user, setCurrentPage, goBack }: RouteContext) {
  const { locale } = useTranslation();

  const orderKey = user ? `mock_orders_${user.id}` : '';
  const readLS = (key: string) => {
    try { const raw = key && localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
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

  const orders = useMemo<Order[]>(() => (user && normalizeOrders(readLS(orderKey))) || seedOrders, [user]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');

  const order = useMemo(() => {
    const id = (selectedId || query).trim();
    if (!id) return null;
    return orders.find(o => o.id.toLowerCase() === id.toLowerCase()) || null;
  }, [orders, query, selectedId]);

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

  const steps: { key: OrderStatus; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'processing', labelAr: 'قيد المعالجة', labelEn: 'Processing', icon: <Clock className="h-4 w-4" /> },
    { key: 'shipped', labelAr: 'في الطريق', labelEn: 'Shipped', icon: <Truck className="h-4 w-4" /> },
    { key: 'delivered', labelAr: 'تم التوصيل', labelEn: 'Delivered', icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const activeIndex = order ? steps.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="track-order" setCurrentPage={setCurrentPage} user={user} goBack={goBack} />
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search / Picker */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{locale==='en'?'Track Order':'تتبع الطلب'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="orderId">{locale==='en'?'Order ID':'رقم الطلب'}</Label>
                  <Input id="orderId" value={query} onChange={e=>setQuery(e.target.value)} placeholder={locale==='en'?'e.g. ORD-001':'مثال: ORD-001'} />
                  <p className="text-xs text-muted-foreground mt-1">{locale==='en'?'Enter your order ID to track status':'أدخل رقم الطلب لتتبع حالته'}</p>
                </div>
                <div>
                  <Label>{locale==='en'?'Recent Orders':'الطلبات الأخيرة'}</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-auto">
                    {orders.map(o => (
                      <div key={o.id} className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${selectedId===o.id?'border-primary ring-1 ring-primary/30':''}`} onClick={()=>setSelectedId(o.id)}>
                        <div>
                          <div className="font-medium">{o.id}</div>
                          <div className="text-xs text-muted-foreground">{o.date} • {o.items} {locale==='en'?'item(s)':'منتج'}</div>
                        </div>
                        <Badge className={getStatusColor(o.status)}>{getStatusText(o.status)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{order ? `${locale==='en'?'Order':'طلب'} # ${order.id}` : (locale==='en'?'Enter or select an order':'أدخل أو اختر طلباً')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!order ? (
                  <div className="text-center text-muted-foreground py-10">
                    {locale==='en'?'No order selected':'لم يتم اختيار طلب'}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                      <div className="text-sm text-muted-foreground">{order.items} {locale==='en'?'item(s)':'منتج'}</div>
                      <div className="font-medium ms-auto">{order.total} {locale==='en'?'SAR':'ر.س'}</div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {steps.map((s, idx) => {
                          const active = idx <= activeIndex;
                          return (
                            <div key={s.key} className="flex-1 flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{s.icon}</div>
                              <div className="text-xs mt-2">{locale==='en'?s.labelEn:s.labelAr}</div>
                              {idx < steps.length-1 && (
                                <div className={`h-1 w-full ${activeIndex>idx? 'bg-primary' : 'bg-muted'}`}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={()=>setCurrentPage('my-orders')}>{locale==='en'?'Back to My Orders':'العودة لطلباتي'}</Button>
                      <Button onClick={()=>setCurrentPage('support')} variant="ghost"><Package className="h-4 w-4 ml-2" />{locale==='en'?'Need Help?':'تحتاج مساعدة؟'}</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}