import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Clock, 
  Bell, 
  Mail,
  MessageSquare,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar
} from 'lucide-react';

export function AdvancedAutomation() {
  const [automations, setAutomations] = useState({
    orderReminders: true,
    paymentAlerts: true,
    stockAlerts: false,
    deliveryNotifications: true,
    weeklyReports: false,
    priceUpdates: false,
    customerSegmentation: true,
    inventoryReorder: false
  });

  const toggleAutomation = (automation: string) => {
    setAutomations(prev => ({
      ...prev,
      [automation]: !prev[automation]
    }));
  };

  const automationRules = [
    {
      id: 'orderReminders',
      title: 'Order Reminder System',
      description: 'Automatically remind customers about pending orders',
      icon: Bell,
      trigger: 'Daily at 9:00 AM',
      category: 'Customer Communication',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'paymentAlerts',
      title: 'Payment Due Alerts',
      description: 'Send payment reminders to customers with outstanding dues',
      icon: DollarSign,
      trigger: 'Weekly on Monday',
      category: 'Financial Management',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'stockAlerts',
      title: 'Low Stock Notifications',
      description: 'Alert when product inventory drops below threshold',
      icon: Package,
      trigger: 'Real-time monitoring',
      category: 'Inventory Management',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'deliveryNotifications',
      title: 'Delivery Updates',
      description: 'Automated delivery status updates to customers',
      icon: RefreshCw,
      trigger: 'On status change',
      category: 'Delivery Management',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'weeklyReports',
      title: 'Weekly Business Reports',
      description: 'Automated generation and distribution of business reports',
      icon: TrendingUp,
      trigger: 'Every Sunday at 8:00 PM',
      category: 'Analytics & Reporting',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'priceUpdates',
      title: 'Dynamic Price Updates',
      description: 'Automatically adjust prices based on market conditions',
      icon: Target,
      trigger: 'Market data changes',
      category: 'Pricing Management',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'customerSegmentation',
      title: 'Customer Segmentation',
      description: 'Automatically categorize customers based on behavior',
      icon: Users,
      trigger: 'Monthly analysis',
      category: 'Customer Analytics',
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'inventoryReorder',
      title: 'Smart Inventory Reorder',
      description: 'Automatically generate purchase orders for low stock items',
      icon: RefreshCw,
      trigger: 'Stock threshold reached',
      category: 'Supply Chain',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const activeAutomations = automationRules.filter(rule => automations[rule.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-purple-400" />
          Advanced Automation
        </h2>
        <p className="text-slate-300">Intelligent workflows that run your business automatically</p>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Rules</p>
                <p className="text-2xl font-bold text-white">{activeAutomations.length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Time Saved</p>
                <p className="text-2xl font-bold text-white">12h/week</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Tasks Automated</p>
                <p className="text-2xl font-bold text-white">847</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-white">98.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationRules.map((rule) => {
          const Icon = rule.icon;
          const isActive = automations[rule.id];
          
          return (
            <Card key={rule.id} className={`bg-slate-900/50 border-slate-700/50 transition-all duration-300 ${
              isActive ? 'ring-2 ring-purple-500/30' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${rule.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">{rule.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1 border-slate-600 text-slate-400">
                        {rule.category}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleAutomation(rule.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-400 text-sm mb-3">{rule.description}</p>
                
                <div className="flex items-center gap-2 text-slate-300 text-xs mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>Trigger: {rule.trigger}</span>
                </div>
                
                {isActive && (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Running Automatically</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Automation Builder */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automation Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <Zap className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Create Custom Automation</h3>
              <p className="text-slate-400 mb-6">Build your own automation workflows with our visual builder</p>
              
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Template Gallery
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Zap className="mr-2 h-4 w-4" />
                  Create Automation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Automation Activity</h3>
                <p className="text-slate-300">Your automations have saved 12 hours this week</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{activeAutomations.length} Rules Active</span>
              </div>
              <p className="text-slate-400 text-sm">847 tasks completed automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}