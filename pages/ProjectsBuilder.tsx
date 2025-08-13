import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { RouteContext } from '../components/routerTypes';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// Product types (IDs must match Projects.tsx)
const productTypes = [
  { id: 'double_aluminum_door', ar: 'باب دبل المنيو', en: 'Double Aluminum Door' },
  { id: 'double_window', ar: 'شباك دبل', en: 'Double Window' },
  { id: 'railing', ar: 'دربزين', en: 'Railing' },
  { id: 'structure', ar: 'استركشر', en: 'Structure' },
  { id: 'securit', ar: 'سكريت', en: 'Securit' },
  { id: 'laser_door', ar: 'باب ليزر', en: 'Laser Door' },
  { id: 'steel_door', ar: 'باب صاج', en: 'Steel Door' },
  { id: 'normal_aluminum_door', ar: 'باب عادي المني', en: 'Normal Aluminum Door' },
  { id: 'double_fixed', ar: 'ثابت دبل', en: 'Double Fixed' },
  { id: 'fixed', ar: 'ثابت', en: 'Fixed' },
];

const materials = [
  { id: 'aluminum', ar: 'ألمنيوم', en: 'Aluminum' },
  { id: 'steel', ar: 'حديد', en: 'Steel' },
  { id: 'laser', ar: 'ليزر', en: 'Laser' },
  { id: 'glass', ar: 'زجاج', en: 'Glass' },
];

const accessoriesCatalog = [
  { id: 'frame', ar: 'حلق', en: 'Frame', price: 50 },
  { id: 'leaf', ar: 'درفه', en: 'Leaf', price: 120 },
  { id: 'covers', ar: 'كفرات', en: 'Covers', price: 40 },
  { id: 'small_covers', ar: 'كفرات صغير', en: 'Small Covers', price: 25 },
  { id: 'mesh_leaf', ar: 'درفه سلك', en: 'Mesh Leaf', price: 80 },
  { id: 'big_screw', ar: 'مسمار كبير', en: 'Big Screw', price: 5 },
  { id: 'small_screw', ar: 'مسمار صغي', en: 'Small Screw', price: 3 },
  { id: 'mesh_roller', ar: 'رول شبك', en: 'Mesh Roller', price: 150 },
  { id: 'gasket', ar: 'جلد', en: 'Gasket', price: 20 },
];

// Fixed price per m² per product type (must match Projects.tsx)
const fixedPricePerType: Record<string, number> = {
  double_aluminum_door: 750,
  double_window: 400,
  railing: 380,
  structure: 480,
  securit: 200,
  laser_door: 800,
  steel_door: 1200,
  normal_aluminum_door: 500,
  double_fixed: 450,
  fixed: 250,
};

function computeTotal(w:number, h:number, ppm:number, qty:number, accIds:string[]) {
  const area = Math.max(0, w) * Math.max(0, h);
  const accCost = accIds
    .map(id => accessoriesCatalog.find(a => a.id === id)?.price || 0)
    .reduce((a,b)=>a+b,0);
  const subtotal = area * (ppm || 0);
  const totalOne = subtotal + accCost;
  return Math.max(0, Math.round(totalOne * Math.max(1, qty)));
}

export default function ProjectsBuilder({ setCurrentPage, ...rest }: RouteContext) {
  const { t, locale } = useTranslation();
  const currency = locale === 'ar' ? 'ر.س' : 'SAR';

  const [ptype, setPtype] = useState('');
  const [material, setMaterial] = useState('');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerMeter, setPricePerMeter] = useState<number>(0);
  const [autoPrice, setAutoPrice] = useState<boolean>(true);
  const [selectedAcc, setSelectedAcc] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  type Builder = {
    id: string;
    ptype: string;
    material: string;
    width: number;
    height: number;
    quantity: number;
    autoPrice: boolean;
    pricePerMeter: number;
    selectedAcc: string[];
    description?: string;
  };
  const [additionalBuilders, setAdditionalBuilders] = useState<Builder[]>([]);

  useEffect(() => {
    if (autoPrice) {
      const ppm = ptype ? (fixedPricePerType[ptype] ?? 0) : 0;
      setPricePerMeter(ppm);
    }
  }, [autoPrice, ptype]);

  const isComplete = Boolean(ptype) && Boolean(material) && width > 0 && height > 0 && quantity > 0 && pricePerMeter > 0;

  const total = useMemo(() => computeTotal(width, height, pricePerMeter, quantity, selectedAcc), [width, height, pricePerMeter, quantity, selectedAcc]);

  function toggleAccessory(id: string, checked: boolean) {
    setSelectedAcc((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  }

  function toggleAccessoryFor(index: number, id: string, checked: boolean) {
    setAdditionalBuilders((prev) => {
      const copy = [...prev];
      const acc = copy[index].selectedAcc;
      copy[index] = {
        ...copy[index],
        selectedAcc: checked ? Array.from(new Set([...acc, id])) : acc.filter((x) => x !== id),
      };
      return copy;
    });
  }

  const addClonedForm = () => {
    // Add a BLANK form to let user add many items easily
    const newForm: Builder = {
      id: Math.random().toString(36).slice(2),
      ptype: '',
      material: '',
      width: 0,
      height: 0,
      quantity: 1,
      autoPrice: true,
      pricePerMeter: 0,
      selectedAcc: [],
      description: '',
    };
    setAdditionalBuilders((prev) => [...prev, newForm]);
  };

  const removeForm = (index: number) => {
    setAdditionalBuilders((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmProject = () => {
    if (!isComplete) return;
    // Build main project
    const mainPPM = autoPrice ? (ptype ? (fixedPricePerType[ptype] ?? 0) : pricePerMeter) : pricePerMeter;
    const mainTotal = computeTotal(width, height, mainPPM, quantity, selectedAcc);
    const mainProj = {
      id: Math.random().toString(36).slice(2),
      ptype,
      material,
      width,
      height,
      quantity,
      autoPrice,
      pricePerMeter: mainPPM,
      selectedAcc,
      description,
      total: mainTotal,
      createdAt: Date.now(),
    };
    // Build additional projects
    const extra = additionalBuilders.map((b) => {
      const ppm = b.autoPrice ? (b.ptype ? (fixedPricePerType[b.ptype] ?? 0) : b.pricePerMeter) : b.pricePerMeter;
      return {
        id: Math.random().toString(36).slice(2),
        ptype: b.ptype,
        material: b.material,
        width: b.width,
        height: b.height,
        quantity: b.quantity,
        autoPrice: b.autoPrice,
        pricePerMeter: ppm,
        selectedAcc: b.selectedAcc,
        description: b.description || '',
        total: computeTotal(b.width, b.height, ppm, b.quantity, b.selectedAcc),
        createdAt: Date.now(),
      };
    });
    try {
      const raw = window.localStorage.getItem('user_projects');
      const prev = raw ? JSON.parse(raw) : [];
      const next = [mainProj, ...extra, ...prev];
      window.localStorage.setItem('user_projects', JSON.stringify(next));
    } catch {}
    setCurrentPage && setCurrentPage('projects');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">{locale==='ar' ? 'إضافة مشروع' : 'Add Project'}</h1>
        <Card className="mb-8">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">{locale==='ar' ? 'نوع المنتج' : 'Product Type'}</label>
                <Select value={ptype} onValueChange={setPtype}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale==='ar' ? 'اختر النوع' : 'Select type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map(pt => (
                      <SelectItem key={pt.id} value={pt.id}>{locale==='ar' ? pt.ar : pt.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-1">{locale==='ar' ? 'الخامة' : 'Material'}</label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale==='ar' ? 'اختر الخامة' : 'Select material'} />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(m => (
                      <SelectItem key={m.id} value={m.id}>{locale==='ar' ? m.ar : m.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm mb-1">{locale==='ar' ? 'العرض (متر)' : 'Width (m)'}</label>
                  <Input type="number" min={0} step={0.01} value={Number.isFinite(width) ? width : 0} onChange={(e) => setWidth(parseFloat(e.target.value || '0'))} placeholder={locale==='ar' ? '0.00' : '0.00'} />
                </div>
                <div>
                  <label className="block text-sm mb-1">{locale==='ar' ? 'الطول (متر)' : 'Height (m)'}</label>
                  <Input type="number" min={0} step={0.01} value={Number.isFinite(height) ? height : 0} onChange={(e) => setHeight(parseFloat(e.target.value || '0'))} placeholder={locale==='ar' ? '0.00' : '0.00'} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="block text-sm mb-1">{locale==='ar' ? 'سعر المتر المربع' : 'Price per m²'}</label>
                  <Input type="number" min={0} step={1} value={Number.isFinite(pricePerMeter) ? pricePerMeter : 0} onChange={(e)=> { setPricePerMeter(parseFloat(e.target.value || '0')); setAutoPrice(false); }} disabled={autoPrice} placeholder={locale==='ar' ? '0' : '0'} />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(() => {
                      const area = Math.max(0,width) * Math.max(0,height);
                      const accCost = selectedAcc.map(id => accessoriesCatalog.find(a => a.id === id)?.price || 0).reduce((a,b)=>a+b,0);
                      const subtotal = area * (pricePerMeter || 0);
                      const totalOne = subtotal + accCost;
                      const totalCalc = Math.max(0, Math.round(totalOne * Math.max(1, quantity)));
                      return `${locale==='ar' ? 'الحد الأدنى (الإجمالي المحسوب)' : 'Minimum (computed total)'}: ${currency} ${totalCalc.toLocaleString(locale==='ar'?'ar-EG':'en-US')}`;
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <Checkbox checked={autoPrice} onCheckedChange={(v) => setAutoPrice(!!v)} />
                  <span className="text-sm text-muted-foreground">{locale==='ar' ? 'حساب تلقائي' : 'Auto-calculate'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">{locale==='ar' ? 'الكمية' : 'Quantity'}</label>
                <Input type="number" min={1} step={1} value={Number.isFinite(quantity) ? quantity : 0} onChange={(e) => setQuantity(parseInt(e.target.value || '0', 10) || 0)} placeholder={locale==='ar' ? '0' : '0'} />
              </div>
              <div className="md:col-span-2 lg:col-span-2">
                <label className="block text-sm mb-2">{locale==='ar' ? 'ملحقات إضافية' : 'Additional Accessories'}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {accessoriesCatalog.map(acc => (
                    <label key={acc.id} className="flex items-center gap-2 rounded-md border p-2">
                      <Checkbox checked={selectedAcc.includes(acc.id)} onCheckedChange={(v) => toggleAccessory(acc.id, !!v)} />
                      <span className="text-sm">
                        {locale==='ar' ? acc.ar : acc.en} <span className="text-muted-foreground">- {currency} {acc.price}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm mb-1">{locale==='ar' ? 'وصف المشروع (اختياري)' : 'Project Description (optional)'}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border rounded-md p-2 bg-background"
                  placeholder={locale==='ar' ? 'اكتب وصفاً مختصراً للمشروع...' : 'Write a brief description of your project...'}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Button type="button" variant="secondary" onClick={addClonedForm} className="mt-2 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> {locale==='ar' ? 'إضافة منتج' : 'Add Product'}
                </Button>
              </div>
            </div>

            {/* Actions moved to bottom under the last form */}
          </CardContent>
        </Card>

        {/* Additional Cloned Forms */}
        {additionalBuilders.length > 0 && (
          <div className="space-y-6 mt-6">
            {additionalBuilders.map((b, idx) => {
              const ppm = b.autoPrice ? (b.ptype ? (fixedPricePerType[b.ptype] ?? 0) : 0) : b.pricePerMeter;
              const bTotal = computeTotal(b.width, b.height, ppm, b.quantity, b.selectedAcc);
              return (
                <Card key={b.id} className="p-4">
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{locale==='ar' ? `منتج إضافي #${idx+1}` : `Additional Item #${idx+1}`}</h3>
                      <Button variant="outline" onClick={() => removeForm(idx)}>
                        {locale==='ar' ? 'حذف' : 'Remove'}
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-1">{locale==='ar' ? 'نوع المنتج' : 'Product Type'}</label>
                        <Select value={b.ptype} onValueChange={(v) => setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], ptype: v }; return c; })}>
                          <SelectTrigger>
                            <SelectValue placeholder={locale==='ar' ? 'اختر النوع' : 'Select type'} />
                          </SelectTrigger>
                          <SelectContent>
                            {productTypes.map((pt) => (
                              <SelectItem key={pt.id} value={pt.id}>{locale==='ar' ? pt.ar : pt.en}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">{locale==='ar' ? 'الخامة' : 'Material'}</label>
                        <Select value={b.material} onValueChange={(v) => setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], material: v }; return c; })}>
                          <SelectTrigger>
                            <SelectValue placeholder={locale==='ar' ? 'اختر الخامة' : 'Select material'} />
                          </SelectTrigger>
                          <SelectContent>
                            {materials.map((m) => (
                              <SelectItem key={m.id} value={m.id}>{locale==='ar' ? m.ar : m.en}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm mb-1">{locale==='ar' ? 'العرض (متر)' : 'Width (m)'}</label>
                          <Input type="number" min={0} step={0.01} value={Number.isFinite(b.width) ? b.width : 0} onChange={(e)=> setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], width: parseFloat(e.target.value || '0') }; return c; })} />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">{locale==='ar' ? 'الطول (متر)' : 'Height (m)'}</label>
                          <Input type="number" min={0} step={0.01} value={Number.isFinite(b.height) ? b.height : 0} onChange={(e)=> setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], height: parseFloat(e.target.value || '0') }; return c; })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div>
                          <label className="block text-sm mb-1">{locale==='ar' ? 'سعر المتر المربع' : 'Price per m²'}</label>
                          <Input type="number" min={0} step={1} value={Number.isFinite(b.pricePerMeter) ? (b.autoPrice ? (b.ptype ? (fixedPricePerType[b.ptype] ?? 0) : 0) : b.pricePerMeter) : 0} onChange={(e)=> setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], pricePerMeter: parseFloat(e.target.value || '0'), autoPrice: false }; return c; })} disabled={b.autoPrice} />
                          <div className="text-xs text-muted-foreground mt-1">
                            {`${locale==='ar' ? 'الحد الأدنى (الإجمالي المحسوب)' : 'Minimum (computed total)'}: ${currency} ${bTotal.toLocaleString(locale==='ar'?'ar-EG':'en-US')}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <Checkbox checked={b.autoPrice} onCheckedChange={(v)=> setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], autoPrice: !!v }; return c; })} />
                          <span className="text-sm text-muted-foreground">{locale==='ar' ? 'حساب تلقائي' : 'Auto-calculate'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">{locale==='ar' ? 'الكمية' : 'Quantity'}</label>
                        <Input type="number" min={1} step={1} value={Number.isFinite(b.quantity) ? b.quantity : 0} onChange={(e)=> setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], quantity: parseInt(e.target.value || '0', 10) || 0 }; return c; })} />
                      </div>
                      <div className="md:col-span-2 lg:col-span-2">
                        <label className="block text-sm mb-2">{locale==='ar' ? 'ملحقات إضافية' : 'Additional Accessories'}</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {accessoriesCatalog.map(acc => (
                            <label key={acc.id} className="flex items-center gap-2 rounded-md border p-2">
                              <Checkbox checked={b.selectedAcc.includes(acc.id)} onCheckedChange={(v) => toggleAccessoryFor(idx, acc.id, !!v)} />
                              <span className="text-sm">
                                {locale==='ar' ? acc.ar : acc.en} <span className="text-muted-foreground">- {currency} {acc.price}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm mb-1">{locale==='ar' ? 'وصف المنتج (اختياري)' : 'Item Description (optional)'}</label>
                        <textarea
                          value={b.description || ''}
                          onChange={(e)=> setAdditionalBuilders((prev)=>{ const c=[...prev]; c[idx] = { ...c[idx], description: e.target.value }; return c; })}
                          rows={3}
                          className="w-full border rounded-md p-2 bg-background"
                          placeholder={locale==='ar' ? 'وصف مختصر...' : 'Brief description...'}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom Actions under the last form */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('projects')}>
            {locale==='ar' ? 'رجوع للمشاريع' : 'Back to Projects'}
          </Button>
          <div className="flex items-center gap-3">
            <Button onClick={confirmProject} disabled={!isComplete} className={!isComplete ? 'opacity-50 cursor-not-allowed' : ''}>
              {locale==='ar' ? 'تأكيد' : 'Confirm'}
            </Button>
          </div>
        </div>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
