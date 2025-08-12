import { useState } from 'react';
import { RouteContext } from '../components/Router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useTranslation } from '../hooks/useTranslation';

interface RegisterProps extends RouteContext {}

export default function Register({ setCurrentPage, setUser, returnTo, setReturnTo }: RegisterProps) {
  const { t, locale } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register then log in
    setUser({ id: 'u2', name, email, role: 'customer' });
    const dest = returnTo || 'checkout';
    setReturnTo(null);
    setCurrentPage(dest);
  };

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="register" setCurrentPage={setCurrentPage} />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'en' ? 'Create your account' : 'إنشاء حساب جديد'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">{locale === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">{locale === 'en' ? 'Password' : 'كلمة المرور'}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button className="w-full" type="submit">{locale === 'en' ? 'Register' : 'تسجيل'}</Button>
            </form>
            <div className="text-sm text-muted-foreground mt-4">
              {locale === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟'}{' '}
              <button className="text-primary underline" onClick={() => setCurrentPage('login')}>
                {locale === 'en' ? 'Login' : 'تسجيل الدخول'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
