import { useState } from 'react';
import { User, Edit, Save, X, MapPin, Phone, Mail, Car, CreditCard, Bell, Shield, Package, Heart, History } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface UserProfileProps extends RouteContext {}

// Mock data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 450,
    items: 3,
    statusText: 'تم التوصيل'
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 230,
    items: 2,
    statusText: 'في الطريق'
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'processing',
    total: 180,
    items: 1,
    statusText: 'قيد المعالجة'
  }
];

const mockWishlist = [
  {
    id: '1',
    name: 'فلتر زيت محرك تويوتا كامري',
    price: 85,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200',
    inStock: true
  },
  {
    id: '2',
    name: 'إطار ميشلين بريمير 225/65R17',
    price: 450,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    inStock: true
  },
  {
    id: '3',
    name: 'بطارية AC Delco 60 أمبير',
    price: 180,
    image: 'https://images.unsplash.com/photo-1609592842852-f9a6d461e543?w=200',
    inStock: false
  }
];

const mockAddresses = [
  {
    id: '1',
    type: 'home',
    name: 'المنزل',
    address: 'شارع الملك فهد، حي الروضة، الرياض 12345',
    phone: '+966 50 123 4567',
    isDefault: true
  },
  {
    id: '2',
    type: 'work',
    name: 'العمل',
    address: 'طريق الملك عبدالعزيز، حي العليا، الرياض 11564',
    phone: '+966 50 123 4567',
    isDefault: false
  }
];

const mockVehicles = [
  {
    id: '1',
    make: 'تويوتا',
    model: 'كامري',
    year: 2020,
    engine: '2.5L',
    isDefault: true
  },
  {
    id: '2',
    make: 'هوندا',
    model: 'أكورد',
    year: 2018,
    engine: '2.0L',
    isDefault: false
  }
];

export default function UserProfile({ user, setUser, setCurrentPage }: UserProfileProps) {
  const { t, locale } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    avatar: '',
    role: 'customer' as const
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    emailNotifications: true,
    smsNotifications: true
  });

  const handleSave = () => {
    setUser?.(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user || editedUser);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, { ar: string; en: string }> = {
      delivered: { ar: 'تم التوصيل', en: 'Delivered' },
      shipped: { ar: 'في الطريق', en: 'Shipped' },
      processing: { ar: 'قيد المعالجة', en: 'Processing' }
    };
    const entry = map[status] || { ar: status, en: status };
    return locale === 'en' ? entry.en : entry.ar;
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="profile" setCurrentPage={setCurrentPage} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={editedUser.avatar} />
                  <AvatarFallback className="text-xl">
                    {editedUser.name?.charAt(0) || 'أ'}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-medium mb-2">{editedUser.name}</h2>
                <p className="text-muted-foreground mb-4">{editedUser.email}</p>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center">
                    {locale === 'en' ? 'Member since Jan 2023' : 'عضو منذ يناير 2023'}
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-center">
                    <Package className="h-3 w-3 ml-1" />
                    {mockOrders.length} {locale === 'en' ? 'orders' : 'طلب'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">{locale === 'en' ? 'Profile' : 'الملف الشخصي'}</TabsTrigger>
                <TabsTrigger value="orders">{locale === 'en' ? 'My Orders' : 'طلباتي'}</TabsTrigger>
                <TabsTrigger value="addresses">{locale === 'en' ? 'Addresses' : 'العناوين'}</TabsTrigger>
                <TabsTrigger value="vehicles">{locale === 'en' ? 'My Vehicles' : 'مركباتي'}</TabsTrigger>
                <TabsTrigger value="wishlist">{locale === 'en' ? 'Wishlist' : 'المفضلة'}</TabsTrigger>
                <TabsTrigger value="settings">{locale === 'en' ? 'Settings' : 'الإعدادات'}</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{locale === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 ml-2" />
                        {locale === 'en' ? 'Edit' : 'تعديل'}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 ml-2" />
                          {locale === 'en' ? 'Save' : 'حفظ'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 ml-2" />
                          {locale === 'en' ? 'Cancel' : 'إلغاء'}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t('fullName')}</Label>
                        <Input
                          id="name"
                          value={editedUser.name || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{locale === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{locale === 'en' ? 'Phone Number' : 'رقم الهاتف'}</Label>
                        <Input
                          id="phone"
                          value={editedUser.phone || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthdate">{locale === 'en' ? 'Birth Date' : 'تاريخ الميلاد'}</Label>
                        <Input
                          id="birthdate"
                          type="date"
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === 'en' ? 'My Orders' : 'طلباتي'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-medium">{locale === 'en' ? 'Order #' : 'طلب رقم '} {order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                              <p className="text-sm text-muted-foreground">{order.items} {locale === 'en' ? 'item(s)' : 'منتج'}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                            <p className="font-medium mt-2">{order.total} {locale === 'en' ? 'SAR' : 'ر.س'}</p>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setCurrentPage('my-orders')}
                      >
                        {locale === 'en' ? 'View all orders' : 'عرض جميع الطلبات'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{locale === 'en' ? 'Delivery Addresses' : 'عناوين التوصيل'}</CardTitle>
                    <Button>
                      <MapPin className="h-4 w-4 ml-2" />
                      {locale === 'en' ? 'Add New Address' : 'إضافة عنوان جديد'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAddresses.map(address => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="secondary">{locale === 'en' ? 'Default' : 'افتراضي'}</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">{locale === 'en' ? 'Edit' : 'تعديل'}</Button>
                              <Button variant="ghost" size="sm" className="text-destructive">{locale === 'en' ? 'Delete' : 'حذف'}</Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{address.address}</p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vehicles Tab */}
              <TabsContent value="vehicles">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{locale === 'en' ? 'My Vehicles' : 'مركباتي'}</CardTitle>
                    <Button>
                      <Car className="h-4 w-4 ml-2" />
                      {locale === 'en' ? 'Add New Vehicle' : 'إضافة مركبة جديدة'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockVehicles.map(vehicle => (
                        <div key={vehicle.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">
                                  {vehicle.make} {vehicle.model} {vehicle.year}
                                </h3>
                                {vehicle.isDefault && (
                                  <Badge variant="secondary">{locale === 'en' ? 'Default' : 'افتراضي'}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{locale === 'en' ? 'Engine' : 'المحرك'}: {vehicle.engine}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">{locale === 'en' ? 'Edit' : 'تعديل'}</Button>
                              <Button variant="ghost" size="sm" className="text-destructive">{locale === 'en' ? 'Delete' : 'حذف'}</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === 'en' ? 'Wishlist' : 'قائمة المفضلة'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockWishlist.map(item => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.name}</h3>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-primary">{item.price} {locale === 'en' ? 'SAR' : 'ر.س'}</span>
                            <div className="flex gap-1">
                              <Button size="sm" disabled={!item.inStock}>
                                {item.inStock ? (locale === 'en' ? 'Add to Cart' : 'إضافة للسلة') : (locale === 'en' ? 'Out of Stock' : 'غير متوفر')}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Heart className="h-4 w-4 fill-current" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{locale === 'en' ? 'Notification Settings' : 'إعدادات الإشعارات'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>{locale === 'en' ? 'Order Updates' : 'تحديثات الطلبات'}</Label>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? 'Receive notifications about your order status' : 'استقبل إشعارات حول حالة طلباتك'}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.orderUpdates}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, orderUpdates: checked })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>{locale === 'en' ? 'Offers and Discounts' : 'العروض والخصومات'}</Label>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? 'Receive notifications about special offers' : 'استقبل إشعارات حول العروض الخاصة'}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.promotions}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, promotions: checked })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>{locale === 'en' ? 'New Products' : 'المنتجات الجديدة'}</Label>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? 'Receive notifications about new products' : 'استقبل إشعارات حول المنتجات الجديدة'}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.newProducts}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, newProducts: checked })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>{locale === 'en' ? 'Email Notifications' : 'الإشعارات عبر البريد الإلكتروني'}</Label>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? 'Receive notifications via email' : 'استقبل الإشعارات عبر البريد الإلكتروني'}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailNotifications: checked })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>{locale === 'en' ? 'SMS Notifications' : 'الإشعارات عبر الرسائل النصية'}</Label>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? 'Receive notifications via SMS' : 'استقبل الإشعارات عبر الرسائل النصية'}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, smsNotifications: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{locale === 'en' ? 'Account Security' : 'أمان الحساب'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 ml-2" />
                        {locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 ml-2" />
                        {locale === 'en' ? 'Enable Two-Factor Authentication' : 'تفعيل المصادقة الثنائية'}
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive">
                        <X className="h-4 w-4 ml-2" />
                        {locale === 'en' ? 'Delete Account' : 'حذف الحساب'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}