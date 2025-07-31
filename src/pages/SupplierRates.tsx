

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';

export default function SupplierRates() {
  const { suppliers, products, supplierProductRates, addSupplierProductRate, updateSupplierProductRate, deleteSupplierProductRate } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [newRate, setNewRate] = useState({
    supplierId: '',
    productId: '',
    rate: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    minimumQuantity: '',
    unit: 'kg'
  });

  const filteredRates = supplierProductRates.filter(rate => {
    const supplier = suppliers.find(s => s.id === rate.supplierId);
    const product = products.find(p => p.id === rate.productId);
    const matchesSearch = supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !selectedSupplier || rate.supplierId === selectedSupplier;
    return matchesSearch && matchesSupplier;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateData = { 
      ...newRate, 
      rate: Number(newRate.rate),
      isActive: true
    };
    
    if (editingRate) {
      updateSupplierProductRate(editingRate.id, rateData);
      toast.success('Supplier rate updated successfully');
    } else {
      addSupplierProductRate(rateData);
      toast.success('Supplier rate added successfully');
    }
    setIsDialogOpen(false);
    setEditingRate(null);
    setNewRate({
      supplierId: '',
      productId: '',
      rate: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      minimumQuantity: '',
      unit: 'kg'
    });
  };

  const handleEdit = (rate: any) => {
    setEditingRate(rate);
    setNewRate({
      supplierId: rate.supplierId,
      productId: rate.productId,
      rate: rate.rate.toString(),
      effectiveDate: rate.effectiveDate,
      validUntil: rate.validUntil || '',
      minimumQuantity: rate.minimumQuantity || '',
      unit: rate.unit || 'kg'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteSupplierProductRate(id);
    toast.success('Supplier rate deleted successfully');
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Supplier Rates
          </h1>
          <p className="text-slate-300 mt-2">Manage supplier product rates and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingRate ? 'Edit Supplier Rate' : 'Add New Supplier Rate'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Supplier</Label>
                <Select value={newRate.supplierId} onValueChange={(value) => setNewRate({...newRate, supplierId: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Product</Label>
                <Select value={newRate.productId} onValueChange={(value) => setNewRate({...newRate, productId: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Rate</Label>
                  <Input
                    type="number"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({...newRate, rate: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Unit</Label>
                  <Input
                    value={newRate.unit}
                    onChange={(e) => setNewRate({...newRate, unit: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="kg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Effective Date</Label>
                  <Input
                    type="date"
                    value={newRate.effectiveDate}
                    onChange={(e) => setNewRate({...newRate, effectiveDate: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Valid Until</Label>
                  <Input
                    type="date"
                    value={newRate.validUntil}
                    onChange={(e) => setNewRate({...newRate, validUntil: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Minimum Quantity</Label>
                <Input
                  type="number"
                  value={newRate.minimumQuantity}
                  onChange={(e) => setNewRate({...newRate, minimumQuantity: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingRate ? 'Update Rate' : 'Add Rate'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search suppliers or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Suppliers</SelectItem>
            {suppliers.map(supplier => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRates.map(rate => {
          const supplier = suppliers.find(s => s.id === rate.supplierId);
          const product = products.find(p => p.id === rate.productId);
          
          return (
            <Card key={rate.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{supplier?.name}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {product?.name}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white">
                    ₹{rate.rate}/{rate.unit}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Effective Date:</span>
                  <span className="text-white">{rate.effectiveDate}</span>
                </div>
                {rate.validUntil && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Valid Until:</span>
                    <span className="text-white">{rate.validUntil}</span>
                  </div>
                )}
                {rate.minimumQuantity && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Min Qty:</span>
                    <span className="text-white">{rate.minimumQuantity} {rate.unit}</span>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(rate)}
                    className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(rate.id)}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRates.length === 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Supplier Rates Found</h3>
            <p className="text-slate-400 text-center max-w-md">
              No supplier rates match your search criteria. Try adjusting your filters or add a new supplier rate.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
