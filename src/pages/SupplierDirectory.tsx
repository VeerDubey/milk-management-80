import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';

export default function SupplierDirectory() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    panNumber: '',
    contactPerson: '',
    notes: ''
  });

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, newSupplier);
      toast.success('Supplier updated successfully');
    } else {
      addSupplier(newSupplier);
      toast.success('Supplier added successfully');
    }
    setIsDialogOpen(false);
    setEditingSupplier(null);
    setNewSupplier({
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: '',
      panNumber: '',
      contactPerson: '',
      notes: ''
    });
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setNewSupplier({
      name: supplier.name,
      company: supplier.company || '',
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
      gstNumber: supplier.gstNumber || '',
      panNumber: supplier.panNumber || '',
      contactPerson: supplier.contactPerson || '',
      notes: supplier.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteSupplier(id);
    toast.success('Supplier deleted successfully');
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Supplier Directory
          </h1>
          <p className="text-slate-300 mt-2">Manage supplier information and contacts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Name</Label>
                  <Input
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Supplier name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Company</Label>
                  <Input
                    value={newSupplier.company}
                    onChange={(e) => setNewSupplier({...newSupplier, company: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Company name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Phone</Label>
                  <Input
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Address</Label>
                <Textarea
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Full address"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">GST Number</Label>
                  <Input
                    value={newSupplier.gstNumber}
                    onChange={(e) => setNewSupplier({...newSupplier, gstNumber: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="GST registration number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">PAN Number</Label>
                  <Input
                    value={newSupplier.panNumber}
                    onChange={(e) => setNewSupplier({...newSupplier, panNumber: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="PAN card number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Contact Person</Label>
                <Input
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Primary contact person"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({...newSupplier, notes: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Badge variant="outline" className="text-slate-300 border-slate-500">
          {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => (
          <Card key={supplier.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{supplier.name}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {supplier.contactPerson || 'No contact person'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(supplier)}
                    className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-2" />
                <span>{supplier.phone}</span>
              </div>
              
              {supplier.email && (
                <div className="flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              )}
              
              {supplier.address && (
                <div className="flex items-start text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span className="text-sm">{supplier.address}</span>
                </div>
              )}
              
              {supplier.contactPerson && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-slate-400 text-sm">
                    Contact: <span className="text-white">{supplier.contactPerson}</span>
                  </p>
                </div>
              )}
              
              {supplier.gstNumber && (
                <div className="flex flex-wrap gap-1 pt-2">
                  <Badge variant="outline" className="text-slate-300 border-slate-500 text-xs">
                    GST: {supplier.gstNumber}
                  </Badge>
                </div>
              )}
              
              {supplier.notes && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-slate-400 text-sm">{supplier.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Suppliers Found</h3>
            <p className="text-slate-400 text-center max-w-md">
              {searchTerm ? 'No suppliers match your search criteria.' : 'No suppliers have been added yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
