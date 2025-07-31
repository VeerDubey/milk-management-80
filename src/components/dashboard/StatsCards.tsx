
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Package 
} from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';

export default function StatsCards() {
  const { orders, customers, payments, products } = useData();

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalProducts = products.length;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalPayments.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
