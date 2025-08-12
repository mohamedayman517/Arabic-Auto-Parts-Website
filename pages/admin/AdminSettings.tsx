import React, { useState } from 'react';
import Header from '../../components/Header';
import type { RouteContext } from '../../components/Router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowRight, Settings } from 'lucide-react';

export default function AdminSettings({ setCurrentPage, ...context }: Partial<RouteContext>) {
  const [siteName, setSiteName] = useState('Auto Parts');
  const [supportEmail, setSupportEmail] = useState('support@example.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);

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
          <h1 className="mb-2">System Settings</h1>
          <p className="text-muted-foreground">Manage global system configuration and behavior.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" /> General</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Site name</Label>
                    <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Support email</Label>
                    <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow new registrations</Label>
                      <p className="text-xs text-muted-foreground">Enable or disable self-service account creation.</p>
                    </div>
                    <Switch checked={allowRegistrations} onCheckedChange={setAllowRegistrations} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance mode</Label>
                      <p className="text-xs text-muted-foreground">Show maintenance banner and restrict non-admin access.</p>
                    </div>
                    <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
