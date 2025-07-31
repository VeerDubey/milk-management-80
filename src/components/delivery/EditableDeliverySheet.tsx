
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Save, Plus, Minus, Edit, Trash2, Download, FileText, Printer,
  Calendar, Users, Package, IndianRupee, MapPin
} from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { format } from 'date-fns';

interface EditableDeliveryRow {
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
  QTY: number;
  AMOUNT: number;
  isEditing: boolean;
}

interface EditableDeliverySheetProps {
  initialData?: any[];
  selectedDate?: Date;
  selectedArea?: string;
  onSave?: (data: any) => void;
}

export function EditableDeliverySheet({ 
  initialData = [], 
  selectedDate = new Date(), 
  selectedArea,
  onSave 
}: EditableDeliverySheetProps) {
  const { customers, products, orders, addOrder, updateOrder } = useData();
  const [deliveryRows, setDeliveryRows] = useState<EditableDeliveryRow[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [sheetDate, setSheetDate] = useState(format(selectedDate, 'yyyy-MM-dd'));
  const [sheetArea, setSheetArea] = useState(selectedArea || 'all');

  // Initialize delivery rows from data
  useEffect(() => {
    if (initialData.length > 0) {
      const rows: EditableDeliveryRow[] = initialData.map(item => ({
        id: item.id || Date.now().toString() + Math.random(),
        customerId: item.customerId || '',
        customerName: item.customer || item.customerName || '',
        area: item.area || '',
        GGH: item.GGH || 0,
        GGH450: item.GGH450 || 0,
        GTSF: item.GTSF || 0,
        GSD1KG: item.GSD1KG || 0,
        GPC: item.GPC || 0,
        FL: item.FL || 0,
        QTY: item.QTY || 0,
        AMOUNT: item.AMOUNT || 0,
        isEditing: false
      }));
      setDeliveryRows(rows);
    } else {
      // Create empty rows for selected area customers
      const areaCustomers = selectedArea && selectedArea !== 'all' 
        ? customers.filter(c => c.area === selectedArea)
        : customers;
      
      const rows: EditableDeliveryRow[] = areaCustomers.map(customer => ({
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
        QTY: 0,
        AMOUNT: 0,
        isEditing: false
      }));
      setDeliveryRows(rows);
    }
  }, [initialData, customers, selectedArea]);

  const calculateRowTotal = (row: EditableDeliveryRow) => {
    const qty = row.GGH + row.GGH450 + row.GTSF + row.GSD1KG + row.GPC + row.FL;
    
    // Calculate amount based on product rates
    let amount = 0;
    const productRates = {
      GGH: 60,
      GGH450: 65,
      GTSF: 50,
      GSD1KG: 45,
      GPC: 55,
      FL: 40
    };
    
    amount += row.GGH * productRates.GGH;
    amount += row.GGH450 * productRates.GGH450;
    amount += row.GTSF * productRates.GTSF;
    amount += row.GSD1KG * productRates.GSD1KG;
    amount += row.GPC * productRates.GPC;
    amount += row.FL * productRates.FL;
    
    return { qty, amount };
  };

  const updateRow = (id: string, field: string, value: any) => {
    setDeliveryRows(prev => prev.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        const { qty, amount } = calculateRowTotal(updatedRow);
        updatedRow.QTY = qty;
        updatedRow.AMOUNT = amount;
        return updatedRow;
      }
      return row;
    }));
  };

  const addNewRow = () => {
    const newRow: EditableDeliveryRow = {
      id: Date.now().toString() + Math.random(),
      customerId: '',
      customerName: '',
      area: '',
      GGH: 0,
      GGH450: 0,
      GTSF: 0,
      GSD1KG: 0,
      GPC: 0,
      FL: 0,
      QTY: 0,
      AMOUNT: 0,
      isEditing: true
    };
    setDeliveryRows(prev => [...prev, newRow]);
    setEditingRowId(newRow.id);
  };

  const deleteRow = (id: string) => {
    setDeliveryRows(prev => prev.filter(row => row.id !== id));
  };

  const startEditing = (id: string) => {
    setEditingRowId(id);
    setDeliveryRows(prev => prev.map(row => ({
      ...row,
      isEditing: row.id === id
    })));
  };

  const stopEditing = () => {
    setEditingRowId(null);
    setDeliveryRows(prev => prev.map(row => ({
      ...row,
      isEditing: false
    })));
  };

  const saveRow = (id: string) => {
    const row = deliveryRows.find(r => r.id === id);
    if (!row) return;

    if (!row.customerId) {
      toast.error('Please select a customer');
      return;
    }

    // Create or update order
    const orderItems = [];
    if (row.GGH > 0) orderItems.push({ productId: 'ggh', quantity: row.GGH, unitPrice: 60 });
    if (row.GGH450 > 0) orderItems.push({ productId: 'ggh450', quantity: row.GGH450, unitPrice: 65 });
    if (row.GTSF > 0) orderItems.push({ productId: 'gtsf', quantity: row.GTSF, unitPrice: 50 });
    if (row.GSD1KG > 0) orderItems.push({ productId: 'gsd1kg', quantity: row.GSD1KG, unitPrice: 45 });
    if (row.GPC > 0) orderItems.push({ productId: 'gpc', quantity: row.GPC, unitPrice: 55 });
    if (row.FL > 0) orderItems.push({ productId: 'fl', quantity: row.FL, unitPrice: 40 });

    if (orderItems.length > 0) {
      const orderData = {
        customerId: row.customerId,
        customerName: row.customerName,
        date: sheetDate,
        items: orderItems,
        total: row.AMOUNT,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        area: row.area,
        totalQty: row.QTY,
        amount: row.AMOUNT
      };

      addOrder(orderData);
      toast.success('Order saved successfully');
    }

    stopEditing();
  };

  const saveDeliverySheet = () => {
    const validRows = deliveryRows.filter(row => row.QTY > 0);
    
    if (validRows.length === 0) {
      toast.error('No valid entries to save');
      return;
    }

    const sheetData = {
      date: sheetDate,
      area: sheetArea,
      items: validRows,
      totals: getTotals()
    };

    if (onSave) {
      onSave(sheetData);
    }

    toast.success('Delivery sheet saved successfully');
  };

  const getTotals = () => {
    return deliveryRows.reduce((acc, row) => ({
      GGH: acc.GGH + row.GGH,
      GGH450: acc.GGH450 + row.GGH450,
      GTSF: acc.GTSF + row.GTSF,
      GSD1KG: acc.GSD1KG + row.GSD1KG,
      GPC: acc.GPC + row.GPC,
      FL: acc.FL + row.FL,
      QTY: acc.QTY + row.QTY,
      AMOUNT: acc.AMOUNT + row.AMOUNT
    }), {
      GGH: 0, GGH450: 0, GTSF: 0, GSD1KG: 0, GPC: 0, FL: 0, QTY: 0, AMOUNT: 0
    });
  };

  const totals = getTotals();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="neo-noir-card">
        <CardHeader>
          <CardTitle className="neo-noir-text flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editable Delivery Sheet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label className="neo-noir-text">Date</Label>
                <Input
                  type="date"
                  value={sheetDate}
                  onChange={(e) => setSheetDate(e.target.value)}
                  className="neo-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="neo-noir-text">Area</Label>
                <Select value={sheetArea} onValueChange={setSheetArea}>
                  <SelectTrigger className="neo-input w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {Array.from(new Set(customers.map(c => c.area))).filter(Boolean).map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addNewRow} className="neo-button-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
              <Button variant="outline" onClick={saveDeliverySheet} className="neo-button-outline">
                <Save className="mr-2 h-4 w-4" />
                Save Sheet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="neo-noir-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm font-medium neo-noir-text-muted">Customers</p>
                <p className="text-2xl font-bold neo-noir-text">{deliveryRows.filter(r => r.QTY > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neo-noir-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium neo-noir-text-muted">Total Qty</p>
                <p className="text-2xl font-bold neo-noir-text">{totals.QTY}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neo-noir-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <IndianRupee className="h-8 w-8 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm font-medium neo-noir-text-muted">Total Amount</p>
                <p className="text-2xl font-bold neo-noir-text">₹{totals.AMOUNT.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neo-noir-card">
          <CardContent className="p-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-400" />
              <div className="ml-3">
                <p className="text-sm font-medium neo-noir-text-muted">Area</p>
                <p className="text-2xl font-bold neo-noir-text">{sheetArea === 'all' ? 'All' : sheetArea}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Sheet Table */}
      <Card className="neo-noir-card">
        <CardHeader>
          <CardTitle className="neo-noir-text">Delivery Sheet Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="neo-noir-text">Customer</TableHead>
                  <TableHead className="neo-noir-text">Area</TableHead>
                  <TableHead className="neo-noir-text text-center">GGH</TableHead>
                  <TableHead className="neo-noir-text text-center">GGH450</TableHead>
                  <TableHead className="neo-noir-text text-center">GTSF</TableHead>
                  <TableHead className="neo-noir-text text-center">GSD1KG</TableHead>
                  <TableHead className="neo-noir-text text-center">GPC</TableHead>
                  <TableHead className="neo-noir-text text-center">F&L</TableHead>
                  <TableHead className="neo-noir-text text-center">QTY</TableHead>
                  <TableHead className="neo-noir-text text-center">AMOUNT</TableHead>
                  <TableHead className="neo-noir-text text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryRows.map((row) => (
                  <TableRow key={row.id} className="border-slate-700">
                    <TableCell className="min-w-48">
                      {row.isEditing ? (
                        <Select value={row.customerId} onValueChange={(value) => {
                          const customer = customers.find(c => c.id === value);
                          updateRow(row.id, 'customerId', value);
                          updateRow(row.id, 'customerName', customer?.name || '');
                          updateRow(row.id, 'area', customer?.area || '');
                        }}>
                          <SelectTrigger className="neo-input">
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="neo-noir-text">{row.customerName}</span>
                      )}
                    </TableCell>
                    <TableCell className="neo-noir-text">{row.area}</TableCell>
                    <TableCell className="text-center">
                      {row.isEditing ? (
                        <Input
                          type="number"
                          value={row.GGH}
                          onChange={(e) => updateRow(row.id, 'GGH', Number(e.target.value))}
                          className="neo-input w-16 text-center"
                          min="0"
                        />
                      ) : (
                        <span className="neo-noir-text">{row.GGH || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.isEditing ? (
                        <Input
                          type="number"
                          value={row.GGH450}
                          onChange={(e) => updateRow(row.id, 'GGH450', Number(e.target.value))}
                          className="neo-input w-16 text-center"
                          min="0"
                        />
                      ) : (
                        <span className="neo-noir-text">{row.GGH450 || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.isEditing ? (
                        <Input
                          type="number"
                          value={row.GTSF}
                          onChange={(e) => updateRow(row.id, 'GTSF', Number(e.target.value))}
                          className="neo-input w-16 text-center"
                          min="0"
                        />
                      ) : (
                        <span className="neo-noir-text">{row.GTSF || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.isEditing ? (
                        <Input
                          type="number"
                          value={row.GSD1KG}
                          onChange={(e) => updateRow(row.id, 'GSD1KG', Number(e.target.value))}
                          className="neo-input w-16 text-center"
                          min="0"
                        />
                      ) : (
                        <span className="neo-noir-text">{row.GSD1KG || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.isEditing ? (
                        <Input
                          type="number"
                          value={row.GPC}
                          onChange={(e) => updateRow(row.id, 'GPC', Number(e.target.value))}
                          className="neo-input w-16 text-center"
                          min="0"
                        />
                      ) : (
                        <span className="neo-noir-text">{row.GPC || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.isEditing ? (
                        <Input
                          type="number"
                          value={row.FL}
                          onChange={(e) => updateRow(row.id, 'FL', Number(e.target.value))}
                          className="neo-input w-16 text-center"
                          min="0"
                        />
                      ) : (
                        <span className="neo-noir-text">{row.FL || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="neo-noir-text font-semibold">{row.QTY}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="neo-noir-text font-semibold">₹{row.AMOUNT.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1">
                        {row.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveRow(row.id)}
                              className="neo-button-primary h-8 w-8 p-0"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={stopEditing}
                              className="neo-button-outline h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(row.id)}
                              className="neo-button-outline h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteRow(row.id)}
                              className="neo-button-outline h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Totals Row */}
                <TableRow className="border-slate-700 bg-slate-800/50">
                  <TableCell className="neo-noir-text font-bold">TOTAL</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.GGH}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.GGH450}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.GTSF}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.GSD1KG}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.GPC}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.FL}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">{totals.QTY}</TableCell>
                  <TableCell className="text-center neo-noir-text font-bold">₹{totals.AMOUNT.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
