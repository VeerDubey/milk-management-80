import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Truck,
  MapPin,
  Clock,
  User,
  Package,
  Route,
  Activity,
  Navigation,
  Fuel,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface VehicleStatus {
  id: string;
  vehicleId: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  location: string;
  lastUpdate: string;
  currentRoute?: string;
  salesmanId?: string;
  fuelLevel?: number;
  speed?: number;
  mileage?: number;
}

export default function VehicleTracking() {
  const { vehicles, salesmen, trackSheets } = useData();
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [trackingMode, setTrackingMode] = useState<'real-time' | 'manual'>('real-time');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initialize vehicle statuses
  useEffect(() => {
    const initialStatuses = vehicles.map(vehicle => ({
      id: `status-${vehicle.id}`,
      vehicleId: vehicle.id,
      status: 'idle' as const,
      location: 'Depot',
      lastUpdate: new Date().toISOString(),
      fuelLevel: Math.floor(Math.random() * 100),
      speed: 0,
      mileage: Math.floor(Math.random() * 50000) + 10000
    }));
    setVehicleStatuses(initialStatuses);
  }, [vehicles]);

  // Simulate real-time updates
  useEffect(() => {
    if (trackingMode === 'real-time') {
      const interval = setInterval(() => {
        setVehicleStatuses(prev => prev.map(status => {
           const activeSheets = trackSheets.filter(sheet => 
             sheet.vehicleId === status.vehicleId && 
             sheet.status === 'in_progress'
           );

          const isActive = activeSheets.length > 0;
          const locations = [
            'Route A - Sector 1', 'Route B - Sector 2', 'Route C - Sector 3',
            'Main Street', 'Market Area', 'Industrial Zone', 'Depot'
          ];

          return {
            ...status,
            status: isActive ? 'active' : Math.random() > 0.7 ? 'idle' : status.status,
            location: isActive ? locations[Math.floor(Math.random() * (locations.length - 1))] : 'Depot',
            lastUpdate: new Date().toISOString(),
            speed: isActive ? Math.floor(Math.random() * 60) + 10 : 0,
            fuelLevel: Math.max(0, status.fuelLevel - Math.random() * 2),
            currentRoute: activeSheets[0]?.routeName || undefined,
            salesmanId: activeSheets[0]?.salesmanId || undefined
          };
        }));
        setLastUpdate(new Date());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [trackingMode, trackSheets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'idle': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'maintenance': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'offline': return 'bg-slate-500/20 text-slate-400 border-slate-500';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'idle': return <Clock className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return 'text-green-400';
    if (level > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus['status']) => {
    setVehicleStatuses(prev => prev.map(vs => 
      vs.vehicleId === vehicleId 
        ? { ...vs, status, lastUpdate: new Date().toISOString() }
        : vs
    ));
    toast.success('Vehicle status updated');
  };

  const refreshTracking = () => {
    setLastUpdate(new Date());
    toast.success('Tracking data refreshed');
  };

  const selectedVehicleStatus = vehicleStatuses.find(vs => vs.vehicleId === selectedVehicle);
  const activeVehicles = vehicleStatuses.filter(vs => vs.status === 'active').length;
  const totalDistance = vehicleStatuses.reduce((sum, vs) => sum + (vs.mileage || 0), 0);
  const avgFuelLevel = vehicleStatuses.reduce((sum, vs) => sum + (vs.fuelLevel || 0), 0) / vehicleStatuses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Navigation className="h-8 w-8 text-blue-400" />
              Vehicle Tracking
            </h1>
            <p className="text-slate-300">Real-time vehicle monitoring and fleet management</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={trackingMode === 'real-time' ? 'default' : 'outline'}
              onClick={() => setTrackingMode('real-time')}
              className="border-green-500 text-green-400"
            >
              <Activity className="mr-2 h-4 w-4" />
              Real-time
            </Button>
            <Button
              variant={trackingMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setTrackingMode('manual')}
            >
              Manual
            </Button>
            <Button onClick={refreshTracking} variant="outline" className="border-blue-500 text-blue-400">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{activeVehicles}</div>
              <div className="text-green-300 text-sm">Active Vehicles</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Truck className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{vehicles.length}</div>
              <div className="text-blue-300 text-sm">Total Fleet</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Route className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{Math.floor(totalDistance / 1000)}K</div>
              <div className="text-purple-300 text-sm">Total Miles</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Fuel className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{Math.floor(avgFuelLevel)}%</div>
              <div className="text-orange-300 text-sm">Avg Fuel Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Selection and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-400" />
                  Fleet Status
                  <Badge variant="outline" className="ml-auto border-blue-500 text-blue-400">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Vehicle</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Location</TableHead>
                        <TableHead className="text-slate-300">Salesman</TableHead>
                        <TableHead className="text-slate-300">Speed</TableHead>
                        <TableHead className="text-slate-300">Fuel</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicleStatuses.map((status) => {
                        const vehicle = vehicles.find(v => v.id === status.vehicleId);
                        const salesman = salesmen.find(s => s.id === status.salesmanId);
                        
                        return (
                          <TableRow 
                            key={status.id} 
                            className={`border-slate-700 cursor-pointer hover:bg-slate-800/30 ${
                              selectedVehicle === status.vehicleId ? 'bg-blue-500/10' : ''
                            }`}
                            onClick={() => setSelectedVehicle(status.vehicleId)}
                          >
                            <TableCell className="font-medium text-white">
                              <div>
                                <div>{vehicle?.name}</div>
                                <div className="text-xs text-slate-400">{vehicle?.number}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(status.status)}>
                                {getStatusIcon(status.status)}
                                <span className="ml-1">{status.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {status.location}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {salesman?.name || '-'}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {status.speed || 0} km/h
                            </TableCell>
                            <TableCell>
                              <span className={getFuelLevelColor(status.fuelLevel || 0)}>
                                {Math.floor(status.fuelLevel || 0)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={status.status}
                                onValueChange={(value) => updateVehicleStatus(status.vehicleId, value as any)}
                              >
                                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="idle">Idle</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                  <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Details */}
          <div>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedVehicleStatus ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">
                        {vehicles.find(v => v.id === selectedVehicleStatus.vehicleId)?.name}
                      </div>
                      <div className="text-sm text-slate-400">
                        {vehicles.find(v => v.id === selectedVehicleStatus.vehicleId)?.number}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Status:</span>
                        <Badge className={getStatusColor(selectedVehicleStatus.status)}>
                          {selectedVehicleStatus.status}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-300">Location:</span>
                        <span className="text-white">{selectedVehicleStatus.location}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-300">Speed:</span>
                        <span className="text-white">{selectedVehicleStatus.speed || 0} km/h</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-300">Fuel Level:</span>
                        <span className={getFuelLevelColor(selectedVehicleStatus.fuelLevel || 0)}>
                          {Math.floor(selectedVehicleStatus.fuelLevel || 0)}%
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-300">Mileage:</span>
                        <span className="text-white">{selectedVehicleStatus.mileage?.toLocaleString()} km</span>
                      </div>

                      {selectedVehicleStatus.currentRoute && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Route:</span>
                          <span className="text-white">{selectedVehicleStatus.currentRoute}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-slate-300">Last Update:</span>
                        <span className="text-white text-xs">
                          {new Date(selectedVehicleStatus.lastUpdate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {selectedVehicleStatus.salesmanId && (
                      <div className="border-t border-slate-600 pt-3">
                        <div className="text-sm font-medium text-slate-300 mb-2">Assigned Salesman</div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-400" />
                          <span className="text-white">
                            {salesmen.find(s => s.id === selectedVehicleStatus.salesmanId)?.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select a vehicle to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
