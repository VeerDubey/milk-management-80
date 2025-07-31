
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Plus, Minus, Save, X, Upload, FileText, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { StockEntry, StockEntryItem } from '@/types';

interface PurchaseItem extends StockEntryItem {
  tempId?: string;
}

export function DualModePurchaseEntry() {
  const { suppliers, products, addStockEntry, updateProduct } = useData();
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');
  const [formData, setFormData] = useState({
    supplierId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    referenceNumber: '',
    notes: '',
    paymentStatus: 'unpaid' as 'paid' | 'partial' | 'unpaid'
  });
  const [items, setItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      addItem();
    }
  }, []);

  const addItem = () => {
    const newItem: PurchaseItem = {
      tempId: `temp_${Date.now()}_${Math.random()}`,
      productId: '',
      productName: '',
      quantity: 0,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Update product name when product changes
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      updatedItems[index].productName = product?.name || '';
      updatedItems[index].rate = product?.costPrice || product?.price || 0;
    }
    
    // Recalculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity;
      const rate = field === 'rate' ? value : updatedItems[index].rate;
      updatedItems[index].amount = quantity * rate;
    }
    
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleSubmit = () => {
    if (!formData.supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    const validItems = items.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }

    const stockEntry: Omit<StockEntry, 'id'> = {
      supplierId: formData.supplierId,
      date: formData.date,
      items: validItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      })),
      totalAmount: calculateTotal(),
      paymentStatus: formData.paymentStatus,
      referenceNumber: formData.referenceNumber || undefined,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString()
    };

    try {
      addStockEntry(stockEntry);
      
      // Update product stock levels
      validItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const newStock = (product.stock || 0) + item.quantity;
          updateProduct(item.productId, { stock: newStock });
        }
      });

      toast.success('Purchase entry created successfully');
      resetForm();
    } catch (error) {
      toast.error('Failed to create purchase entry');
      console.error('Error creating purchase entry:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      referenceNumber: '',
      notes: '',
      paymentStatus: 'unpaid'
    });
    setItems([]);
    addItem();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Purchase Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as 'manual' | 'excel')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="excel">Excel Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Select value={formData.supplierId} onValueChange={(value) => setFormData({...formData, supplierId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.filter(s => s.isActive).map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                    placeholder="Enter reference number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select value={formData.paymentStatus} onValueChange={(value: 'paid' | 'partial' | 'unpaid') => setFormData({...formData, paymentStatus: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Purchase Items</Label>
                  <Button onClick={addItem} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate (₹)</TableHead>
                        <TableHead>Amount (₹)</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.tempId || index}>
                          <TableCell>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => updateItem(index, 'productId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.filter(p => p.isActive).map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} ({product.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity || ''}
                              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate || ''}
                              onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell>
                            ₹{(item.amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Total Amount: ₹{calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Enter any additional notes..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Purchase Entry
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="excel" className="space-y-6">
              <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Upload Excel File</p>
                <p className="text-sm text-gray-600 mb-4">
                  Upload an Excel file with purchase data to automatically create entries
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
