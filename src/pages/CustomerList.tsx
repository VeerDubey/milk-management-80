
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ExportUtils } from '@/utils/exportUtils';
import { Search, Download, Printer, Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

const CustomerList = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    address: '',
    outstandingBalance: ''
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'all' || customer.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const areas = Array.from(new Set(customers.map(c => c.area))).filter(Boolean);

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.area) {
      toast.error('Please fill in all required fields');
      return;
    }

    const customerData = {
      ...formData,
      outstandingBalance: parseFloat(formData.outstandingBalance) || 0
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
      toast.success('Customer updated successfully');
    } else {
      addCustomer(customerData);
      toast.success('Customer added successfully');
    }

    setFormData({ name: '', phone: '', email: '', area: '', address: '', outstandingBalance: '' });
    setIsAddDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      area: customer.area,
      address: customer.address || '',
      outstandingBalance: customer.outstandingBalance?.toString() || '0'
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
      toast.success('Customer deleted successfully');
    }
  };

  const exportCustomers = async () => {
    try {
      const headers = ['Name', 'Phone', 'Email', 'Area', 'Address', 'Outstanding Balance'];
      const data = filteredCustomers.map(customer => [
        customer.name,
        customer.phone,
        customer.email || '',
        customer.area,
        customer.address || '',
        (customer.outstandingBalance || 0).toFixed(2)
      ]);
      
      await ExportUtils.exportToExcel(data, headers, 'Customer List');
      toast.success('Customers exported successfully!');
    } catch (error) {
      toast.error('Failed to export customers');
    }
  };

  const printCustomers = async () => {
    try {
      const headers = ['Name', 'Phone', 'Email', 'Area', 'Outstanding'];
      const data = filteredCustomers.map(customer => [
        customer.name,
        customer.phone,
        customer.email || '',
        customer.area,
        (customer.outstandingBalance || 0).toFixed(2)
      ]);
      
      await ExportUtils.printData(data, headers, 'Customer List');
      toast.success('Customers sent to printer!');
    } catch (error) {
      toast.error('Failed to print customers');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer List</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCustomers} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={printCustomers} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="Enter area"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <Label htmlFor="outstanding">Outstanding Balance</Label>
                  <Input
                    id="outstanding"
                    type="number"
                    step="0.01"
                    value={formData.outstandingBalance}
                    onChange={(e) => setFormData({...formData, outstandingBalance: e.target.value})}
                    placeholder="Enter outstanding balance"
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Areas</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Area</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.area}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(customer.outstandingBalance || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(customer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No customers found</p>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
