
import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Search, 
  Plus,
  Eye,
  Calendar,
  Truck,
  User,
  Package,
  Filter,
  BarChart3
} from 'lucide-react';

export default function TrackSheetHistory() {
  const { trackSheets, deleteTrackSheet } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTrackSheet, setSelectedTrackSheet] = useState<any>(null);
  
  // Get unique areas and vehicles for filtering
  const areas = Array.from(new Set(trackSheets.map(sheet => sheet.area).filter(Boolean)));
  const vehicles = Array.from(new Set(trackSheets.map(sheet => sheet.vehicleName).filter(Boolean)));
  
  // Filter track sheets
  const filteredTrackSheets = trackSheets.filter(sheet => {
    const matchesSearch = 
      sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.salesmanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.area?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sheet.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const sheetDate = new Date(sheet.date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - sheetDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this track sheet?')) {
      deleteTrackSheet(id);
      toast.success('Track sheet deleted successfully');
    }
  };

  const calculateTotals = (trackSheet: any) => {
    const totalQuantity = trackSheet.rows?.reduce((sum: number, row: any) => sum + (row.total || 0), 0) || 0;
    const totalAmount = trackSheet.rows?.reduce((sum: number, row: any) => sum + (row.amount || 0), 0) || trackSheet.totalAmount || 0;
    return { totalQuantity, totalAmount };
  };

  const getProductSummary = (trackSheet: any) => {
    if (!trackSheet.rows) return {};
    
    const summary: Record<string, number> = {};
    trackSheet.rows.forEach((row: any) => {
      if (row.quantities) {
        Object.entries(row.quantities).forEach(([productName, qty]: [string, any]) => {
          summary[productName] = (summary[productName] || 0) + (Number(qty) || 0);
        });
      }
    });
    return summary;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-400" />
              Track Sheet History
            </h1>
            <p className="text-slate-300">View and manage all track sheets</p>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/track-sheet-advanced'} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Track Sheet
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search track sheets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {filteredTrackSheets.length} sheets
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {filteredTrackSheets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{filteredTrackSheets.length}</div>
                <div className="text-blue-300 text-sm">Total Sheets</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Package className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {filteredTrackSheets.reduce((sum, sheet) => {
                    const { totalQuantity } = calculateTotals(sheet);
                    return sum + totalQuantity;
                  }, 0)}
                </div>
                <div className="text-green-300 text-sm">Total Items</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  ₹{filteredTrackSheets.reduce((sum, sheet) => {
                    const { totalAmount } = calculateTotals(sheet);
                    return sum + totalAmount;
                  }, 0).toFixed(2)}
                </div>
                <div className="text-purple-300 text-sm">Total Value</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Truck className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {new Set(filteredTrackSheets.map(s => s.vehicleId)).size}
                </div>
                <div className="text-orange-300 text-sm">Vehicles Used</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Track Sheets Table */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 bg-slate-800/50">
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Vehicle</TableHead>
                    <TableHead className="text-slate-300">Salesman</TableHead>
                    <TableHead className="text-slate-300">Area</TableHead>
                    <TableHead className="text-slate-300">Items</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrackSheets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-8 w-8 text-slate-400" />
                          <p className="text-slate-400">No track sheets found</p>
                          <Button 
                            onClick={() => window.location.href = '/track-sheet-advanced'} 
                            variant="outline"
                            className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                          >
                            Create your first track sheet
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrackSheets.map((sheet) => {
                      const { totalQuantity, totalAmount } = calculateTotals(sheet);
                      
                      return (
                        <TableRow key={sheet.id} className="border-slate-700 hover:bg-slate-800/30">
                          <TableCell className="font-medium text-white">{sheet.name}</TableCell>
                          <TableCell className="text-slate-300">
                            {format(new Date(sheet.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="text-slate-300">{sheet.vehicleName || '-'}</TableCell>
                          <TableCell className="text-slate-300">{sheet.salesmanName || '-'}</TableCell>
                          <TableCell className="text-slate-300">{sheet.area || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              {totalQuantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              ₹{totalAmount.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(sheet.status)}>
                              {sheet.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedTrackSheet(sheet)}
                                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Track Sheet Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedTrackSheet && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-semibold">Basic Info</h4>
                                          <div className="text-sm space-y-1 text-slate-600">
                                            <p>Date: {format(new Date(selectedTrackSheet.date), 'dd/MM/yyyy')}</p>
                                            <p>Vehicle: {selectedTrackSheet.vehicleName}</p>
                                            <p>Salesman: {selectedTrackSheet.salesmanName}</p>
                                            <p>Area: {selectedTrackSheet.area}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold">Summary</h4>
                                          <div className="text-sm space-y-1 text-slate-600">
                                            <p>Total Items: {calculateTotals(selectedTrackSheet).totalQuantity}</p>
                                            <p>Total Amount: ₹{calculateTotals(selectedTrackSheet).totalAmount.toFixed(2)}</p>
                                            <p>Customers: {selectedTrackSheet.rows?.length || 0}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-semibold mb-2">Product Summary</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                          {Object.entries(getProductSummary(selectedTrackSheet)).map(([product, qty]) => (
                                            <div key={product} className="bg-slate-100 p-2 rounded text-sm">
                                              <div className="font-medium">{product}</div>
                                              <div className="text-slate-600">{qty as number}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                                onClick={() => handleDelete(sheet.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
