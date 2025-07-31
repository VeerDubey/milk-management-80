import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target,
  BarChart3,
  Lightbulb,
  Activity,
  Settings
} from 'lucide-react';

export default function AIAnalytics() {
  const [aiStatus] = useState({
    status: 'online',
    model: 'v2.4',
    confidence: 94
  });

  const [insights] = useState([
    {
      id: 1,
      type: 'sales',
      title: 'Sales spike at 7-9 AM and 5-7 PM daily',
      confidence: 94,
      priority: 'high',
      recommendation: 'Increase inventory during peak hours',
      icon: TrendingUp
    },
    {
      id: 2,
      type: 'inventory',
      title: 'GGH milk likely to run out in 2 days',
      confidence: 87,
      priority: 'medium',
      recommendation: 'Order 50 units by tomorrow',
      icon: Target
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Analytics Hub
            </h1>
            <p className="text-slate-600 mt-2">Intelligent insights powered by machine learning</p>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Brain className="mr-2 h-4 w-4" />
            Run AI Analysis
          </Button>
        </div>

        {/* AI Engine Status */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">AI Engine Status</h3>
                  <p className="text-slate-600">Neural networks active and learning</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Activity className="mr-1 h-3 w-3" />
                  Online
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-800">
                  Model {aiStatus.model}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Content */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-0">
            <Tabs defaultValue="insights" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                  <TabsTrigger value="insights" className="data-[state=active]:bg-white">
                    Smart Insights
                  </TabsTrigger>
                  <TabsTrigger value="predictions" className="data-[state=active]:bg-white">
                    Predictions
                  </TabsTrigger>
                  <TabsTrigger value="optimization" className="data-[state=active]:bg-white">
                    Optimization
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="data-[state=active]:bg-white">
                    AI Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="insights" className="p-6 pt-4">
                <div className="space-y-6">
                  {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                      <div key={insight.id} className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-medium text-slate-900">{insight.title}</h3>
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="bg-slate-900 text-white">
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">AI Recommendation:</span>
                              </div>
                              <p className="text-blue-800">{insight.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="p-6 pt-4">
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Demand Predictions</h3>
                  <p className="text-slate-600 mb-6">AI-powered forecasting for inventory and sales</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Predictions
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="optimization" className="p-6 pt-4">
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Price Optimization</h3>
                  <p className="text-slate-600 mb-6">Optimize pricing strategies using market data</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Settings className="mr-2 h-4 w-4" />
                    Run Optimization
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="p-6 pt-4">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">AI Reports</h3>
                  <p className="text-slate-600 mb-6">Comprehensive analytics and business intelligence</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}