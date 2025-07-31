
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, AlertTriangle, Package, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function StockSettings() {
  const { uiSettings, updateUISettings } = useData();
  
  const [settings, setSettings] = useState({
    autoUpdateStock: uiSettings?.stockSettings?.autoUpdateStock || false,
    lowStockAlerts: uiSettings?.stockSettings?.lowStockAlerts || true,
    stockValueMethod: uiSettings?.stockSettings?.stockValueMethod || 'FIFO',
    showStockInList: uiSettings?.stockSettings?.showStockInList || true,
    stockUnit: uiSettings?.stockSettings?.stockUnit || 'pieces',
    stockAlertThreshold: uiSettings?.stockSettings?.stockAlertThreshold || 10,
    stockValuation: uiSettings?.stockSettings?.stockValuation || 'weighted_average',
    stockAging: uiSettings?.stockSettings?.stockAging || 'enabled',
    stockReports: uiSettings?.stockSettings?.stockReports || 'detailed',
    stockAudit: uiSettings?.stockSettings?.stockAudit || 'monthly',
    lowStockThreshold: uiSettings?.stockSettings?.lowStockThreshold || 10,
    mediumStockThreshold: uiSettings?.stockSettings?.mediumStockThreshold || 50,
    autoReorderEnabled: uiSettings?.stockSettings?.autoReorderEnabled || false,
    reorderQuantity: uiSettings?.stockSettings?.reorderQuantity || 100,
    alertsEnabled: uiSettings?.stockSettings?.alertsEnabled || true,
    emailNotifications: uiSettings?.stockSettings?.emailNotifications || false,
    smsNotifications: uiSettings?.stockSettings?.smsNotifications || false,
    trackExpiry: uiSettings?.stockSettings?.trackExpiry || false,
    expiryAlertDays: uiSettings?.stockSettings?.expiryAlertDays || 30,
    batchTracking: uiSettings?.stockSettings?.batchTracking || false
  });

  const handleSaveSettings = () => {
    updateUISettings({
      stockSettings: settings
    });
    toast.success('Stock settings saved successfully');
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Stock Settings
          </h1>
          <p className="text-slate-300 mt-2">Configure inventory management preferences</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="thresholds" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="thresholds" className="data-[state=active]:bg-blue-600">
            Stock Thresholds
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
            Alerts & Notifications
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-blue-600">
            Automation
          </TabsTrigger>
          <TabsTrigger value="tracking" className="data-[state=active]:bg-blue-600">
            Advanced Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Low Stock Threshold
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Alert when stock falls below this level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Minimum Quantity</Label>
                  <Input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="w-5 h-5 mr-2 text-yellow-400" />
                  Medium Stock Threshold
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Warning level before reaching low stock
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Warning Quantity</Label>
                  <Input
                    type="number"
                    value={settings.mediumStockThreshold}
                    onChange={(e) => handleSettingChange('mediumStockThreshold', parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-400" />
                  Alert Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure how you receive stock alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Enable Stock Alerts</Label>
                  <Switch
                    checked={settings.alertsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('alertsEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Email Notifications</Label>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">SMS Notifications</Label>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Expiry Alerts</CardTitle>
                <CardDescription className="text-slate-300">
                  Get notified about expiring products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Track Product Expiry</Label>
                  <Switch
                    checked={settings.trackExpiry}
                    onCheckedChange={(checked) => handleSettingChange('trackExpiry', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Alert Days Before Expiry</Label>
                  <Input
                    type="number"
                    value={settings.expiryAlertDays}
                    onChange={(e) => handleSettingChange('expiryAlertDays', parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={!settings.trackExpiry}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-green-400" />
                Auto-Reorder Settings
              </CardTitle>
              <CardDescription className="text-slate-300">
                Automatically reorder products when stock is low
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Enable Auto-Reorder</Label>
                <Switch
                  checked={settings.autoReorderEnabled}
                  onCheckedChange={(checked) => handleSettingChange('autoReorderEnabled', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Default Reorder Quantity</Label>
                <Input
                  type="number"
                  value={settings.reorderQuantity}
                  onChange={(e) => handleSettingChange('reorderQuantity', parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!settings.autoReorderEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Tracking</CardTitle>
              <CardDescription className="text-slate-300">
                Enhanced inventory tracking features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Batch/Lot Tracking</Label>
                  <p className="text-sm text-slate-400">Track products by batch numbers</p>
                </div>
                <Switch
                  checked={settings.batchTracking}
                  onCheckedChange={(checked) => handleSettingChange('batchTracking', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
