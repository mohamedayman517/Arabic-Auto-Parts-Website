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
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Share,
  Mail,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Globe,
  Smartphone,
  ShoppingCart,
  Star,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Filter,
} from "lucide-react";
import Header from "../../components/Header";
import { useTranslation } from "../../hooks/useTranslation";

const campaignStats = [
  {
    title: "الحملات النشطة",
    value: "12",
    change: "+3 هذا الأسبوع",
    icon: Target,
    color: "text-blue-600",
    trend: "up",
  },
  {
    title: "إجمالي النقرات",
    value: "45,678",
    change: "+25% من الشهر الماضي",
    icon: MousePointer,
    color: "text-green-600",
    trend: "up",
  },
  {
    title: "التحويلات",
    value: "2,134",
    change: "+15% من الشهر الماضي",
    icon: ShoppingCart,
    color: "text-purple-600",
    trend: "up",
  },
  {
    title: "عائد الاستثمار",
    value: "320%",
    change: "+45% من الشهر الماضي",
    icon: DollarSign,
    color: "text-yellow-600",
    trend: "up",
  },
];

const activeCampaigns = [
  {
    id: 1,
    name: "عرض قطع غيار الشتاء",
    type: "social",
    status: "active",
    budget: "5,000 ر.س",
    spent: "3,200 ر.س",
    clicks: 1234,
    conversions: 89,
    ctr: "3.2%",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
  {
    id: 2,
    name: "إطارات ميشلين - خصم 20%",
    type: "google",
    status: "active",
    budget: "3,500 ر.س",
    spent: "2,100 ر.س",
    clicks: 856,
    conversions: 67,
    ctr: "4.1%",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
  },
  {
    id: 3,
    name: "حملة زيوت المحرك المميزة",
    type: "email",
    status: "paused",
    budget: "2,000 ر.س",
    spent: "450 ر.س",
    clicks: 234,
    conversions: 12,
    ctr: "2.1%",
    startDate: "2024-01-05",
    endDate: "2024-01-25",
  },
];

const topPerformingContent = [
  {
    title: "فيديو: كيفية تغيير زيت المحرك",
    type: "video",
    views: "25,400",
    engagement: "8.5%",
    conversions: 234,
    platform: "يوتيوب",
  },
  {
    title: "مقال: أفضل إطارات لموسم الشتاء",
    type: "article",
    views: "15,600",
    engagement: "12.3%",
    conversions: 167,
    platform: "المدونة",
  },
  {
    title: "إنفوجرافيك: صيانة المكابح",
    type: "infographic",
    views: "18,900",
    engagement: "15.7%",
    conversions: 189,
    platform: "إنستغرام",
  },
];

const audienceInsights = [
  {
    demographic: "الفئة العمرية",
    segments: [
      { name: "18-25", percentage: 15 },
      { name: "26-35", percentage: 35 },
      { name: "36-45", percentage: 30 },
      { name: "46+", percentage: 20 },
    ],
  },
  {
    demographic: "الجنس",
    segments: [
      { name: "ذكور", percentage: 78 },
      { name: "إناث", percentage: 22 },
    ],
  },
  {
    demographic: "الموقع",
    segments: [
      { name: "الرياض", percentage: 35 },
      { name: "جدة", percentage: 25 },
      { name: "الدمام", percentage: 18 },
      { name: "أخرى", percentage: 22 },
    ],
  },
];

const upcomingTasks = [
  {
    id: 1,
    task: "إطلاق حملة العروض الشتوية",
    priority: "high",
    dueDate: "2024-01-18",
    status: "pending",
  },
  {
    id: 2,
    task: "تحليل أداء حملة إطارات ميشلين",
    priority: "medium",
    dueDate: "2024-01-20",
    status: "in-progress",
  },
  {
    id: 3,
    task: "إنشاء محتوى لوسائل التواصل الاجتماعي",
    priority: "low",
    dueDate: "2024-01-22",
    status: "pending",
  },
];

export default function MarketerDashboard(context: RouteContext) {
  const { t, locale } = useTranslation();

  // وظائف المسوق (مترجمة)
  const marketerFunctions = [
    {
      icon: "BarChart3",
      label: { ar: "لوحة تحكم الأداء", en: "Performance Dashboard" },
    },
    {
      icon: "Share",
      label: { ar: "توليد روابط التسويق", en: "Generate Marketing Links" },
    },
    {
      icon: "DollarSign",
      label: { ar: "تتبع العمولات والطلبات", en: "Track Commissions & Orders" },
    },
    {
      icon: "PieChart",
      label: { ar: "تقارير تحليل الأداء", en: "Performance Analytics Reports" },
    },
  ];

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case "social":
        return Share;
      case "google":
        return Globe;
      case "email":
        return Mail;
      default:
        return Target;
    }
  };

  const getCampaignTypeText = (type: string) => {
    switch (type) {
      case "social":
        return "وسائل التواصل";
      case "google":
        return "إعلانات جوجل";
      case "email":
        return "البريد الإلكتروني";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "paused":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشطة";
      case "paused":
        return "متوقفة";
      case "completed":
        return "مكتملة";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "عالية";
      case "medium":
        return "متوسطة";
      case "low":
        return "منخفضة";
      default:
        return priority;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header {...context} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t("marketerFunctions")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {marketerFunctions.map((func, i) => {
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
          <h1 className="mb-2">{t("welcome", { name: context.user?.name })}</h1>
          <p className="text-muted-foreground">
            {t("marketingDashboardDescription")}
          </p>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {campaignStats.map((stat, index) => (
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
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                {t("createNewCampaign")}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                {t("createContent")}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                {t("performanceReports")}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                {t("audienceAnalysis")}
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {t("upcomingTasks")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.task}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("dueDate")}: {task.dueDate}
                    </p>
                    <Badge
                      variant={getPriorityColor(task.priority)}
                      className="mt-1"
                    >
                      {t("priority")}: {getPriorityText(task.priority)}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                {t("performanceSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">
                    {t("aboveAveragePerformance")}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("conversionRate")}</span>
                  <span className="font-medium">4.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("conversionCost")}</span>
                  <span className="font-medium">15 ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("investmentReturn")}</span>
                  <span className="font-medium text-green-600">320%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">{t("campaigns")}</TabsTrigger>
            <TabsTrigger value="content">{t("content")}</TabsTrigger>
            <TabsTrigger value="audience">{t("audience")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("activeCampaigns")}</span>
                  <Button size="sm">{t("newCampaign")}</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => {
                    const TypeIcon = getCampaignTypeIcon(campaign.type);
                    const budgetUsed =
                      (parseInt(campaign.spent.replace(/[^\d]/g, "")) /
                        parseInt(campaign.budget.replace(/[^\d]/g, ""))) *
                      100;

                    return (
                      <div key={campaign.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <TypeIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{campaign.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getCampaignTypeText(campaign.type)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Badge variant={getStatusColor(campaign.status)}>
                              {getStatusText(campaign.status)}
                            </Badge>
                            <Button size="sm" variant="outline">
                              {campaign.status === "active" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {t("budgetUsed")}
                            </p>
                            <p className="font-medium">
                              {campaign.spent} {t("from")} {campaign.budget}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {t("clicks")}
                            </p>
                            <p className="font-medium">
                              {campaign.clicks.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {t("conversions")}
                            </p>
                            <p className="font-medium">
                              {campaign.conversions}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {t("ctr")}
                            </p>
                            <p className="font-medium">{campaign.ctr}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t("budgetUtilization")}</span>
                            <span>{budgetUsed.toFixed(1)}%</span>
                          </div>
                          <Progress value={budgetUsed} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("topPerformingContent")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingContent.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {content.type === "video" ? (
                            <Play className="h-5 w-5 text-primary" />
                          ) : content.type === "article" ? (
                            <Edit className="h-5 w-5 text-primary" />
                          ) : (
                            <PieChart className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{content.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {content.platform}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              {t("views")}
                            </p>
                            <p className="font-medium">{content.views}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {t("engagement")}
                            </p>
                            <p className="font-medium">{content.engagement}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {t("conversions")}
                            </p>
                            <p className="font-medium">{content.conversions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {audienceInsights.map((insight, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{insight.demographic}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insight.segments.map((segment, segIndex) => (
                      <div key={segIndex}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{segment.name}</span>
                          <span>{segment.percentage}%</span>
                        </div>
                        <Progress value={segment.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("overallPerformance")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("totalMonthlyExpenses")}</span>
                    <span className="font-medium">28,500 ر.س</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("totalReturn")}</span>
                    <span className="font-medium">91,200 ر.س</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("investmentReturn")}</span>
                    <span className="font-medium text-green-600">+320%</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-medium">{t("netProfit")}</span>
                    <span className="font-medium text-green-600">
                      62,700 ر.س
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("conversionRates")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("googleAds")}</span>
                      <span>5.2%</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("socialMedia")}</span>
                      <span>3.8%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("email")}</span>
                      <span>7.1%</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("organicContent")}</span>
                      <span>4.5%</span>
                    </div>
                    <Progress value={45} className="h-2" />
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
