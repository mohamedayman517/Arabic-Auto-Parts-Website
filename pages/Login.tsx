import { useState } from 'react';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useTranslation } from '../hooks/useTranslation';

interface LoginProps extends RouteContext {}

export default function Login({ setCurrentPage, setUser, returnTo, setReturnTo }: LoginProps) {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Map static demo accounts to roles and landing pages
  const resolveRoleAndDest = (inputEmail: string) => {
    const normalized = inputEmail.trim().toLowerCase();
    if (normalized === 'admin@demo.com') {
      return { role: 'admin' as const, dest: 'admin-dashboard' };
    }
    if (normalized === 'vendor@demo.com') {
      return { role: 'vendor' as const, dest: 'vendor-dashboard' };
    }
    return { role: 'customer' as const, dest: returnTo || 'checkout' };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login with static accounts
    const { role, dest } = resolveRoleAndDest(email);
    const displayName = role === 'admin' ? 'Admin User' : role === 'vendor' ? 'Vendor User' : 'Guest User';
    setUser({ id: 'u1', name: displayName, email, role });
    setReturnTo(null);
    setCurrentPage(dest);
  };

  // Quick login helpers for demo accounts
  const quickLogin = (role: 'admin' | 'vendor') => {
    const demoEmail = role === 'admin' ? 'admin@demo.com' : 'vendor@demo.com';
    const dest = role === 'admin' ? 'admin-dashboard' : 'vendor-dashboard';
    setUser({ id: role === 'admin' ? 'a1' : 'v1', name: role === 'admin' ? 'Admin User' : 'Vendor User', email: demoEmail, role });
    setReturnTo(null);
    setCurrentPage(dest);
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="login" setCurrentPage={setCurrentPage} />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'en' ? 'Sign in to your account' : 'تسجيل الدخول إلى حسابك'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email">{locale === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">{locale === 'en' ? 'Password' : 'كلمة المرور'}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button className="w-full" type="submit">{locale === 'en' ? 'Login' : 'تسجيل الدخول'}</Button>
            </form>
            {/* Demo account shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <Button variant="secondary" onClick={() => quickLogin('admin')}>
                {locale === 'en' ? 'Login as Admin' : 'تسجيل دخول كمسؤول'}
              </Button>
              <Button variant="secondary" onClick={() => quickLogin('vendor')}>
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
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
