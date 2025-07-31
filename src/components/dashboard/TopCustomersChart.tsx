
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useData } from '@/contexts/data/DataContext';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export default function TopCustomersChart() {
  const { customers, orders } = useData();

  // Calculate customer spending data
  const customerSpending = customers.map(customer => {
    const totalSpent = orders
      .filter(order => order.customerId === customer.id)
      .reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      name: customer.name.length > 20 ? customer.name.substring(0, 20) + '...' : customer.name,
      value: totalSpent,
      orders: orders.filter(order => order.customerId === customer.id).length
    };
  }).filter(customer => customer.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">Revenue: ₹{data.value.toFixed(2)}</p>
          <p className="text-gray-600">Orders: {data.orders}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers by Revenue</CardTitle>
        <CardDescription>Highest spending customers based on total order value</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={customerSpending}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {customerSpending.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
