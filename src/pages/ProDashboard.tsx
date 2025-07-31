import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Brain, 
  Shield, 
  Bot, 
  Building, 
  Cpu, 
  Sparkles,
  Target,
  TrendingUp,
  MessageSquare,
  Bell,
  Globe,
  BarChart3,
  Users,
  ShoppingCart,
  Lock,
  Zap,
  Activity,
  DollarSign
} from 'lucide-react';

import { ProLicenseService } from '@/services/pro/ProLicenseService';
import { AIAnalyticsService } from '@/services/pro/AIAnalyticsService';
import { SecurityService } from '@/services/pro/SecurityService';
import { ChatbotService } from '@/services/pro/ChatbotService';
import { MarketingAutomationService } from '@/services/pro/MarketingAutomationService';
import { ECommerceService } from '@/services/pro/ECommerceService';

export default function ProDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [chatbotStats, setChatbotStats] = useState<any>(null);
  const [marketingStats, setMarketingStats] = useState<any>(null);
  const [ecommerceStats, setEcommerceStats] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load AI Analytics
      const aiAnalytics = AIAnalyticsService.getAnalytics();
      setAnalytics(aiAnalytics);

      // Load Security Logs
      const logs = SecurityService.getAuditLogs(undefined, 10);
      setSecurityLogs(logs);

      // Load Chatbot Analytics
      const chatStats = ChatbotService.getChatbotAnalytics();
      setChatbotStats(chatStats);

      // Load Marketing Analytics
      const marketingAnalytics = MarketingAutomationService.getAnalytics();
      setMarketingStats(marketingAnalytics);

      // Load E-commerce Analytics (if store exists)
      const stores = ECommerceService.getStores();
      if (stores.length > 0) {
        const storeStats = ECommerceService.getAnalytics(stores[0].id);
        setEcommerceStats(storeStats);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const enableFeature = async (feature: string) => {
    if (!ProLicenseService.hasFeature(feature)) {
      toast.error('This feature is not available in your current license');
      return;
    }
    
    toast.success(`${feature} feature enabled`);
  };

  const hasFeature = (feature: string) => ProLicenseService.hasFeature(feature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              Pro Features Dashboard
            </h1>
            <p className="text-slate-300">Monitor and manage your advanced ERP capabilities</p>
          </div>
          
          <div className="flex gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              Enterprise License Active
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">AI Insights</p>
                  <p className="text-2xl font-bold text-white">{analytics?.length || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Security Events</p>
                  <p className="text-2xl font-bold text-white">{securityLogs.length}</p>
                </div>
                <Shield className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Chat Sessions</p>
                  <p className="text-2xl font-bold text-white">{chatbotStats?.totalSessions || 0}</p>
                </div>
                <Bot className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Campaigns</p>
                  <p className="text-2xl font-bold text-white">{marketingStats?.totalCampaigns || 0}</p>
                </div>
                <Bell className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Tabs */}
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">AI Analytics</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600">Security</TabsTrigger>
            <TabsTrigger value="chatbot" className="data-[state=active]:bg-purple-600">Chatbot</TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-yellow-600">Marketing</TabsTrigger>
            <TabsTrigger value="ecommerce" className="data-[state=active]:bg-pink-600">E-Commerce</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-indigo-600">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    AI Demand Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Models</span>
                      <Badge className="bg-blue-600/20 text-blue-400">3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Accuracy Rate</span>
                      <span className="text-green-400 font-semibold">87%</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('ai_predictions')}
                      disabled={!hasFeature('ai_predictions')}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Generate New Prediction
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Price Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Optimized Products</span>
                      <Badge className="bg-green-600/20 text-green-400">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Revenue Impact</span>
                      <span className="text-green-400 font-semibold">+15%</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('price_optimization')}
                      disabled={!hasFeature('price_optimization')}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Optimize Prices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">2FA Enabled</span>
                      <Badge className="bg-green-600/20 text-green-400">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Failed Login Attempts</span>
                      <span className="text-yellow-400 font-semibold">2</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('advanced_security')}
                      disabled={!hasFeature('advanced_security')}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      View Security Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Recent Security Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {securityLogs.slice(0, 3).map((log, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">{log.action}</span>
                        <Badge 
                          className={`${log.success ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'} text-xs`}
                        >
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatbot" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                    Chatbot Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Resolution Rate</span>
                      <span className="text-green-400 font-semibold">{chatbotStats?.resolutionRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Avg Satisfaction</span>
                      <span className="text-blue-400 font-semibold">{chatbotStats?.avgSatisfaction?.toFixed(1) || 0}/5</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('chatbot')}
                      disabled={!hasFeature('chatbot')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View Chat Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-400" />
                    Customer Segments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">High Value</span>
                      <Badge className="bg-cyan-600/20 text-cyan-400">24</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">At Risk</span>
                      <Badge className="bg-red-600/20 text-red-400">8</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('customer_segmentation')}
                      disabled={!hasFeature('customer_segmentation')}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Segment Customers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-400" />
                    Campaign Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Open Rate</span>
                      <span className="text-green-400 font-semibold">{marketingStats?.averageRates?.openRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Click Rate</span>
                      <span className="text-blue-400 font-semibold">{marketingStats?.averageRates?.clickRate?.toFixed(1) || 0}%</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('marketing_automation')}
                      disabled={!hasFeature('marketing_automation')}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-400" />
                    Marketing Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Campaigns</span>
                      <Badge className="bg-orange-600/20 text-orange-400">{marketingStats?.activeCampaigns || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Conversion Rate</span>
                      <span className="text-green-400 font-semibold">{marketingStats?.averageRates?.conversionRate?.toFixed(1) || 0}%</span>
                    </div>
                    <Button className="w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Detailed Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ecommerce" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-pink-400" />
                    Store Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Orders</span>
                      <span className="text-green-400 font-semibold">{ecommerceStats?.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Revenue</span>
                      <span className="text-blue-400 font-semibold">₹{ecommerceStats?.totalRevenue?.toLocaleString() || 0}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('ecommerce')}
                      disabled={!hasFeature('ecommerce')}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Manage Store
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    White Label
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Custom Branding</span>
                      <Badge className="bg-emerald-600/20 text-emerald-400">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Custom Domain</span>
                      <Badge className="bg-blue-600/20 text-blue-400">Configured</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('white_label')}
                      disabled={!hasFeature('white_label')}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Customize Branding
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-indigo-400" />
                    API Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active APIs</span>
                      <Badge className="bg-indigo-600/20 text-indigo-400">5</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Success Rate</span>
                      <span className="text-green-400 font-semibold">99.8%</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('api_integration')}
                      disabled={!hasFeature('api_integration')}
                    >
                      <Cpu className="mr-2 h-4 w-4" />
                      Manage Integrations
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="h-5 w-5 text-teal-400" />
                    Multi-Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Companies</span>
                      <Badge className="bg-teal-600/20 text-teal-400">3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Data Sync</span>
                      <Badge className="bg-green-600/20 text-green-400">Real-time</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => enableFeature('multi_company')}
                      disabled={!hasFeature('multi_company')}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Switch Company
                    </Button>
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