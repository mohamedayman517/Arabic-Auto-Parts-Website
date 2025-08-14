import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import type { RouteContext } from "../components/routerTypes";
import { Eye, Pencil, Trash2, ArrowLeft, Check, X } from "lucide-react";

interface ServiceDetailsProps extends Partial<RouteContext> {}

type Service = {
  id: string;
  type: string;
  dailyWage: number;
  days: number;
  total: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

const SERVICE_TYPES = [
  { id: 'plumber', ar: 'سباك', en: 'Plumber' },
  { id: 'electrician', ar: 'كهربائي', en: 'Electrician' },
  { id: 'carpenter', ar: 'نجار', en: 'Carpenter' },
  { id: 'painter', ar: 'نقاش', en: 'Painter' },
  { id: 'gypsum_installer', ar: 'فني تركيب جيبس بورد', en: 'Gypsum Board Installer' },
  { id: 'marble_installer', ar: 'فني تركيب رخام', en: 'Marble Installer' },
];

export default function ServiceDetails({ setCurrentPage }: ServiceDetailsProps) {
  const { locale } = useTranslation();
  const currency = locale === 'ar' ? 'ر.س' : 'SAR';
  const [service, setService] = useState<Service | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);

  // Load selected service by id from localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const id = window.localStorage.getItem('selected_service_id');
      if (!id) return;
      const raw = window.localStorage.getItem('user_services');
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return;
      const found = list.find((s: any) => String(s.id) === String(id));
      if (found) setService(found as Service);
      // Load proposals for this service
      try {
        const pRaw = window.localStorage.getItem('vendor_proposals');
        const plist = pRaw ? JSON.parse(pRaw) : [];
        const filtered = Array.isArray(plist) ? plist.filter((p:any)=> p.targetType === 'service' && String(p.targetId) === String(id)) : [];
        setProposals(filtered);
      } catch {}
    } catch {}
  }, []);

  const typeLabel = useMemo(() => {
    if (!service) return '';
    const item = SERVICE_TYPES.find(s => s.id === service.type);
    return item ? (locale === 'ar' ? item.ar : item.en) : service.type;
  }, [service, locale]);

  const deleteService = () => {
    try {
      if (!service) return;
      const raw = window.localStorage.getItem('user_services');
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        const next = list.filter((s: any) => String(s.id) !== String(service.id));
        window.localStorage.setItem('user_services', JSON.stringify(next));
      }
    } catch {}
    // navigate back to projects
    setCurrentPage && setCurrentPage('projects');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Header currentPage="projects" setCurrentPage={setCurrentPage as any} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('projects')}>
              <ArrowLeft className="w-4 h-4 ml-1" /> {locale === 'ar' ? 'رجوع' : 'Back'}
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {locale === 'ar' ? 'لم يتم العثور على الخدمة' : 'Service not found'}
            </CardContent>
          </Card>
        </div>
        <Footer setCurrentPage={setCurrentPage as any} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="projects" setCurrentPage={setCurrentPage as any} />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{locale === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}</h1>
            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'عرض وتعديل وحذف الخدمة' : 'View, edit, and delete service'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('projects')}>
              <ArrowLeft className="w-4 h-4 ml-1" /> {locale === 'ar' ? 'رجوع' : 'Back'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => { try { window.localStorage.setItem('edit_service_id', String(service.id)); } catch {}; setCurrentPage && setCurrentPage('add-service'); }}
            >
              <Pencil className="w-4 h-4 ml-1" /> {locale === 'ar' ? 'تعديل' : 'Edit'}
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white border border-red-600" onClick={deleteService}>
              <Trash2 className="w-4 h-4 ml-1" /> {locale === 'ar' ? 'حذف' : 'Delete'}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'نوع الفني' : 'Technician'}</div>
              <div className="text-base font-medium">{typeLabel}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'اليومية' : 'Daily wage'}</div>
                <div className="text-base font-medium">{currency} {Number(service.dailyWage || 0).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'الأيام' : 'Days'}</div>
                <div className="text-base font-medium">{Number(service.days || 0)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'الإجمالي' : 'Total'}</div>
                <div className="text-base font-semibold text-primary">{currency} {Number(service.total || 0).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</div>
              </div>
            </div>
            {service.description && (
              <div>
                <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'الوصف' : 'Description'}</div>
                <div className="text-base">{service.description}</div>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {service.createdAt ? (locale === 'ar' ? `أُنشئت: ${new Date(service.createdAt).toLocaleString('ar-EG')}` : `Created: ${new Date(service.createdAt).toLocaleString('en-US')}`) : null}
              {service.updatedAt ? (locale === 'ar' ? ` • آخر تحديث: ${new Date(service.updatedAt).toLocaleString('ar-EG')}` : ` • Updated: ${new Date(service.updatedAt).toLocaleString('en-US')}`) : null}
            </div>
          </CardContent>
        </Card>

        {/* Proposals for this service */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{locale === 'ar' ? 'عروض مقدّمة' : 'Submitted Proposals'}</h2>
              <Badge variant="outline">{proposals.length}</Badge>
            </div>
            {proposals.length === 0 ? (
              <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'لا توجد عروض حتى الآن.' : 'No proposals yet.'}</div>
            ) : (
              <div className="space-y-3">
                {proposals.map((pp:any)=> (
                  <div key={pp.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{locale === 'ar' ? 'السعر' : 'Price'}: {currency} {Number(pp.price||0).toLocaleString(locale==='ar'?'ar-EG':'en-US')}</div>
                      <Badge variant={pp.status==='accepted'? 'secondary' : pp.status==='rejected'? 'destructive' : 'outline'} className="text-xs capitalize">{locale==='ar' ? (pp.status==='pending'?'معلق': pp.status==='accepted'?'مقبول':'مرفوض') : pp.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{locale === 'ar' ? 'المدة' : 'Days'}: {Number(pp.days||0)}</div>
                    {pp.message && <div className="mt-1 text-xs bg-muted/20 rounded p-2">{pp.message}</div>}
                    {pp.status === 'pending' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Button size="sm" className="flex-1" onClick={() => {
                          try {
                            const raw = window.localStorage.getItem('vendor_proposals');
                            const list = raw ? JSON.parse(raw) : [];
                            const next = list.map((x:any)=> x.id===pp.id ? { ...x, status: 'accepted' } : x);
                            window.localStorage.setItem('vendor_proposals', JSON.stringify(next));
                            setProposals((prev)=> prev.map((x:any)=> x.id===pp.id ? { ...x, status: 'accepted' } : x));
                          } catch {}
                        }}>
                          <Check className="w-4 h-4 ml-1" /> {locale === 'ar' ? 'قبول' : 'Accept'}
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700 text-white border border-red-600" onClick={() => {
                          try {
                            const raw = window.localStorage.getItem('vendor_proposals');
                            const list = raw ? JSON.parse(raw) : [];
                            const next = list.map((x:any)=> x.id===pp.id ? { ...x, status: 'rejected' } : x);
                            window.localStorage.setItem('vendor_proposals', JSON.stringify(next));
                            setProposals((prev)=> prev.map((x:any)=> x.id===pp.id ? { ...x, status: 'rejected' } : x));
                          } catch {}
                        }}>
                          <X className="w-4 h-4 ml-1" /> {locale === 'ar' ? 'رفض' : 'Reject'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer setCurrentPage={setCurrentPage as any} />
    </div>
  );
}
