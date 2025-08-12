import { useState } from 'react';
import { Wrench, Car, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '../components/ui/utils';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useTranslation } from '../hooks/useTranslation';
import { addUser, validateEmail, validatePasswordMin, Role } from '../lib/authMock';

interface RegisterProps extends RouteContext {}

export default function Register({ setCurrentPage, setUser, returnTo, setReturnTo, user, cartItems }: RegisterProps) {
  const { t, locale } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isAr = locale === 'ar';
  const [role, setRole] = useState<Role>('customer');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!name.trim()) {
      setError(isAr ? 'الاسم مطلوب' : 'Name is required');
      return;
    }
    if (!validateEmail(email)) {
      setError(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format');
      return;
    }
    if (!validatePasswordMin(password, 6)) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    const res = addUser({ name: name.trim(), email: email.trim(), password, role });
    if (!res.ok) {
      setError(isAr ? 'هذا البريد مستخدم بالفعل' : 'Email already in use');
      return;
    }
    setError(null);
    const u = res.user;
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    const dest = returnTo || (role === 'admin' ? 'admin-dashboard' : role === 'vendor' ? 'vendor-dashboard' : role === 'marketer' ? 'marketer-dashboard' : 'home');
    setReturnTo(null);
    setCurrentPage(dest);
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="register" setCurrentPage={setCurrentPage} user={user} setUser={setUser} cartItems={cartItems} />
      <div className="w-full px-0 md:px-6 py-6 md:py-8">
        <div
          className={cn(
            "flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:min-h-[80vh]",
            locale === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row',
          )}
        > 
          {/* Visual panel */}
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden border bg-muted/30 h-56 md:h-auto md:min-h-[70vh] flex-1",
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
              <h2 className="text-2xl font-bold mb-2">
                {locale === 'en' ? 'Join our auto parts community' : 'انضم إلى مجتمع قطع الغيار'}
              </h2>
              <p className="text-sm text-white/90 mb-4">
                {locale === 'en'
                  ? 'Create an account to track orders and save your vehicle preferences'
                  : 'أنشئ حساباً لتتبع الطلبات وحفظ تفضيلات سيارتك'}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Wrench className="w-4 h-4" /> {locale === 'en' ? 'Expert support' : 'دعم فني خبير'}</li>
                <li className="flex items-center gap-2"><Car className="w-4 h-4" /> {locale === 'en' ? 'Vehicle profiles' : 'ملفات سيارات'}</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> {locale === 'en' ? 'Protected data' : 'بياناتك محمية'}</li>
              </ul>
            </div>
          </div>

          {/* Form panel */}
          <div
            className={cn(
              "w-full md:mx-0 flex-1 flex items-start md:items-center justify-center px-4",
            )}
          > 
            <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl">{locale === 'en' ? 'Create your account' : 'إنشاء حساب جديد'}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Fill in your details to get started.' : 'أدخل بياناتك للبدء.'}
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleRegister} dir={isAr ? 'rtl' : 'ltr'}>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded p-2">
                      {error}
                    </div>
                  )}
                  <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                    <Label className="font-medium" htmlFor="name">{t('fullName')}</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-lg text-base" />
                  </div>
                  <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                    <Label className="font-medium" htmlFor="email">{locale === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={cn('h-11 rounded-lg text-base', isAr ? 'pr-11 text-right' : 'pl-11')}
                      />
                      <Mail className={cn('absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground', isAr ? 'right-3' : 'left-3')} />
                    </div>
                  </div>
                  <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                    <Label className="font-medium" htmlFor="password">{locale === 'en' ? 'Password' : 'كلمة المرور'}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={cn('h-11 rounded-lg text-base pl-11 pr-11', isAr && 'text-right')}
                      />
                      <Lock className={cn('absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground', isAr ? 'right-3' : 'left-3')} />
                      <button
                        type="button"
                        aria-label={locale === 'en' ? (showPassword ? 'Hide password' : 'Show password') : (showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور')}
                        onClick={() => setShowPassword((v: boolean) => !v)}
                        className={cn('absolute top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/50 transition', isAr ? 'left-2' : 'right-2')}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4 text-muted-foreground" />
                        ) : (
                          <Eye className="size-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                    <Label className="font-medium" htmlFor="role">{isAr ? 'الدور' : 'Role'}</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
                    >
                      <option value="customer">{isAr ? 'مستخدم' : 'Customer'}</option>
                      <option value="vendor">{isAr ? 'بائع' : 'Vendor'}</option>
                      <option value="marketer">{isAr ? 'مسوّق' : 'Marketer'}</option>
                    </select>
                  </div>
                  <Button className="w-full rounded-lg h-11 text-base font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px] ring-1 ring-indigo-500/30 transition" size="lg" type="submit">{locale === 'en' ? 'Register' : 'تسجيل'}</Button>
                </form>
                <div className="my-4 border-t border-gray-200 dark:border-gray-800" />
                <div className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟'}{' '}
                  <button className="text-primary underline" onClick={() => setCurrentPage('login')}>
                    {locale === 'en' ? 'Login' : 'تسجيل الدخول'}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
