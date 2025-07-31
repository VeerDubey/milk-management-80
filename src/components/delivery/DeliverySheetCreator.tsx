
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  Save, 
  Download, 
  FileSpreadsheet, 
  Printer,
  Plus,
  Trash2,
  Users,
  Package,
  IndianRupee
} from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { generateDeliverySheetPDF } from '@/utils/pdf-generator';
import { exportDeliverySheetToExcel } from '@/utils/excel-generator';

interface DeliverySheetRow {
  id: string;
  customerId: string;
  customerName: string;
  area: string;
  GGH: number;
  GGH450: number;
  GTSF: number;
  GSD1KG: number;
  GPC: number;
  FL: number;
  totalQty: number;
  amount: number;
}

const PRODUCT_RATES = {
  GGH: 60,
  GGH450: 65,
  GTSF: 50,
  GSD1KG: 45,
  GPC: 55,
  FL: 40
};

export function DeliverySheetCreator() {
  const { customers, addOrder, areas } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedArea, setSelectedArea] = useState('');
  const [deliveryRows, setDeliveryRows] = useState<DeliverySheetRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter customers by selected area
  const filteredCustomers = useMemo(() => {
    if (!selectedArea || selectedArea === 'all') return customers;
    return customers.filter(customer => customer.area === selectedArea);
  }, [customers, selectedArea]);

  // Initialize delivery rows when area changes
  useEffect(() => {
    if (selectedArea && selectedArea !== 'all') {
      const rows: DeliverySheetRow[] = filteredCustomers.map(customer => ({
        id: customer.id,
        customerId: customer.id,
        customerName: customer.name,
        area: customer.area || '',
        GGH: 0,
        GGH450: 0,
        GTSF: 0,
        GSD1KG: 0,
        GPC: 0,
        FL: 0,
        totalQty: 0,
        amount: 0
      }));
      setDeliveryRows(rows);
    } else {
      setDeliveryRows([]);
    }
  }, [filteredCustomers, selectedArea]);

  const updateQuantity = (rowId: string, product: keyof typeof PRODUCT_RATES, quantity: number) => {
    setDeliveryRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [product]: quantity };
        
        // Recalculate totals
        const totalQty = updatedRow.GGH + updatedRow.GGH450 + updatedRow.GTSF + 
                        updatedRow.GSD1KG + updatedRow.GPC + updatedRow.FL;
        
        const amount = (updatedRow.GGH * PRODUCT_RATES.GGH) +
                      (updatedRow.GGH450 * PRODUCT_RATES.GGH450) +
                      (updatedRow.GTSF * PRODUCT_RATES.GTSF) +
                      (updatedRow.GSD1KG * PRODUCT_RATES.GSD1KG) +
                      (updatedRow.GPC * PRODUCT_RATES.GPC) +
                      (updatedRow.FL * PRODUCT_RATES.FL);
        
        return { ...updatedRow, totalQty, amount };
      }
      return row;
    }));
  };

  const addCustomRow = () => {
    const newRow: DeliverySheetRow = {
      id: `custom-${Date.now()}`,
      customerId: '',
      customerName: '',
      area: selectedArea,
      GGH: 0,
      GGH450: 0,
      GTSF: 0,
      GSD1KG: 0,
      GPC: 0,
      FL: 0,
      totalQty: 0,
      amount: 0
    };
    setDeliveryRows(prev => [...prev, newRow]);
  };

  const removeRow = (rowId: string) => {
    setDeliveryRows(prev => prev.filter(row => row.id !== rowId));
  };

  const updateCustomerSelection = (rowId: string, customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setDeliveryRows(prev => prev.map(row => 
        row.id === rowId 
          ? { ...row, customerId, customerName: customer.name, area: customer.area || '' }
          : row
      ));
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    return deliveryRows.reduce((acc, row) => ({
      GGH: acc.GGH + row.GGH,
      GGH450: acc.GGH450 + row.GGH450,
      GTSF: acc.GTSF + row.GTSF,
      GSD1KG: acc.GSD1KG + row.GSD1KG,
      GPC: acc.GPC + row.GPC,
      FL: acc.FL + row.FL,
      QTY: acc.QTY + row.totalQty,
      AMOUNT: acc.AMOUNT + row.amount
    }), {
      GGH: 0, GGH450: 0, GTSF: 0, GSD1KG: 0, GPC: 0, FL: 0, QTY: 0, AMOUNT: 0
    });
  }, [deliveryRows]);

  const saveDeliverySheet = async () => {
    if (!selectedDate || !selectedArea) {
      toast.error('Please select date and area');
      return;
    }

    const validRows = deliveryRows.filter(row => row.totalQty > 0 && row.customerId);
    if (validRows.length === 0) {
      toast.error('Please add items to at least one customer');
      return;
    }

    setIsLoading(true);
    try {
      // Create orders for each customer with items
      let createdOrders = 0;
      
      for (const row of validRows) {
        const orderItems = [];
        
        if (row.GGH > 0) orderItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: 'ggh',
          productName: 'GGH',
          productCode: 'GGH',
          quantity: row.GGH,
          rate: PRODUCT_RATES.GGH,
          unitPrice: PRODUCT_RATES.GGH,
          price: PRODUCT_RATES.GGH,
          total: row.GGH * PRODUCT_RATES.GGH,
          unit: 'Ltr'
        });
        
        if (row.GGH450 > 0) orderItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: 'ggh450',
          productName: 'GGH450',
          productCode: 'GGH450',
          quantity: row.GGH450,
          rate: PRODUCT_RATES.GGH450,
          unitPrice: PRODUCT_RATES.GGH450,
          price: PRODUCT_RATES.GGH450,
          total: row.GGH450 * PRODUCT_RATES.GGH450,
          unit: 'Ltr'
        });
        
        if (row.GTSF > 0) orderItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: 'gtsf',
          productName: 'GTSF',
          productCode: 'GTSF',
          quantity: row.GTSF,
          rate: PRODUCT_RATES.GTSF,
          unitPrice: PRODUCT_RATES.GTSF,
          price: PRODUCT_RATES.GTSF,
          total: row.GTSF * PRODUCT_RATES.GTSF,
          unit: 'Ltr'
        });
        
        if (row.GSD1KG > 0) orderItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: 'gsd1kg',
          productName: 'GSD1KG',
          productCode: 'GSD1KG',
          quantity: row.GSD1KG,
          rate: PRODUCT_RATES.GSD1KG,
          unitPrice: PRODUCT_RATES.GSD1KG,
          price: PRODUCT_RATES.GSD1KG,
          total: row.GSD1KG * PRODUCT_RATES.GSD1KG,
          unit: 'Kg'
        });
        
        if (row.GPC > 0) orderItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: 'gpc',
          productName: 'GPC',
          productCode: 'GPC',
          quantity: row.GPC,
          rate: PRODUCT_RATES.GPC,
          unitPrice: PRODUCT_RATES.GPC,
          price: PRODUCT_RATES.GPC,
          total: row.GPC * PRODUCT_RATES.GPC,
          unit: 'Ltr'
        });
        
        if (row.FL > 0) orderItems.push({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: 'fl',
          productName: 'F&L',
          productCode: 'FL',
          quantity: row.FL,
          rate: PRODUCT_RATES.FL,
          unitPrice: PRODUCT_RATES.FL,
          price: PRODUCT_RATES.FL,
          total: row.FL * PRODUCT_RATES.FL,
          unit: 'Ltr'
        });

        if (orderItems.length > 0) {
          addOrder({
            customerId: row.customerId,
            customerName: row.customerName,
            area: row.area,
            date: format(selectedDate, 'yyyy-MM-dd'),
            items: orderItems,
            status: 'pending',
            paymentStatus: 'pending',
            total: row.amount,
            amount: row.amount,
            totalQty: row.totalQty,
            vehicleId: '',
            salesmanId: '',
            notes: `Delivery Sheet - ${selectedArea} - ${format(selectedDate, 'dd/MM/yyyy')}`
          });
          createdOrders++;
        }
      }

      toast.success(`Delivery sheet saved! Created ${createdOrders} orders.`);
    } catch (error) {
      console.error('Error saving delivery sheet:', error);
      toast.error('Failed to save delivery sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    if (deliveryRows.length === 0) {
      toast.error('No data to export');
      return;
    }

    const sheetData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      area: selectedArea,
      items: deliveryRows.map(row => ({
        customerName: row.customerName,
        area: row.area,
        GGH: row.GGH,
        GGH450: row.GGH450,
        GTSF: row.GTSF,
        GSD1KG: row.GSD1KG,
        GPC: row.GPC,
        FL: row.FL,
        totalQty: row.totalQty,
        amount: row.amount
      })),
      totals: totals
    };

    generateDeliverySheetPDF(sheetData);
    toast.success('PDF generated successfully');
  };

  const exportToExcel = () => {
    if (deliveryRows.length === 0) {
      toast.error('No data to export');
      return;
    }

    const sheetData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      area: selectedArea,
      items: deliveryRows.map(row => ({
        customerName: row.customerName,
        area: row.area,
        GGH: row.GGH,
        GGH450: row.GGH450,
        GTSF: row.GTSF,
        GSD1KG: row.GSD1KG,
        GPC: row.GPC,
        FL: row.FL,
        totalQty: row.totalQty,
        amount: row.amount
      })),
      totals: totals
    };

    exportDeliverySheetToExcel(sheetData);
    toast.success('Excel file generated successfully');
  };

  const printSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create Delivery Sheet
          </CardTitle>
          <CardDescription>
            Create delivery sheets by selecting date, area, and entering product quantities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Area Selection */}
            <div className="space-y-2">
              <Label>Delivery Area</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas?.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button onClick={addCustomRow} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Customers</p>
                    <p className="text-2xl font-bold">{deliveryRows.filter(r => r.totalQty > 0).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Total Qty</p>
                    <p className="text-2xl font-bold">{totals.QTY}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <IndianRupee className="h-8 w-8 text-yellow-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">₹{totals.AMOUNT.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="text-lg font-bold">{format(selectedDate, 'dd/MM')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Sheet Table */}
      {selectedArea && (
        <Card>
          <CardHeader>
            <CardTitle>
              Delivery Sheet - {format(selectedDate, 'dd/MM/yyyy')} - {selectedArea}
            </CardTitle>
            <div className="flex justify-end gap-2">
              <Button onClick={saveDeliverySheet} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Orders'}
              </Button>
              <Button onClick={exportToPDF} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={exportToExcel} variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button onClick={printSheet} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Customer</TableHead>
                    <TableHead className="text-center">GGH<br/>₹{PRODUCT_RATES.GGH}</TableHead>
                    <TableHead className="text-center">GGH450<br/>₹{PRODUCT_RATES.GGH450}</TableHead>
                    <TableHead className="text-center">GTSF<br/>₹{PRODUCT_RATES.GTSF}</TableHead>
                    <TableHead className="text-center">GSD1KG<br/>₹{PRODUCT_RATES.GSD1KG}</TableHead>
                    <TableHead className="text-center">GPC<br/>₹{PRODUCT_RATES.GPC}</TableHead>
                    <TableHead className="text-center">F&L<br/>₹{PRODUCT_RATES.FL}</TableHead>
                    <TableHead className="text-center">QTY</TableHead>
                    <TableHead className="text-center">AMOUNT</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {row.customerId && customers.find(c => c.id === row.customerId) ? (
                          <span className="font-medium">{row.customerName}</span>
                        ) : (
                          <Select value={row.customerId} onValueChange={(value) => updateCustomerSelection(row.id, value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map(customer => (
                                <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          value={row.GGH || ''}
                          onChange={(e) => updateQuantity(row.id, 'GGH', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          value={row.GGH450 || ''}
                          onChange={(e) => updateQuantity(row.id, 'GGH450', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          value={row.GTSF || ''}
                          onChange={(e) => updateQuantity(row.id, 'GTSF', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          value={row.GSD1KG || ''}
                          onChange={(e) => updateQuantity(row.id, 'GSD1KG', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          value={row.GPC || ''}
                          onChange={(e) => updateQuantity(row.id, 'GPC', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          value={row.FL || ''}
                          onChange={(e) => updateQuantity(row.id, 'FL', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center font-semibold">{row.totalQty}</TableCell>
                      <TableCell className="text-center font-semibold">₹{row.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeRow(row.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Totals Row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-center">{totals.GGH}</TableCell>
                    <TableCell className="text-center">{totals.GGH450}</TableCell>
                    <TableCell className="text-center">{totals.GTSF}</TableCell>
                    <TableCell className="text-center">{totals.GSD1KG}</TableCell>
                    <TableCell className="text-center">{totals.GPC}</TableCell>
                    <TableCell className="text-center">{totals.FL}</TableCell>
                    <TableCell className="text-center">{totals.QTY}</TableCell>
                    <TableCell className="text-center">₹{totals.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedArea && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Area to Continue</h3>
            <p className="text-muted-foreground">
              Please select a delivery area to create the delivery sheet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
