import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
import { info as infoAlert } from '../utils/alerts';

interface RegisterProps extends RouteContext {}

export default function Register({ setCurrentPage, setUser, returnTo, setReturnTo, user, cartItems }: RegisterProps) {
  const { t, locale } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isAr = locale === 'ar';
  const [role, setRole] = useState<Role>('customer');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [profession, setProfession] = useState<'plumber' | 'electrician' | 'carpenter' | 'painter' | 'gypsum' | 'marble' | ''>('');
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
    if (role === 'technician') {
      if (!phone.trim()) { setError(isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required'); return; }
      if (!dob.trim()) { setError(isAr ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required'); return; }
      if (!profession) { setError(isAr ? 'اختر المهنة' : 'Please select a profession'); return; }
    }

    const base = { name: name.trim(), email: email.trim(), password, role } as any;
    if (role === 'technician') {
      base.phone = phone.trim();
      base.dob = dob.trim();
      base.profession = profession;
    }
    const res = addUser(base);
    if (!res.ok) {
      setError(isAr ? 'هذا البريد مستخدم بالفعل' : 'Email already in use');
      return;
    }
    setError(null);
    const u = res.user;
    // If vendor: do NOT auto-login. Inform pending approval and redirect to login
    if (u.role === 'vendor') {
      infoAlert(
        isAr ? 'تم استلام طلب تسجيلك كبائع وهو قيد المراجعة من الإدارة. سيتم إشعارك عند الموافقة، بعدها يمكنك تسجيل الدخول.' : 'Your vendor registration has been received and is pending admin approval. You will be notified when approved, then you can log in.',
        isAr
      );
      setReturnTo(null);
      setCurrentPage('login');
      return;
    }
    // Non-vendor: auto-login as before
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    try {
      const payload: any = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      };
      if (u.role === 'technician') {
        payload.phone = (u as any).phone || phone;
        payload.dob = (u as any).dob || dob;
        payload.birthdate = (u as any).dob || dob;
        payload.profession = (u as any).profession || profession;
        payload.technicianType = (u as any).profession || profession;
      }
      localStorage.setItem('mock_current_user', JSON.stringify(payload));
    } catch {}
    const dest = returnTo || 'home';
    setReturnTo(null);
    setCurrentPage(dest);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="register" setCurrentPage={setCurrentPage} user={user} setUser={setUser} cartItems={cartItems} />
      <div className="w-full px-4 md:px-6 py-10 md:py-12">
        <div className="max-w-2xl mx-auto min-h-[70vh] flex items-center justify-center">
          <div className="w-full">
            <Card className="w-full max-w-xl mx-auto shadow-2xl border border-gray-200/70 dark:border-gray-800/70 rounded-2xl backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-extrabold">{locale === 'en' ? 'Create your account' : 'إنشاء حساب جديد'}</CardTitle>
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
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl text-base" />
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
                        className={cn('h-12 rounded-xl text-base', isAr ? 'pr-11 text-right' : 'pl-11')}
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
                        className={cn('h-12 rounded-xl text-base pl-11 pr-11', isAr && 'text-right')}
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
                      <option value="technician">{isAr ? 'فني' : 'Technician'}</option>
                    </select>
                  </div>
                  {role === 'technician' && (
                    <>
                      <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                        <Label className="font-medium" htmlFor="phone">{isAr ? 'رقم الهاتف' : 'Phone Number'}</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12 rounded-xl text-base" />
                      </div>
                      <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                        <Label className="font-medium" htmlFor="dob">{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</Label>
                        <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="h-12 rounded-xl text-base" />
                      </div>
                      <div className={cn('space-y-1', isAr ? 'text-right' : 'text-left')}>
                        <Label className="font-medium" htmlFor="profession">{isAr ? 'المهنة' : 'Profession'}</Label>
                        <select
                          id="profession"
                          value={profession}
                          onChange={(e) => setProfession(e.target.value as any)}
                          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
                        >
                          <option value="">{isAr ? 'اختر المهنة' : 'Select profession'}</option>
                          <option value="plumber">{isAr ? 'سباك' : 'Plumber'}</option>
                          <option value="electrician">{isAr ? 'كهربائي' : 'Electrician'}</option>
                          <option value="carpenter">{isAr ? 'نجار' : 'Carpenter'}</option>
                          <option value="painter">{isAr ? 'دهان' : 'Painter'}</option>
                          <option value="gypsum">{isAr ? 'فني جبس' : 'Gypsum Installer'}</option>
                          <option value="marble">{isAr ? 'فني رخام' : 'Marble Installer'}</option>
                        </select>
                      </div>
                    </>
                  )}
                  <Button className="w-full rounded-xl h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px] ring-1 ring-indigo-500/30 transition" size="lg" type="submit">{locale === 'en' ? 'Register' : 'تسجيل'}</Button>
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
