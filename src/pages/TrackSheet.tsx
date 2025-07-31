

import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Calendar
} from 'lucide-react';

export default function TrackSheet() {
  const { customers, products, vehicles, salesmen, addTrackSheet } = useData();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [trackSheetDate, setTrackSheetDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeName, setRouteName] = useState('');
   const [rows, setRows] = useState([
     { id: '1', customerId: '', customerName: '', quantities: {}, total: 0, amount: 0 }
   ]);

  const areaCustomers = customers.filter(c => c.area === selectedArea);
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedSalesmanData = salesmen.find(s => s.id === selectedSalesman);

   const addRow = () => {
     const newRow = {
       id: Date.now().toString(),
       customerId: '',
       customerName: '',
       quantities: {},
       total: 0,
       amount: 0
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

        // Calculate totals
        if (field === 'quantities') {
          const total = Object.values(value as Record<string, string>).reduce((sum: number, qty: string) => {
            return sum + (Number(qty) || 0);
          }, 0);
          updatedRow.total = total;
          
          const amount = Object.entries(value as Record<string, string>).reduce((sum: number, [productName, qty]: [string, string]) => {
            const product = products.find(p => p.name === productName);
            return sum + ((Number(qty) || 0) * (product?.price || 0));
          }, 0);
          updatedRow.amount = amount;
        }

        return updatedRow;
      }
      return row;
    }));
  };

  const updateQuantity = (rowId: string, productName: string, quantity: string) => {
    const row = rows.find(r => r.id === rowId);
    if (row) {
      const newQuantities = { ...row.quantities, [productName]: quantity };
      updateRow(rowId, 'quantities', newQuantities);
    }
  };

  const saveTrackSheet = () => {
    if (!selectedVehicle || !selectedSalesman || !selectedArea) {
      toast.error('Please select vehicle, salesman, and area');
      return;
    }

    const trackSheetData = {
      name: `Track Sheet - ${routeName || selectedArea} - ${trackSheetDate}`,
      date: trackSheetDate,
      vehicleId: selectedVehicle,
      vehicleName: selectedVehicleData?.name || '',
      salesmanId: selectedSalesman,
      salesmanName: selectedSalesmanData?.name || '',
      area: selectedArea,
      routeName,
       rows: rows.filter(row => row.customerId).map(row => ({
         id: row.id,
         customerId: row.customerId,
         customerName: row.customerName,
         name: row.customerName,
         quantities: row.quantities,
         total: row.total,
         amount: row.amount
       })),
      totalAmount: rows.reduce((sum, row) => sum + row.amount, 0),
      status: 'pending' as const
    };

    const result = addTrackSheet(trackSheetData);
    if (result) {
      toast.success('Track sheet saved successfully');
       // Reset form
       setRows([{ id: '1', customerId: '', customerName: '', quantities: {}, total: 0, amount: 0 }]);
       setRouteName('');
    } else {
      toast.error('Failed to save track sheet');
    }
  };

  const getTotalQuantity = () => {
    return rows.reduce((sum, row) => sum + row.total, 0);
  };

  const getTotalAmount = () => {
    return rows.reduce((sum, row) => sum + row.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Track Sheet
            </h1>
            <p className="text-slate-300">Create and manage delivery tracking sheets</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={saveTrackSheet} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Track Sheet
            </Button>
          </div>
        </div>

        {/* Configuration Section */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-400" />
              Track Sheet Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Route Name (Optional)</Label>
              <Input
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Enter route name"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Track Sheet Table */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-green-400" />
                Product Distribution
              </CardTitle>
              <Button onClick={addRow} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
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
                      <TableHead key={product.id} className="text-slate-300 text-center min-w-20">
                        {product.name}
                      </TableHead>
                    ))}
                    <TableHead className="text-slate-300 text-center">Total Qty</TableHead>
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
                          <Input
                            type="number"
                            value={(row.quantities as Record<string, string>)[product.name] || ''}
                            onChange={(e) => updateQuantity(row.id, product.name, e.target.value)}
                            className="w-16 text-center bg-slate-800 border-slate-600 text-white"
                            min="0"
                          />
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

            {/* Summary */}
            <div className="mt-6 flex justify-end">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-slate-300">Total Quantity:</div>
                  <div className="text-green-400 font-semibold">{getTotalQuantity()}</div>
                  <div className="text-slate-300">Total Amount:</div>
                  <div className="text-blue-400 font-semibold">₹{getTotalAmount().toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
