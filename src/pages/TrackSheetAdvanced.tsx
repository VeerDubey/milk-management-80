import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, 
  Minus, 
  Save, 
  Download, 
  FileText, 
  Truck,
  Package,
  User,
  MapPin,
  Calendar,
  BarChart3,
  Clock,
  Route,
  Zap
} from 'lucide-react';

export default function TrackSheetAdvanced() {
  const { customers, products, vehicles, salesmen, orders, addTrackSheet } = useData();
  const [activeTab, setActiveTab] = useState('basic');
  
  // Basic Info
  const [trackSheetName, setTrackSheetName] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [trackSheetDate, setTrackSheetDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeName, setRouteName] = useState('');
  const [notes, setNotes] = useState('');
  
  // Advanced settings
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [includeReturns, setIncludeReturns] = useState(false);
  const [priority, setPriority] = useState('normal');
  
  // Track sheet rows
   const [rows, setRows] = useState([
     { 
       id: '1', 
       customerId: '', 
       customerName: '', 
       quantities: {}, 
       returns: {},
       total: 0, 
       amount: 0,
       notes: '',
       status: 'pending'
     }
   ]);

  const areaCustomers = customers.filter(c => c.area === selectedArea);
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedSalesmanData = salesmen.find(s => s.id === selectedSalesman);

  // Auto-generate name
  useEffect(() => {
    if (selectedArea && trackSheetDate) {
      const datePart = new Date(trackSheetDate).toLocaleDateString('en-GB').replace(/\//g, '-');
      setTrackSheetName(`${selectedArea}-${datePart}${routeName ? `-${routeName}` : ''}`);
    }
  }, [selectedArea, trackSheetDate, routeName]);

   const addRow = () => {
     const newRow = {
       id: Date.now().toString(),
       customerId: '',
       customerName: '',
       quantities: {},
       returns: {},
       total: 0,
       amount: 0,
       notes: '',
       status: 'pending'
     };
     setRows([...rows, newRow]);
   };

   const removeRow = (id: string) => {
     if (rows.length > 1) {
       setRows(rows.filter(row => row.id !== id));
     }
   };

  const updateRow = (id: string, field: string, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        if (field === 'customerId') {
          const customer = customers.find(c => c.id === value);
          updatedRow.customerName = customer?.name || '';
        }

        if (autoCalculate && (field === 'quantities' || field === 'returns')) {
          calculateRowTotals(updatedRow);
        }

        return updatedRow;
      }
      return row;
    }));
  };

  const calculateRowTotals = (row: any) => {
    const quantities = row.quantities || {};
    const returns = row.returns || {};
    
    let total = 0;
    let amount = 0;
    
    Object.entries(quantities).forEach(([productName, qty]: [string, any]) => {
      const product = products.find(p => p.name === productName);
      const netQty = (Number(qty) || 0) - (Number(returns[productName]) || 0);
      total += netQty;
      amount += netQty * (product?.price || 0);
    });
    
    row.total = total;
    row.amount = amount;
  };

  const updateQuantity = (rowId: string, productName: string, quantity: string, type: 'quantities' | 'returns' = 'quantities') => {
    const row = rows.find(r => r.id === rowId);
    if (row) {
      const newValues = { ...row[type], [productName]: quantity };
      updateRow(rowId, type, newValues);
    }
  };

  const importFromOrders = () => {
    const pendingOrders = orders.filter(order => 
      order.status === 'pending' && 
      (!selectedArea || order.area === selectedArea)
    );

    if (pendingOrders.length === 0) {
      toast.error('No pending orders found for the selected area');
      return;
    }

     const newRows = pendingOrders.map(order => ({
       id: (Date.now() + Math.random()).toString(),
       customerId: order.customerId,
       customerName: order.customerName,
       quantities: order.items.reduce((acc: any, item: any) => {
         acc[item.productName] = item.quantity;
         return acc;
       }, {}),
       returns: {},
       total: order.totalQty || 0,
       amount: order.amount || 0,
       notes: order.notes || '',
       status: 'pending'
     }));

    setRows(newRows);
    toast.success(`Imported ${pendingOrders.length} orders`);
  };

  const saveTrackSheet = () => {
    if (!trackSheetName || !selectedVehicle || !selectedSalesman || !selectedArea) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validRows = rows.filter(row => row.customerId);
    if (validRows.length === 0) {
      toast.error('Please add at least one customer');
      return;
    }

    const trackSheetData = {
      name: trackSheetName,
      title: trackSheetName,
      date: trackSheetDate,
      vehicleId: selectedVehicle,
      vehicleName: selectedVehicleData?.name || '',
      salesmanId: selectedSalesman,
      salesmanName: selectedSalesmanData?.name || '',
      area: selectedArea,
      routeName,
       rows: validRows.map(row => ({
         id: row.id,
         customerId: row.customerId,
         customerName: row.customerName,
         name: row.customerName,
         quantities: row.quantities,
         returns: row.returns,
         total: row.total,
         amount: row.amount,
         notes: row.notes,
         status: row.status
       })),
      totalAmount: getTotalAmount(),
      status: 'pending' as const,
      notes,
      priority,
      includeReturns,
      summary: {
        totalItems: getTotalQuantity(),
        totalAmount: getTotalAmount(),
        productTotals: getProductTotals()
      }
    };

    const result = addTrackSheet(trackSheetData);
    if (result) {
      toast.success('Advanced track sheet saved successfully');
      resetForm();
    } else {
      toast.error('Failed to save track sheet');
    }
  };

  const resetForm = () => {
     setRows([{ 
       id: '1', 
       customerId: '', 
       customerName: '', 
       quantities: {}, 
       returns: {},
       total: 0, 
       amount: 0,
       notes: '',
       status: 'pending'
     }]);
    setTrackSheetName('');
    setRouteName('');
    setNotes('');
  };

  const getTotalQuantity = () => {
    return rows.reduce((sum, row) => sum + row.total, 0);
  };

  const getTotalAmount = () => {
    return rows.reduce((sum, row) => sum + row.amount, 0);
  };

  const getProductTotals = () => {
    const totals: Record<string, number> = {};
    rows.forEach(row => {
      Object.entries(row.quantities).forEach(([productName, qty]: [string, any]) => {
        const returns = row.returns[productName] || 0;
        const netQty = (Number(qty) || 0) - (Number(returns) || 0);
        totals[productName] = (totals[productName] || 0) + netQty;
      });
    });
    return totals;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-400" />
              Advanced Track Sheet
            </h1>
            <p className="text-slate-300">Create comprehensive delivery tracking sheets with advanced features</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={importFromOrders} variant="outline" className="border-purple-500 text-purple-400">
              <Download className="mr-2 h-4 w-4" />
              Import Orders
            </Button>
            <Button onClick={saveTrackSheet} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Track Sheet
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Track Sheet Name</Label>
                    <Input
                      value={trackSheetName}
                      onChange={(e) => setTrackSheetName(e.target.value)}
                      placeholder="Enter track sheet name"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Date</Label>
                    <Input
                      type="date"
                      value={trackSheetDate}
                      onChange={(e) => setTrackSheetDate(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Vehicle</Label>
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} - {vehicle.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Salesman</Label>
                    <Select value={selectedSalesman} onValueChange={setSelectedSalesman}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select salesman" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesmen.map((salesman) => (
                          <SelectItem key={salesman.id} value={salesman.id}>
                            {salesman.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Area</Label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set(customers.map(c => c.area))).map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Route Name</Label>
                    <Input
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                      placeholder="Enter route name"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or special instructions"
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-400" />
                    Product Distribution
                  </CardTitle>
                  <Button onClick={addRow} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Customer</TableHead>
                        {products.map(product => (
                          <TableHead key={product.id} className="text-slate-300 text-center min-w-24">
                            <div className="space-y-1">
                              <div>{product.name}</div>
                              <div className="text-xs text-slate-400">₹{product.price}</div>
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="text-slate-300 text-center">Total</TableHead>
                        <TableHead className="text-slate-300 text-center">Amount</TableHead>
                        <TableHead className="text-slate-300 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id} className="border-slate-700">
                          <TableCell className="min-w-48">
                            <Select 
                              value={row.customerId} 
                              onValueChange={(value) => updateRow(row.id, 'customerId', value)}
                            >
                              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                              <SelectContent>
                                {areaCustomers.map((customer) => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {products.map(product => (
                            <TableCell key={product.id} className="text-center">
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  value={row.quantities[product.name] || ''}
                                  onChange={(e) => updateQuantity(row.id, product.name, e.target.value, 'quantities')}
                                  className="w-16 text-center bg-slate-800 border-slate-600 text-white text-xs"
                                  min="0"
                                  placeholder="Qty"
                                />
                                {includeReturns && (
                                  <Input
                                    type="number"
                                    value={row.returns[product.name] || ''}
                                    onChange={(e) => updateQuantity(row.id, product.name, e.target.value, 'returns')}
                                    className="w-16 text-center bg-red-900/20 border-red-600 text-red-400 text-xs"
                                    min="0"
                                    placeholder="Ret"
                                  />
                                )}
                              </div>
                            </TableCell>
                          ))}
                          <TableCell className="text-center">
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              {row.total}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              ₹{row.amount.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={() => removeRow(row.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500/20"
                              disabled={rows.length === 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{getTotalQuantity()}</div>
                  <div className="text-blue-300">Total Items</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{rows.filter(r => r.customerId).length}</div>
                  <div className="text-green-300">Customers</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">₹{getTotalAmount().toFixed(2)}</div>
                  <div className="text-purple-300">Total Amount</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Product Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(getProductTotals()).map(([productName, total]) => (
                    <div key={productName} className="bg-slate-800/50 p-3 rounded-lg">
                      <div className="text-slate-300 text-sm">{productName}</div>
                      <div className="text-white font-semibold">{total}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Auto Calculate Totals</Label>
                  <Button
                    variant={autoCalculate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoCalculate(!autoCalculate)}
                  >
                    {autoCalculate ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Include Returns</Label>
                  <Button
                    variant={includeReturns ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIncludeReturns(!includeReturns)}
                  >
                    {includeReturns ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
