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
  CheckCircle,
  XCircle,
  Truck,
  MessageSquare,
  Bell,
  Target,
  Award,
  Zap,
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

const notifications = [
  {
    id: 1,
    type: "order",
    message: "طلب جديد من محمد العلي",
    time: "5 دقائق",
    urgent: true,
  },
  {
    id: 2,
    type: "review",
    message: "تقييم جديد 5 نجوم لمنتج فلتر الزيت",
    time: "1 ساعة",
    urgent: false,
  },
  {
    id: 3,
    type: "stock",
    message: "مخزون فلتر الهواء منخفض",
    time: "3 ساعات",
    urgent: true,
  },
];

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
  const vendorFunctions = [
    {
      icon: "ShoppingCart",
      label: { ar: "عرض الطلبات والمبيعات", en: "View Orders & Sales" },
    },
    { icon: "Package", label: { ar: "إدارة المنتجات", en: "Manage Products" } },
    {
      icon: "DollarSign",
      label: { ar: "النظام المحاسبي", en: "Accounting System" },
    },
    {
      icon: "BarChart3",
      label: {
        ar: "الفواتير وتحليل الأرباح",
        en: "Invoices & Profit Analysis",
      },
    },
  ];

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
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t("vendorFunctions")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {vendorFunctions.map((func, i) => {
              const Icon = require("lucide-react")[func.icon];
              return (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 bg-muted rounded-lg shadow-sm"
                >
                  <Icon className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">
                    {func.label[locale]}
                  </span>
                </div>
              );
            })}
          </div>
          <h1 className="mb-2">{`${t("welcome")} ${context.user?.name ?? ""}`}</h1>
          <p className="text-muted-foreground">
            {t("vendorDashboardDescription")}
          </p>
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
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                {t("importantAlerts")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 space-x-reverse"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.urgent ? "bg-red-500" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">{t("recentOrders")}</TabsTrigger>
            <TabsTrigger value="performance">{t("performance")}</TabsTrigger>
            <TabsTrigger value="customers">{t("customers")}</TabsTrigger>
            <TabsTrigger value="goals">{t("goals")}</TabsTrigger>
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

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    {t("monthlyGoals")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("salesGoal")}</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("ordersGoal")}</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("newCustomersGoal")}</span>
                      <span>127%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    {t("achievements")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">
                        {t("bestSellerThisMonth")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm">{t("fiveStarRating")}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-sm">{t("salesGrowth20")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
