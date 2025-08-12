import React from 'react';
import Header from '../../components/Header';
import type { RouteContext } from '../../components/Router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Package, ArrowRight } from 'lucide-react';

export default function AdminReports({ setCurrentPage, ...context }: Partial<RouteContext>) {
  return (
    <div className="min-h-screen bg-background">
      <Header {...context} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('admin-dashboard')} className="mr-4">
              <ArrowRight className="ml-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Key metrics and insights about users, vendors, and products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Total Revenue <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,456,789 SAR</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <TrendingUp className="mr-1 h-3 w-3" /> +15.3% vs last month
              </div>
              <div className="mt-4">
                <Progress value={72} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">72% of monthly target achieved</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Users <Users className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,847</div>
              <div className="flex items-center text-xs text-green-600 mt-2">
                <TrendingUp className="mr-1 h-3 w-3" /> +12.5% vs last month
              </div>
              <div className="mt-4">
                <Progress value={58} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">58% growth quarter-to-date</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Listed Products <Package className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,678</div>
              <div className="flex items-center text-xs text-red-600 mt-2">
                <TrendingDown className="mr-1 h-3 w-3" /> -1.1% vs last month
              </div>
              <div className="mt-4">
                <Progress value={43} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">New listings this month</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sales" className="space-y-6">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>
              <TabsContent value="sales">
                <p className="text-sm text-muted-foreground mb-4">Daily/weekly/monthly sales breakdown.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm">Daily Sales</div>
                    <div className="text-xl font-semibold">45,200 SAR</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm">Weekly Sales</div>
                    <div className="text-xl font-semibold">315,400 SAR</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm">Monthly Sales</div>
                    <div className="text-xl font-semibold">1,256,800 SAR</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="users">
                <p className="text-sm text-muted-foreground mb-4">User growth per role.</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Customers</span><span>85%</span></div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Vendors</span><span>60%</span></div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Marketers</span><span>25%</span></div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="inventory">
                <p className="text-sm text-muted-foreground mb-4">Inventory health and low-stock alerts.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm">In-stock items</div>
                    <div className="text-xl font-semibold">32,145</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm">Low-stock alerts</div>
                    <div className="text-xl font-semibold text-amber-600">1,284</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
