
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Palette, Monitor, Smartphone, Tablet, Eye, Save, RotateCcw, Download, Upload } from 'lucide-react';

interface UISettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontSize: number;
  fontFamily: string;
  compactMode: boolean;
  showAnimations: boolean;
  sidebarCollapsed: boolean;
  tablePageSize: number;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  language: 'en' | 'hi' | 'mr';
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  keyboardShortcuts: boolean;
}

const defaultSettings: UISettings = {
  theme: 'dark',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  fontSize: 14,
  fontFamily: 'Inter',
  compactMode: false,
  showAnimations: true,
  sidebarCollapsed: false,
  tablePageSize: 25,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  currency: 'INR',
  language: 'en',
  notifications: true,
  soundEnabled: true,
  autoSave: true,
  keyboardShortcuts: true
};

const UISettings = () => {
  const [settings, setSettings] = useState<UISettings>(defaultSettings);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('uiSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with default settings to ensure all properties exist
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof UISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('uiSettings', JSON.stringify(settings));
    toast.success('UI settings saved successfully');
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('uiSettings');
    toast.success('Settings reset to default');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ui-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Settings exported successfully');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          // Merge with default settings to ensure all properties exist
          setSettings({ ...defaultSettings, ...importedSettings });
          toast.success('Settings imported successfully');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const colorPresets = [
    { name: 'Blue', primary: '#3b82f6', secondary: '#8b5cf6' },
    { name: 'Purple', primary: '#8b5cf6', secondary: '#ec4899' },
    { name: 'Green', primary: '#10b981', secondary: '#f59e0b' },
    { name: 'Red', primary: '#ef4444', secondary: '#f97316' },
    { name: 'Indigo', primary: '#6366f1', secondary: '#06b6d4' }
  ];

  const fontFamilies = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              UI Settings
            </h1>
            <p className="text-slate-300 mt-2">Customize your interface preferences and appearance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetSettings} className="text-slate-300 border-slate-600">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportSettings} className="text-slate-300 border-slate-600">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
              <Button variant="outline" className="text-slate-300 border-slate-600">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </label>
            <Button onClick={saveSettings} className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Preview Mode Toggle */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label className="text-slate-300">Preview Mode:</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setPreviewMode('desktop')}
                  className="text-slate-300"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Desktop
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  onClick={() => setPreviewMode('tablet')}
                  className="text-slate-300"
                >
                  <Tablet className="mr-2 h-4 w-4" />
                  Tablet
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setPreviewMode('mobile')}
                  className="text-slate-300"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme & Appearance */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Appearance
              </CardTitle>
              <CardDescription className="text-slate-300">
                Customize colors, fonts, and visual appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Color Presets</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto p-2 border-slate-600"
                      onClick={() => {
                        handleSettingChange('primaryColor', preset.primary);
                        handleSettingChange('secondaryColor', preset.secondary);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <span className="text-slate-300 text-xs">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Primary Color</Label>
                  <Input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 h-10"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Secondary Color</Label>
                  <Input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 h-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Font Family</Label>
                <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange('fontFamily', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Font Size: {settings.fontSize}px</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => handleSettingChange('fontSize', value[0])}
                  min={12}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Layout & Behavior */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Layout & Behavior
              </CardTitle>
              <CardDescription className="text-slate-300">
                Configure interface behavior and layout preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Compact Mode</Label>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Show Animations</Label>
                  <Switch
                    checked={settings.showAnimations}
                    onCheckedChange={(checked) => handleSettingChange('showAnimations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Sidebar Collapsed</Label>
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) => handleSettingChange('sidebarCollapsed', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Auto Save</Label>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Keyboard Shortcuts</Label>
                  <Switch
                    checked={settings.keyboardShortcuts}
                    onCheckedChange={(checked) => handleSettingChange('keyboardShortcuts', checked)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Table Page Size</Label>
                <Select value={(settings.tablePageSize || 25).toString()} onValueChange={(value) => handleSettingChange('tablePageSize', parseInt(value))}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 rows</SelectItem>
                    <SelectItem value="25">25 rows</SelectItem>
                    <SelectItem value="50">50 rows</SelectItem>
                    <SelectItem value="100">100 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Localization</CardTitle>
              <CardDescription className="text-slate-300">
                Configure language, date, time, and currency formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Time Format</Label>
                <Select value={settings.timeFormat} onValueChange={(value) => handleSettingChange('timeFormat', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Notifications & Alerts</CardTitle>
              <CardDescription className="text-slate-300">
                Configure notification preferences and alert settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Enable Notifications</Label>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Sound Alerts</Label>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                <h4 className="text-white font-medium">Current Settings Preview</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-300">Theme: <Badge variant="secondary">{settings.theme}</Badge></div>
                  <div className="text-slate-300">Font: <Badge variant="secondary">{settings.fontFamily}</Badge></div>
                  <div className="text-slate-300">Page Size: <Badge variant="secondary">{settings.tablePageSize}</Badge></div>
                  <div className="text-slate-300">Language: <Badge variant="secondary">{settings.language}</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UISettings;
