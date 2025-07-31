
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Save, Percent, TrendingUp } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';

export default function CustomerRates() {
  const { customers, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerRates, setCustomerRates] = useState<Record<string, Record<string, number>>>({});

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  const handleRateChange = (customerId: string, productId: string, rate: number) => {
    setCustomerRates(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [productId]: rate
      }
    }));
  };

  const getCustomerRate = (customerId: string, productId: string) => {
    return customerRates[customerId]?.[productId] || 0;
  };

  const getEffectiveRate = (customerId: string, productId: string) => {
    const customerRate = getCustomerRate(customerId, productId);
    const product = products.find(p => p.id === productId);
    const baseRate = product?.price || 0;
    
    if (customerRate > 0) {
      return customerRate;
    }
    
    return baseRate;
  };

  const saveCustomerRates = () => {
    // In a real app, this would save to backend
    toast.success('Customer rates updated successfully');
  };

  const applyBulkDiscount = (percentage: number) => {
    if (!selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }

    const newRates = { ...customerRates };
    if (!newRates[selectedCustomer]) {
      newRates[selectedCustomer] = {};
    }

    products.forEach(product => {
      const discountedRate = product.price * (1 - percentage / 100);
      newRates[selectedCustomer][product.id] = discountedRate;
    });

    setCustomerRates(newRates);
    toast.success(`Applied ${percentage}% discount to all products`);
  };

  return (
    <div className="neo-noir-bg min-h-screen">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold neo-noir-gradient-text">
              Customer Rates
            </h1>
            <p className="neo-noir-text-muted">
              Manage customer-specific pricing and discounts
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={saveCustomerRates} className="neo-noir-button-accent">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Customer Selection */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text">Customer Selection</CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Select a customer to manage their specific rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="neo-noir-text">Search Customer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 neo-noir-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="neo-noir-text">Select Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="neo-noir-input">
                    <SelectValue placeholder="Choose customer" />
                  </SelectTrigger>
                  <SelectContent className="neo-noir-surface">
                    {filteredCustomers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        <div className="flex items-center gap-2">
                          {customer.name}
                          <Badge variant="outline" className="text-xs">
                            Customer
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedCustomerData && (
          <Card className="neo-noir-card">
            <CardHeader>
              <CardTitle className="neo-noir-text">Quick Actions - {selectedCustomerData.name}</CardTitle>
              <CardDescription className="neo-noir-text-muted">
                Apply bulk discounts or reset rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  onClick={() => applyBulkDiscount(5)}
                  className="neo-noir-button-outline"
                >
                  <Percent className="mr-2 h-4 w-4" />
                  5% Discount
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => applyBulkDiscount(10)}
                  className="neo-noir-button-outline"
                >
                  <Percent className="mr-2 h-4 w-4" />
                  10% Discount
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => applyBulkDiscount(15)}
                  className="neo-noir-button-outline"
                >
                  <Percent className="mr-2 h-4 w-4" />
                  15% Discount
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCustomerRates(prev => ({ ...prev, [selectedCustomer]: {} }))}
                  className="neo-noir-button-outline"
                >
                  Reset All Rates
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rates Table */}
        {selectedCustomerData && (
          <Card className="neo-noir-card">
            <CardHeader>
              <CardTitle className="neo-noir-text">Product Rates</CardTitle>
              <CardDescription className="neo-noir-text-muted">
                Set custom rates for {selectedCustomerData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="neo-noir-table">
                <TableHeader>
                  <TableRow className="neo-noir-table-header">
                    <TableHead>Product</TableHead>
                    <TableHead>Base Rate</TableHead>
                    <TableHead>Customer Rate</TableHead>
                    <TableHead>Effective Rate</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const baseRate = product.price;
                    const customerRate = getCustomerRate(selectedCustomer, product.id);
                    const effectiveRate = getEffectiveRate(selectedCustomer, product.id);
                    const discount = baseRate > 0 ? ((baseRate - effectiveRate) / baseRate * 100) : 0;
                    
                    return (
                      <TableRow key={product.id} className="neo-noir-table-row">
                        <TableCell>
                          <div>
                            <div className="font-medium neo-noir-text">{product.name}</div>
                            <div className="text-sm neo-noir-text-muted">{product.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>₹{baseRate.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={customerRate || ''}
                            onChange={(e) => handleRateChange(selectedCustomer, product.id, parseFloat(e.target.value) || 0)}
                            className="w-24 neo-noir-input"
                            placeholder="Custom"
                          />
                        </TableCell>
                        <TableCell className="font-medium">₹{effectiveRate.toFixed(2)}</TableCell>
                        <TableCell>
                          {discount > 0 && (
                            <Badge variant="outline" className="text-green-400 border-green-500/30">
                              -{discount.toFixed(1)}%
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRateChange(selectedCustomer, product.id, baseRate)}
                            className="neo-noir-button-outline"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!selectedCustomer && (
          <Card className="neo-noir-card">
            <CardContent className="text-center py-12">
              <Percent className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold neo-noir-text mb-2">Select a Customer</h3>
              <p className="neo-noir-text-muted">
                Choose a customer to manage their specific rates and discounts
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
