
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { Users, Package, TrendingUp, DollarSign, ShoppingCart, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

const CHART_COLORS = ['hsl(220, 70%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(30, 80%, 55%)', 'hsl(280, 65%, 60%)', 'hsl(340, 75%, 55%)', 'hsl(200, 70%, 50%)'];

const Dashboard = () => {
  const { customers, products, orders, payments } = useData();

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalOutstanding = customers.reduce((sum, customer) => sum + (customer.outstandingBalance || 0), 0);

  // Sales trend data (last 30 days)
  const salesTrendData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    return last30Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayOrders = orders.filter(o => o.date?.startsWith(dateStr));
      const dayPayments = payments.filter(p => p.date?.startsWith(dateStr));
      const revenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      const orderAmount = dayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

      return {
        date: format(day, 'dd MMM'),
        revenue,
        orders: orderAmount,
        count: dayOrders.length
      };
    });
  }, [orders, payments]);

  // Top customers by payment
  const topCustomersData = useMemo(() => {
    const customerPayments: Record<string, number> = {};
    payments.forEach(p => {
      const customer = customers.find(c => c.id === p.customerId);
      const name = customer?.name || 'Unknown';
      customerPayments[name] = (customerPayments[name] || 0) + p.amount;
    });

    return Object.entries(customerPayments)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, amount]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, amount }));
  }, [payments, customers]);

  // Product distribution (orders by product)
  const productDistribution = useMemo(() => {
    const productCounts: Record<string, number> = {};
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        const name = item.productName || 'Unknown';
        productCounts[name] = (productCounts[name] || 0) + (item.quantity || 1);
      });
    });

    return Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, value }));
  }, [orders]);

  // Payment method breakdown
  const paymentMethodData = useMemo(() => {
    const methods: Record<string, number> = {};
    payments.forEach(p => {
      const method = p.method || p.paymentMethod || 'Cash';
      methods[method] = (methods[method] || 0) + p.amount;
    });
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [payments]);

  // Order status breakdown
  const orderStatusData = useMemo(() => {
    const statuses: Record<string, number> = {};
    orders.forEach(o => {
      const status = o.status || 'unknown';
      statuses[status] = (statuses[status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [orders]);

  const stats = [
    { title: 'Total Customers', value: customers.length, icon: Users, description: 'Active customers', trend: '+5%', up: true },
    { title: 'Total Products', value: products.length, icon: Package, description: 'Products in catalog', trend: '+2%', up: true },
    { title: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: DollarSign, description: 'Total payments received', trend: '+12%', up: true },
    { title: 'Pending Orders', value: pendingOrders, icon: ShoppingCart, description: 'Orders to process', trend: pendingOrders > 0 ? `${pendingOrders} active` : 'None', up: false },
    { title: 'Completed Orders', value: completedOrders, icon: TrendingUp, description: 'Orders completed', trend: '+8%', up: true },
    { title: 'Outstanding', value: `₹${totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: FileText, description: 'Amount pending', trend: totalOutstanding > 0 ? 'Due' : 'Clear', up: false },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-card p-3 shadow-md">
          <p className="text-sm font-medium text-card-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Vikas Milk Centre Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-orange-500" />
                )}
                <p className={`text-xs ${stat.up ? 'text-green-500' : 'text-orange-500'}`}>{stat.trend}</p>
                <span className="text-xs text-muted-foreground ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
          <CardDescription>Revenue and order amounts over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(220, 70%, 50%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="hsl(160, 60%, 45%)" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>By total payment amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {topCustomersData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCustomersData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" name="Amount" fill="hsl(220, 70%, 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No payment data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>Order quantity by product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {productDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={productDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {productDistribution.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No order data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={5}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {paymentMethodData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No payment data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
            <CardDescription>Current order breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                      {orderStatusData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No order data yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer?.name || 'Unknown Customer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.date ? format(new Date(order.date), 'dd MMM yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(order.amount || 0).toFixed(2)}</p>
                      <p className={`text-sm ${
                        order.status === 'completed' ? 'text-green-500' : 
                        order.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map(payment => {
                const customer = customers.find(c => c.id === payment.customerId);
                return (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer?.name || 'Unknown Customer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.date ? format(new Date(payment.date), 'dd MMM yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">₹{payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{payment.method || payment.paymentMethod}</p>
                    </div>
                  </div>
                );
              })}
              {payments.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No payments yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
