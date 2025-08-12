import { useState } from 'react';
import { User, Edit, Save, X, MapPin, Mail, CreditCard, Shield, Package, Heart, History } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getUsers, saveUsers, validatePasswordMin } from '../lib/authMock';

// Local types for profile data
type OrderStatus = 'delivered' | 'shipped' | 'processing';
interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
  statusText: string;
}
interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

interface UserProfileProps extends RouteContext {
  // Add any additional props specific to UserProfile
}

// Seed data (used if user has no saved data)
const seedOrders: Order[] = [
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

// Using wishlist from context instead of mock data

const seedAddresses: Address[] = [
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

 

export default function UserProfile({ user, setUser, setCurrentPage, wishlistItems, removeFromWishlist, addToCart }: UserProfileProps) {
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

  // LocalStorage helpers for per-user data
  const addrKey = user ? `mock_addresses_${user.id}` : '';
  const orderKey = user ? `mock_orders_${user.id}` : '';

  const readLS = (key: string) => {
    try { const raw = key && localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
  };
  const writeLS = (key: string, val: unknown) => {
    try { if (key) localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };

  // State: orders and addresses
  // Normalizers to coerce LS data safely to typed structs
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
  const normalizeAddresses = (raw: any): Address[] => {
    if (!Array.isArray(raw)) return seedAddresses;
    const types = ['home','work','other'] as const;
    return raw.map((a: any): Address => ({
      id: String(a?.id ?? Date.now()),
      type: types.includes(a?.type) ? a.type : 'home',
      name: String(a?.name ?? ''),
      address: String(a?.address ?? ''),
      phone: String(a?.phone ?? ''),
      isDefault: Boolean(a?.isDefault)
    }));
  };

  const [orders, setOrders] = useState<Order[]>(
    () => (user && normalizeOrders(readLS(orderKey))) || seedOrders
  );
  const [addresses, setAddresses] = useState<Address[]>(
    () => (user && normalizeAddresses(readLS(addrKey))) || seedAddresses
  );

  // Persist on changes (when user exists)
  const persistOrders = (next: typeof orders) => { setOrders(next); if (user) writeLS(orderKey, next); };
  const persistAddresses = (next: typeof addresses) => { setAddresses(next); if (user) writeLS(addrKey, next); };

  const handleSave = () => {
    setUser?.(editedUser);
    setIsEditing(false);
  };

  // Address actions
  const addAddress = async () => {
    const html = `
      <div class="space-y-2 text-right">
        <input id="addr_name" class="swal2-input" placeholder="${locale==='en'?'Name':'الاسم'}" />
        <input id="addr_address" class="swal2-input" placeholder="${locale==='en'?'Address':'العنوان'}" />
        <input id="addr_phone" class="swal2-input" placeholder="${locale==='en'?'Phone':'الهاتف'}" />
      </div>`;
    const res = await Swal.fire({
      title: locale==='en'?'Add New Address':'إضافة عنوان جديد',
      html,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: locale==='en'?'Save':'حفظ',
      cancelButtonText: locale==='en'?'Cancel':'إلغاء',
      preConfirm: () => {
        const name = (document.getElementById('addr_name') as HTMLInputElement)?.value?.trim();
        const address = (document.getElementById('addr_address') as HTMLInputElement)?.value?.trim();
        const phone = (document.getElementById('addr_phone') as HTMLInputElement)?.value?.trim();
        if (!name || !address || !phone) {
          Swal.showValidationMessage(locale==='en'?'All fields are required':'كل الحقول مطلوبة');
          return null as any;
        }
        return { name, address, phone };
      }
    }) as any;
    if (!res.value) return;
    const newAddr = { id: String(Date.now()), type: 'home' as const, name: res.value.name, address: res.value.address, phone: res.value.phone, isDefault: addresses.length===0 };
    persistAddresses([newAddr, ...addresses.map(a=> ({...a, isDefault: a.isDefault && !(addresses.length===0)}))]);
    Swal.fire({ title: locale==='en'?'Address added':'تمت إضافة العنوان', icon: 'success', timer: 1500, showConfirmButton: false });
  };

  const editAddress = async (id: string) => {
    const a = addresses.find(x=>x.id===id); if (!a) return;
    const html = `
      <div class="space-y-2 text-right">
        <input id="addr_name" class="swal2-input" value="${a.name}" />
        <input id="addr_address" class="swal2-input" value="${a.address}" />
        <input id="addr_phone" class="swal2-input" value="${a.phone}" />
      </div>`;
    const res = await Swal.fire({
      title: locale==='en'?'Edit Address':'تعديل العنوان',
      html,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: locale==='en'?'Save':'حفظ',
      cancelButtonText: locale==='en'?'Cancel':'إلغاء',
      preConfirm: () => {
        const name = (document.getElementById('addr_name') as HTMLInputElement)?.value?.trim();
        const address = (document.getElementById('addr_address') as HTMLInputElement)?.value?.trim();
        const phone = (document.getElementById('addr_phone') as HTMLInputElement)?.value?.trim();
        if (!name || !address || !phone) { Swal.showValidationMessage(locale==='en'?'All fields are required':'كل الحقول مطلوبة'); return null as any; }
        return { name, address, phone };
      }
    }) as any;
    if (!res.value) return;
    persistAddresses(addresses.map(x => x.id===id ? { ...x, ...res.value } : x));
    Swal.fire({ title: locale==='en'?'Address updated':'تم تحديث العنوان', icon: 'success', timer: 1500, showConfirmButton: false });
  };

  const deleteAddress = async (id: string) => {
    const go = await Swal.fire({ title: locale==='en'?'Delete address?':'حذف العنوان؟', icon: 'warning', showCancelButton: true, confirmButtonText: locale==='en'?'Delete':'حذف', cancelButtonText: locale==='en'?'Cancel':'إلغاء' });
    if (!go.isConfirmed) return;
    const next = addresses.filter(a=>a.id!==id);
    // Ensure at most one default remains
    if (next.length>0 && !next.some(a=>a.isDefault)) next[0].isDefault = true;
    persistAddresses([...next]);
    Swal.fire({ title: locale==='en'?'Deleted':'تم الحذف', icon: 'success', timer: 1200, showConfirmButton: false });
  };

  const setDefaultAddress = (id: string) => {
    persistAddresses(addresses.map(a => ({ ...a, isDefault: a.id===id })));
  };

  // Order actions
  const cancelOrder = async (id: string) => {
    const o = orders.find(x=>x.id===id); if (!o) return;
    if (o.status !== 'processing') { Swal.fire({ title: locale==='en'?'Cannot cancel':'لا يمكن الإلغاء', text: locale==='en'?'Only processing orders can be cancelled':'يمكن إلغاء الطلبات قيد المعالجة فقط', icon: 'info' }); return; }
    const go = await Swal.fire({ title: locale==='en'?'Cancel order?':'إلغاء الطلب؟', icon: 'warning', showCancelButton: true, confirmButtonText: locale==='en'?'Cancel Order':'إلغاء الطلب', cancelButtonText: locale==='en'?'Back':'رجوع' });
    if (!go.isConfirmed) return;
    const next = orders.map((x: Order) => x.id===id ? { ...x, status: 'delivered' as OrderStatus, statusText: locale==='en'?'Cancelled':'ملغي', total: 0, items: 0 } : x);
    persistOrders(next);
  };

  const confirmDelivered = (id: string) => {
    const o = orders.find(x=>x.id===id); if (!o) return;
    if (o.status === 'delivered') return;
    persistOrders(orders.map((x: Order) => x.id===id ? { ...x, status: 'delivered' as OrderStatus, statusText: locale==='en'?'Delivered':'تم التوصيل' } : x));
  };

  const handleChangePassword = async () => {
    if (!user) {
      Swal.fire({ title: locale === 'en' ? 'You must be logged in' : 'يجب تسجيل الدخول', icon: 'error' });
      return;
    }
    const result = await Swal.fire<{ value: string }>({
      title: locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور',
      input: 'password',
      inputLabel: locale === 'en' ? 'New Password (min 6 chars)' : 'كلمة المرور الجديدة (6 أحرف على الأقل)',
      inputPlaceholder: locale === 'en' ? 'Enter new password' : 'أدخل كلمة المرور الجديدة',
      showCancelButton: true,
      confirmButtonText: locale === 'en' ? 'Save' : 'حفظ',
      cancelButtonText: locale === 'en' ? 'Cancel' : 'إلغاء',
      preConfirm: (value: string) => {
        if (!validatePasswordMin(value || '', 6)) {
          Swal.showValidationMessage(locale === 'en' ? 'Password must be at least 6 characters' : 'يجب أن تكون كلمة المرور 6 أحرف على الأقل');
        }
        return value;
      }
    } as any);
    const newPass = (result as any).value as string | undefined;
    if (!newPass) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === (user as any).id);
    if (idx === -1) {
      Swal.fire({ title: locale === 'en' ? 'User not found' : 'المستخدم غير موجود', icon: 'error' });
      return;
    }
    users[idx].password = newPass;
    saveUsers(users);
    Swal.fire({ title: locale === 'en' ? 'Password updated' : 'تم تحديث كلمة المرور', icon: 'success', timer: 2000, showConfirmButton: false });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const res = await Swal.fire({
      title: locale === 'en' ? 'Delete Account?' : 'حذف الحساب؟',
      text: locale === 'en' ? 'This action cannot be undone' : 'لا يمكن التراجع عن هذا الإجراء',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: locale === 'en' ? 'Delete' : 'حذف',
      cancelButtonText: locale === 'en' ? 'Cancel' : 'إلغاء'
    });
    if (!res.isConfirmed) return;
    const users = getUsers().filter(u => u.id !== (user as any).id);
    saveUsers(users);
    try { localStorage.removeItem('mock_current_user'); } catch {}
    setUser?.(null as any);
    setCurrentPage?.('home');
    Swal.fire({ title: locale === 'en' ? 'Account deleted' : 'تم حذف الحساب', icon: 'success', timer: 2000, showConfirmButton: false });
  };

  const roleLabel = (r?: string) => {
    if (!r) return '';
    const map: Record<string, { ar: string; en: string }> = {
      admin: { ar: 'مشرف', en: 'Admin' },
      vendor: { ar: 'بائع', en: 'Vendor' },
      marketer: { ar: 'مسوّق', en: 'Marketer' },
      customer: { ar: 'عميل', en: 'Customer' }
    };
    const entry = map[r] || { ar: r, en: r };
    return locale === 'en' ? entry.en : entry.ar;
  };

  const handleCancel = () => {
    setEditedUser(user || editedUser);
    setIsEditing(false);
  };

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
    const entry = map[status] || { ar: status, en: status };
    return locale === 'en' ? entry.en : entry.ar;
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="profile" setCurrentPage={setCurrentPage} user={user} setUser={setUser} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-28 h-28 mx-auto mb-4 ring-2 ring-primary/20">
                  <AvatarImage src={editedUser.avatar} />
                  <AvatarFallback className="text-xl">
                    {editedUser.name?.charAt(0) || 'أ'}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-medium mb-2">{editedUser.name}</h2>
                <p className="text-muted-foreground mb-4">{editedUser.email}</p>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center gap-2">
                    <Shield className="h-3 w-3" /> {roleLabel(editedUser.role)}
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-center gap-1">
                    <Package className="h-3 w-3 ml-1" />
                    {orders.length} {locale === 'en' ? 'orders' : 'طلب'}
                  </Badge>
                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">{locale === 'en' ? 'Profile' : 'الملف الشخصي'}</TabsTrigger>
                <TabsTrigger value="orders">{locale === 'en' ? 'My Orders' : 'طلباتي'}</TabsTrigger>
                <TabsTrigger value="addresses">{locale === 'en' ? 'Addresses' : 'العناوين'}</TabsTrigger>
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
                        {/* Email input removed as requested; email shown read-only under avatar */}
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
                      {orders.map((order: Order) => (
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
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => confirmDelivered(order.id)}>{locale==='en'?'Confirm Delivery':'تأكيد الاستلام'}</Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => cancelOrder(order.id)}>{locale==='en'?'Cancel':'إلغاء'}</Button>
                            </div>
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
                    <Button onClick={addAddress}>
                      <MapPin className="h-4 w-4 ml-2" />
                      {locale === 'en' ? 'Add New Address' : 'إضافة عنوان جديد'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address: Address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="secondary">{locale === 'en' ? 'Default' : 'افتراضي'}</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {!address.isDefault && (
                                <Button variant="outline" size="sm" onClick={() => setDefaultAddress(address.id)}>{locale==='en'?'Make Default':'تعيين كافتراضي'}</Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => editAddress(address.id)}>{locale === 'en' ? 'Edit' : 'تعديل'}</Button>
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteAddress(address.id)}>{locale === 'en' ? 'Delete' : 'حذف'}</Button>
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

              

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === 'en' ? 'Wishlist' : 'قائمة المفضلة'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {wishlistItems?.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-medium mb-2">{locale === 'en' ? 'Your wishlist is empty' : 'قائمة المفضلة فارغة'}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {locale === 'en' ? 'Add items to your wishlist by clicking the heart icon on products' : 'أضف منتجات إلى قائمة المفضلة بالضغط على أيقونة القلب على المنتجات'}
                        </p>
                        <Button onClick={() => setCurrentPage('product-listing')}>
                          {locale === 'en' ? 'Browse Products' : 'تصفح المنتجات'}
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistItems?.map(item => (
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
                                <Button 
                                  size="sm" 
                                  disabled={!item.inStock}
                                  onClick={() => {
                                    if (item.inStock) {
                                      addToCart && addToCart({
                                        ...item,
                                        quantity: 1,
                                        maxQuantity: 10
                                      });
                                      Swal.fire({
                                        title: locale === 'en' ? 'Added to cart' : 'تمت الإضافة إلى السلة',
                                        icon: 'success',
                                        toast: true,
                                        position: 'top-end',
                                        showConfirmButton: false,
                                        timer: 3000
                                      });
                                    }
                                  }}
                                >
                                  {item.inStock ? (locale === 'en' ? 'Add to Cart' : 'إضافة للسلة') : (locale === 'en' ? 'Out of Stock' : 'غير متوفر')}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromWishlist && removeFromWishlist(item.id);
                                    Swal.fire({
                                      title: locale === 'en' ? 'Removed from wishlist' : 'تمت الإزالة من المفضلة',
                                      icon: 'info',
                                      toast: true,
                                      position: 'top-end',
                                      showConfirmButton: false,
                                      timer: 3000
                                    });
                                  }}
                                >
                                  <Heart className="h-4 w-4 fill-current" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{locale === 'en' ? 'Account Security' : 'أمان الحساب'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
                        <Shield className="h-4 w-4 ml-2" />
                        {locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleDeleteAccount}>
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