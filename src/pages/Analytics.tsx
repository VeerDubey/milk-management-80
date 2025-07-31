
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Zap, Brain, AlertTriangle } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';

export default function Analytics() {
  const { orders, customers, products, payments } = useData();
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('revenue');

  const getAnalyticsData = () => {
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    const filteredOrders = orders.filter(order => new Date(order.date) >= startDate);
    const filteredPayments = payments.filter(payment => new Date(payment.date) >= startDate);
    
    return {
      orders: filteredOrders,
      payments: filteredPayments,
      revenue: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      orderCount: filteredOrders.length,
      customerCount: new Set(filteredOrders.map(order => order.customerId)).size,
      avgOrderValue: filteredOrders.length > 0 ? filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0) / filteredOrders.length : 0
    };
  };

  const getGrowthMetrics = () => {
    const current = getAnalyticsData();
    const prevStart = new Date(new Date().getTime() - (timeRange === '7d' ? 14 : timeRange === '30d' ? 60 : 180) * 24 * 60 * 60 * 1000);
    const prevEnd = new Date(new Date().getTime() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000);
    
    const prevOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= prevStart && orderDate <= prevEnd;
    });
    
    const prevRevenue = prevOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const prevOrderCount = prevOrders.length;
    const prevCustomerCount = new Set(prevOrders.map(order => order.customerId)).size;
    
    return {
      revenueGrowth: prevRevenue > 0 ? ((current.revenue - prevRevenue) / prevRevenue) * 100 : 0,
      orderGrowth: prevOrderCount > 0 ? ((current.orderCount - prevOrderCount) / prevOrderCount) * 100 : 0,
      customerGrowth: prevCustomerCount > 0 ? ((current.customerCount - prevCustomerCount) / prevCustomerCount) * 100 : 0
    };
  };

  const getTrendData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(order => 
        new Date(order.date).toDateString() === date.toDateString()
      );
      
      data.push({
        date: date.toLocaleDateString(),
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: dayOrders.length,
        customers: new Set(dayOrders.map(order => order.customerId)).size
      });
    }
    
    return data;
  };

  const getProductPerformance = () => {
    const productStats = new Map();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const existing = productStats.get(product.id) || {
            name: product.name,
            sales: 0,
            revenue: 0,
            quantity: 0
          };
          existing.sales += 1;
          existing.revenue += item.total || (item.quantity * (item.price || item.unitPrice || 0));
          existing.quantity += item.quantity;
          productStats.set(product.id, existing);
        }
      });
    });
    
    return Array.from(productStats.values()).sort((a, b) => b.revenue - a.revenue);
  };

  const getCustomerSegments = () => {
    const customerStats = new Map();
    
    orders.forEach(order => {
      const existing = customerStats.get(order.customerId) || {
        orders: 0,
        revenue: 0,
        lastOrder: new Date(order.date)
      };
      existing.orders += 1;
      existing.revenue += order.total || 0;
      if (new Date(order.date) > existing.lastOrder) {
        existing.lastOrder = new Date(order.date);
      }
      customerStats.set(order.customerId, existing);
    });
    
    const segments = {
      vip: 0,      // >10 orders or >5000 revenue
      regular: 0,  // 5-10 orders or 2000-5000 revenue
      occasional: 0, // 2-4 orders or 500-2000 revenue
      new: 0       // 1 order or <500 revenue
    };
    
    customerStats.forEach(stats => {
      if (stats.orders > 10 || stats.revenue > 5000) {
        segments.vip++;
      } else if (stats.orders >= 5 || stats.revenue >= 2000) {
        segments.regular++;
      } else if (stats.orders >= 2 || stats.revenue >= 500) {
        segments.occasional++;
      } else {
        segments.new++;
      }
    });
    
    return segments;
  };

  const current = getAnalyticsData();
  const growth = getGrowthMetrics();
  const trendData = getTrendData();
  const productPerformance = getProductPerformance();
  const customerSegments = getCustomerSegments();

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-300 mt-2">Advanced business intelligence and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{current.revenue.toFixed(2)}</div>
            <div className="flex items-center mt-2">
              {growth.revenueGrowth >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={`text-sm ${growth.revenueGrowth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {growth.revenueGrowth >= 0 ? '+' : ''}{growth.revenueGrowth.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{current.orderCount}</div>
            <div className="flex items-center mt-2">
              {growth.orderGrowth >= 0 ? (
                <TrendingUp className="w-4 h-4 text-blue-400 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={`text-sm ${growth.orderGrowth >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
                {growth.orderGrowth >= 0 ? '+' : ''}{growth.orderGrowth.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{current.customerCount}</div>
            <div className="flex items-center mt-2">
              {growth.customerGrowth >= 0 ? (
                <TrendingUp className="w-4 h-4 text-purple-400 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={`text-sm ${growth.customerGrowth >= 0 ? 'text-purple-300' : 'text-red-300'}`}>
                {growth.customerGrowth >= 0 ? '+' : ''}{growth.customerGrowth.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Avg Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{current.avgOrderValue.toFixed(2)}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-300 text-sm">+5.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Performance Trends
          </CardTitle>
          <CardDescription className="text-slate-300">
            {metric.charAt(0).toUpperCase() + metric.slice(1)} trend over {timeRange}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Customer Segments</CardTitle>
            <CardDescription className="text-slate-300">
              Customer classification by behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">VIP Customers</span>
                <Badge className="bg-purple-600 text-white">{customerSegments.vip}</Badge>
              </div>
              <Progress value={(customerSegments.vip / customers.length) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Regular Customers</span>
                <Badge className="bg-blue-600 text-white">{customerSegments.regular}</Badge>
              </div>
              <Progress value={(customerSegments.regular / customers.length) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Occasional Customers</span>
                <Badge className="bg-green-600 text-white">{customerSegments.occasional}</Badge>
              </div>
              <Progress value={(customerSegments.occasional / customers.length) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">New Customers</span>
                <Badge className="bg-yellow-600 text-white">{customerSegments.new}</Badge>
              </div>
              <Progress value={(customerSegments.new / customers.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Product Performance</CardTitle>
            <CardDescription className="text-slate-300">
              Top performing products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productPerformance.slice(0, 5).map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-slate-400 text-sm">{product.quantity} units</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">₹{product.revenue.toFixed(2)}</div>
                    <div className="text-slate-400 text-sm">{product.sales} sales</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <h3 className="font-semibold text-blue-400 mb-2">Revenue Insight</h3>
              <p className="text-slate-300 text-sm">
                {growth.revenueGrowth >= 0 
                  ? `Revenue is growing by ${growth.revenueGrowth.toFixed(1)}%. Continue current strategies.`
                  : `Revenue declined by ${Math.abs(growth.revenueGrowth).toFixed(1)}%. Consider promotional campaigns.`
                }
              </p>
            </div>
            
            <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-2">Customer Insight</h3>
              <p className="text-slate-300 text-sm">
                You have {customerSegments.vip} VIP customers generating high revenue. Focus on retention strategies.
              </p>
            </div>
            
            <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">Product Insight</h3>
              <p className="text-slate-300 text-sm">
                {productPerformance[0]?.name} is your top performer. Consider promoting similar products.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
              <h3 className="font-semibold text-yellow-400 mb-2">Order Insight</h3>
              <p className="text-slate-300 text-sm">
                Average order value is ₹{current.avgOrderValue.toFixed(2)}. Consider bundling to increase AOV.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
