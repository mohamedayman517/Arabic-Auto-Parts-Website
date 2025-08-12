'use client';
import { useState, useEffect } from 'react';
import { Package, Eye, Download, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RouteContext } from '../../components/Router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from '../../utils/vendorHelpers';
import { useTranslation } from '../../hooks/useTranslation';

interface VendorOrdersProps extends RouteContext {}

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'أحمد محمد',
    customerEmail: 'ahmed@example.com',
    items: [
      { name: 'فلتر زيت محرك تويوتا كامري', quantity: 2, price: 85 },
      { name: 'إطار ميشلين بريمير', quantity: 1, price: 450 }
    ],
    total: 620,
    status: 'pending',
    date: '2024-01-15',
    shippingAddress: 'الرياض، حي الروضة'
  },
  {
    id: 'ORD-002',
    customer: 'فاطمة علي',
    customerEmail: 'fatima@example.com',
    items: [
      { name: 'بطارية AC Delco 60 أمبير', quantity: 1, price: 180 }
    ],
    total: 205,
    status: 'shipped',
    date: '2024-01-14',
    shippingAddress: 'جدة، حي الحمراء'
  },
  {
    id: 'ORD-003',
    customer: 'محمد أحمد',
    customerEmail: 'mohammed@example.com',
    items: [
      { name: 'مصابيح LED فيليبس', quantity: 2, price: 95 }
    ],
    total: 215,
    status: 'delivered',
    date: '2024-01-13',
    shippingAddress: 'الدمام، حي الفيصلية'
  }
];

export default function VendorOrders({ setCurrentPage }: VendorOrdersProps) {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { t, locale } = useTranslation();

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.includes(searchTerm) ||
        order.customer.includes(searchTerm) ||
        order.customerEmail.includes(searchTerm)
      );
    }

    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedStatus, orders]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    return { totalOrders, pendingOrders, shippedOrders, deliveredOrders };
  };

  const stats = getOrderStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="vendor-orders" setCurrentPage={setCurrentPage} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('vendorOrdersTitle')}</h1>
            <p className="text-muted-foreground">{t('vendorOrdersSubtitle')}</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            {t('exportOrders')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalOrdersLabel')}</p>
                  <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('pendingLabel')}</p>
                  <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('shippedLabel')}</p>
                  <h3 className="text-2xl font-bold">{stats.shippedOrders}</h3>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('deliveredLabel')}</p>
                  <h3 className="text-2xl font-bold">{stats.deliveredOrders}</h3>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('searchOrdersPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('orderStatusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatusesLabel')}</SelectItem>
                  <SelectItem value="pending">{t('pendingLabel')}</SelectItem>
                  <SelectItem value="processing">{t('processingLabel')}</SelectItem>
                  <SelectItem value="shipped">{t('shippedLabel')}</SelectItem>
                  <SelectItem value="delivered">{t('deliveredLabel')}</SelectItem>
                  <SelectItem value="cancelled">{t('cancelledLabel')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ordersListTitle')} ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">طلب رقم {order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                    </div>
                    <div className="text-left">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <p className="font-medium mt-1">{formatCurrency(order.total, locale === 'en' ? 'en' : 'ar')}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">{t('productsLabel')}</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity, locale === 'en' ? 'en' : 'ar')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {t('deliveryAddress')} {order.shippingAddress}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Package className="h-4 w-4 ml-2" />
                        {t('viewDetails')}
                      </Button>
                      {order.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                        >
                          {t('processOrder')}
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                        >
                          {t('shipOrder')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}