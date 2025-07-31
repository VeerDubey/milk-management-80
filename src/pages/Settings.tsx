
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Building2, 
  MapPin, 
  Calendar, 
  Calculator, 
  Palette, 
  Shield, 
  DollarSign,
  ChevronRight,
  Zap,
  Database,
  Bell,
  Lock,
  Globe,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const settingsCategories = [
  {
    title: 'General Settings',
    description: 'Basic application configuration and preferences',
    icon: SettingsIcon,
    color: 'text-blue-400',
    items: [
      { name: 'Application Settings', path: '/settings', badge: 'Core' },
      { name: 'System Preferences', path: '/settings', badge: 'Config' }
    ]
  },
  {
    title: 'Business Setup',
    description: 'Company and business-related configurations',
    icon: Building2,
    color: 'text-green-400',
    items: [
      { name: 'Company Profile', path: '/company-profile', badge: 'Essential' },
      { name: 'Area Management', path: '/area-management', badge: 'Location' },
      { name: 'Financial Year', path: '/financial-year', badge: 'Finance' }
    ]
  },
  {
    title: 'Financial Configuration',
    description: 'Tax settings and financial calculations',
    icon: Calculator,
    color: 'text-purple-400',
    items: [
      { name: 'Tax Settings', path: '/tax-settings', badge: 'Tax' },
      { name: 'Expenses', path: '/expenses', badge: 'Finance' }
    ]
  },
  {
    title: 'User & Security',
    description: 'User access control and security settings',
    icon: Shield,
    color: 'text-red-400',
    items: [
      { name: 'User Access', path: '/user-access', badge: 'Security' },
      { name: 'Permissions', path: '/user-access', badge: 'Access' }
    ]
  },
  {
    title: 'Interface & Display',
    description: 'Customize the look and feel of your application',
    icon: Palette,
    color: 'text-cyan-400',
    items: [
      { name: 'UI Settings', path: '/ui-settings', badge: 'Theme' },
      { name: 'Display Options', path: '/ui-settings', badge: 'Visual' }
    ]
  }
];

const systemStatus = [
  { name: 'Database Connection', status: 'Connected', color: 'text-green-400' },
  { name: 'Backup Status', status: 'Up to date', color: 'text-blue-400' },
  { name: 'System Health', status: 'Optimal', color: 'text-green-400' },
  { name: 'Security Status', status: 'Secure', color: 'text-green-400' }
];

export default function Settings() {
  const navigate = useNavigate();

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Essential': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30';
      case 'Security': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
      case 'Finance': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30';
      case 'Core': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="neo-noir-bg min-h-screen">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold neo-noir-gradient-text">
              System Settings
            </h1>
            <p className="neo-noir-text-muted">
              Configure your application settings and preferences
            </p>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
            <Zap className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-400">System Online</p>
              <p className="text-xs neo-noir-text-muted">All systems operational</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-400" />
              System Status
            </CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Current system health and operational status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {systemStatus.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                    <span className="text-sm neo-noir-text-muted">{item.name}</span>
                  </div>
                  <p className={`font-medium ${item.color}`}>{item.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Categories */}
        <div className="grid gap-6">
          {settingsCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="neo-noir-card hover-scale">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl flex items-center justify-center border border-slate-600/30">
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div>
                      <CardTitle className="neo-noir-text">{category.title}</CardTitle>
                      <CardDescription className="neo-noir-text-muted">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-600/20 hover:border-slate-500/40 transition-colors cursor-pointer"
                        onClick={() => navigate(item.path)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="neo-noir-text font-medium">{item.name}</span>
                          <Badge className={getBadgeColor(item.badge)}>
                            {item.badge}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 neo-noir-text-muted" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text">Quick Actions</CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Common system administration tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="neo-noir-button-outline h-auto p-4 flex flex-col gap-2">
                <Database className="h-6 w-6 text-blue-400" />
                <span className="text-sm">Backup Data</span>
              </Button>
              <Button variant="outline" className="neo-noir-button-outline h-auto p-4 flex flex-col gap-2">
                <Bell className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">Notifications</span>
              </Button>
              <Button variant="outline" className="neo-noir-button-outline h-auto p-4 flex flex-col gap-2">
                <Lock className="h-6 w-6 text-red-400" />
                <span className="text-sm">Security Audit</span>
              </Button>
              <Button variant="outline" className="neo-noir-button-outline h-auto p-4 flex flex-col gap-2">
                <Globe className="h-6 w-6 text-green-400" />
                <span className="text-sm">System Update</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
