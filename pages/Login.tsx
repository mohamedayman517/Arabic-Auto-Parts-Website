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
import { authenticate, validateEmail, validatePasswordMin, findUserByEmail } from '../lib/authMock';

interface LoginProps extends RouteContext {}

export default function Login({ setCurrentPage, setUser, returnTo, setReturnTo, user, cartItems }: LoginProps) {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAr = locale === 'ar';
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map role to landing page
  const roleDest = (role: 'admin' | 'vendor' | 'marketer' | 'customer') => {
    if (returnTo) return returnTo;
    if (role === 'admin') return 'admin-dashboard';
    if (role === 'vendor') return 'vendor-dashboard';
    if (role === 'marketer') return 'marketer-dashboard';
    return 'home';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!validateEmail(email)) {
      setError(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format');
      return;
    }
    if (!validatePasswordMin(password, 6)) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    const user = authenticate(email, password);
    if (!user) {
      // If email exists but password wrong, show specific message
      const exists = !!findUserByEmail(email);
      setError(
        exists
          ? (isAr ? 'كلمة المرور غير صحيحة' : 'Incorrect password')
          : (isAr ? 'لا يوجد حساب بهذا البريد' : 'No account found with this email')
      );
      return;
    }
    setError(null);
    const u = user;
    const cleanName = typeof u.name === 'string' ? u.name.replace(/\s*User$/i, '').trim() : u.name;
    setUser({ id: u.id, name: cleanName, email: u.email, role: u.role });
    setReturnTo(null);
    setCurrentPage(roleDest(user.role));
  };

  // Quick login helpers for demo accounts
  const quickLogin = (role: 'admin' | 'vendor') => {
    const demoEmail = role === 'admin' ? 'admin@demo.com' : 'vendor@demo.com';
    const demoPass = role === 'admin' ? 'admin123' : 'vendor123';
    const user = authenticate(demoEmail, demoPass);
    if (user) {
      setUser({ id: user.id, name: user.name, email: user.email, role: user.role });
      setReturnTo(null);
      setCurrentPage(roleDest(user.role));
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="login" setCurrentPage={setCurrentPage} user={user} setUser={setUser} cartItems={cartItems} />
      <div className="w-full px-0 md:px-6 py-6 md:py-8">
        <div
          className={cn(
            "flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:min-h-[80vh]",
            // English: form left, image right. Arabic: form right, image left.
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
                  "url('https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
              <h2 className="text-2xl font-bold mb-2">
                {locale === 'en' ? 'Everything for your car' : 'كل ما تحتاجه لسيارتك'}
              </h2>
              <p className="text-sm text-white/90 mb-4">
                {locale === 'en'
                  ? 'Genuine and aftermarket auto parts with fast delivery'
                  : 'قطع غيار أصلية وتجارية مع توصيل سريع'}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Wrench className="w-4 h-4" /> {locale === 'en' ? 'Wide parts catalog' : 'كتالوج قطع واسع'}</li>
                <li className="flex items-center gap-2"><Car className="w-4 h-4" /> {locale === 'en' ? 'Fits your vehicle' : 'متوافق مع سيارتك'}</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> {locale === 'en' ? 'Secure shopping' : 'تسوق آمن'}</li>
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
                <CardTitle className="text-2xl">
                  {locale === 'en' ? 'Sign in to your account' : 'تسجيل الدخول إلى حسابك'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Welcome back. Please enter your details.' : 'مرحباً بعودتك. من فضلك أدخل بياناتك.'}
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleLogin} dir={isAr ? 'rtl' : 'ltr'}>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded p-2">
                      {error}
                    </div>
                  )}
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
                        onClick={() => setShowPassword((v) => !v)}
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
                  <div className={cn('flex items-center justify-between text-sm', isAr ? 'flex-row-reverse' : 'flex-row')}>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" className="size-4 rounded border-gray-300 dark:border-gray-700" />
                      <span className="text-muted-foreground">{locale === 'en' ? 'Remember me' : 'تذكرني'}</span>
                    </label>
                    <button type="button" className="text-primary hover:underline">
                      {locale === 'en' ? 'Forgot password?' : 'هل نسيت كلمة المرور؟'}
                    </button>
                  </div>
                  <Button className="w-full rounded-lg h-11 text-base font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px] ring-1 ring-indigo-500/30 transition" size="lg" type="submit">{locale === 'en' ? 'Login' : 'تسجيل الدخول'}</Button>
                </form>
                {/* Demo account shortcuts */}
                <div className="my-4 border-t border-gray-200 dark:border-gray-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button variant="secondary" className="rounded-lg h-11 bg-secondary text-foreground border border-border hover:bg-secondary/90 shadow-sm" size="lg" onClick={() => quickLogin('admin')}>
                    {locale === 'en' ? 'Login as Admin' : 'تسجيل دخول كمسؤول'}
                  </Button>
                  <Button variant="secondary" className="rounded-lg h-11 bg-secondary text-foreground border border-border hover:bg-secondary/90 shadow-sm" size="lg" onClick={() => quickLogin('vendor')}>
                    {locale === 'en' ? 'Login as Vendor' : 'تسجيل دخول كبائع'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {locale === 'en'
                    ? 'Demo accounts: admin@demo.com, vendor@demo.com (any password)'
                    : 'حسابات تجريبية: admin@demo.com و vendor@demo.com (أي كلمة مرور)'}
                </p>
                <div className="text-sm text-muted-foreground mt-4">
                  {locale === 'en' ? "Don't have an account?" : 'ليس لديك حساب؟'}{' '}
                  <button className="text-primary underline" onClick={() => setCurrentPage('register')}>
                    {locale === 'en' ? 'Create one' : 'إنشاء حساب'}
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
