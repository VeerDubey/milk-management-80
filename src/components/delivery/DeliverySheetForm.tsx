
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { Plus, Save, Printer, FileText, Calculator } from 'lucide-react';
import { DeliverySheetData } from '@/types/delivery';

interface DeliveryItem {
  id: string;
  customerName: string;
  customerId: string;
  productName: string;
  productCode: string;
  quantity: number;
  rate: number;
  total: number;
  remarks: string;
}

interface DeliverySheetFormProps {
  onSave: (data: DeliverySheetData) => void;
}

export const DeliverySheetForm: React.FC<DeliverySheetFormProps> = ({ onSave }) => {
  const { customers, products } = useData();
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [selectedCompany, setSelectedCompany] = useState('Vikas Milk Centre');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [route, setRoute] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  useEffect(() => {
    if (selectedProductData) {
      setRate(selectedProductData.price?.toString() || '0');
    }
  }, [selectedProductData]);

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const itemRate = parseFloat(rate) || 0;
    return qty * itemRate;
  };

  const addToSheet = () => {
    if (!selectedCustomer || !selectedProduct || !quantity) {
      toast.error('Please fill all required fields');
      return;
    }

    const newItem: DeliveryItem = {
      id: `item_${Date.now()}`,
      customerName: selectedCustomerData?.name || '',
      customerId: selectedCustomer,
      productName: selectedProductData?.name || '',
      productCode: selectedProductData?.code || selectedProductData?.id || '',
      quantity: parseFloat(quantity),
      rate: parseFloat(rate),
      total: calculateTotal(),
      remarks
    };

    setDeliveryItems([...deliveryItems, newItem]);
    
    // Clear form
    setSelectedCustomer('');
    setSelectedProduct('');
    setQuantity('');
    setRate('');
    setRemarks('');
    
    toast.success('Item added to delivery sheet');
  };

  const removeItem = (itemId: string) => {
    setDeliveryItems(deliveryItems.filter(item => item.id !== itemId));
    toast.success('Item removed from delivery sheet');
  };

  const clearForm = () => {
    setSelectedCustomer('');
    setSelectedProduct('');
    setRoute('');
    setQuantity('');
    setRate('');
    setRemarks('');
    setDeliveryItems([]);
    toast.success('Form cleared');
  };

  const saveDeliverySheet = () => {
    if (deliveryItems.length === 0) {
      toast.error('Please add at least one item to the delivery sheet');
      return;
    }

    const deliveryData: DeliverySheetData = {
      date: deliveryDate.toISOString().split('T')[0],
      area: route,
      items: deliveryItems.map(item => ({
        customerName: item.customerName,
        GGH: item.productCode === 'GGH' ? item.quantity : 0,
        GGH450: item.productCode === 'GGH450' ? item.quantity : 0,
        GTSF: item.productCode === 'GTSF' ? item.quantity : 0,
        GSD1KG: item.productCode === 'GSD1KG' ? item.quantity : 0,
        GPC: item.productCode === 'GPC' ? item.quantity : 0,
        FL: item.productCode === 'FL' ? item.quantity : 0,
        totalQty: item.quantity,
        amount: item.total
      })),
      totals: {
        GGH: deliveryItems.filter(i => i.productCode === 'GGH').reduce((sum, i) => sum + i.quantity, 0),
        GGH450: deliveryItems.filter(i => i.productCode === 'GGH450').reduce((sum, i) => sum + i.quantity, 0),
        GTSF: deliveryItems.filter(i => i.productCode === 'GTSF').reduce((sum, i) => sum + i.quantity, 0),
        GSD1KG: deliveryItems.filter(i => i.productCode === 'GSD1KG').reduce((sum, i) => sum + i.quantity, 0),
        GPC: deliveryItems.filter(i => i.productCode === 'GPC').reduce((sum, i) => sum + i.quantity, 0),
        FL: deliveryItems.filter(i => i.productCode === 'FL').reduce((sum, i) => sum + i.quantity, 0),
        QTY: deliveryItems.reduce((sum, i) => sum + i.quantity, 0),
        AMOUNT: deliveryItems.reduce((sum, i) => sum + i.total, 0)
      }
    };

    onSave(deliveryData);
    toast.success('Delivery sheet saved successfully');
  };

  const grandTotal = deliveryItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      {/* Header Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Delivery Sheet - Form Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Delivery Date</Label>
              <DatePicker 
                date={deliveryDate} 
                setDate={setDeliveryDate}
                placeholder="Select delivery date"
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vikas Milk Centre">Vikas Milk Centre</SelectItem>
                  <SelectItem value="Amul">Amul</SelectItem>
                  <SelectItem value="Gokul">Gokul</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="route">Route/Area</Label>
              <Input
                id="route"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="Enter route or area"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="customer">Customer Name *</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="product">Product Name *</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <Label htmlFor="rate">Rate</Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="Enter rate"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total">Total Amount</Label>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={addToSheet} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add to Sheet
            </Button>
            <Button variant="outline" onClick={clearForm}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      {deliveryItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Items ({deliveryItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-2 text-left">Customer</th>
                    <th className="border border-gray-200 p-2 text-left">Product</th>
                    <th className="border border-gray-200 p-2 text-left">Code</th>
                    <th className="border border-gray-200 p-2 text-right">Qty</th>
                    <th className="border border-gray-200 p-2 text-right">Rate</th>
                    <th className="border border-gray-200 p-2 text-right">Total</th>
                    <th className="border border-gray-200 p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryItems.map(item => (
                    <tr key={item.id}>
                      <td className="border border-gray-200 p-2">{item.customerName}</td>
                      <td className="border border-gray-200 p-2">{item.productName}</td>
                      <td className="border border-gray-200 p-2">{item.productCode}</td>
                      <td className="border border-gray-200 p-2 text-right">{item.quantity}</td>
                      <td className="border border-gray-200 p-2 text-right">₹{item.rate.toFixed(2)}</td>
                      <td className="border border-gray-200 p-2 text-right font-medium">₹{item.total.toFixed(2)}</td>
                      <td className="border border-gray-200 p-2 text-center">
                        <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={5} className="border border-gray-200 p-2 text-right">Grand Total:</td>
                    <td className="border border-gray-200 p-2 text-right">₹{grandTotal.toFixed(2)}</td>
                    <td className="border border-gray-200 p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={saveDeliverySheet} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Delivery Sheet
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Challan
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generate PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
