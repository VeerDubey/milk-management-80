import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Users, 
  Package,
  DollarSign,
  Activity,
  Zap
} from 'lucide-react';

export function AIAnalyticsPanel() {
  const [activeInsight, setActiveInsight] = useState('demand');

  const insights = [
    {
      id: 'demand',
      title: 'Demand Prediction',
      description: 'AI-powered demand forecasting for your products',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      data: {
        accuracy: '94.2%',
        nextWeek: '+12% demand increase predicted',
        topProducts: ['Milk 500ml', 'Curd 250g', 'Butter 100g']
      }
    },
    {
      id: 'customer',
      title: 'Customer Insights',
      description: 'Deep customer behavior analysis and segmentation',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      data: {
        segments: 4,
        highValue: '23% of customers',
        churnRisk: '8 customers at risk'
      }
    },
    {
      id: 'pricing',
      title: 'Price Optimization',
      description: 'Dynamic pricing recommendations based on market conditions',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      data: {
        opportunities: 12,
        revenue: '+₹2,400 potential increase',
        products: ['Premium Milk', 'Organic Curd']
      }
    },
    {
      id: 'inventory',
      title: 'Smart Inventory',
      description: 'Intelligent stock management and reorder predictions',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      data: {
        reorders: 5,
        stockouts: '0 predicted next week',
        savings: '₹1,200 in reduced waste'
      }
    }
  ];

  const currentInsight = insights.find(i => i.id === activeInsight);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-blue-400" />
          AI Analytics Suite
        </h2>
        <p className="text-slate-300">Advanced machine learning insights for your business</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const isActive = activeInsight === insight.id;
          
          return (
            <Card 
              key={insight.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isActive ? 'ring-2 ring-blue-500/50 bg-blue-900/20' : 'bg-slate-900/50'
              } border-slate-700/50`}
              onClick={() => setActiveInsight(insight.id)}
            >
              <CardHeader className="pb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${insight.color} w-fit`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">{insight.description}</p>
                {isActive && (
                  <Badge className="mt-2 bg-blue-600/20 text-blue-400 border-blue-500/30">
                    Active View
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      {currentInsight && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${currentInsight.color}`}>
                  <currentInsight.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">{currentInsight.title}</CardTitle>
                  <p className="text-slate-400">{currentInsight.description}</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Zap className="mr-2 h-4 w-4" />
                Run Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Key Metrics</h4>
                {Object.entries(currentInsight.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-medium">
                      {Array.isArray(value) ? `${value.length} items` : value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visualization Placeholder */}
              <div className="md:col-span-2">
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">AI Analytics Visualization</p>
                    <p className="text-slate-500 text-sm">Charts and insights will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Export Report
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Schedule Analysis
              </Button>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                Apply Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Status */}
      <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Engine Status</h3>
                <p className="text-slate-300">Machine learning models are active and learning</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online & Processing</span>
              </div>
              <p className="text-slate-400 text-sm">Last updated: 2 minutes ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}