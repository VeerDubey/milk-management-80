import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Trash2, Save, FileSpreadsheet, FileText, Printer, Download, Calculator, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';

interface DeliveryEntry {
  id: string;
  date: Date;
  customerId: string;
  customerName: string;
  route: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  rate: number;
  total: number;
  remarks: string;
  delivered: boolean;
  status: 'pending' | 'delivered' | 'partial';
}

const companies = [
  { id: 'amul', name: 'Amul', logo: '🥛' },
  { id: 'gokul', name: 'Gokul', logo: '🐄' },
  { id: 'vikas', name: 'Vikas Milk', logo: '🥛' },
  { id: 'mother-dairy', name: 'Mother Dairy', logo: '🥛' },
];

const routes = [
  'Route A - Central',
  'Route B - North',
  'Route C - South',
  'Route D - East',
  'Route E - West',
];

export default function DeliverySheetBulk() {
  const { customers, products } = useData();
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [deliveryEntries, setDeliveryEntries] = useState<DeliveryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterRoute, setFilterRoute] = useState<string>('all');
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Initialize with empty rows
  useEffect(() => {
    if (deliveryEntries.length === 0) {
      addNewRow();
    }
  }, []);

  const addNewRow = () => {
    const newEntry: DeliveryEntry = {
      id: `entry-${Date.now()}-${Math.random()}`,
      date: selectedDate,
      customerId: '',
      customerName: '',
      route: '',
      productId: '',
      productName: '',
      productCode: '',
      quantity: 0,
      rate: 0,
      total: 0,
      remarks: '',
      delivered: false,
      status: 'pending',
    };
    setDeliveryEntries([...deliveryEntries, newEntry]);
  };

  const deleteRow = (id: string) => {
    if (deliveryEntries.length > 1) {
      setDeliveryEntries(deliveryEntries.filter(entry => entry.id !== id));
    } else {
      toast.error('At least one row must remain');
    }
  };

  const updateEntry = (id: string, field: keyof DeliveryEntry, value: any) => {
    setDeliveryEntries(entries => 
      entries.map(entry => {
        if (entry.id !== id) return entry;
        
        const updatedEntry = { ...entry, [field]: value };
        
        // Auto-fill customer name when customer ID changes
        if (field === 'customerId') {
          const customer = customers.find(c => c.id === value);
          if (customer) {
            updatedEntry.customerName = customer.name;
            updatedEntry.route = customer.area || '';
          }
        }
        
        // Auto-fill product details when product ID changes
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedEntry.productName = product.name;
            updatedEntry.productCode = product.code || product.id;
            updatedEntry.rate = product.price;
          }
        }
        
        // Recalculate total when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedEntry.total = updatedEntry.quantity * updatedEntry.rate;
        }
        
        // Update status based on delivered checkbox
        if (field === 'delivered') {
          updatedEntry.status = value ? 'delivered' : 'pending';
        }
        
        return updatedEntry;
      })
    );
  };

  // Filter entries based on selected filters
  const filteredEntries = useMemo(() => {
    return deliveryEntries.filter(entry => {
      if (filterRoute !== 'all' && entry.route !== filterRoute) return false;
      if (filterCustomer !== 'all' && entry.customerId !== filterCustomer) return false;
      if (filterStatus !== 'all' && entry.status !== filterStatus) return false;
      return true;
    });
  }, [deliveryEntries, filterRoute, filterCustomer, filterStatus]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalQuantity = filteredEntries.reduce((sum, entry) => sum + entry.quantity, 0);
    const grandTotal = filteredEntries.reduce((sum, entry) => sum + entry.total, 0);
    const deliveredCount = filteredEntries.filter(entry => entry.delivered).length;
    const pendingCount = filteredEntries.length - deliveredCount;
    
    return { totalQuantity, grandTotal, deliveredCount, pendingCount };
  }, [filteredEntries]);

  const saveDeliverySheet = () => {
    const validEntries = deliveryEntries.filter(entry => 
      entry.customerId && entry.productId && entry.quantity > 0
    );
    
    if (validEntries.length === 0) {
      toast.error('Please add at least one valid entry');
      return;
    }
    
    // Here you would typically save to your backend/database
    console.log('Saving delivery sheet:', {
      company: selectedCompany,
      date: selectedDate,
      entries: validEntries,
    });
    
    toast.success(`Saved ${validEntries.length} delivery entries`);
  };

  const exportToExcel = () => {
    const validEntries = deliveryEntries.filter(entry => 
      entry.customerId && entry.productId
    );
    
    if (validEntries.length === 0) {
      toast.error('No valid entries to export');
      return;
    }
    
    // Create CSV data
    const csvData = [
      ['Date', 'Company', 'Customer', 'Route', 'Product', 'Code', 'Qty', 'Rate', 'Total', 'Status', 'Remarks'],
      ...validEntries.map(entry => [
        format(entry.date, 'yyyy-MM-dd'),
        selectedCompany.name,
        entry.customerName,
        entry.route,
        entry.productName,
        entry.productCode,
        entry.quantity.toString(),
        entry.rate.toString(),
        entry.total.toString(),
        entry.status,
        entry.remarks,
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-sheet-${selectedCompany.name}-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
    a.click();
    
    toast.success('Delivery sheet exported to Excel');
  };

  const exportToPDF = () => {
    toast.info('PDF export functionality would be implemented here');
  };

  const printDeliverySheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const validEntries = deliveryEntries.filter(entry => 
      entry.customerId && entry.productId
    );
    
    const printContent = `
      <html>
        <head>
          <title>Delivery Sheet - ${selectedCompany.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-logo { font-size: 24px; margin-bottom: 10px; }
            .company-name { font-size: 20px; font-weight: bold; }
            .date { margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .totals { margin-top: 20px; font-weight: bold; }
            .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-logo">${selectedCompany.logo}</div>
            <div class="company-name">${selectedCompany.name}</div>
            <div class="date">Delivery Sheet - ${format(selectedDate, 'dd MMM yyyy')}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Product</th>
                <th>Code</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${validEntries.map((entry, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${entry.customerName}</td>
                  <td>${entry.route}</td>
                  <td>${entry.productName}</td>
                  <td>${entry.productCode}</td>
                  <td>${entry.quantity}</td>
                  <td>₹${entry.rate}</td>
                  <td>₹${entry.total}</td>
                  <td>${entry.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div>Total Quantity: ${totals.totalQuantity}</div>
            <div>Grand Total: ₹${totals.grandTotal}</div>
            <div>Delivered: ${totals.deliveredCount} | Pending: ${totals.pendingCount}</div>
          </div>
          
          <div class="signatures">
            <div class="signature-box">Delivered By</div>
            <div class="signature-box">Received By</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Delivery Sheet</h1>
          <p className="text-muted-foreground">
            Excel-style delivery management for daily dispatch
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCompany.id} onValueChange={(value) => 
            setSelectedCompany(companies.find(c => c.id === value) || companies[0])
          }>
            <SelectTrigger className="w-[180px]">
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  <span className="flex items-center gap-2">
                    <span>{company.logo}</span>
                    {company.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Sheet Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Filter Route</label>
              <Select value={filterRoute} onValueChange={setFilterRoute}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {routes.map(route => (
                    <SelectItem key={route} value={route}>{route}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Filter Customer</label>
              <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Filter Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={addNewRow} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Row
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveDeliverySheet} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Sheet
            </Button>
            <Button onClick={exportToExcel} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button onClick={exportToPDF} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={printDeliverySheet} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Sheet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delivery Entries</CardTitle>
            <Badge variant="outline" className="text-sm">
              <Calculator className="mr-1 h-4 w-4" />
              {filteredEntries.length} entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[50px]">S.No</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[180px]">Customer</TableHead>
                  <TableHead className="w-[150px]">Route</TableHead>
                  <TableHead className="w-[180px]">Product</TableHead>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead className="w-[80px]">Qty</TableHead>
                  <TableHead className="w-[80px]">Rate</TableHead>
                  <TableHead className="w-[100px]">Total</TableHead>
                  <TableHead className="w-[120px]">Remarks</TableHead>
                  <TableHead className="w-[80px]">Delivered</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[60px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry, index) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    
                    <TableCell>
                      <Input
                        type="date"
                        value={format(entry.date, 'yyyy-MM-dd')}
                        onChange={(e) => updateEntry(entry.id, 'date', new Date(e.target.value))}
                        className="w-full"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Select 
                        value={entry.customerId} 
                        onValueChange={(value) => updateEntry(entry.id, 'customerId', value)}
                      >
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
                    </TableCell>
                    
                    <TableCell>
                      <Select 
                        value={entry.route} 
                        onValueChange={(value) => updateEntry(entry.id, 'route', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          {routes.map(route => (
                            <SelectItem key={route} value={route}>
                              {route}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    <TableCell>
                      <Select 
                        value={entry.productId} 
                        onValueChange={(value) => updateEntry(entry.id, 'productId', value)}
                      >
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
                    </TableCell>
                    
                    <TableCell>
                      <Input
                        value={entry.productCode}
                        onChange={(e) => updateEntry(entry.id, 'productCode', e.target.value)}
                        className="w-full"
                        placeholder="Code"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Input
                        type="number"
                        value={entry.quantity || ''}
                        onChange={(e) => updateEntry(entry.id, 'quantity', Number(e.target.value) || 0)}
                        className="w-full"
                        placeholder="0"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={entry.rate || ''}
                        onChange={(e) => updateEntry(entry.id, 'rate', Number(e.target.value) || 0)}
                        className="w-full"
                        placeholder="0.00"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">₹{entry.total.toFixed(2)}</div>
                    </TableCell>
                    
                    <TableCell>
                      <Input
                        value={entry.remarks}
                        onChange={(e) => updateEntry(entry.id, 'remarks', e.target.value)}
                        className="w-full"
                        placeholder="Remarks"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Checkbox
                        checked={entry.delivered}
                        onCheckedChange={(checked) => updateEntry(entry.id, 'delivered', checked)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={
                        entry.status === 'delivered' ? 'default' :
                        entry.status === 'partial' ? 'secondary' : 'outline'
                      }>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRow(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totals.totalQuantity}</div>
              <div className="text-sm text-muted-foreground">Total Quantity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{totals.grandTotal.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Grand Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{totals.deliveredCount}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{totals.pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}