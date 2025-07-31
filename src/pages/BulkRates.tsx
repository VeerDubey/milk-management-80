import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Upload, 
  Download, 
  Save, 
  RefreshCw, 
  DollarSign, 
  Package,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { exportToPdf, exportToExcel } from '@/utils/exportUtils';
import { toast } from 'sonner';

interface BulkRateUpdate {
  productId: string;
  productName: string;
  currentRate: number;
  newRate: number;
  category: string;
  unit: string;
  changePercent: number;
  status: 'pending' | 'applied' | 'rejected';
}

export default function BulkRates() {
  const { products, updateProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rateUpdates, setRateUpdates] = useState<BulkRateUpdate[]>([]);
  const [bulkPercentage, setBulkPercentage] = useState('');
  const [bulkAmount, setBulkAmount] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Initialize rate updates from current products
  React.useEffect(() => {
    const updates: BulkRateUpdate[] = products.map(product => ({
      productId: product.id,
      productName: product.name,
      currentRate: (product as any).price || 0,
      newRate: (product as any).price || 0,
      category: (product as any).category || 'General',
      unit: product.unit || 'Ltr',
      changePercent: 0,
      status: 'pending' as const
    }));
    setRateUpdates(updates);
  }, [products]);

  const filteredUpdates = useMemo(() => {
    return rateUpdates.filter(update => {
      const matchesSearch = update.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || update.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [rateUpdates, searchTerm, categoryFilter]);

  const handleRateChange = (productId: string, newRate: string) => {
    const rate = parseFloat(newRate) || 0;
    setRateUpdates(prev => prev.map(update => {
      if (update.productId === productId) {
        const changePercent = update.currentRate > 0 
          ? ((rate - update.currentRate) / update.currentRate * 100)
          : 0;
        return {
          ...update,
          newRate: rate,
          changePercent,
          status: 'pending' as const
        };
      }
      return update;
    }));
  };

  const applyBulkPercentage = () => {
    const percentage = parseFloat(bulkPercentage);
    if (isNaN(percentage)) {
      toast.error('Please enter a valid percentage');
      return;
    }

    const productsToUpdate = selectedProducts.length > 0 
      ? filteredUpdates.filter(u => selectedProducts.includes(u.productId))
      : filteredUpdates;

    setRateUpdates(prev => prev.map(update => {
      if (productsToUpdate.some(p => p.productId === update.productId)) {
        const newRate = update.currentRate * (1 + percentage / 100);
        return {
          ...update,
          newRate: Math.round(newRate * 100) / 100,
          changePercent: percentage,
          status: 'pending' as const
        };
      }
      return update;
    }));

    toast.success(`Applied ${percentage}% change to ${productsToUpdate.length} products`);
  };

  const applyBulkAmount = () => {
    const amount = parseFloat(bulkAmount);
    if (isNaN(amount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    const productsToUpdate = selectedProducts.length > 0 
      ? filteredUpdates.filter(u => selectedProducts.includes(u.productId))
      : filteredUpdates;

    setRateUpdates(prev => prev.map(update => {
      if (productsToUpdate.some(p => p.productId === update.productId)) {
        const newRate = update.currentRate + amount;
        const changePercent = update.currentRate > 0 
          ? (amount / update.currentRate * 100)
          : 0;
        return {
          ...update,
          newRate: Math.max(0, Math.round(newRate * 100) / 100),
          changePercent,
          status: 'pending' as const
        };
      }
      return update;
    }));

    toast.success(`Applied ₹${amount} change to ${productsToUpdate.length} products`);
  };

  const saveAllChanges = async () => {
    const changedUpdates = rateUpdates.filter(update => 
      update.newRate !== update.currentRate && update.status === 'pending'
    );

    try {
      for (const update of changedUpdates) {
        await updateProduct(update.productId, { price: update.newRate });
      }

      setRateUpdates(prev => prev.map(update => ({
        ...update,
        currentRate: update.newRate,
        changePercent: 0,
        status: 'applied' as const
      })));

      toast.success(`Successfully updated ${changedUpdates.length} product rates`);
    } catch (error) {
      toast.error('Failed to update product rates');
    }
  };

  const resetChanges = () => {
    setRateUpdates(prev => prev.map(update => ({
      ...update,
      newRate: update.currentRate,
      changePercent: 0,
      status: 'pending' as const
    })));
    setSelectedProducts([]);
    setBulkPercentage('');
    setBulkAmount('');
    toast.info('All changes have been reset');
  };

  const exportData = (format: 'pdf' | 'excel') => {
    const headers = ['Product Name', 'Category', 'Current Rate', 'New Rate', 'Change %', 'Unit', 'Status'];
    const data = filteredUpdates.map(update => [
      update.productName,
      update.category,
      `₹${update.currentRate}`,
      `₹${update.newRate}`,
      `${update.changePercent.toFixed(2)}%`,
      update.unit,
      update.status
    ]);

    if (format === 'pdf') {
      exportToPdf(headers, data, {
        title: 'Bulk Rate Updates',
        filename: 'bulk-rate-updates.pdf'
      });
    } else {
      const excelData = filteredUpdates.map(update => ({
        'Product Name': update.productName,
        'Category': update.category,
        'Current Rate': `₹${update.currentRate}`,
        'New Rate': `₹${update.newRate}`,
        'Change %': `${update.changePercent.toFixed(2)}%`,
        'Unit': update.unit,
        'Status': update.status
      }));
      exportToExcel(excelData, 'bulk-rate-updates.xlsx');
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(filteredUpdates.map(u => u.productId));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const pendingChanges = rateUpdates.filter(u => u.newRate !== u.currentRate).length;
  const totalIncrease = rateUpdates.reduce((sum, u) => sum + (u.newRate - u.currentRate), 0);
  const categories = Array.from(new Set(rateUpdates.map(u => u.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bulk Rate Update
            </h1>
            <p className="text-slate-400 mt-2">Update product rates in bulk with advanced controls</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => exportData('excel')}
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportData('pdf')}
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Products</p>
                  <p className="text-2xl font-bold text-white">{rateUpdates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Pending Changes</p>
                  <p className="text-2xl font-bold text-white">{pendingChanges}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Impact</p>
                  <p className="text-2xl font-bold text-white">
                    {totalIncrease >= 0 ? '+' : ''}₹{totalIncrease.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Selected</p>
                  <p className="text-2xl font-bold text-white">{selectedProducts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Update Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Bulk Update Controls</CardTitle>
            <CardDescription className="text-slate-400">
              Apply percentage or amount changes to selected products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Percentage Change</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="e.g., 10 for 10% increase"
                    value={bulkPercentage}
                    onChange={(e) => setBulkPercentage(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <Button onClick={applyBulkPercentage} className="bg-blue-600 hover:bg-blue-700">
                    Apply %
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Amount Change</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="e.g., 5 for ₹5 increase"
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <Button onClick={applyBulkAmount} className="bg-green-600 hover:bg-green-700">
                    Apply ₹
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Selection Controls</label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={selectAllProducts}
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearSelection}
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px] bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rate Updates Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-orange-400">Product Rate Updates</CardTitle>
                <CardDescription className="text-slate-400">
                  Showing {filteredUpdates.length} of {rateUpdates.length} products
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetChanges}
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={saveAllChanges} 
                  disabled={pendingChanges === 0}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes ({pendingChanges})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredUpdates.length && filteredUpdates.length > 0}
                        onChange={(e) => e.target.checked ? selectAllProducts() : clearSelection()}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">Product</TableHead>
                    <TableHead className="text-slate-300">Category</TableHead>
                    <TableHead className="text-slate-300">Current Rate</TableHead>
                    <TableHead className="text-slate-300">New Rate</TableHead>
                    <TableHead className="text-slate-300">Change</TableHead>
                    <TableHead className="text-slate-300">Unit</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUpdates.map((update) => (
                    <TableRow key={update.productId} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(update.productId)}
                          onChange={() => toggleProductSelection(update.productId)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{update.productName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                          {update.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">₹{update.currentRate.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={update.newRate}
                          onChange={(e) => handleRateChange(update.productId, e.target.value)}
                          className="w-24 bg-slate-700/50 border-slate-600 text-white"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${
                          update.changePercent > 0 ? 'text-green-400' : 
                          update.changePercent < 0 ? 'text-red-400' : 'text-slate-400'
                        }`}>
                          {update.changePercent > 0 && '+'}
                          {update.changePercent.toFixed(2)}%
                          <span className="text-xs">
                            (₹{(update.newRate - update.currentRate).toFixed(2)})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{update.unit}</TableCell>
                      <TableCell>
                        <Badge className={
                          update.status === 'applied' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                          update.newRate !== update.currentRate ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                          'bg-slate-500/20 text-slate-400 border-slate-500/50'
                        }>
                          {update.status === 'applied' ? 'Applied' : 
                           update.newRate !== update.currentRate ? 'Modified' : 'Unchanged'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
