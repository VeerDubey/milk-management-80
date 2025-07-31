import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Zap, 
  Brain, 
  Shield, 
  Cpu, 
  Database, 
  Cloud,
  Bot,
  Lock,
  Globe,
  RefreshCw,
  TrendingUp,
  Target,
  Sparkles,
  Rocket,
  Settings,
  Bell,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';

export default function AdvancedFeatures() {
  const [features, setFeatures] = useState({
    aiPredictions: false,
    autoBackup: true,
    realTimeSync: true,
    advancedSecurity: false,
    chatbot: false,
    multiCompany: false,
    cloudStorage: true,
    apiIntegration: false,
    mobileApp: false,
    whiteLabel: false,
    advancedReports: true,
    inventoryOptimization: false,
    priceOptimization: false,
    customerSegmentation: false,
    marketingAutomation: false,
    eCommerce: false,
  });

  const toggleFeature = (feature: string) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    toast.success(`${feature} ${features[feature] ? 'disabled' : 'enabled'}`);
  };

  const proFeatures = [
    {
      id: 'aiPredictions',
      title: 'AI Demand Prediction',
      description: 'Predict customer demand using machine learning algorithms',
      icon: Brain,
      category: 'AI & ML',
      premium: true
    },
    {
      id: 'autoBackup',
      title: 'Automated Backup',
      description: 'Automatic daily backups with cloud storage integration',
      icon: Database,
      category: 'Data & Security'
    },
    {
      id: 'realTimeSync',
      title: 'Real-time Synchronization',
      description: 'Sync data across all devices in real-time',
      icon: RefreshCw,
      category: 'Connectivity'
    },
    {
      id: 'advancedSecurity',
      title: 'Advanced Security Suite',
      description: 'Multi-factor authentication, encryption, and audit logs',
      icon: Shield,
      category: 'Data & Security',
      premium: true
    },
    {
      id: 'chatbot',
      title: 'AI-Powered Chatbot',
      description: 'Automated customer support with natural language processing',
      icon: Bot,
      category: 'AI & ML',
      premium: true
    },
    {
      id: 'multiCompany',
      title: 'Multi-Company Management',
      description: 'Manage multiple companies from a single dashboard',
      icon: Globe,
      category: 'Enterprise',
      premium: true
    },
    {
      id: 'cloudStorage',
      title: 'Cloud Storage',
      description: 'Unlimited cloud storage for documents and media',
      icon: Cloud,
      category: 'Storage'
    },
    {
      id: 'apiIntegration',
      title: 'API Integration Hub',
      description: 'Connect with third-party applications and services',
      icon: Cpu,
      category: 'Integration',
      premium: true
    },
    {
      id: 'mobileApp',
      title: 'Mobile Application',
      description: 'Native mobile app for iOS and Android',
      icon: Rocket,
      category: 'Mobility'
    },
    {
      id: 'whiteLabel',
      title: 'White Label Solution',
      description: 'Customize branding and create your own ERP platform',
      icon: Sparkles,
      category: 'Branding',
      premium: true
    },
    {
      id: 'advancedReports',
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting with predictive insights',
      icon: BarChart3,
      category: 'Analytics'
    },
    {
      id: 'inventoryOptimization',
      title: 'Smart Inventory',
      description: 'AI-driven inventory optimization and demand forecasting',
      icon: Target,
      category: 'AI & ML',
      premium: true
    },
    {
      id: 'priceOptimization',
      title: 'Dynamic Pricing',
      description: 'AI-powered price optimization based on market conditions',
      icon: TrendingUp,
      category: 'AI & ML',
      premium: true
    },
    {
      id: 'customerSegmentation',
      title: 'Customer Segmentation',
      description: 'Advanced customer analytics and segmentation',
      icon: MessageSquare,
      category: 'Analytics',
      premium: true
    },
    {
      id: 'marketingAutomation',
      title: 'Marketing Automation',
      description: 'Automated email campaigns and customer engagement',
      icon: Bell,
      category: 'Marketing',
      premium: true
    },
    {
      id: 'eCommerce',
      title: 'E-commerce Integration',
      description: 'Built-in online store and e-commerce capabilities',
      icon: Globe,
      category: 'Sales',
      premium: true
    }
  ];

  const categories = ['All', 'AI & ML', 'Data & Security', 'Connectivity', 'Enterprise', 'Integration', 'Analytics', 'Marketing'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeatures = selectedCategory === 'All' 
    ? proFeatures 
    : proFeatures.filter(feature => feature.category === selectedCategory);

  const enabledCount = Object.values(features).filter(Boolean).length;
  const totalCount = proFeatures.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              Pro Features & Modules
            </h1>
            <p className="text-slate-300">Advanced capabilities to supercharge your ERP system</p>
          </div>
          
          <div className="flex gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              {enabledCount}/{totalCount} Active
            </Badge>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Rocket className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        </div>

        {/* Feature Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">AI Features</p>
                  <p className="text-2xl font-bold text-white">
                    {proFeatures.filter(f => f.category === 'AI & ML' && features[f.id]).length}/
                    {proFeatures.filter(f => f.category === 'AI & ML').length}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Security</p>
                  <p className="text-2xl font-bold text-white">
                    {proFeatures.filter(f => f.category === 'Data & Security' && features[f.id]).length}/
                    {proFeatures.filter(f => f.category === 'Data & Security').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Integration</p>
                  <p className="text-2xl font-bold text-white">
                    {proFeatures.filter(f => f.category === 'Integration' && features[f.id]).length}/
                    {proFeatures.filter(f => f.category === 'Integration').length}
                  </p>
                </div>
                <Cpu className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Premium</p>
                  <p className="text-2xl font-bold text-white">
                    {proFeatures.filter(f => f.premium && features[f.id]).length}/
                    {proFeatures.filter(f => f.premium).length}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-slate-800/50 h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-blue-600 text-xs p-2"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeatures.map((feature) => {
                const Icon = feature.icon;
                const isEnabled = features[feature.id];
                
                return (
                  <Card 
                    key={feature.id} 
                    className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      isEnabled ? 'ring-2 ring-blue-500/30 bg-blue-900/10' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isEnabled ? 'bg-blue-600/20' : 'bg-slate-800/50'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isEnabled ? 'text-blue-400' : 'text-slate-400'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                              {feature.title}
                              {feature.premium && (
                                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                  PRO
                                </Badge>
                              )}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs mt-1 border-slate-600 text-slate-400">
                              {feature.category}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                          disabled={feature.premium && !isEnabled}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-slate-400 text-sm mb-3">{feature.description}</p>
                      
                      {feature.premium && !isEnabled && (
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-yellow-600/80 to-orange-600/80 hover:from-yellow-600 hover:to-orange-600"
                          onClick={() => toast.info('Upgrade to Pro to unlock this feature')}
                        >
                          <Lock className="mr-2 h-3 w-3" />
                          Upgrade to Enable
                        </Button>
                      )}
                      
                      {isEnabled && (
                        <div className="flex items-center gap-2 text-green-400 text-xs">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Feature Active
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Tabs>

        {/* Pro Upgrade Banner */}
        <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Unlock the Full Potential</h3>
                  <p className="text-slate-300">Get access to all premium features and advanced capabilities</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  View Pricing
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}