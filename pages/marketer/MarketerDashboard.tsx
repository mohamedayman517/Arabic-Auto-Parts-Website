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
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Search, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// Campaign quick stats (example)
const campaignStats = [
  {
    title: "Active campaigns",
    value: "12",
    change: "+3 this week",
    icon: Target,
    color: "text-blue-600",
    trend: "up",
  },
  {
    title: "Total clicks",
    value: "45,678",
    change: "+25% vs last month",
    icon: MousePointer,
    color: "text-green-600",
    trend: "up",
  },
  {
    title: "Conversions",
    value: "2,134",
    change: "+15% vs last month",
    icon: ShoppingCart,
    color: "text-purple-600",
    trend: "up",
  },
  {
    title: "ROI",
    value: "320%",
    change: "+45% vs last month",
    icon: DollarSign,
    color: "text-yellow-600",
    trend: "up",
  },
];

type CampaignStatus = 'active' | 'paused' | 'completed';
type CampaignType = 'social' | 'google' | 'email';
interface CampaignRow {
  id: number;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent: number;
  clicks: number;
  conversions: number;
  ctr: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

const STORAGE_KEY = 'marketer_campaigns_mock';

function readCampaigns(): CampaignRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seed: CampaignRow[] = [
    { id: 1, name: 'Winter Parts Promo', type: 'social', status: 'active', budget: 5000, spent: 3200, clicks: 1234, conversions: 89, ctr: '3.2%', startDate: '2024-01-01', endDate: '2024-01-31' },
    { id: 2, name: 'Michelin Tires -20%', type: 'google', status: 'active', budget: 3500, spent: 2100, clicks: 856, conversions: 67, ctr: '4.1%', startDate: '2024-01-10', endDate: '2024-02-10' },
    { id: 3, name: 'Premium Engine Oils', type: 'email', status: 'paused', budget: 2000, spent: 450, clicks: 234, conversions: 12, ctr: '2.1%', startDate: '2024-01-05', endDate: '2024-01-25' },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function writeCampaigns(rows: CampaignRow[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } catch {}
}

const topPerformingContent = [
  {
    title: "Video: How to change engine oil",
    type: "video",
    views: "25,400",
    engagement: "8.5%",
    conversions: 234,
    platform: "YouTube",
  },
  {
    title: "Article: Best winter tires",
    type: "article",
    views: "15,600",
    engagement: "12.3%",
    conversions: 167,
    platform: "Blog",
  },
  {
    title: "Infographic: Brake maintenance",
    type: "infographic",
    views: "18,900",
    engagement: "15.7%",
    conversions: 189,
    platform: "Instagram",
  },
];

const audienceInsights = [
  {
    demographic: "Age group",
    segments: [
      { name: "18-25", percentage: 15 },
      { name: "26-35", percentage: 35 },
      { name: "36-45", percentage: 30 },
      { name: "46+", percentage: 20 },
    ],
  },
  {
    demographic: "Gender",
    segments: [
      { name: "Male", percentage: 78 },
      { name: "Female", percentage: 22 },
    ],
  },
  {
    demographic: "Location",
    segments: [
      { name: "Riyadh", percentage: 35 },
      { name: "Jeddah", percentage: 25 },
      { name: "Dammam", percentage: 18 },
      { name: "Other", percentage: 22 },
    ],
  },
];

const upcomingTasks = [
  {
    id: 1,
    task: "Launch winter offers campaign",
    priority: "high",
    dueDate: "2024-01-18",
    status: "pending",
  },
  {
    id: 2,
    task: "Analyze Michelin tires campaign performance",
    priority: "medium",
    dueDate: "2024-01-20",
    status: "in-progress",
  },
  {
    id: 3,
    task: "Create social media content",
    priority: "low",
    dueDate: "2024-01-22",
    status: "pending",
  },
];

export default function MarketerDashboard(context: Partial<RouteContext>) {
  const { t, locale } = useTranslation();
  const [rows, setRows] = useState<CampaignRow[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | CampaignStatus>('all');
  const [type, setType] = useState<'all' | CampaignType>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<CampaignRow>>({ name: '', type: 'social', status: 'active', budget: 0, spent: 0, clicks: 0, conversions: 0, ctr: '0%', startDate: '', endDate: '', notes: '' });

  useEffect(() => { setRows(readCampaigns()); }, []);
  const reload = () => setRows(readCampaigns());

  const filtered = rows.filter(r => {
    const s = search.trim().toLowerCase();
    const matches = !s || r.name.toLowerCase().includes(s) || r.type.toLowerCase().includes(s);
    const statusOk = status === 'all' || r.status === status;
    const typeOk = type === 'all' || r.type === type;
    return matches && statusOk && typeOk;
  });

  // Marketer quick functions grid
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
        return "Social";
      case "google":
        return "Google Ads";
      case "email":
        return "Email";
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
        return "Active";
      case "paused":
        return "Paused";
      case "completed":
        return "Completed";
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
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return priority;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header {...context} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button variant="outline" onClick={() => context.setCurrentPage && context.setCurrentPage('marketer-dashboard')} className="mr-4">
              <ArrowRight className="ml-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <h2 className="text-xl font-bold mb-4">Marketer Functions</h2>
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
                    {func.label['en']}
                  </span>
                </div>
              );
            })}
          </div>
          <h1 className="mb-2">{`Welcome, ${context.user?.name ?? ""}`}</h1>
          <p className="text-muted-foreground">Plan and monitor your campaigns, content and audience engagement.</p>
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
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => { setEditId(null); setFormOpen(true); setForm({ name: '', type: 'social', status: 'active', budget: 0, spent: 0, clicks: 0, conversions: 0, ctr: '0%', startDate: '', endDate: '', notes: '' }); }}>
                <Plus className="mr-2 h-4 w-4" />
                Create new campaign
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Create content
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Performance reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Audience analysis
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming tasks
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
              <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5" /> Performance summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Above average performance</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conversion rate</span>
                  <span className="font-medium">4.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion cost</span>
                  <span className="font-medium">15 SAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Return on investment</span>
                  <span className="font-medium text-green-600">320%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top performing content</CardTitle>
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
                            <p className="text-muted-foreground">Views</p>
                            <p className="font-medium">{content.views}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Engagement</p>
                            <p className="font-medium">{content.engagement}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conversions</p>
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
                  <CardTitle>Overall performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total monthly expenses</span>
                    <span className="font-medium">28,500 SAR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total return</span>
                    <span className="font-medium">91,200 SAR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Return on investment</span>
                    <span className="font-medium text-green-600">320%</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Net profit</span>
                    <span className="font-medium text-green-600">62,700 SAR</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversion rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Google Ads</span>
                      <span>5.2%</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Social media</span>
                      <span>3.8%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Email</span>
                      <span>7.1%</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Organic content</span>
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
