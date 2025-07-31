
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Download, Calendar, DollarSign, Package, Users } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';

export default function SalesReport() {
  const { orders, customers, products, payments } = useData();
  const [dateRange, setDateRange] = useState<string>('month');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  const getFilteredOrders = () => {
    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      let dateMatch = true;
      
      switch (dateRange) {
        case 'today':
          dateMatch = orderDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateMatch = orderDate >= weekAgo;
          break;
        case 'month':
          dateMatch = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          break;
        case 'quarter':
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          dateMatch = orderDate >= quarterStart;
          break;
      }
      
      const productMatch = !selectedProduct || order.items.some(item => item.productId === selectedProduct);
      const customerMatch = !selectedCustomer || order.customerId === selectedCustomer;
      
      return dateMatch && productMatch && customerMatch;
    });
    
    return filteredOrders;
  };

  const filteredOrders = getFilteredOrders();

  const getSalesStats = () => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalCustomers = new Set(filteredOrders.map(order => order.customerId)).size;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalCustomers
    };
  };

  const getTopProducts = () => {
    const productSales = new Map();
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.productId;
        const product = products.find(p => p.id === productId);
        if (product) {
          const existing = productSales.get(productId) || { name: product.name, quantity: 0, revenue: 0 };
          existing.quantity += item.quantity;
          existing.revenue += item.total || (item.quantity * (item.price || item.unitPrice || 0));
          productSales.set(productId, existing);
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getTopCustomers = () => {
    const customerSales = new Map();
    
    filteredOrders.forEach(order => {
      const customerId = order.customerId;
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        const existing = customerSales.get(customerId) || { name: customer.name, orders: 0, revenue: 0 };
        existing.orders += 1;
        existing.revenue += order.total || 0;
        customerSales.set(customerId, existing);
      }
    });

    return Array.from(customerSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getDailySales = () => {
    const salesByDate = new Map();
    
    filteredOrders.forEach(order => {
      const dateKey = new Date(order.date).toDateString();
      const existing = salesByDate.get(dateKey) || { date: dateKey, revenue: 0, orders: 0 };
      existing.revenue += order.total || 0;
      existing.orders += 1;
      salesByDate.set(dateKey, existing);
    });

    return Array.from(salesByDate.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  };

  const stats = getSalesStats();
  const topProducts = getTopProducts();
  const topCustomers = getTopCustomers();
  const dailySales = getDailySales();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sales Report
          </h1>
          <p className="text-slate-300 mt-2">Comprehensive sales analytics and insights</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Package className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Products</SelectItem>
            {products.map(product => (
              <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Users className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Customers</SelectItem>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{stats.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-300 text-sm">+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-blue-300 text-sm">+8.3% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{stats.avgOrderValue.toFixed(2)}</div>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-300 text-sm">-3.2% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-300 text-sm">+5.7% from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Daily Sales Trend</CardTitle>
            <CardDescription className="text-slate-300">
              Revenue and orders over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySales}>
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
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription className="text-slate-300">
              Best performing products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription className="text-slate-300">
              Best performing products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-slate-400 text-sm">{product.quantity} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">₹{product.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Customers</CardTitle>
            <CardDescription className="text-slate-300">
              Highest revenue generating customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{customer.name}</div>
                      <div className="text-slate-400 text-sm">{customer.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">₹{customer.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
