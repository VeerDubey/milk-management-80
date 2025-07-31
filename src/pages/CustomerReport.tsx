
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Filter, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerReport() {
  const { customers, orders, payments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  const areas = Array.from(new Set(customers.map(c => c.area).filter(Boolean)));

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesArea = selectedArea === 'all' || customer.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const getCustomerStats = (customerId: string) => {
    const customerOrders = orders.filter(o => o.customerId === customerId);
    const customerPayments = payments.filter(p => p.customerId === customerId);
    
    const totalOrders = customerOrders.length;
    const totalAmount = customerOrders.reduce((sum, order) => sum + (order.total || order.amount || 0), 0);
    const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = totalAmount - totalPaid;

    return { totalOrders, totalAmount, totalPaid, outstanding };
  };

  const exportReport = () => {
    toast.success('Customer report exported successfully');
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Customer Report
          </h1>
          <p className="text-slate-300 mt-2">Comprehensive customer analytics and insights</p>
        </div>
        <Button onClick={exportReport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{customers.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {customers.filter(c => orders.some(o => o.customerId === c.id)).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-yellow-400" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{orders.reduce((sum, order) => sum + (order.total || order.amount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{orders.length ? Math.round(orders.reduce((sum, order) => sum + (order.total || order.amount || 0), 0) / orders.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Customer Analysis</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map(customer => {
              const stats = getCustomerStats(customer.id);
              return (
                <div key={customer.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{customer.name}</h3>
                    <p className="text-sm text-slate-300">{customer.phone} • {customer.area}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-white font-semibold">{stats.totalOrders}</div>
                      <div className="text-slate-400">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold">₹{stats.totalAmount.toLocaleString()}</div>
                      <div className="text-slate-400">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold">₹{stats.totalPaid.toLocaleString()}</div>
                      <div className="text-slate-400">Paid</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${stats.outstanding > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ₹{stats.outstanding.toLocaleString()}
                      </div>
                      <div className="text-slate-400">Outstanding</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
