import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { RouteContext } from '../components/Router';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Ruler, Package, Layers, Boxes, ClipboardList, Calendar, ArrowRight, Edit3, Info } from 'lucide-react';

// Keep catalogs in sync with ProjectsBuilder/Projects
const productTypes = [
  { id: 'door', ar: 'باب', en: 'Door' },
  { id: 'window', ar: 'شباك', en: 'Window' },
  { id: 'railing', ar: 'دربزين', en: 'Railing' },
];
const materials = [
  { id: 'aluminum', ar: 'ألمنيوم', en: 'Aluminum' },
  { id: 'steel', ar: 'صاج', en: 'Steel' },
  { id: 'laser', ar: 'ليزر', en: 'Laser-cut' },
  { id: 'glass', ar: 'سكريت', en: 'Glass (Securit)' },
];
const accessoriesCatalog = [
  { id: 'brass_handle', ar: 'أوكرة نحاس', en: 'Brass Handle', price: 20 },
  { id: 'stainless_handle', ar: 'أوكرة سلستين', en: 'Stainless Handle', price: 15 },
  { id: 'aluminum_lock', ar: 'كالون الومنيوم', en: 'Aluminum Lock', price: 40 },
  { id: 'computer_lock', ar: 'قفل كمبيوتر', en: 'Computer Lock', price: 60 },
  { id: 'window_knob', ar: 'مقبض شباك', en: 'Window Knob', price: 20 },
];

interface ProjectDetailsProps extends Partial<RouteContext> {}

export default function ProjectDetails({ setCurrentPage, goBack }: ProjectDetailsProps) {
  const { t, locale } = useTranslation();
  const currency = locale === 'ar' ? 'ر.س' : 'SAR';
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load selected project by id from localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const id = localStorage.getItem('selected_project_id');
      const raw = localStorage.getItem('user_projects');
      if (!id || !raw) return;
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const found = list.find((p: any) => p.id === id);
        setProject(found || null);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  const typeLabel = useMemo(() => productTypes.find(pt => pt.id === (project?.ptype || project?.type))?.[locale==='ar'?'ar':'en'] || '', [project, locale]);
  const materialLabel = useMemo(() => materials.find(m => m.id === project?.material)?.[locale==='ar'?'ar':'en'] || '', [project, locale]);
  const accessoriesNames = useMemo(() => {
    if (!project) return [] as string[];
    if (Array.isArray(project.accessories)) return project.accessories.map((a: any)=> (locale==='ar'?a.ar:a.en));
    if (Array.isArray(project.selectedAcc)) return project.selectedAcc.map((id: string)=>{
      const acc = accessoriesCatalog.find(a=>a.id===id);
      return acc ? (locale==='ar'?acc.ar:acc.en) : null;
    }).filter(Boolean) as string[];
    return [] as string[];
  }, [project, locale]);

  // Derived values for summary/breakdown
  const area = useMemo(() => (project ? (Number(project.width)||0) * (Number(project.height)||0) : 0), [project]);
  const pricePerMeter = useMemo(() => (project ? (Number(project.pricePerMeter)||0) : 0), [project]);
  const quantity = useMemo(() => (project ? (Number(project.quantity)||0) : 0), [project]);
  const subtotal = useMemo(() => Math.max(0, area * pricePerMeter), [area, pricePerMeter]);
  const accessoriesCost = useMemo(() => {
    if (!project) return 0;
    if (Array.isArray(project.accessories)) return project.accessories.reduce((s: number, a: any) => s + (Number(a.price)||0), 0);
    if (Array.isArray(project.selectedAcc)) return project.selectedAcc.reduce((s: number, id: string) => {
      const acc = accessoriesCatalog.find(a=>a.id===id); return s + (acc?.price||0);
    }, 0);
    return 0;
  }, [project]);

  const handleEdit = () => {
    if (!project) return;
    try {
      const draft = {
        id: project.id,
        ptype: project.ptype || project.type || '',
        psubtype: project.psubtype || 'normal',
        material: project.material || '',
        color: project.color || 'white',
        width: project.width || 0,
        height: project.height || 0,
        quantity: project.quantity || 1,
        selectedAcc: Array.isArray(project.selectedAcc)
          ? project.selectedAcc
          : Array.isArray(project.accessories)
            ? project.accessories.map((a:any)=>a?.id).filter(Boolean)
            : [],
        description: project.description || ''
      };
      localStorage.setItem('edit_project_draft', JSON.stringify(draft));
    } catch {}
    setCurrentPage && setCurrentPage('projects-builder');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    if (goBack) return goBack();
    setCurrentPage && setCurrentPage('projects');
  };

  return (
    <div className="min-h-screen bg-background" dir={locale==='ar'?'rtl':'ltr'}>
      <Header currentPage="project-details" setCurrentPage={setCurrentPage as any} />

      <div className="container mx-auto px-4 py-8">
        {/* Loading/empty state */}
        {loading && (
          <Card className="max-w-2xl mx-auto animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-40 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-muted rounded" />
                <div className="h-12 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !project && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Info className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">{locale==='ar' ? 'لا توجد تفاصيل متاحة لهذا المشروع.' : 'No details available for this project.'}</p>
              <p className="text-sm text-muted-foreground">{locale==='ar' ? 'ربما تم حذف المشروع أو لم يتم اختياره.' : 'The project might have been removed or not selected.'}</p>
              <div className="pt-1">
                <Button onClick={back} className="inline-flex items-center gap-1">
                  {locale==='ar' ? 'رجوع للمشاريع' : 'Back to Projects'} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && project && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main details */}
            <Card className="lg:col-span-2 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">{locale==='ar' ? 'تفاصيل المشروع' : 'Project Details'}</h1>
                  </div>
                  <Badge variant="secondary" className="text-sm">{typeLabel}</Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 bg-background">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4" /> {locale==='ar' ? 'الخامة' : 'Material'}
                    </div>
                    <div className="mt-1 font-medium">{materialLabel || '-'}</div>
                  </div>
                  <div className="rounded-lg border p-4 bg-background">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> {locale==='ar' ? 'الأبعاد (متر)' : 'Dimensions (m)'}
                    </div>
                    <div className="mt-1 font-medium">{(project.width||0)} × {(project.height||0)}<span className="text-muted-foreground text-xs ms-1">m</span></div>
                  </div>
                  <div className="rounded-lg border p-4 bg-background">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Boxes className="w-4 h-4" /> {locale==='ar' ? 'الكمية' : 'Quantity'}
                    </div>
                    <div className="mt-1 font-medium">{project.quantity || 0}</div>
                  </div>
                  <div className="rounded-lg border p-4 bg-background">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> {locale==='ar' ? 'سعر المتر المربع' : 'Price per m²'}
                    </div>
                    <div className="mt-1 font-medium">{project.pricePerMeter || 0} {currency}</div>
                  </div>
                </div>

                {/* Accessories */}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{locale==='ar' ? 'الملحقات' : 'Accessories'}</div>
                  {accessoriesNames.length>0 ? (
                    <div className="flex flex-wrap gap-2">
                      {accessoriesNames.map((name: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="rounded-full px-3 py-1 text-xs">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">{locale==='ar'?'بدون':'None'}</div>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{locale==='ar' ? 'الوصف' : 'Description'}</div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 border rounded-md p-3">
                      {project.description}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                  {project.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> {locale==='ar' ? 'تم الإنشاء' : 'Created'}: {new Date(project.createdAt).toLocaleString(locale==='ar'?'ar-EG':'en-US')}
                    </div>
                  )}
                  {project.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> {locale==='ar' ? 'آخر تحديث' : 'Updated'}: {new Date(project.updatedAt).toLocaleString(locale==='ar'?'ar-EG':'en-US')}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button onClick={handleEdit} className="inline-flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> {locale==='ar' ? 'تعديل' : 'Edit'}
                  </Button>
                  <Button variant="outline" onClick={back} className="inline-flex items-center gap-2">
                    {locale==='ar' ? 'رجوع' : 'Back'} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sticky price/breakdown */}
            <Card className="h-fit lg:sticky lg:top-24">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">{locale==='ar' ? 'ملخص السعر' : 'Price Summary'}</div>
                  <div className="text-3xl font-bold text-primary mt-1">{currency} {(project.total || 0).toLocaleString(locale==='ar'?'ar-EG':'en-US')}</div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'المساحة' : 'Area'}</span>
                    <span>{area.toFixed(2)} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'سعر المتر' : 'Price/m²'}</span>
                    <span>{currency} {pricePerMeter}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'الملحقات' : 'Accessories'}</span>
                    <span>{currency} {accessoriesCost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'الكمية' : 'Qty'}</span>
                    <span>{quantity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer setCurrentPage={setCurrentPage as any} />
    </div>
  );
}
