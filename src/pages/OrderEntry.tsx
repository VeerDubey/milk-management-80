
import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  total: number;
}

export default function OrderEntry() {
  const { customers, products, vehicles, salesmen, addOrder, getProductRateForCustomer } = useData();
  const [orderData, setOrderData] = useState({
    customerId: '',
    customerName: '',
    area: '',
    vehicleId: '',
    salesmanId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const addProductToOrder = () => {
    if (!selectedProduct || !orderData.customerId) {
      toast.error('Please select customer and product');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItemIndex = orderItems.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setOrderItems(updatedItems);
    } else {
      const customRate = getProductRateForCustomer(orderData.customerId, selectedProduct);
      const price = customRate || product.price;
      
      const newItem: OrderItem = {
        productId: selectedProduct,
        productName: product.name,
        productCode: product.code,
        quantity: 1,
        price: price,
        total: price
      };
      setOrderItems([...orderItems, newItem]);
    }
    setSelectedProduct('');
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    const updatedItems = [...orderItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].total = quantity * updatedItems[index].price;
    setOrderItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const getTotalQuantity = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setOrderData({
        ...orderData,
        customerId,
        customerName: customer.name,
        area: customer.area
      });
      
      // Update prices for existing items based on customer rates
      const updatedItems = orderItems.map(item => {
        const customRate = getProductRateForCustomer(customerId, item.productId);
        if (customRate && customRate !== item.price) {
          return {
            ...item,
            price: customRate,
            total: item.quantity * customRate
          };
        }
        return item;
      });
      setOrderItems(updatedItems);
    }
  };

  const saveOrder = () => {
    if (!orderData.customerId || orderItems.length === 0) {
      toast.error('Please select customer and add at least one item');
      return;
    }

    const order = {
      ...orderData,
      items: orderItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode,
        quantity: item.quantity,
        price: item.price,
        rate: item.price,
        unitPrice: item.price,
        total: item.total
      })),
      totalQty: getTotalQuantity(),
      total: getTotalAmount(),
      amount: getTotalAmount(),
      status: 'pending' as const,
      date: orderData.date
    };

    addOrder(order);
    toast.success('Order created successfully');
    
    // Reset form
    setOrderData({
      customerId: '',
      customerName: '',
      area: '',
      vehicleId: '',
      salesmanId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setOrderItems([]);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Order Entry
          </h1>
          <p className="text-slate-300 mt-2">Create new customer orders</p>
        </div>
        <Button onClick={saveOrder} disabled={orderItems.length === 0} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Customer *</Label>
                  <Select value={orderData.customerId} onValueChange={handleCustomerChange}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Order Date</Label>
                  <Input
                    type="date"
                    value={orderData.date}
                    onChange={(e) => setOrderData({...orderData, date: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Vehicle</Label>
                  <Select value={orderData.vehicleId} onValueChange={(value) => setOrderData({...orderData, vehicleId: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Salesman</Label>
                  <Select value={orderData.salesmanId} onValueChange={(value) => setOrderData({...orderData, salesmanId: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select salesman" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesmen.map(salesman => (
                        <SelectItem key={salesman.id} value={salesman.id}>
                          {salesman.name} - {salesman.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  value={orderData.notes}
                  onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Order notes..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select product to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.code}) - ₹{orderData.customerId ? (getProductRateForCustomer(orderData.customerId, product.id) || product.price) : product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addProductToOrder} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Items ({orderItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No items added yet</p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.productName}</h4>
                        <p className="text-sm text-slate-300">{item.productCode} • ₹{item.price}/{products.find(p => p.id === item.productId)?.unit}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="h-8 w-8 p-0 bg-slate-600 border-slate-500 hover:bg-slate-500"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="h-8 w-8 p-0 bg-slate-600 border-slate-500 hover:bg-slate-500"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div className="font-semibold text-white">₹{item.total}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 sticky top-6">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderData.customerName && (
                <div>
                  <h3 className="font-medium text-white">{orderData.customerName}</h3>
                  <p className="text-sm text-slate-300">{orderData.area}</p>
                </div>
              )}
              
              <div className="border-t border-slate-600 pt-4">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Total Items:</span>
                  <span>{getTotalQuantity()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-white">
                  <span>Total Amount:</span>
                  <span>₹{getTotalAmount().toLocaleString()}</span>
                </div>
              </div>

              {orderItems.length > 0 && (
                <div className="space-y-2 border-t border-slate-600 pt-4">
                  <h4 className="font-medium text-white">Item Breakdown:</h4>
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-slate-400">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>₹{item.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
