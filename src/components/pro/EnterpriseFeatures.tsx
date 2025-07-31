import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Globe, 
  Users, 
  Smartphone,
  Palette,
  Cloud,
  Database,
  Network,
  Crown,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';

export function EnterpriseFeatures() {
  const [activeFeature, setActiveFeature] = useState('multi-company');

  const enterpriseFeatures = [
    {
      id: 'multi-company',
      title: 'Multi-Company Management',
      description: 'Manage unlimited companies from a single dashboard',
      icon: Building,
      status: 'premium',
      benefits: [
        'Centralized management dashboard',
        'Cross-company reporting',
        'Shared resources and templates',
        'Unified user management'
      ]
    },
    {
      id: 'white-label',
      title: 'White Label Solution',
      description: 'Complete customization and branding capabilities',
      icon: Palette,
      status: 'premium',
      benefits: [
        'Custom branding and logos',
        'Personalized color schemes',
        'Custom domain hosting',
        'Branded mobile applications'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Native Mobile Apps',
      description: 'iOS and Android applications for your business',
      icon: Smartphone,
      status: 'available',
      benefits: [
        'Native iOS and Android apps',
        'Offline functionality',
        'Push notifications',
        'Real-time synchronization'
      ]
    },
    {
      id: 'api-integration',
      title: 'API Integration Hub',
      description: 'Connect with third-party systems and services',
      icon: Network,
      status: 'premium',
      benefits: [
        'RESTful API access',
        'Webhook integrations',
        'Custom connectors',
        'Real-time data sync'
      ]
    },
    {
      id: 'cloud-infrastructure',
      title: 'Enterprise Cloud',
      description: 'Scalable cloud infrastructure with advanced features',
      icon: Cloud,
      status: 'premium',
      benefits: [
        'Auto-scaling infrastructure',
        '99.9% uptime guarantee',
        'Global CDN distribution',
        'Advanced backup systems'
      ]
    },
    {
      id: 'advanced-analytics',
      title: 'Business Intelligence',
      description: 'Advanced analytics and predictive insights',
      icon: Star,
      status: 'available',
      benefits: [
        'Custom dashboards',
        'Predictive analytics',
        'Advanced reporting',
        'Data visualization'
      ]
    }
  ];

  const currentFeature = enterpriseFeatures.find(f => f.id === activeFeature);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-orange-400" />
          Enterprise Features
        </h2>
        <p className="text-slate-300">Enterprise-grade capabilities for large-scale operations</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enterpriseFeatures.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          const isPremium = feature.status === 'premium';
          
          return (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isActive ? 'ring-2 ring-orange-500/50 bg-orange-900/20' : 'bg-slate-900/50'
              } border-slate-700/50`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        PREMIUM
                      </Badge>
                    )}
                    {feature.status === 'available' && (
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                        AVAILABLE
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">{feature.description}</p>
                {isActive && (
                  <Badge className="mt-2 bg-orange-600/20 text-orange-400 border-orange-500/30">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Feature View */}
      {currentFeature && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <currentFeature.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">{currentFeature.title}</CardTitle>
                  <p className="text-slate-400">{currentFeature.description}</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-orange-600 to-red-600">
                {currentFeature.status === 'premium' ? 'Upgrade to Access' : 'Get Started'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Benefits */}
              <div>
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-400" />
                  Key Benefits
                </h4>
                <ul className="space-y-3">
                  {currentFeature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-300">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature Preview */}
              <div>
                <h4 className="text-white font-semibold mb-4">Feature Preview</h4>
                <div className="h-40 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                  <div className="text-center">
                    <currentFeature.icon className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">Feature demonstration</p>
                    <p className="text-slate-500 text-sm">Interactive preview coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Learn More
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                View Documentation
              </Button>
              {currentFeature.status === 'available' && (
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Zap className="mr-2 h-4 w-4" />
                  Enable Feature
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enterprise Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">Unlimited Users</h3>
            <p className="text-slate-300">Scale your team without limits</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">Unlimited Storage</h3>
            <p className="text-slate-300">Store all your business data</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 text-orange-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">Global Deployment</h3>
            <p className="text-slate-300">Worldwide infrastructure</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Enterprise Sales */}
      <Card className="bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 border-orange-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ready for Enterprise?</h3>
                <p className="text-slate-300">Contact our enterprise team for custom solutions and pricing</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Schedule Demo
              </Button>
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Users className="mr-2 h-4 w-4" />
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}