import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { RouteContext } from '../components/routerTypes';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Ruler, Package, Layers, Boxes, ClipboardList, Calendar, ArrowRight, Edit3, Info, Check, X } from 'lucide-react';

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

export default function ProjectDetails({ setCurrentPage, goBack, ...rest }: ProjectDetailsProps) {
  const { t, locale } = useTranslation();
  const currency = locale === 'ar' ? 'ر.س' : 'SAR';
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<any[]>([]);
  const currentUserId = (rest as any)?.user?.id ? String((rest as any).user.id) : '';
  const isLoggedIn = Boolean((rest as any)?.user);

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
        // Enforce owner-only access
        if (!isLoggedIn) {
          setProject(null);
        } else if (found && String(found.ownerId || '') === currentUserId) {
          setProject(found);
        } else {
          setProject(null);
        }
      }
      // Load proposals addressed to this project
      try {
        const propRaw = localStorage.getItem('vendor_proposals');
        const propList = propRaw ? JSON.parse(propRaw) : [];
        const filtered = Array.isArray(propList) ? propList.filter((p:any)=> p.targetType === 'project' && String(p.targetId) === String(id)) : [];
        setProposals(filtered);
      } catch {}
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
        days: Number(project.days) || 1,
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
          days: Number(it.days) || 1,
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
    <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header currentPage="project-details" setCurrentPage={setCurrentPage as any} {...(rest as any)} />

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
              <p className="text-lg font-medium">{locale==='ar' ? (isLoggedIn ? 'غير مصرح لك بعرض هذا المشروع.' : 'الرجاء تسجيل الدخول لعرض مشاريعك.') : (isLoggedIn ? 'You are not authorized to view this project.' : 'Please sign in to view your projects.')}</p>
              <p className="text-sm text-muted-foreground">{locale==='ar' ? 'هذه الصفحة تعرض فقط مشاريع المالك.' : 'This page only shows projects owned by the current user.'}</p>
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
                  <div className="rounded-lg border p-4 bg-background shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {locale==='ar' ? 'المدة (أيام)' : 'Duration (days)'}
                    </div>
                    <div className="mt-1 font-medium">{Number(project?.days) > 0 ? project.days : '-'}</div>
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
                    {locale==='ar' ? `الكمية: ${project.quantity||0}` : `Quantity: ${project.quantity||0}`}
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs">
                    {locale==='ar' ? `سعر المتر: ${project.pricePerMeter||0}` : `Price per m²: ${project.pricePerMeter||0}`}
                  </Badge>
                  {Number(project?.days) > 0 && (
                    <Badge variant="outline" className="rounded-full text-xs">
                      {locale==='ar' ? `الأيام: ${project.days}` : `Days: ${project.days}`}
                    </Badge>
                  )}
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
                                  <Calendar className="w-4 h-4" /> {locale==='ar' ? 'أيام التنفيذ' : 'Days to complete'}
                                </div>
                                <div className="mt-1 font-medium">{Number(it?.days) > 0 ? it.days : '-'}</div>
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

            {/* Sidebar: Proposals for this project */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{locale==='ar' ? 'عروض مقدّمة' : 'Submitted Proposals'}</h2>
                    <Badge variant="outline">{proposals.length}</Badge>
                  </div>
                  {proposals.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{locale==='ar' ? 'لا توجد عروض حتى الآن.' : 'No proposals yet.'}</div>
                  ) : (
                    <div className="space-y-3">
                      {proposals.map((pp:any)=> (
                        <div key={pp.id} className="border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{locale==='ar' ? 'السعر' : 'Price'}: {currency} {Number(pp.price||0).toLocaleString(locale==='ar'?'ar-EG':'en-US')}</div>
                            <Badge variant={pp.status==='accepted'? 'secondary' : pp.status==='rejected'? 'destructive' : 'outline'} className="text-xs capitalize">{locale==='ar' ? (pp.status==='pending'?'معلق': pp.status==='accepted'?'مقبول':'مرفوض') : pp.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{locale==='ar' ? 'المدة' : 'Days'}: {Number(pp.days||0)}</div>
                          {pp.message && <div className="mt-1 text-xs bg-muted/20 rounded p-2">{pp.message}</div>}
                          {pp.status === 'pending' && (
                            <div className="mt-2 flex items-center gap-2">
                              <Button size="sm" className="flex-1" onClick={() => {
                                try {
                                  const raw = localStorage.getItem('vendor_proposals');
                                  const list = raw ? JSON.parse(raw) : [];
                                  const next = list.map((x:any)=> x.id===pp.id ? { ...x, status: 'accepted' } : x);
                                  localStorage.setItem('vendor_proposals', JSON.stringify(next));
                                  setProposals((prev)=> prev.map((x:any)=> x.id===pp.id ? { ...x, status: 'accepted' } : x));
                                  // Notify vendor about acceptance
                                  try {
                                    const nraw = localStorage.getItem('app_notifications');
                                    const nlist = nraw ? JSON.parse(nraw) : [];
                                    const numLocale = locale==='ar' ? 'ar-EG' : 'en-US';
                                    const title = locale==='ar' ? 'تم قبول عرضك' : 'Your proposal was accepted';
                                    const desc = locale==='ar'
                                      ? `تم قبول عرضك بقيمة ${currency} ${Number(pp.price||0).toLocaleString(numLocale)} لمدة ${Number(pp.days||0)} يوم`
                                      : `Your offer of ${currency} ${Number(pp.price||0).toLocaleString(numLocale)} for ${Number(pp.days||0)} days was accepted`;
                                    const notif = {
                                      id: `ntf_${Date.now()}`,
                                      type: 'proposal-status',
                                      recipientId: pp.vendorId,
                                      recipientRole: 'vendor',
                                      title,
                                      desc,
                                      createdAt: new Date().toISOString(),
                                      meta: { targetType: 'project', targetId: (project as any)?.id, proposalId: pp.id, status: 'accepted' }
                                    };
                                    const combined = Array.isArray(nlist) ? [notif, ...nlist] : [notif];
                                    localStorage.setItem('app_notifications', JSON.stringify(combined));
                                  } catch {}
                                } catch {}
                              }}>
                                <Check className="w-4 h-4 ml-1" /> {locale==='ar' ? 'قبول' : 'Accept'}
                              </Button>
                              <Button size="sm" variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700 text-white border border-red-600" onClick={() => {
                                try {
                                  const raw = localStorage.getItem('vendor_proposals');
                                  const list = raw ? JSON.parse(raw) : [];
                                  const next = list.map((x:any)=> x.id===pp.id ? { ...x, status: 'rejected' } : x);
                                  localStorage.setItem('vendor_proposals', JSON.stringify(next));
                                  setProposals((prev)=> prev.map((x:any)=> x.id===pp.id ? { ...x, status: 'rejected' } : x));
                                  // Notify vendor about rejection
                                  try {
                                    const nraw = localStorage.getItem('app_notifications');
                                    const nlist = nraw ? JSON.parse(nraw) : [];
                                    const numLocale = locale==='ar' ? 'ar-EG' : 'en-US';
                                    const title = locale==='ar' ? 'تم رفض عرضك' : 'Your proposal was rejected';
                                    const desc = locale==='ar'
                                      ? `تم رفض عرضك بقيمة ${currency} ${Number(pp.price||0).toLocaleString(numLocale)} لمدة ${Number(pp.days||0)} يوم`
                                      : `Your offer of ${currency} ${Number(pp.price||0).toLocaleString(numLocale)} for ${Number(pp.days||0)} days was rejected`;
                                    const notif = {
                                      id: `ntf_${Date.now()}`,
                                      type: 'proposal-status',
                                      recipientId: pp.vendorId,
                                      recipientRole: 'vendor',
                                      title,
                                      desc,
                                      createdAt: new Date().toISOString(),
                                      meta: { targetType: 'project', targetId: (project as any)?.id, proposalId: pp.id, status: 'rejected' }
                                    };
                                    const combined = Array.isArray(nlist) ? [notif, ...nlist] : [notif];
                                    localStorage.setItem('app_notifications', JSON.stringify(combined));
                                  } catch {}
                                } catch {}
                              }}>
                                <X className="w-4 h-4 ml-1" /> {locale==='ar' ? 'رفض' : 'Reject'}
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
        </div>
        )}
      </div>

      <Footer setCurrentPage={setCurrentPage as any} />
    </div>
  );
}
