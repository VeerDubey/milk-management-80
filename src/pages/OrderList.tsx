
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, ShoppingCart, Eye, Edit, Truck, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: string[];
  paymentStatus: 'pending' | 'paid' | 'partial';
  area: string;
}

const OrderList = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Rajesh Sharma',
      customerPhone: '9876543210',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      status: 'delivered',
      totalAmount: 350,
      items: ['Full Cream Milk - 5L', 'Curd - 1Kg'],
      paymentStatus: 'paid',
      area: 'Andheri'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Priya Patel',
      customerPhone: '9876543211',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-17',
      status: 'processing',
      totalAmount: 280,
      items: ['Toned Milk - 4L', 'Paneer - 500g'],
      paymentStatus: 'pending',
      area: 'Bandra'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Amit Kumar',
      customerPhone: '9876543212',
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-17',
      status: 'confirmed',
      totalAmount: 450,
      items: ['Buffalo Milk - 3L', 'Full Cream Milk - 3L', 'Curd - 2Kg'],
      paymentStatus: 'partial',
      area: 'Juhu'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Sunita Singh',
      customerPhone: '9876543213',
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-18',
      status: 'pending',
      totalAmount: 200,
      items: ['Double Toned Milk - 4L'],
      paymentStatus: 'pending',
      area: 'Worli'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerPhone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'outline',
      delivered: 'default',
      cancelled: 'destructive'
    };
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      processing: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/50',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    
    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-red-500/20 text-red-400 border-red-500/50',
      paid: 'bg-green-500/20 text-green-400 border-green-500/50',
      partial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    };
    
    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleView = (order: Order) => {
    toast.info(`Viewing order ${order.orderNumber}`);
  };

  const handleEdit = (order: Order) => {
    toast.info(`Editing order ${order.orderNumber}`);
  };

  const handleTrack = (order: Order) => {
    toast.info(`Tracking order ${order.orderNumber}`);
  };

  const todayOrders = orders.filter(order => order.orderDate === new Date().toISOString().split('T')[0]);
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const totalRevenue = orders.filter(order => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-slate-400 mt-2">Track and manage all customer orders</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Today's Orders</p>
                  <p className="text-2xl font-bold text-white">{todayOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-yellow-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Pending Orders</p>
                  <p className="text-2xl font-bold text-white">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by order number, customer name, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px] bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Order List</CardTitle>
            <CardDescription>Showing {filteredOrders.length} of {orders.length} orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Order #</TableHead>
                    <TableHead className="text-slate-300">Customer</TableHead>
                    <TableHead className="text-slate-300">Order Date</TableHead>
                    <TableHead className="text-slate-300">Delivery Date</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Payment</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{order.orderNumber}</div>
                          <div className="text-sm text-slate-400">{order.area}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{order.customerName}</div>
                          <div className="text-sm text-slate-400">{order.customerPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{order.orderDate}</TableCell>
                      <TableCell className="text-slate-300">{order.deliveryDate}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-white font-medium">₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(order)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(order)}
                            className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTrack(order)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderList;
