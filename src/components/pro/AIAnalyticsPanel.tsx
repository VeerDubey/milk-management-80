import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Package,
  BarChart3,
  Zap,
  Target,
  DollarSign
} from 'lucide-react';
import { AIAnalyticsService } from '@/services/pro/AIAnalyticsService';
import { ProLicenseService } from '@/services/pro/ProLicenseService';

export function AIAnalyticsPanel() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = AIAnalyticsService.getAnalytics();
    setAnalytics(data);
  };

  const generateDemandPrediction = async () => {
    if (!ProLicenseService.hasFeature('ai_predictions')) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock historical data
      const historicalData = [
        { date: '2024-01-01', stock: 100, sold: 25 },
        { date: '2024-01-02', stock: 75, sold: 30 },
        { date: '2024-01-03', stock: 45, sold: 28 },
        { date: '2024-01-04', stock: 17, sold: 15 },
      ];

      await AIAnalyticsService.generateDemandPrediction('product_milk_500ml', historicalData);
      loadAnalytics();
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const optimizePrice = async () => {
    if (!ProLicenseService.hasFeature('price_optimization')) {
      return;
    }

    setIsLoading(true);
    try {
      const marketData = {
        currentPrice: 50,
        competitorPrices: [48, 52, 49],
        demandHistory: [100, 95, 110, 105]
      };

      await AIAnalyticsService.optimizePrice('product_milk_500ml', marketData);
      loadAnalytics();
    } catch (error) {
      console.error('Error optimizing price:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const segmentCustomers = async () => {
    if (!ProLicenseService.hasFeature('customer_segmentation')) {
      return;
    }

    setIsLoading(true);
    try {
      // Mock customer data
      const customers = [
        { id: 'c1', totalPurchases: 15000, daysSinceLastOrder: 5 },
        { id: 'c2', totalPurchases: 5000, daysSinceLastOrder: 15 },
        { id: 'c3', totalPurchases: 500, daysSinceLastOrder: 120 },
        { id: 'c4', totalPurchases: 25000, daysSinceLastOrder: 2 },
      ];

      await AIAnalyticsService.segmentCustomers(customers);
      loadAnalytics();
    } catch (error) {
      console.error('Error segmenting customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const insights = [
    {
      icon: TrendingUp,
      title: 'Demand Forecast',
      description: 'Predict product demand with 85% accuracy',
      action: generateDemandPrediction,
      feature: 'ai_predictions'
    },
    {
      icon: DollarSign,
      title: 'Price Optimization',
      description: 'AI-powered pricing recommendations',
      action: optimizePrice,
      feature: 'price_optimization'
    },
    {
      icon: Users,
      title: 'Customer Segmentation',
      description: 'Automatically group customers by behavior',
      action: segmentCustomers,
      feature: 'customer_segmentation'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            AI Analytics
          </h2>
          <p className="text-slate-400">Advanced machine learning insights</p>
        </div>
        <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
          AI Powered
        </Badge>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const hasAccess = ProLicenseService.hasFeature(insight.feature);
          
          return (
            <Card key={index} className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={hasAccess ? 'h-5 w-5 text-blue-400' : 'h-5 w-5 text-slate-400'} />
                  {!hasAccess && (
                    <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                      PRO
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">{insight.description}</p>
                <Button 
                  onClick={insight.action}
                  disabled={!hasAccess || isLoading}
                  className={hasAccess 
                    ? "w-full bg-blue-600 hover:bg-blue-700" 
                    : "w-full bg-slate-700 text-slate-400 cursor-not-allowed"
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : hasAccess ? (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  ) : (
                    'Upgrade Required'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Results */}
      {analytics.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              Recent AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${
                        item.type === 'demand_prediction' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' :
                        item.type === 'price_optimization' ? 'bg-green-600/20 text-green-400 border-green-500/30' :
                        'bg-purple-600/20 text-purple-400 border-purple-500/30'
                      }`}>
                        {item.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-slate-400 text-xs">
                        Confidence: {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      {item.insights.map((insight: string, idx: number) => (
                        <p key={idx} className="text-slate-300 text-sm">• {insight}</p>
                      ))}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}