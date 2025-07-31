
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { Users, Package, TrendingUp, DollarSign, ShoppingCart, FileText } from 'lucide-react';

const Dashboard = () => {
  const { customers, products, orders, payments } = useData();

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalOutstanding = customers.reduce((sum, customer) => sum + (customer.outstandingBalance || 0), 0);

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      description: 'Active customers',
      color: 'text-blue-600'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      description: 'Products in catalog',
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total payments received',
      color: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: ShoppingCart,
      description: 'Orders to process',
      color: 'text-orange-600'
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: TrendingUp,
      description: 'Orders completed',
      color: 'text-emerald-600'
    },
    {
      title: 'Outstanding',
      value: `₹${totalOutstanding.toFixed(2)}`,
      icon: FileText,
      description: 'Amount pending',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Vikas Milk Centre Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.amount.toFixed(2)}</p>
                      <p className={`text-sm ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                );
              })}
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
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">₹{payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{payment.method}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
