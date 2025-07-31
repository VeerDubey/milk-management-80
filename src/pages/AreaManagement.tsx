
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Plus, Edit, Trash2, Users, Truck, Navigation, Search } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';

interface Area {
  id: string;
  name: string;
  description: string;
  pincode: string;
  customerCount: number;
  salesmanId?: string;
  vehicleId?: string;
  isActive: boolean;
  createdAt: string;
}

const AreaManagement = () => {
  const { customers, salesmen, vehicles } = useData();
  const [areas, setAreas] = useState<Area[]>([
    {
      id: '1',
      name: 'SEWRI',
      description: 'Sewri area including residential and commercial zones',
      pincode: '400015',
      customerCount: 45,
      salesmanId: 'sales-1',
      vehicleId: 'vehicle-1',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'LALBAUGH',
      description: 'Lalbaugh market area and surrounding localities',
      pincode: '400012',
      customerCount: 38,
      salesmanId: 'sales-2',
      vehicleId: 'vehicle-2',
      isActive: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pincode: '',
    salesmanId: '',
    vehicleId: ''
  });

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.pincode.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingArea) {
      setAreas(areas.map(area => 
        area.id === editingArea.id 
          ? { 
              ...area, 
              ...formData,
              customerCount: customers.filter(c => c.area === formData.name).length
            }
          : area
      ));
      toast.success('Area updated successfully');
    } else {
      const newArea: Area = {
        id: Date.now().toString(),
        ...formData,
        customerCount: customers.filter(c => c.area === formData.name).length,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAreas([...areas, newArea]);
      toast.success('Area created successfully');
    }
    
    setShowDialog(false);
    setEditingArea(null);
    setFormData({ name: '', description: '', pincode: '', salesmanId: '', vehicleId: '' });
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      description: area.description,
      pincode: area.pincode,
      salesmanId: area.salesmanId || '',
      vehicleId: area.vehicleId || ''
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setAreas(areas.filter(area => area.id !== id));
    toast.success('Area deleted successfully');
  };

  const toggleActive = (id: string) => {
    setAreas(areas.map(area => 
      area.id === id 
        ? { ...area, isActive: !area.isActive }
        : area
    ));
    toast.success('Area status updated');
  };

  const getSalesmanName = (salesmanId: string) => {
    const salesman = salesmen.find(s => s.id === salesmanId);
    return salesman?.name || 'Unassigned';
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle?.name || 'Unassigned';
  };

  const totalCustomers = areas.reduce((sum, area) => sum + area.customerCount, 0);
  const activeAreas = areas.filter(area => area.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Area Management
            </h1>
            <p className="text-slate-300 mt-2">Manage delivery areas and geographical zones</p>
          </div>
          <Button 
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Area
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Areas</p>
                  <p className="text-2xl font-bold text-white">{areas.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Active Areas</p>
                  <p className="text-2xl font-bold text-white">{activeAreas}</p>
                </div>
                <Navigation className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-white">{totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Areas List */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Areas ({filteredAreas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Area Name</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Pincode</TableHead>
                  <TableHead className="text-slate-300">Customers</TableHead>
                  <TableHead className="text-slate-300">Salesman</TableHead>
                  <TableHead className="text-slate-300">Vehicle</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas.map(area => (
                  <TableRow key={area.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{area.name}</TableCell>
                    <TableCell className="text-slate-300">{area.description}</TableCell>
                    <TableCell className="text-slate-300">{area.pincode}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        {area.customerCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{getSalesmanName(area.salesmanId || '')}</TableCell>
                    <TableCell className="text-slate-300">{getVehicleName(area.vehicleId || '')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={area.isActive ? "default" : "secondary"}
                        className={area.isActive ? "bg-green-600/20 text-green-300" : "bg-slate-600/20 text-slate-300"}
                      >
                        {area.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(area)}
                          className="text-blue-300 border-blue-300 hover:bg-blue-600/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(area.id)}
                          className="text-yellow-300 border-yellow-300 hover:bg-yellow-600/20"
                        >
                          {area.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(area.id)}
                          className="text-red-300 border-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingArea ? 'Edit Area' : 'Create New Area'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {editingArea ? 'Update area information' : 'Add a new delivery area to your network'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Area Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-slate-300">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="salesmanId" className="text-slate-300">Assign Salesman</Label>
                <select
                  id="salesmanId"
                  value={formData.salesmanId}
                  onChange={(e) => setFormData({...formData, salesmanId: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Select Salesman</option>
                  {salesmen.map(salesman => (
                    <option key={salesman.id} value={salesman.id}>{salesman.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="vehicleId" className="text-slate-300">Assign Vehicle</Label>
                <select
                  id="vehicleId"
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.name} - {vehicle.number}</option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingArea ? 'Update Area' : 'Create Area'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AreaManagement;
