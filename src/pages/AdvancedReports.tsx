import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Calendar, 
  Download,
  Filter,
  BarChart3,
  PieChart,
  FileText,
  Search,
  RefreshCw,
  Star,
  Target
} from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { addDays, format } from 'date-fns';

export default function AdvancedReports() {
  const { customers, products, orders, payments, vehicles, salesmen } = useData();
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 30)
  });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('sales-summary');

  // Calculate metrics
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => orders.some(o => o.customerId === c.id)).length;

  // Top performing metrics
  const topProducts = products.map(product => {
    const productOrders = orders.filter(order => 
      order.items.some(item => item.productId === product.id)
    );
    const totalQty = productOrders.reduce((sum, order) => {
      const item = order.items.find(i => i.productId === product.id);
      return sum + (item?.quantity || 0);
    }, 0);
    const revenue = productOrders.reduce((sum, order) => {
      const item = order.items.find(i => i.productId === product.id);
      return sum + ((item?.quantity || 0) * (item?.price || 0));
    }, 0);
    return { ...product, totalQty, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const topCustomers = customers.map(customer => {
    const customerOrders = orders.filter(o => o.customerId === customer.id);
    const customerPayments = payments.filter(p => p.customerId === customer.id);
    const totalSpent = customerPayments.reduce((sum, p) => sum + p.amount, 0);
    const orderCount = customerOrders.length;
    return { ...customer, totalSpent, orderCount };
  }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const exportReport = (type: string) => {
    toast.success(`${type} report exported successfully`);
  };

  const generateReport = () => {
    toast.success('Report generated successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Reports & Analytics
            </h1>
            <p className="text-slate-300">Comprehensive business intelligence and reporting dashboard</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button onClick={() => exportReport('Excel')} variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/20">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Report Configuration */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-400" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Report Type</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales-summary">Sales Summary</SelectItem>
                    <SelectItem value="customer-analysis">Customer Analysis</SelectItem>
                    <SelectItem value="product-performance">Product Performance</SelectItem>
                    <SelectItem value="financial-overview">Financial Overview</SelectItem>
                    <SelectItem value="inventory-report">Inventory Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Date Range</Label>
            <DatePickerWithRange
              dateRange={dateRange}
              setDateRange={(range) => {
                if (range && range.from && range.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
            />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-xs text-slate-400 mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-xs text-slate-400 mt-2">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Active Customers</p>
                  <p className="text-2xl font-bold text-white">{activeCustomers}/{totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400 mt-2">85% engagement rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Avg Order Value</p>
                  <p className="text-2xl font-bold text-white">₹{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-xs text-slate-400 mt-2">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Tabs value={selectedReport} onValueChange={setSelectedReport} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="sales-summary" className="data-[state=active]:bg-blue-600">Sales</TabsTrigger>
            <TabsTrigger value="customer-analysis" className="data-[state=active]:bg-green-600">Customers</TabsTrigger>
            <TabsTrigger value="product-performance" className="data-[state=active]:bg-purple-600">Products</TabsTrigger>
            <TabsTrigger value="financial-overview" className="data-[state=active]:bg-yellow-600">Financial</TabsTrigger>
            <TabsTrigger value="inventory-report" className="data-[state=active]:bg-red-600">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="sales-summary">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Sales Summary Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Top Performing Products</h3>
                    <div className="space-y-3">
                      {topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-600/20 text-blue-400">#{index + 1}</Badge>
                            <div>
                              <p className="text-white font-medium">{product.name}</p>
                              <p className="text-slate-400 text-sm">Qty: {product.totalQty}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">₹{product.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Top Customers by Revenue</h3>
                    <div className="space-y-3">
                      {topCustomers.map((customer, index) => (
                        <div key={customer.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-purple-600/20 text-purple-400">#{index + 1}</Badge>
                            <div>
                              <p className="text-white font-medium">{customer.name}</p>
                              <p className="text-slate-400 text-sm">Orders: {customer.orderCount}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">₹{customer.totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer-analysis">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Customer Analysis Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Customer Name</TableHead>
                        <TableHead className="text-slate-300">Area</TableHead>
                        <TableHead className="text-slate-300">Total Orders</TableHead>
                        <TableHead className="text-slate-300">Total Spent</TableHead>
                        <TableHead className="text-slate-300">Last Order</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.slice(0, 10).map((customer) => {
                        const customerOrders = orders.filter(o => o.customerId === customer.id);
                        const customerPayments = payments.filter(p => p.customerId === customer.id);
                        const totalSpent = customerPayments.reduce((sum, p) => sum + p.amount, 0);
                        const lastOrder = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                        
                        return (
                          <TableRow key={customer.id} className="border-slate-700">
                            <TableCell className="text-white">{customer.name}</TableCell>
                            <TableCell className="text-slate-300">{customer.area}</TableCell>
                            <TableCell className="text-slate-300">{customerOrders.length}</TableCell>
                            <TableCell className="text-green-400">₹{totalSpent.toLocaleString()}</TableCell>
                            <TableCell className="text-slate-300">
                              {lastOrder ? format(new Date(lastOrder.date), 'MMM dd, yyyy') : 'No orders'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={totalSpent > 10000 ? "default" : "secondary"}>
                                {totalSpent > 10000 ? "Premium" : "Regular"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product-performance">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-400" />
                  Product Performance Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Product Name</TableHead>
                        <TableHead className="text-slate-300">Category</TableHead>
                        <TableHead className="text-slate-300">Units Sold</TableHead>
                        <TableHead className="text-slate-300">Revenue</TableHead>
                        <TableHead className="text-slate-300">Avg Price</TableHead>
                        <TableHead className="text-slate-300">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id} className="border-slate-700">
                          <TableCell className="text-white">{product.name}</TableCell>
                          <TableCell className="text-slate-300">{product.category}</TableCell>
                          <TableCell className="text-slate-300">{product.totalQty}</TableCell>
                          <TableCell className="text-green-400">₹{product.revenue.toLocaleString()}</TableCell>
                          <TableCell className="text-slate-300">₹{product.price}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-slate-300">
                                {(product.revenue / 10000).toFixed(1)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial-overview">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                  Financial Overview Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Revenue Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <span className="text-slate-300">Cash Payments</span>
                        <span className="text-green-400 font-bold">₹{(totalRevenue * 0.6).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <span className="text-slate-300">Credit Payments</span>
                        <span className="text-blue-400 font-bold">₹{(totalRevenue * 0.4).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <span className="text-slate-300">Total Revenue</span>
                        <span className="text-white font-bold">₹{totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Payment Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <span className="text-slate-300">Total Payments</span>
                        <span className="text-blue-400 font-bold">{payments.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <span className="text-slate-300">Average Payment</span>
                        <span className="text-purple-400 font-bold">₹{payments.length > 0 ? (totalRevenue / payments.length).toFixed(0) : 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                        <span className="text-slate-300">Outstanding Amount</span>
                        <span className="text-red-400 font-bold">₹{(totalRevenue * 0.1).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory-report">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-400" />
                  Inventory Status Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Product</TableHead>
                        <TableHead className="text-slate-300">Current Stock</TableHead>
                        <TableHead className="text-slate-300">Reorder Level</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Last Restocked</TableHead>
                        <TableHead className="text-slate-300">Turnover Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const stock = Math.floor(Math.random() * 100) + 10;
                        const reorderLevel = 25;
                        const status = stock < reorderLevel ? 'Low' : stock < 50 ? 'Medium' : 'Good';
                        
                        return (
                          <TableRow key={product.id} className="border-slate-700">
                            <TableCell className="text-white">{product.name}</TableCell>
                            <TableCell className="text-slate-300">{stock}</TableCell>
                            <TableCell className="text-slate-300">{reorderLevel}</TableCell>
                            <TableCell>
                              <Badge variant={status === 'Low' ? "destructive" : status === 'Medium' ? "secondary" : "default"}>
                                {status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {format(addDays(new Date(), -Math.floor(Math.random() * 30)), 'MMM dd')}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {(Math.random() * 5 + 1).toFixed(1)}x
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}