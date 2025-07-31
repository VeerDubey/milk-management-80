import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, Minus, AlertTriangle, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function StockManagement() {
  const { products, stockEntries, addStockEntry, updateStockEntry, addStockTransaction } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newEntry, setNewEntry] = useState({
    productId: '',
    quantity: '',
    type: 'in' as 'in' | 'out',
    notes: ''
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockLevel = (productId: string) => {
    const entries = stockEntries.filter(entry => entry.productId === productId);
    const inStock = entries.filter(e => e.type === 'in').reduce((sum, e) => sum + e.quantity, 0);
    const outStock = entries.filter(e => e.type === 'out').reduce((sum, e) => sum + e.quantity, 0);
    return inStock - outStock;
  };

  const getStockStatus = (productId: string) => {
    const level = getStockLevel(productId);
    if (level <= 10) return { status: 'low', color: 'bg-red-500', text: 'Low Stock' };
    if (level <= 50) return { status: 'medium', color: 'bg-yellow-500', text: 'Medium Stock' };
    return { status: 'good', color: 'bg-green-500', text: 'Good Stock' };
  };

  const handleStockEntry = () => {
    if (!newEntry.productId || !newEntry.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product = products.find(p => p.id === newEntry.productId);
    const quantity = parseInt(newEntry.quantity);
    const unitPrice = product?.costPrice || product?.price || 0;

    const stockEntry = {
      date: new Date().toISOString().split('T')[0],
      supplierId: 'manual',
      items: [{
        productId: newEntry.productId,
        productName: product?.name || '',
        quantity: quantity,
        rate: unitPrice,
        amount: quantity * unitPrice,
        unitPrice: unitPrice,
        totalPrice: quantity * unitPrice,
        total: quantity * unitPrice
      }],
      totalAmount: quantity * unitPrice,
      notes: newEntry.notes,
      productId: newEntry.productId,
      type: newEntry.type,
      quantity: quantity
    };

    addStockEntry(stockEntry);
    
    // Also add as transaction for tracking
    addStockTransaction({
      productId: newEntry.productId,
      productName: product?.name || '',
      type: newEntry.type,
      quantity: quantity,
      date: new Date().toISOString().split('T')[0],
      notes: newEntry.notes
    });

    toast.success(`Stock ${newEntry.type === 'in' ? 'added' : 'removed'} successfully`);
    setNewEntry({ productId: '', quantity: '', type: 'in', notes: '' });
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-slate-300 mt-2">Monitor and manage inventory levels</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Stock Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Stock Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Product</Label>
                <Select value={newEntry.productId} onValueChange={(value) => setNewEntry({...newEntry, productId: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Quantity</Label>
                  <Input
                    type="number"
                    value={newEntry.quantity}
                    onChange={(e) => setNewEntry({...newEntry, quantity: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Type</Label>
                  <Select value={newEntry.type} onValueChange={(value: 'in' | 'out') => setNewEntry({...newEntry, type: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Stock In</SelectItem>
                      <SelectItem value="out">Stock Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Input
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Optional notes..."
                />
              </div>
              <Button onClick={handleStockEntry} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <Package className="w-4 h-4 mr-2 text-blue-400" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {products.filter(p => getStockLevel(p.id) <= 10).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              Stock Entries Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stockEntries.filter(e => e.date === new Date().toISOString().split('T')[0]).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2 text-purple-400" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Current Stock Levels</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map(product => {
              const stockLevel = getStockLevel(product.id);
              const status = getStockStatus(product.id);
              
              return (
                <div key={product.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-slate-300">{product.code} • {product.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{stockLevel}</div>
                      <div className="text-sm text-slate-400">{product.unit}</div>
                    </div>
                    <Badge className={`${status.color} text-white`}>
                      {status.text}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
