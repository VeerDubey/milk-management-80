import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Calendar,
  Truck,
  Users,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  FileText,
  Building2
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DateRange } from 'react-day-picker';

interface DeliverySheet {
  id: string;
  date: Date;
  sheetNumber: string;
  company: string;
  route: string;
  driverName: string;
  vehicleNumber: string;
  status: 'draft' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  deliveredItems: number;
  pendingItems: number;
  entries: DeliveryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeliveryEntry {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  rate: number;
  total: number;
  delivered: boolean;
  deliveredAt?: Date;
  remarks: string;
  status: 'pending' | 'delivered' | 'partial' | 'cancelled';
}

const mockDeliverySheets: DeliverySheet[] = [
  {
    id: '1',
    date: new Date(),
    sheetNumber: 'DS-2024-001',
    company: 'Amul',
    route: 'Route A - Central',
    driverName: 'Rajesh Kumar',
    vehicleNumber: 'GJ-01-AB-1234',
    status: 'delivered',
    totalItems: 15,
    totalQuantity: 250,
    totalAmount: 12500,
    deliveredItems: 15,
    pendingItems: 0,
    entries: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    date: subDays(new Date(), 1),
    sheetNumber: 'DS-2024-002',
    company: 'Gokul',
    route: 'Route B - North',
    driverName: 'Amit Patel',
    vehicleNumber: 'GJ-02-CD-5678',
    status: 'in-transit',
    totalItems: 12,
    totalQuantity: 180,
    totalAmount: 9000,
    deliveredItems: 8,
    pendingItems: 4,
    entries: [],
    createdAt: subDays(new Date(), 1),
    updatedAt: new Date(),
  },
  {
    id: '3',
    date: subDays(new Date(), 2),
    sheetNumber: 'DS-2024-003',
    company: 'Vikas Milk',
    route: 'Route C - South',
    driverName: 'Suresh Singh',
    vehicleNumber: 'GJ-03-EF-9012',
    status: 'confirmed',
    totalItems: 20,
    totalQuantity: 300,
    totalAmount: 15000,
    deliveredItems: 0,
    pendingItems: 20,
    entries: [],
    createdAt: subDays(new Date(), 2),
    updatedAt: subDays(new Date(), 1),
  },
];

export default function DeliverySheetManager() {
  const { customers, products } = useData();
  const [deliverySheets, setDeliverySheets] = useState<DeliverySheet[]>(mockDeliverySheets);
  const [selectedSheet, setSelectedSheet] = useState<DeliverySheet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  // Filter delivery sheets
  const filteredSheets = useMemo(() => {
    return deliverySheets.filter(sheet => {
      // Search filter
      if (searchQuery && !sheet.sheetNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !sheet.driverName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !sheet.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all' && sheet.status !== statusFilter) {
        return false;
      }
      
      // Company filter
      if (companyFilter !== 'all' && sheet.company !== companyFilter) {
        return false;
      }
      
      // Route filter
      if (routeFilter !== 'all' && sheet.route !== routeFilter) {
        return false;
      }
      
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const sheetDate = sheet.date;
        if (sheetDate < dateRange.from || sheetDate > dateRange.to) {
          return false;
        }
      }
      
      return true;
    });
  }, [deliverySheets, searchQuery, statusFilter, companyFilter, routeFilter, dateRange]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = filteredSheets.length;
    const delivered = filteredSheets.filter(s => s.status === 'delivered').length;
    const inTransit = filteredSheets.filter(s => s.status === 'in-transit').length;
    const pending = filteredSheets.filter(s => s.status === 'confirmed').length;
    const totalAmount = filteredSheets.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalQuantity = filteredSheets.reduce((sum, s) => sum + s.totalQuantity, 0);
    
    return { total, delivered, inTransit, pending, totalAmount, totalQuantity };
  }, [filteredSheets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'in-transit': return 'bg-blue-500';
      case 'confirmed': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in-transit': return <Truck className="h-4 w-4" />;
      case 'confirmed': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCreateNew = () => {
    window.location.href = '/delivery-sheet-bulk';
  };

  const handleViewSheet = (sheet: DeliverySheet) => {
    setSelectedSheet(sheet);
  };

  const handleEditSheet = (sheet: DeliverySheet) => {
    toast.info(`Editing delivery sheet ${sheet.sheetNumber}`);
    // Navigate to edit mode
  };

  const handleDeleteSheet = (sheet: DeliverySheet) => {
    setDeliverySheets(prev => prev.filter(s => s.id !== sheet.id));
    toast.success(`Deleted delivery sheet ${sheet.sheetNumber}`);
  };

  const handlePrintSheet = (sheet: DeliverySheet) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = `
      <html>
        <head>
          <title>Delivery Sheet - ${sheet.sheetNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .sheet-info { display: flex; justify-content: space-between; margin: 20px 0; }
            .info-section { flex: 1; margin: 0 10px; }
            .info-title { font-weight: bold; margin-bottom: 5px; }
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
            <div class="company-name">${sheet.company}</div>
            <div>Delivery Sheet - ${sheet.sheetNumber}</div>
            <div>Date: ${format(sheet.date, 'dd MMM yyyy')}</div>
          </div>
          
          <div class="sheet-info">
            <div class="info-section">
              <div class="info-title">Route Information</div>
              <div>Route: ${sheet.route}</div>
              <div>Driver: ${sheet.driverName}</div>
              <div>Vehicle: ${sheet.vehicleNumber}</div>
            </div>
            <div class="info-section">
              <div class="info-title">Delivery Summary</div>
              <div>Total Items: ${sheet.totalItems}</div>
              <div>Total Quantity: ${sheet.totalQuantity}</div>
              <div>Total Amount: ₹${sheet.totalAmount}</div>
              <div>Status: ${sheet.status.toUpperCase()}</div>
            </div>
          </div>
          
          <div class="totals">
            <div>Delivered: ${sheet.deliveredItems} | Pending: ${sheet.pendingItems}</div>
            <div>Grand Total: ₹${sheet.totalAmount}</div>
          </div>
          
          <div class="signatures">
            <div class="signature-box">Delivered By<br>${sheet.driverName}</div>
            <div class="signature-box">Received By<br>Customer</div>
            <div class="signature-box">Supervisor<br>_____________</div>
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
          <h1 className="text-3xl font-bold tracking-tight">Delivery Sheet Manager</h1>
          <p className="text-muted-foreground">
            View, manage and track all delivery sheets
          </p>
        </div>
        
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create New Sheet
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Sheets</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.delivered}</div>
                <div className="text-sm text-muted-foreground">Delivered</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.inTransit}</div>
                <div className="text-sm text-muted-foreground">In Transit</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.totalQuantity}</div>
                <div className="text-sm text-muted-foreground">Total Qty</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">₹{summaryStats.totalAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sheet number, driver, vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Company</label>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="Amul">Amul</SelectItem>
                  <SelectItem value="Gokul">Gokul</SelectItem>
                  <SelectItem value="Vikas Milk">Vikas Milk</SelectItem>
                  <SelectItem value="Mother Dairy">Mother Dairy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Route</label>
              <Select value={routeFilter} onValueChange={setRouteFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  <SelectItem value="Route A - Central">Route A - Central</SelectItem>
                  <SelectItem value="Route B - North">Route B - North</SelectItem>
                  <SelectItem value="Route C - South">Route C - South</SelectItem>
                  <SelectItem value="Route D - East">Route D - East</SelectItem>
                  <SelectItem value="Route E - West">Route E - West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <DatePickerWithRange
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'cards')}>
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredSheets.length} of {deliverySheets.length} delivery sheets
        </div>
      </div>

      {/* Delivery Sheets Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSheets.map((sheet) => (
            <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sheet.sheetNumber}</CardTitle>
                  <Badge className={`${getStatusColor(sheet.status)} text-white`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(sheet.status)}
                      {sheet.status}
                    </span>
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(sheet.date, 'dd MMM yyyy')} • {sheet.company}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Route</div>
                    <div>{sheet.route}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Driver</div>
                    <div>{sheet.driverName}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Vehicle</div>
                    <div>{sheet.vehicleNumber}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Items</div>
                    <div>{sheet.totalItems}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">₹{sheet.totalAmount.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">({sheet.totalQuantity} qty)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600">{sheet.deliveredItems} delivered</div>
                    <div className="text-orange-600">{sheet.pendingItems} pending</div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedSheet(sheet)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Delivery Sheet Details - {sheet.sheetNumber}</DialogTitle>
                        <DialogDescription>
                          Complete details and status of delivery sheet
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="font-medium text-muted-foreground">Date</div>
                            <div>{format(sheet.date, 'dd MMM yyyy')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Company</div>
                            <div>{sheet.company}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Route</div>
                            <div>{sheet.route}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Status</div>
                            <Badge className={`${getStatusColor(sheet.status)} text-white`}>
                              {sheet.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="font-medium text-muted-foreground">Driver</div>
                            <div>{sheet.driverName}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Vehicle</div>
                            <div>{sheet.vehicleNumber}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Total Items</div>
                            <div>{sheet.totalItems}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Total Amount</div>
                            <div>₹{sheet.totalAmount.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" variant="outline" onClick={() => handleEditSheet(sheet)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  
                  <Button size="sm" variant="outline" onClick={() => handlePrintSheet(sheet)}>
                    <Printer className="mr-1 h-3 w-3" />
                    Print
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteSheet(sheet)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sheet Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSheets.map((sheet) => (
                  <TableRow key={sheet.id}>
                    <TableCell className="font-medium">{sheet.sheetNumber}</TableCell>
                    <TableCell>{format(sheet.date, 'dd MMM yyyy')}</TableCell>
                    <TableCell>{sheet.company}</TableCell>
                    <TableCell>{sheet.route}</TableCell>
                    <TableCell>{sheet.driverName}</TableCell>
                    <TableCell>{sheet.vehicleNumber}</TableCell>
                    <TableCell>{sheet.totalItems}</TableCell>
                    <TableCell>₹{sheet.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(sheet.status)} text-white`}>
                        {sheet.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleViewSheet(sheet)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditSheet(sheet)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePrintSheet(sheet)}>
                          <Printer className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteSheet(sheet)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredSheets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No delivery sheets found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new delivery sheet.
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Sheet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}