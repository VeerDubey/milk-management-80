import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle,
  QrCode,
  RefreshCw,
  Clock,
  Plus,
  Minus
} from 'lucide-react';

export default function SmartInventory() {
  const [inventoryData] = useState({
    totalItems: 3,
    criticalStock: 1,
    lowStock: 1,
    goodStock: 1
  });

  const [activeTab, setActiveTab] = useState('overview');

  const inventoryItems = [
    {
      id: 'GGH001',
      name: 'Fresh Milk 1L',
      code: 'GGH001',
      currentStock: 5,
      minStock: 20,
      status: 'low',
      lastUpdated: '2 hours ago',
      category: 'Dairy'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500';
      case 'low': return 'text-yellow-500';
      case 'good': return 'text-green-500';
      default: return 'text-slate-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">CRITICAL</Badge>;
      case 'low': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">LOW</Badge>;
      case 'good': return <Badge variant="secondary" className="bg-green-100 text-green-800">GOOD</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Smart Inventory
            </h1>
            <p className="text-slate-600 mt-2">AI-powered inventory management system</p>
          </div>
          
          <div className="flex gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <QrCode className="mr-2 h-4 w-4" />
              Scan Barcode
            </Button>
            <Button variant="outline" className="border-slate-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync
            </Button>
          </div>
        </div>

        {/* Alert */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Inventory Alert:</strong> 1 critical items, 1 low stock items
            <br />
            Immediate action required to prevent stockouts
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total Items</p>
                  <p className="text-3xl font-bold text-slate-900">{inventoryData.totalItems}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Critical Stock</p>
                  <p className="text-3xl font-bold text-red-600">{inventoryData.criticalStock}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Low Stock</p>
                  <p className="text-3xl font-bold text-yellow-600">{inventoryData.lowStock}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <TrendingDown className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Good Stock</p>
                  <p className="text-3xl font-bold text-green-600">{inventoryData.goodStock}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                    Inventory Overview
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="data-[state=active]:bg-white">
                    Stock Alerts
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6 pt-4">
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Code: {item.code}</p>
                            <p className="text-sm text-slate-600">{item.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {getStatusBadge(item.status)}
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Clock className="h-4 w-4" />
                            {item.lastUpdated}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Current Stock: {item.currentStock}</span>
                            <span>Min Required: {item.minStock}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.currentStock < item.minStock ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.currentStock / item.minStock) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-6">
                          <Button variant="outline" size="sm">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 bg-slate-100 rounded text-sm font-medium">
                            {item.currentStock}
                          </span>
                          <Button variant="outline" size="sm">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="p-6 pt-4">
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Stock Alerts</h3>
                  <p className="text-slate-600">Monitor critical and low stock items here</p>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="p-6 pt-4">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Inventory Analytics</h3>
                  <p className="text-slate-600">Detailed analytics and insights coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}