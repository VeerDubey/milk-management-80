
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/contexts/data/DataContext';

export default function TopProductsChart() {
  const { products, orders } = useData();

  // Calculate product sales data
  const productSales = products.map(product => {
    const totalSold = orders.reduce((sum, order) => {
      const orderItems = order.items?.filter(item => item.productId === product.id) || [];
      return sum + orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const totalRevenue = orders.reduce((sum, order) => {
      const orderItems = order.items?.filter(item => item.productId === product.id) || [];
      return sum + orderItems.reduce((itemSum, item) => itemSum + (item.quantity * item.unitPrice), 0);
    }, 0);

    return {
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      sold: totalSold,
      revenue: totalRevenue
    };
  }).sort((a, b) => b.sold - a.sold).slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Quantity Sold</CardTitle>
        <CardDescription>Most popular products based on total quantity sold</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productSales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'sold' ? `${value} units` : `₹${typeof value === 'number' ? value.toFixed(2) : value}`,
                name === 'sold' ? 'Quantity Sold' : 'Revenue'
              ]}
            />
            <Bar dataKey="sold" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
