
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Download, Printer, Calculator } from 'lucide-react';
import { DeliverySheetData } from '@/types/delivery';

interface TableRow {
  id: string;
  customerName: string;
  customerId: string;
  productName: string;
  productCode: string;
  quantity: number;
  rate: number;
  total: number;
  deliveryStatus: 'Pending' | 'Delivered';
}

interface DeliverySheetTableProps {
  onSave: (data: DeliverySheetData) => void;
}

export const DeliverySheetTable: React.FC<DeliverySheetTableProps> = ({ onSave }) => {
  const { customers, products } = useData();
  const [rows, setRows] = useState<TableRow[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);

  // Initialize with one empty row
  useEffect(() => {
    addRow();
  }, []);

  const addRow = () => {
    const newRow: TableRow = {
      id: `row_${Date.now()}`,
      customerName: '',
      customerId: '',
      productName: '',
      productCode: '',
      quantity: 0,
      rate: 0,
      total: 0,
      deliveryStatus: 'Pending'
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (rowId: string) => {
    if (rows.length === 1) {
      toast.error('At least one row is required');
      return;
    }
    setRows(rows.filter(row => row.id !== rowId));
    toast.success('Row deleted');
  };

  const updateRow = (rowId: string, field: string, value: any) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-calculate total when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedRow.total = updatedRow.quantity * updatedRow.rate;
        }
        
        // Auto-fill product details when product is selected
        if (field === 'productName') {
          const product = products.find(p => p.name === value);
          if (product) {
            updatedRow.productCode = product.code || product.id;
            updatedRow.rate = product.price || 0;
            updatedRow.total = updatedRow.quantity * updatedRow.rate;
          }
        }
        
        // Auto-fill customer ID when customer name is selected
        if (field === 'customerName') {
          const customer = customers.find(c => c.name === value);
          if (customer) {
            updatedRow.customerId = customer.id;
          }
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  const handleCellEdit = (rowId: string, field: string, value: string) => {
    let processedValue: any = value;
    
    if (field === 'quantity' || field === 'rate') {
      processedValue = parseFloat(value) || 0;
    }
    
    updateRow(rowId, field, processedValue);
  };

  const saveDeliverySheet = () => {
    const validRows = rows.filter(row => 
      row.customerName && row.productName && row.quantity > 0
    );
    
    if (validRows.length === 0) {
      toast.error('Please add at least one valid row with customer, product, and quantity');
      return;
    }

    const deliveryData: DeliverySheetData = {
      date: new Date().toISOString().split('T')[0],
      area: 'Multiple Areas',
      items: validRows.map(row => ({
        customerName: row.customerName,
        GGH: row.productCode === 'GGH' ? row.quantity : 0,
        GGH450: row.productCode === 'GGH450' ? row.quantity : 0,
        GTSF: row.productCode === 'GTSF' ? row.quantity : 0,
        GSD1KG: row.productCode === 'GSD1KG' ? row.quantity : 0,
        GPC: row.productCode === 'GPC' ? row.quantity : 0,
        FL: row.productCode === 'FL' ? row.quantity : 0,
        totalQty: row.quantity,
        amount: row.total
      })),
      totals: {
        GGH: validRows.filter(r => r.productCode === 'GGH').reduce((sum, r) => sum + r.quantity, 0),
        GGH450: validRows.filter(r => r.productCode === 'GGH450').reduce((sum, r) => sum + r.quantity, 0),
        GTSF: validRows.filter(r => r.productCode === 'GTSF').reduce((sum, r) => sum + r.quantity, 0),
        GSD1KG: validRows.filter(r => r.productCode === 'GSD1KG').reduce((sum, r) => sum + r.quantity, 0),
        GPC: validRows.filter(r => r.productCode === 'GPC').reduce((sum, r) => sum + r.quantity, 0),
        FL: validRows.filter(r => r.productCode === 'FL').reduce((sum, r) => sum + r.quantity, 0),
        QTY: validRows.reduce((sum, r) => sum + r.quantity, 0),
        AMOUNT: validRows.reduce((sum, r) => sum + r.total, 0)
      }
    };

    onSave(deliveryData);
    toast.success('Delivery sheet saved successfully');
  };

  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tabular Delivery Entry (Editable Spreadsheet)
          </span>
          <div className="flex gap-2">
            <Button onClick={addRow} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 text-left min-w-[200px]">Customer Name</th>
                <th className="border border-gray-200 p-2 text-left min-w-[200px]">Product Name</th>
                <th className="border border-gray-200 p-2 text-left min-w-[100px]">Product Code</th>
                <th className="border border-gray-200 p-2 text-right min-w-[100px]">Quantity</th>
                <th className="border border-gray-200 p-2 text-right min-w-[100px]">Rate</th>
                <th className="border border-gray-200 p-2 text-right min-w-[120px]">Total</th>
                <th className="border border-gray-200 p-2 text-center min-w-[120px]">Status</th>
                <th className="border border-gray-200 p-2 text-center min-w-[80px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-1">
                    <Select 
                      value={row.customerName} 
                      onValueChange={(value) => updateRow(row.id, 'customerName', value)}
                    >
                      <SelectTrigger className="h-8 border-none">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  
                  <td className="border border-gray-200 p-1">
                    <Select 
                      value={row.productName} 
                      onValueChange={(value) => updateRow(row.id, 'productName', value)}
                    >
                      <SelectTrigger className="h-8 border-none">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  
                  <td className="border border-gray-200 p-1">
                    <Input
                      value={row.productCode}
                      onChange={(e) => handleCellEdit(row.id, 'productCode', e.target.value)}
                      className="h-8 border-none"
                      placeholder="Code"
                    />
                  </td>
                  
                  <td className="border border-gray-200 p-1">
                    <Input
                      type="number"
                      value={row.quantity || ''}
                      onChange={(e) => handleCellEdit(row.id, 'quantity', e.target.value)}
                      className="h-8 border-none text-right"
                      placeholder="0"
                    />
                  </td>
                  
                  <td className="border border-gray-200 p-1">
                    <Input
                      type="number"
                      value={row.rate || ''}
                      onChange={(e) => handleCellEdit(row.id, 'rate', e.target.value)}
                      className="h-8 border-none text-right"
                      placeholder="0.00"
                    />
                  </td>
                  
                  <td className="border border-gray-200 p-2 text-right font-medium">
                    ₹{row.total.toFixed(2)}
                  </td>
                  
                  <td className="border border-gray-200 p-1">
                    <Select 
                      value={row.deliveryStatus} 
                      onValueChange={(value: 'Pending' | 'Delivered') => updateRow(row.id, 'deliveryStatus', value)}
                    >
                      <SelectTrigger className="h-8 border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  
                  <td className="border border-gray-200 p-1 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRow(row.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={5} className="border border-gray-200 p-2 text-right">
                  Grand Total:
                </td>
                <td className="border border-gray-200 p-2 text-right">
                  ₹{grandTotal.toFixed(2)}
                </td>
                <td colSpan={2} className="border border-gray-200 p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button onClick={saveDeliverySheet} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Delivery Sheet
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Sheet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
