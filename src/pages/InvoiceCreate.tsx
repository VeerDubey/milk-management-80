import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, Trash2, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface InvoiceLineItem {
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function InvoiceCreate() {
  const { customers, products, addInvoice, getProductRateForCustomer } = useData();
  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState({
    customerId: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    taxRate: 0,
    discount: 0,
  });

  const [items, setItems] = useState<InvoiceLineItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setInvoiceData(prev => ({
        ...prev,
        customerId,
        customerName: customer.name,
      }));
      // Update item prices based on customer rates
      setItems(prev => prev.map(item => {
        const customRate = getProductRateForCustomer(customerId, item.productId);
        const rate = customRate || item.rate;
        return { ...item, rate, amount: item.quantity * rate };
      }));
    }
  };

  const addItem = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingIndex = items.findIndex(i => i.productId === selectedProduct);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].amount = updated[existingIndex].quantity * updated[existingIndex].rate;
      setItems(updated);
    } else {
      const customRate = invoiceData.customerId
        ? getProductRateForCustomer(invoiceData.customerId, selectedProduct)
        : null;
      const rate = customRate || product.price;
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        description: product.name,
        quantity: 1,
        rate,
        amount: rate,
      }]);
    }
    setSelectedProduct('');
  };

  const updateItemQuantity = (index: number, qty: number) => {
    if (qty <= 0) { removeItem(index); return; }
    const updated = [...items];
    updated[index].quantity = qty;
    updated[index].amount = qty * updated[index].rate;
    setItems(updated);
  };

  const updateItemRate = (index: number, rate: number) => {
    const updated = [...items];
    updated[index].rate = rate;
    updated[index].amount = updated[index].quantity * rate;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const discountAmount = invoiceData.discount;
  const total = subtotal + taxAmount - discountAmount;

  const handleSave = (status: 'draft' | 'sent') => {
    if (!invoiceData.customerId || items.length === 0) {
      toast.error('Please select a customer and add at least one item');
      return;
    }

    addInvoice({
      number: `INV-${Date.now().toString().slice(-6)}`,
      customerId: invoiceData.customerId,
      customerName: invoiceData.customerName,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate,
      items: items.map(item => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      status,
      notes: invoiceData.notes,
    });

    toast.success(`Invoice ${status === 'draft' ? 'saved as draft' : 'created and sent'}`);
    navigate('/invoice-history');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/invoice-history')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">Generate a new invoice for a customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')}>
            Save Draft
          </Button>
          <Button onClick={() => handleSave('sent')}>
            <Save className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer *</Label>
                  <Select value={invoiceData.customerId} onValueChange={handleCustomerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} - {c.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Input
                    type="date"
                    value={invoiceData.date}
                    onChange={e => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={e => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={invoiceData.taxRate}
                    onChange={e => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select product to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.code}) - ₹{p.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addItem}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-24">Qty</TableHead>
                      <TableHead className="w-28">Rate (₹)</TableHead>
                      <TableHead className="text-right w-28">Amount (₹)</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                              onClick={() => updateItemQuantity(index, item.quantity - 1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={e => updateItemRate(index, parseFloat(e.target.value) || 0)}
                            className="h-8 w-24"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{item.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="destructive" className="h-7 w-7 p-0"
                            onClick={() => removeItem(index)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {items.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No items added yet. Select a product above to begin.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={invoiceData.notes}
                onChange={e => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes for the invoice..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoiceData.customerName && (
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{invoiceData.customerName}</p>
                </div>
              )}

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {invoiceData.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({invoiceData.taxRate}%)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  value={invoiceData.discount}
                  onChange={e => setInvoiceData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{items.length} items</Badge>
                <Badge variant="outline">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} units
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
