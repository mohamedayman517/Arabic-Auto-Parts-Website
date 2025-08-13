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

  // Main item total based on current project values
  const mainItemTotal = useMemo(() => {
    const qty = Math.max(1, quantity || 0);
    return Math.max(0, Math.round((subtotal + accessoriesCost) * qty));
  }, [subtotal, accessoriesCost, quantity]);

  // Additional items helpers
  const itemsArray = useMemo(() => Array.isArray(project?.items) ? project!.items : [], [project]);
  const itemsCount = useMemo(() => itemsArray.length, [itemsArray]);
  const addItemsTotal = useMemo(() => itemsArray.reduce((s: number, it: any) => s + (Number(it?.total)||0), 0), [itemsArray]);

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

      // Prepare additional items for builder
      if (Array.isArray(project.items) && project.items.length > 0) {
        const itemsDraft = project.items.map((it: any) => ({
          id: it.id || Math.random().toString(36).slice(2),
          ptype: it.ptype || it.type || '',
          psubtype: it.psubtype || 'normal',
          material: it.material || '',
          color: it.color || 'white',
          width: Number(it.width) || 0,
          height: Number(it.height) || 0,
          quantity: Number(it.quantity) || 1,
          autoPrice: true,
          pricePerMeter: Number(it.pricePerMeter) || 0, // builder recalculates
          selectedAcc: Array.isArray(it.selectedAcc) ? it.selectedAcc : [],
          description: it.description || '',
        }));
        localStorage.setItem('edit_project_items_draft', JSON.stringify(itemsDraft));
      } else {
        localStorage.removeItem('edit_project_items_draft');
      }
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
            <Card className="lg:col-span-2 overflow-hidden shadow-sm">
              <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">{locale==='ar' ? 'تفاصيل المشروع' : 'Project Details'}</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">{typeLabel}</Badge>
                    {itemsCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {locale==='ar' ? `${itemsCount + 1} عناصر` : `${itemsCount + 1} items`}
                      </Badge>
                    )}
                  </div>
                </div>
                {/* Quick summary chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {materialLabel && (
                    <Badge variant="outline" className="rounded-full text-xs">{materialLabel}</Badge>
                  )}
                  <Badge variant="outline" className="rounded-full text-xs">
                    {(project.width||0)} × {(project.height||0)} m
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs">
                    {locale==='ar' ? `الكمية: ${project.quantity||0}` : `Qty: ${project.quantity||0}`}
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs">
                    {locale==='ar' ? `سعر المتر: ${project.pricePerMeter||0}` : `Price/m²: ${project.pricePerMeter||0}`}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 bg-background shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4" /> {locale==='ar' ? 'الخامة' : 'Material'}
                    </div>
                    <div className="mt-1 font-medium">{materialLabel || '-'}</div>
                  </div>
                  <div className="rounded-lg border p-4 bg-background shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> {locale==='ar' ? 'الأبعاد (متر)' : 'Dimensions (m)'}
                    </div>
                    <div className="mt-1 font-medium">{(project.width||0)} × {(project.height||0)}<span className="text-muted-foreground text-xs ms-1">m</span></div>
                  </div>
                  <div className="rounded-lg border p-4 bg-background shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Boxes className="w-4 h-4" /> {locale==='ar' ? 'الكمية' : 'Quantity'}
                    </div>
                    <div className="mt-1 font-medium">{project.quantity || 0}</div>
                  </div>
                  <div className="rounded-lg border p-4 bg-background shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> {locale==='ar' ? 'سعر المتر المربع' : 'Price per m²'}
                    </div>
                    <div className="mt-1 font-medium">{project.pricePerMeter || 0} {currency}</div>
                  </div>
                </div>

                <Separator />
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
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{locale==='ar' ? 'الوصف' : 'Description'}</div>
                  {project.description ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 border rounded-md p-3">
                      {project.description}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">{locale==='ar' ? 'لا يوجد وصف مضاف.' : 'No description provided.'}</div>
                  )}
                </div>

                {/* Additional Items (from builder) */}
                {itemsCount > 0 && (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {locale==='ar' ? 'عناصر إضافية ضمن هذا المشروع' : 'Additional items in this project'}
                    </div>
                    <div className="space-y-4">
                      {itemsArray.map((it: any, idx: number) => {
                        const itTypeLabel = productTypes.find(pt => pt.id === (it?.ptype || it?.type))?.[locale==='ar'?'ar':'en'] || '';
                        const itMaterialLabel = materials.find(m => m.id === it?.material)?.[locale==='ar'?'ar':'en'] || '';
                        const itAccessoriesNames: string[] = Array.isArray(it?.selectedAcc)
                          ? it.selectedAcc.map((id: string) => {
                              const acc = accessoriesCatalog.find(a => a.id === id);
                              return acc ? (locale==='ar'?acc.ar:acc.en) : null;
                            }).filter(Boolean) as string[]
                          : [];
                        return (
                          <div key={it?.id || idx} className="rounded-lg border p-4 bg-background shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">{locale==='ar' ? `عنصر #${idx+2}` : `Item #${idx+2}`}</div>
                              {itTypeLabel && <Badge variant="outline">{itTypeLabel}</Badge>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <Layers className="w-4 h-4" /> {locale==='ar' ? 'الخامة' : 'Material'}
                                </div>
                                <div className="mt-1 font-medium">{itMaterialLabel || '-'}</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <Ruler className="w-4 h-4" /> {locale==='ar' ? 'الأبعاد (متر)' : 'Dimensions (m)'}
                                </div>
                                <div className="mt-1 font-medium">{(it?.width||0)} × {(it?.height||0)}<span className="text-muted-foreground text-xs ms-1">m</span></div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <Boxes className="w-4 h-4" /> {locale==='ar' ? 'الكمية' : 'Quantity'}
                                </div>
                                <div className="mt-1 font-medium">{it?.quantity || 0}</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <ClipboardList className="w-4 h-4" /> {locale==='ar' ? 'سعر المتر المربع' : 'Price per m²'}
                                </div>
                                <div className="mt-1 font-medium">{it?.pricePerMeter || 0} {currency}</div>
                              </div>
                            </div>
                            {/* Item accessories */}
                            <div className="mt-3">
                              <div className="text-sm text-muted-foreground">{locale==='ar' ? 'الملحقات' : 'Accessories'}</div>
                              {itAccessoriesNames.length>0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {itAccessoriesNames.map((name: string, i: number) => (
                                    <Badge key={i} variant="outline" className="rounded-full px-3 py-1 text-xs">{name}</Badge>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">{locale==='ar'?'بدون':'None'}</div>
                              )}
                            </div>
                            {/* Item description */}
                            {it?.description && (
                              <div className="mt-3">
                                <div className="text-sm text-muted-foreground">{locale==='ar' ? 'الوصف' : 'Description'}</div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 border rounded-md p-3">{it.description}</div>
                              </div>
                            )}
                            {/* Item total */}
                            <div className="mt-3 flex items-center justify-end">
                              <div className="text-sm">
                                <span className="text-muted-foreground me-2">{locale==='ar' ? 'إجمالي هذا العنصر:' : 'Item total:'}</span>
                                <span className="font-semibold">{currency} {(it?.total || 0).toLocaleString(locale==='ar'?'ar-EG':'en-US')}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
            <Card className="h-fit lg:sticky lg:top-24 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">{locale==='ar' ? 'ملخص التكلفة' : 'Cost Summary'}</div>
                  <div className="text-3xl font-bold text-primary mt-1">{currency} {(project.total || 0).toLocaleString(locale==='ar'?'ar-EG':'en-US')}</div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'العنصر الأساسي' : 'Main item'}</span>
                    <span>{currency} {mainItemTotal.toLocaleString(locale==='ar'?'ar-EG':'en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'العناصر الإضافية' : 'Additional items'}</span>
                    <span>{currency} {addItemsTotal.toLocaleString(locale==='ar'?'ar-EG':'en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{locale==='ar' ? 'عدد العناصر' : 'Items count'}</span>
                    <span>{itemsCount + 1}</span>
                  </div>
                </div>
                {itemsCount > 0 && (
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-1">{locale==='ar' ? 'تفصيل العناصر' : 'Items breakdown'}</div>
                    <div className="space-y-1 text-sm">
                      {itemsArray.map((it:any, idx:number) => (
                        <div key={it?.id || idx} className="flex items-center justify-between">
                          <span className="truncate text-muted-foreground">{locale==='ar' ? `عنصر #${idx+2}` : `Item #${idx+2}`}</span>
                          <span>{currency} {(Number(it?.total)||0).toLocaleString(locale==='ar'?'ar-EG':'en-US')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer setCurrentPage={setCurrentPage as any} />
    </div>
  );
}
