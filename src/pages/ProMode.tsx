import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { 
  Zap, 
  Crown, 
  Shield, 
  Brain,
  Rocket,
  Settings,
  Users,
  BarChart3,
  Lock,
  Sparkles,
  Globe,
  Database,
  Mail,
  MessageSquare,
  TrendingUp,
  Package,
  CheckCircle
} from 'lucide-react';
import { ProLicenseService } from '@/services/pro/ProLicenseService';
import { UpgradeDialog } from '@/components/pro/UpgradeDialog';

export default function ProMode() {
  const [userPlan] = useState('free'); // Mock user plan
  const [activeTab, setActiveTab] = useState('all');
  const [licenseKey, setLicenseKey] = useState('');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleLicenseActivation = async () => {
    if (!licenseKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid license key",
        variant: "destructive"
      });
      return;
    }

    const isValid = await ProLicenseService.validateLicense(licenseKey);
    if (isValid) {
      toast({
        title: "Success",
        description: "Pro license activated successfully!",
      });
      setLicenseKey('');
    } else {
      toast({
        title: "Invalid License",
        description: "Invalid license key. Please check and try again.",
        variant: "destructive"
      });
    }
  };

  // Enhanced features with more categories
  const [features, setFeatures] = useState([
    // AI & ML
    {
      id: 'ai_demand_prediction',
      name: 'AI Demand Prediction',
      category: 'AI & ML',
      pro: true,
      enabled: false,
      description: 'Predict customer demand using machine learning',
      icon: Brain
    },
    {
      id: 'ai_chatbot',
      name: 'AI-Powered Chatbot',
      category: 'AI & ML',
      pro: true,
      enabled: false,
      description: 'Intelligent customer support automation',
      icon: MessageSquare
    },
    {
      id: 'price_optimization',
      name: 'AI Price Optimization',
      category: 'AI & ML',
      pro: true,
      enabled: false,
      description: 'Optimize pricing using market analysis',
      icon: TrendingUp
    },
    {
      id: 'customer_segmentation',
      name: 'Smart Customer Segmentation',
      category: 'AI & ML',
      pro: true,
      enabled: false,
      description: 'Automatically segment customers by behavior',
      icon: Users
    },
    
    // Data & Security
    {
      id: 'automated_backup',
      name: 'Automated Backup',
      category: 'Data & Security',
      pro: false,
      enabled: true,
      description: 'Automatic daily backups with cloud storage',
      icon: Database
    },
    {
      id: 'advanced_security',
      name: 'Advanced Security Suite',
      category: 'Data & Security',
      pro: true,
      enabled: false,
      description: 'Two-factor authentication and encryption',
      icon: Shield
    },
    
    // Connectivity
    {
      id: 'real_time_sync',
      name: 'Real-time Synchronization',
      category: 'Connectivity',
      pro: false,
      enabled: true,
      description: 'Sync data across all devices in real-time',
      icon: Globe
    },
    
    // Enterprise
    {
      id: 'multi_company',
      name: 'Multi-Company Management',
      category: 'Enterprise',
      pro: true,
      enabled: false,
      description: 'Manage multiple companies from one dashboard',
      icon: Settings
    },
    {
      id: 'white_label',
      name: 'White Label Solution',
      category: 'Enterprise',
      pro: true,
      enabled: false,
      description: 'Custom branding and domain configuration',
      icon: Crown
    },
    
    // Integration
    {
      id: 'api_access',
      name: 'API Access',
      category: 'Integration',
      pro: true,
      enabled: false,
      description: 'RESTful API for third-party integrations',
      icon: Zap
    },
    
    // Analytics
    {
      id: 'advanced_reports',
      name: 'Advanced Analytics',
      category: 'Analytics',
      pro: true,
      enabled: false,
      description: 'Detailed business intelligence reports',
      icon: BarChart3
    },
    
    // Marketing
    {
      id: 'email_campaigns',
      name: 'Email Marketing',
      category: 'Marketing',
      pro: true,
      enabled: false,
      description: 'Automated email marketing campaigns',
      icon: Mail
    }
  ]);

  const categories = ['All', 'AI & ML', 'Data & Security', 'Connectivity', 'Enterprise', 'Integration', 'Analytics', 'Marketing'];
  
  const getFeaturesByCategory = (category: string) => {
    if (category === 'All') return features;
    return features.filter(feature => feature.category === category);
  };

  const toggleFeature = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    if (feature.pro && userPlan !== 'pro') {
      toast({
        title: "Upgrade Required",
        description: "This feature requires a Pro subscription.",
        variant: "destructive"
      });
      return;
    }

    setFeatures(prev => prev.map(f => 
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));

    // Save to localStorage
    const updatedFeature = { ...feature, enabled: !feature.enabled };
    localStorage.setItem(`feature_${featureId}`, JSON.stringify(updatedFeature));

    toast({
      title: updatedFeature.enabled ? "Feature Enabled" : "Feature Disabled",
      description: `${feature.name} has been ${updatedFeature.enabled ? 'enabled' : 'disabled'}.`
    });
  };

  useEffect(() => {
    // Load feature states from localStorage
    const loadedFeatures = features.map(feature => {
      const saved = localStorage.getItem(`feature_${feature.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...feature, enabled: parsed.enabled };
      }
      return feature;
    });
    setFeatures(loadedFeatures);
  }, []);

  const getStats = () => {
    return {
      aiFeatures: features.filter(f => f.category === 'AI & ML' && f.enabled).length,
      securityFeatures: features.filter(f => f.category === 'Data & Security' && f.enabled).length,
      integrationFeatures: features.filter(f => f.category === 'Integration' && f.enabled).length,
      premiumFeatures: features.filter(f => f.pro && f.enabled).length,
      totalAI: features.filter(f => f.category === 'AI & ML').length,
      totalSecurity: features.filter(f => f.category === 'Data & Security').length,
      totalIntegration: features.filter(f => f.category === 'Integration').length,
      totalPremium: features.filter(f => f.pro).length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Pro Mode
              </h1>
              <p className="text-slate-300">Enterprise-grade features and advanced capabilities</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
              <Crown className="mr-1 h-3 w-3" />
              Pro Features
            </Badge>
            <Button 
              onClick={() => setShowUpgradeDialog(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* License Activation */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              License Activation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your Pro license key..."
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
              <Button 
                onClick={handleLicenseActivation}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              >
                Activate
              </Button>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Try: PRO-2024-VIKAS-MILK-ENTERPRISE or contact support for your license key
            </p>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm">AI Features</p>
                <p className="text-2xl font-bold text-white">{stats.aiFeatures}/{stats.totalAI}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Security</p>
                <p className="text-2xl font-bold text-white">{stats.securityFeatures}/{stats.totalSecurity}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Integration</p>
                <p className="text-2xl font-bold text-white">{stats.integrationFeatures}/{stats.totalIntegration}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Premium</p>
                <p className="text-2xl font-bold text-white">{stats.premiumFeatures}/{stats.totalPremium}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid grid-cols-4 lg:grid-cols-8 bg-slate-100">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category.toLowerCase().replace(/\s+/g, '-')}
                      className="data-[state=active]:bg-white text-xs"
                      onClick={() => setActiveTab(category.toLowerCase().replace(/\s+/g, '-'))}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent 
                  key={category} 
                  value={category.toLowerCase().replace(/\s+/g, '-')} 
                  className="mt-6 px-6 pb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFeaturesByCategory(category).map((feature) => {
                      const Icon = feature.icon;
                      const isLocked = feature.pro && userPlan !== 'pro';
                      
                      return (
                        <Card 
                          key={feature.id} 
                          className={`bg-slate-900/50 border-slate-700/50 transition-all duration-300 hover:scale-105 ${
                            feature.enabled ? 'ring-2 ring-green-500/30' : isLocked ? 'ring-2 ring-yellow-500/30' : ''
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                              <div className={`p-2 rounded-lg ${
                                feature.enabled ? 'bg-green-600/20' : isLocked ? 'bg-yellow-600/20' : 'bg-slate-800/50'
                              }`}>
                                <Icon className={`h-5 w-5 ${
                                  feature.enabled ? 'text-green-400' : isLocked ? 'text-yellow-400' : 'text-slate-400'
                                }`} />
                              </div>
                              <div className="flex items-center gap-2">
                                {feature.pro && (
                                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                    PRO
                                  </Badge>
                                )}
                                {feature.enabled && (
                                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                                    ACTIVE
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardTitle className="text-white text-lg">{feature.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {feature.category}
                              </Badge>
                              
                              {isLocked ? (
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-to-r from-yellow-600/80 to-orange-600/80 hover:from-yellow-600 hover:to-orange-600"
                                  onClick={() => toggleFeature(feature.id)}
                                >
                                  <Lock className="mr-2 h-3 w-3" />
                                  Upgrade
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Switch 
                                    checked={feature.enabled}
                                    onCheckedChange={() => toggleFeature(feature.id)}
                                  />
                                  <span className="text-xs text-slate-400">
                                    {feature.enabled ? 'ON' : 'OFF'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Upgrade Dialog */}
        <UpgradeDialog 
          open={showUpgradeDialog} 
          onOpenChange={setShowUpgradeDialog}
        />
      </div>
    </div>
  );
}