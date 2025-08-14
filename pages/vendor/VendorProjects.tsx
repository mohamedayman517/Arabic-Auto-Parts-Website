import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Eye, Send } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import type { RouteContext } from "../../components/routerTypes";

interface Props extends Partial<RouteContext> {}

export default function VendorProjects({ setCurrentPage, ...context }: Props) {
  const { locale } = useTranslation();
  const currency = locale === "ar" ? "ر.س" : "SAR";

  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [offerPrice, setOfferPrice] = useState<string>("");
  const [offerDays, setOfferDays] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem("user_projects");
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) setUserProjects(list);
    } catch {}
  }, []);

  const labelForProductType = (id: string) => {
    const map: any = {
      door: { ar: "باب", en: "Door" },
      window: { ar: "شباك", en: "Window" },
      railing: { ar: "دربزين", en: "Railing" },
    };
    return map[id]?.[locale === "ar" ? "ar" : "en"] || id;
  };
  const labelForMaterial = (id: string) => {
    const map: any = {
      aluminum: { ar: "ألمنيوم", en: "Aluminum" },
      steel: { ar: "صاج", en: "Steel" },
      laser: { ar: "ليزر", en: "Laser-cut" },
      glass: { ar: "سكريت", en: "Glass (Securit)" },
    };
    return map[id]?.[locale === "ar" ? "ar" : "en"] || id;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header {...context} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{locale === 'ar' ? 'كل المشاريع' : 'All Projects'}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('vendor-dashboard')}>
              {locale === 'ar' ? 'لوحة التاجر' : 'Vendor Dashboard'}
            </Button>
         
          </div>
        </div>

        {userProjects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              {locale === 'ar' ? 'لا توجد مشاريع بعد.' : 'No projects yet.'}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map((p:any) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {labelForProductType(p.ptype || p.type)}{p.material ? ` • ${labelForMaterial(p.material)}` : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div className="text-muted-foreground">
                    {locale === 'ar' ? 'الأبعاد' : 'Size'}: {Number(p.width || 0)}×{Number(p.height || 0)}
                  </div>
                  <div className="text-muted-foreground">
                    {locale === 'ar' ? 'الكمية' : 'Quantity'}: {Number(p.quantity || 0)}
                  </div>
                  <div className="font-semibold">
                    {currency} {Number(p.total || 0).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                  </div>
                  {!!p.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</div>
                  )}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedProject(p);
                        setOfferPrice("");
                        setOfferDays("");
                        setOfferMessage("");
                        setProposalOpen(true);
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {locale === 'ar' ? 'تقديم عرض' : 'Submit Proposal'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Proposal Dialog */}
      <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {locale === 'ar' ? 'تقديم عرض للمشروع' : 'Submit Proposal for Project'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="price">{locale === 'ar' ? 'السعر المقترح' : 'Proposed Price'}</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                placeholder={locale === 'ar' ? 'مثال: 2500' : 'e.g. 2500'}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days">{locale === 'ar' ? 'المدة (أيام)' : 'Duration (days)'}</Label>
              <Input
                id="days"
                type="number"
                inputMode="numeric"
                placeholder={locale === 'ar' ? 'مثال: 7' : 'e.g. 7'}
                value={offerDays}
                onChange={(e) => setOfferDays(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">{locale === 'ar' ? 'رسالة' : 'Message'}</Label>
              <Textarea
                id="message"
                rows={4}
                placeholder={locale === 'ar' ? 'عرّف بنفسك وقدّم تفاصيل العرض' : 'Introduce yourself and detail your offer'}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={saving || !selectedProject || !offerPrice || !offerDays}
              onClick={() => {
                if (!selectedProject) return;
                try {
                  setSaving(true);
                  const proposal = {
                    id: `prop_${Date.now()}`,
                    targetType: 'project',
                    targetId: selectedProject.id,
                    targetSnapshot: selectedProject,
                    price: Number(offerPrice),
                    days: Number(offerDays),
                    message: offerMessage,
                    vendorId: (context as any)?.user?.id || null,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                  };
                  const raw = window.localStorage.getItem('vendor_proposals');
                  const list = raw ? JSON.parse(raw) : [];
                  list.push(proposal);
                  window.localStorage.setItem('vendor_proposals', JSON.stringify(list));
                  setProposalOpen(false);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? (locale === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (locale === 'ar' ? 'إرسال العرض' : 'Send Proposal')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer setCurrentPage={setCurrentPage as any} />
    </div>
  );
}
