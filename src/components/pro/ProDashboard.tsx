import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Zap,
  Crown,
  Star,
  Lock,
  CheckCircle
} from 'lucide-react';

interface ProFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'available' | 'premium' | 'coming-soon';
  category: string;
}

interface ProDashboardProps {
  features: ProFeature[];
}

export function ProDashboard({ features }: ProDashboardProps) {
  const stats = [
    {
      title: 'Active Features',
      value: features.filter(f => f.status === 'available').length,
      total: features.length,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      title: 'Premium Features',
      value: features.filter(f => f.status === 'premium').length,
      total: features.length,
      icon: Crown,
      color: 'text-yellow-400'
    },
    {
      title: 'AI Capabilities',
      value: features.filter(f => f.category === 'AI & ML').length,
      total: features.length,
      icon: Star,
      color: 'text-blue-400'
    },
    {
      title: 'Security Features',
      value: features.filter(f => f.category === 'Security').length,
      total: features.length,
      icon: Shield,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}/{stat.total}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isAvailable = feature.status === 'available';
          const isPremium = feature.status === 'premium';
          
          return (
            <Card 
              key={feature.id} 
              className={`bg-slate-900/50 border-slate-700/50 transition-all duration-300 hover:scale-105 ${
                isAvailable ? 'ring-2 ring-green-500/30' : isPremium ? 'ring-2 ring-yellow-500/30' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${
                    isAvailable ? 'bg-green-600/20' : isPremium ? 'bg-yellow-600/20' : 'bg-slate-800/50'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isAvailable ? 'text-green-400' : isPremium ? 'text-yellow-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {feature.category}
                    </Badge>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        PRO
                      </Badge>
                    )}
                    {isAvailable && (
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                
                {isPremium && (
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-yellow-600/80 to-orange-600/80 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Lock className="mr-2 h-3 w-3" />
                    Upgrade to Access
                  </Button>
                )}
                
                {isAvailable && (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Feature Active & Ready
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Boost Your Performance</h3>
                <p className="text-slate-300">Unlock advanced analytics and automation tools</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                View Documentation
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Zap className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}