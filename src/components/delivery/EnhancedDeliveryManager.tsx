
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { DeliverySheetForm } from './DeliverySheetForm';
import { DeliverySheetTable } from './DeliverySheetTable';
import { downloadDeliverySheetPDF, exportToExcel, printDeliverySheet } from '@/utils/deliverySheetUtils';
import { generateDeliverySheetPDF } from '@/utils/pdf-generator';
import { exportDeliverySheetToExcel } from '@/utils/excel-generator';
import { toast } from 'sonner';
import { 
  FormInput, 
  Table, 
  FileText, 
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Building2,
  MapPin,
  Users,
  Package,
  TrendingUp,
  Clock
} from 'lucide-react';
import { DeliverySheetData } from '@/types/delivery';

export const EnhancedDeliveryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [deliverySheets, setDeliverySheets] = useState<DeliverySheetData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Date>();
  const [filterCompany, setFilterCompany] = useState('');
  const [filterRoute, setFilterRoute] = useState('');

  const handleSaveDeliverySheet = (data: DeliverySheetData) => {
    setDeliverySheets([...deliverySheets, data]);
    toast.success('Delivery sheet saved successfully!');
  };

  const handleExportPDF = (data: DeliverySheetData) => {
    try {
      generateDeliverySheetPDF(data);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleExportExcel = (data: DeliverySheetData) => {
    try {
      exportDeliverySheetToExcel(data);
      toast.success('Excel file generated successfully!');
    } catch (error) {
      toast.error('Failed to generate Excel file');
    }
  };

  const handlePrint = (data: DeliverySheetData) => {
    try {
      printDeliverySheet(data);
      toast.success('Print dialog opened');
    } catch (error) {
      toast.error('Failed to print delivery sheet');
    }
  };

  const filteredSheets = deliverySheets.filter(sheet => {
    const matchesSearch = sheet.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.items.some(item => item.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDate = !filterDate || sheet.date === filterDate.toISOString().split('T')[0];
    const matchesRoute = !filterRoute || sheet.area === filterRoute;
    
    return matchesSearch && matchesDate && matchesRoute;
  });

  const stats = {
    totalSheets: deliverySheets.length,
    totalCustomers: new Set(deliverySheets.flatMap(sheet => sheet.items.map(item => item.customerName))).size,
    totalAmount: deliverySheets.reduce((sum, sheet) => sum + sheet.totals.AMOUNT, 0),
    totalQuantity: deliverySheets.reduce((sum, sheet) => sum + sheet.totals.QTY, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Delivery Sheet Manager</h1>
          <p className="text-muted-foreground">
            Complete delivery management system with form and tabular entry modes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            Vikas Milk Centre
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSheets}</p>
                <p className="text-sm text-muted-foreground">Total Sheets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalQuantity}</p>
                <p className="text-sm text-muted-foreground">Total Qty</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">₹{stats.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FormInput className="h-4 w-4" />
            Form Entry
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Tabular Entry
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Manage Sheets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <DeliverySheetForm onSave={handleSaveDeliverySheet} />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <DeliverySheetTable onSave={handleSaveDeliverySheet} />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Search by customer or area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <DatePicker 
                    date={filterDate} 
                    setDate={setFilterDate}
                    placeholder="Filter by date"
                  />
                </div>
                <div>
                  <Select value={filterRoute} onValueChange={setFilterRoute}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Routes</SelectItem>
                      {Array.from(new Set(deliverySheets.map(sheet => sheet.area))).map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterDate(undefined);
                      setFilterRoute('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Sheets List */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Sheets ({filteredSheets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSheets.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Delivery Sheets Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {deliverySheets.length === 0 
                      ? 'Create your first delivery sheet to get started'
                      : 'No sheets match your current filters'
                    }
                  </p>
                  <Button onClick={() => setActiveTab('form')}>
                    Create Delivery Sheet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSheets.map((sheet, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <h3 className="font-semibold">Delivery Sheet #{index + 1}</h3>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(sheet.date).toLocaleDateString()}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {sheet.area}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sheet.items.length} items • ₹{sheet.totals.AMOUNT.toFixed(2)} total
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportPDF(sheet)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportExcel(sheet)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              Excel
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrint(sheet)}
                              className="flex items-center gap-1"
                            >
                              <Printer className="h-4 w-4" />
                              Print
                            </Button>
                          </div>
                        </div>
                        
                        {/* Items Preview */}
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Customer</th>
                                <th className="text-right p-2">Qty</th>
                                <th className="text-right p-2">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sheet.items.slice(0, 3).map((item, itemIndex) => (
                                <tr key={itemIndex} className="border-b">
                                  <td className="p-2">{item.customerName}</td>
                                  <td className="p-2 text-right">{item.totalQty}</td>
                                  <td className="p-2 text-right">₹{item.amount.toFixed(2)}</td>
                                </tr>
                              ))}
                              {sheet.items.length > 3 && (
                                <tr>
                                  <td colSpan={3} className="p-2 text-center text-muted-foreground">
                                    +{sheet.items.length - 3} more items
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
