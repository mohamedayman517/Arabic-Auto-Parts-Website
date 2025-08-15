import { useEffect, useState } from "react";
import { RouteContext } from "../../components/Router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  BarChart3,
  Settings,
  Store,
  Users,
  Star,
  AlertCircle,
  Clock,
  XCircle,
  Truck,
  MessageSquare,
} from "lucide-react";
import Header from "../../components/Header";
import { useTranslation } from "../../hooks/useTranslation";

// statsCards moved inside component to use translations

const recentOrders = [
  {
    id: "#12345",
    customer: "محمد العلي",
    product: "فلتر زيت محرك",
    amount: "120 ر.س",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "#12346",
    customer: "فاطمة أحمد",
    product: "تيل فرامل سيراميك",
    amount: "350 ر.س",
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "#12347",
    customer: "علي محمود",
    product: "بطارية سيارة",
    amount: "480 ر.س",
    status: "delivered",
    date: "2024-01-13",
  },
];

const lowStockProducts = [
  {
    name: "فلتر هواء K&N",
    current: 3,
    minimum: 10,
    status: "critical",
  },
  {
    name: "زيت محرك 5W-30",
    current: 8,
    minimum: 20,
    status: "low",
  },
  {
    name: "مكابح ATE",
    current: 15,
    minimum: 25,
    status: "moderate",
  },
];

// Removed inline notifications in favor of dedicated Notifications page

export default function VendorDashboard({ setCurrentPage, ...context }: Partial<RouteContext>) {
  const { t, locale } = useTranslation();
  const statsCards = [
    {
      title: t("totalProducts"),
      value: "156",
      change: t("changeUpThisMonth"),
      icon: Package,
      color: "text-blue-600",
      trend: "up",
    },
    {
      title: t("newOrders"),
      value: "23",
      change: t("changeUpToday"),
      icon: ShoppingCart,
      color: "text-green-600",
      trend: "up",
    },
    {
      title: t("monthlySales"),
      value: "45,230 ر.س",
      change: t("changeSalesFromLastMonth"),
      icon: DollarSign,
      color: "text-purple-600",
      trend: "up",
    },
    {
      title: t("storeRating"),
      value: "4.8",
      change: t("changeRatingThisMonth"),
      icon: Star,
      color: "text-yellow-600",
      trend: "up",
    },
  ];

  // وظائف التاجر (مترجمة)
  const vendorFunctions: Array<{
    icon: string;
    label: { ar: string; en: string };
    route?: string;
  }> = [
    {
      icon: "ShoppingCart",
      label: { ar: "عرض الطلبات والمبيعات", en: "View Orders & Sales" },
      route: "vendor-orders",
    },
    {
      icon: "Package",
      label: { ar: "إدارة المنتجات", en: "Manage Products" },
      route: "vendor-products",
    },
    {
      icon: "DollarSign",
      label: { ar: "النظام المحاسبي", en: "Accounting System" },
      route: "vendor-analytics",
    },
    {
      icon: "BarChart3",
      label: { ar: "الفواتير وتحليل الأرباح", en: "Invoices & Profit Analysis" },
      route: "vendor-analytics",
    },
    // View sections instead of add
    {
      icon: "Eye",
      label: { ar: "عرض المشاريع", en: "View Projects" },
      route: "vendor-projects",
    },
    {
      icon: "Eye",
      label: { ar: "عرض الخدمات", en: "View Services" },
      route: "vendor-services",
    },
  ];

  // عرض المشاريع والخدمات من localStorage
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [vendorProposals, setVendorProposals] = useState<any[]>([]);
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const pRaw = window.localStorage.getItem("user_projects");
      const sRaw = window.localStorage.getItem("user_services");
      const p = pRaw ? JSON.parse(pRaw) : [];
      const s = sRaw ? JSON.parse(sRaw) : [];
      if (Array.isArray(p)) setUserProjects(p);
      if (Array.isArray(s)) setUserServices(s);
      // Load vendor proposals and filter by current vendor
      const vRaw = window.localStorage.getItem('vendor_proposals');
      const allProps = vRaw ? JSON.parse(vRaw) : [];
      const myId = (context as any)?.user?.id;
      const mine = Array.isArray(allProps) ? allProps.filter((pr: any) => !myId || pr.vendorId === myId) : [];
      setVendorProposals(mine);
    } catch {}
  }, []);

  const currency = locale === "ar" ? "ر.س" : "SAR";
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
  const labelForServiceType = (id: string) => {
    const map: any = {
      plumber: { ar: "سباك", en: "Plumber" },
      electrician: { ar: "كهربائي", en: "Electrician" },
      carpenter: { ar: "نجار", en: "Carpenter" },
      painter: { ar: "نقاش", en: "Painter" },
      gypsum_installer: { ar: "فني تركيب جيبس بورد", en: "Gypsum Board Installer" },
      marble_installer: { ar: "فني تركيب رخام", en: "Marble Installer" },
    };
    return map[id]?.[locale === "ar" ? "ar" : "en"] || id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return t("deliveredStatus");
      case "shipped":
        return t("shippedStatus");
      case "pending":
        return t("pendingOrderStatus");
      default:
        return status;
    }
  };

  // Proposal status helpers
  const proposalStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const;
      case 'in_progress':
        return 'outline' as const;
      case 'completed':
        return 'default' as const;
      case 'closed':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };
  const proposalStatusLabel = (status: string) => {
    if (locale === 'ar') {
      switch (status) {
        case 'pending': return 'قيد الانتظار';
        case 'in_progress': return 'قيد التنفيذ';
        case 'completed': return 'مكتمل';
        case 'closed': return 'مغلق';
        default: return status;
      }
    }
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  // Generic item status helpers (projects/services)
  const itemStatusVariant = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'secondary' as const;
      case 'in_progress':
      case 'in-progress': return 'outline' as const;
      case 'completed': return 'default' as const;
      case 'closed': return 'destructive' as const;
      case 'active': return 'default' as const;
      case 'draft': return 'secondary' as const;
      default: return 'secondary' as const;
    }
  };
  const itemStatusLabel = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (locale === 'ar') {
      switch (s) {
        case 'pending': return 'قيد الانتظار';
        case 'in_progress':
        case 'in-progress': return 'قيد التنفيذ';
        case 'completed': return 'مكتمل';
        case 'closed': return 'مغلق';
        case 'active': return 'نشط';
        case 'draft': return 'مسودة';
        default: return status || '';
      }
    }
    switch (s) {
      case 'pending': return 'Pending';
      case 'in_progress':
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'closed': return 'Closed';
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      default: return status || '';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "low":
        return "secondary";
      case "moderate":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header {...context} />

      <div className="container mx-auto px-4 py-8">
        {/* Vendor welcome section */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{locale==='ar' ? 'مرحباً' : 'Welcome'}</div>
                <div className="text-lg font-semibold">{(context as any)?.user?.name || (locale==='ar'?'التاجر':'Vendor')}</div>
                {(context as any)?.user?.email && (
                  <div className="text-xs text-muted-foreground mt-1">{(context as any)?.user?.email}</div>
                )}
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{locale==='ar' ? 'المشاريع الظاهرة' : 'Visible Projects'}: {userProjects.length}</div>
                <div>{locale==='ar' ? 'الخدمات الظاهرة' : 'Visible Services'}: {userServices.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t("vendorFunctions")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {vendorFunctions.map((func, i) => {
              const Icon = require("lucide-react")[func.icon];
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center p-4 bg-muted rounded-lg shadow-sm ${func.route ? 'cursor-pointer hover:bg-muted/80 transition' : ''}`}
                  onClick={() => func.route && setCurrentPage && setCurrentPage(func.route)}
                >
                  <Icon className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">
                    {func.label[locale]}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Vendor Applications (Projects & Services) */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{locale === 'ar' ? 'عروضي المقدمة' : 'My Applications'}</h2>
            {vendorProposals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-muted-foreground">
                  {locale === 'ar' ? 'لا توجد عروض مقدمة بعد.' : 'No applications yet.'}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vendorProposals.map((pr: any) => (
                  <Card key={pr.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>
                          {pr.targetType === 'project' ? (
                            <>
                              {labelForProductType(pr.targetSnapshot?.ptype || pr.targetSnapshot?.type)}
                              {pr.targetSnapshot?.material ? ` • ${labelForMaterial(pr.targetSnapshot.material)}` : ''}
                            </>
                          ) : (
                            <>
                              {labelForServiceType(pr.targetSnapshot?.type)}
                            </>
                          )}
                        </span>
                        <Badge variant={proposalStatusVariant(pr.status)}>{proposalStatusLabel(pr.status)}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                          {locale === 'ar' ? 'السعر' : 'Price'}: {currency} {Number(pr.price || 0).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                        </div>
                        <div className="text-muted-foreground">
                          {locale === 'ar' ? 'المدة' : 'Days'}: {Number(pr.days || 0)}
                        </div>
                      </div>
                      {!!pr.message && (
                        <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{pr.message}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {locale === 'ar' ? 'تاريخ الإرسال' : 'Submitted'}: {new Date(pr.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          {/* Removed welcome and overview description under My Applications */}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div
                  className={`flex items-center text-xs ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                {t("stockAlert")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("available")}: {product.current} | {t("minimum")}: {product.minimum}
                    </p>
                  </div>
                  <Badge variant={getStockStatusColor(product.status)}>
                    {product.status === "critical"
                      ? t("critical")
                      : product.status === "low"
                      ? t("low")
                      : t("moderate")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* View Projects */}
              <Button
                className="w-full justify-start"
                variant="secondary"
                onClick={() => setCurrentPage && setCurrentPage("vendor-projects")}
              >
                <Eye className="mr-2 h-4 w-4" />
                {locale === 'ar' ? 'عرض المشاريع' : 'View Projects'}
              </Button>
              {/* View Services */}
              <Button
                className="w-full justify-start"
                variant="secondary"
                onClick={() => setCurrentPage && setCurrentPage("vendor-services")}
              >
                <Eye className="mr-2 h-4 w-4" />
                {locale === 'ar' ? 'عرض الخدمات' : 'View Services'}
              </Button>
              <Button
                className="w-full justify-start"
                onClick={() => setCurrentPage && setCurrentPage("vendor-products")}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("addNewProduct")}
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setCurrentPage && setCurrentPage("vendor-orders")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("manageOrders")}
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setCurrentPage && setCurrentPage("vendor-analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {t("analyticsReports")}
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setCurrentPage && setCurrentPage("vendor-settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t("storeSettings")}
              </Button>
            </CardContent>
          </Card>
        </div>

      

        {/* Detailed Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="orders">{t("recentOrders")}</TabsTrigger>
            <TabsTrigger value="performance">{t("performance")}</TabsTrigger>
            <TabsTrigger value="customers">{t("customers")}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("recentOrders")}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage && setCurrentPage("vendor-orders")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    {t("viewAll")}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.product}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{order.amount}</p>
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("conversionRate")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("visitorsToCustomers")}</span>
                        <span>12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("addToCart")}</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("completePurchase")}</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("averageOrderValue")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">285 ر.س</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("thisMonth")}</span>
                      <span className="text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t("lastMonth")}</span>
                      <span>248 ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t("monthlyGoal")}</span>
                      <span>300 ر.س</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("newCustomers")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-sm text-muted-foreground">
                    {t("thisMonth")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("repeatCustomers")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-sm text-muted-foreground">
                    {t("returnRate")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("averageRating")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">4.8</div>
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("from245Reviews")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Removed Goals tab content */}
        </Tabs>
      </div>
    </div>
  );
}
