
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Truck, User, Save, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: string;
  driver: string;
  status: 'active' | 'maintenance' | 'inactive';
}

interface Salesman {
  id: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const VehicleSalesmanCreate = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', number: 'MH-12-AB-1234', type: 'Truck', capacity: '500L', driver: 'Rajesh Kumar', status: 'active' },
    { id: '2', number: 'MH-12-CD-5678', type: 'Van', capacity: '300L', driver: 'Suresh Patil', status: 'active' },
  ]);

  const [salesmen, setSalesmen] = useState<Salesman[]>([
    { id: '1', name: 'Amit Sharma', phone: '9876543210', email: 'amit@example.com', area: 'Zone A', joinDate: '2023-01-15', status: 'active' },
    { id: '2', name: 'Priya Singh', phone: '9876543211', email: 'priya@example.com', area: 'Zone B', joinDate: '2023-02-20', status: 'active' },
  ]);

  const [vehicleForm, setVehicleForm] = useState({
    number: '',
    type: '',
    capacity: '',
    driver: '',
    status: 'active' as const
  });

  const [salesmanForm, setSalesmanForm] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    joinDate: '',
    status: 'active' as const
  });

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...vehicleForm
    };
    setVehicles([...vehicles, newVehicle]);
    setVehicleForm({ number: '', type: '', capacity: '', driver: '', status: 'active' });
    toast.success('Vehicle added successfully!');
  };

  const handleSalesmanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSalesman: Salesman = {
      id: Date.now().toString(),
      ...salesmanForm
    };
    setSalesmen([...salesmen, newSalesman]);
    setSalesmanForm({ name: '', phone: '', email: '', area: '', joinDate: '', status: 'active' });
    toast.success('Salesman added successfully!');
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'active' ? 'default' : status === 'maintenance' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Vehicle & Salesman Management
            </h1>
            <p className="text-slate-400 mt-2">Manage delivery vehicles and sales team</p>
          </div>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="salesmen" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Salesmen
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Vehicle Form */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Plus className="w-5 h-5" />
                    Add New Vehicle
                  </CardTitle>
                  <CardDescription>Register a new delivery vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVehicleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-number">Vehicle Number</Label>
                        <Input
                          id="vehicle-number"
                          placeholder="MH-12-AB-1234"
                          value={vehicleForm.number}
                          onChange={(e) => setVehicleForm({...vehicleForm, number: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-type">Vehicle Type</Label>
                        <Select value={vehicleForm.type} onValueChange={(value) => setVehicleForm({...vehicleForm, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="tempo">Tempo</SelectItem>
                            <SelectItem value="bike">Bike</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          placeholder="500L"
                          value={vehicleForm.capacity}
                          onChange={(e) => setVehicleForm({...vehicleForm, capacity: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="driver">Driver Name</Label>
                        <Input
                          id="driver"
                          placeholder="Driver name"
                          value={vehicleForm.driver}
                          onChange={(e) => setVehicleForm({...vehicleForm, driver: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Vehicle List */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">Registered Vehicles</CardTitle>
                  <CardDescription>All registered delivery vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{vehicle.number}</h3>
                          {getStatusBadge(vehicle.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                          <div>Type: {vehicle.type}</div>
                          <div>Capacity: {vehicle.capacity}</div>
                          <div className="col-span-2">Driver: {vehicle.driver}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Salesmen Tab */}
          <TabsContent value="salesmen" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Salesman Form */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Plus className="w-5 h-5" />
                    Add New Salesman
                  </CardTitle>
                  <CardDescription>Register a new sales team member</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSalesmanSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="salesman-name">Full Name</Label>
                      <Input
                        id="salesman-name"
                        placeholder="Enter full name"
                        value={salesmanForm.name}
                        onChange={(e) => setSalesmanForm({...salesmanForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="9876543210"
                          value={salesmanForm.phone}
                          onChange={(e) => setSalesmanForm({...salesmanForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={salesmanForm.email}
                          onChange={(e) => setSalesmanForm({...salesmanForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="area">Area/Zone</Label>
                        <Input
                          id="area"
                          placeholder="Zone A"
                          value={salesmanForm.area}
                          onChange={(e) => setSalesmanForm({...salesmanForm, area: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="join-date">Join Date</Label>
                        <Input
                          id="join-date"
                          type="date"
                          value={salesmanForm.joinDate}
                          onChange={(e) => setSalesmanForm({...salesmanForm, joinDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Add Salesman
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Salesmen List */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Sales Team</CardTitle>
                  <CardDescription>All registered sales team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesmen.map((salesman) => (
                      <div key={salesman.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{salesman.name}</h3>
                          {getStatusBadge(salesman.status)}
                        </div>
                        <div className="space-y-1 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {salesman.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {salesman.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {salesman.area}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            Joined: {salesman.joinDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleSalesmanCreate;
