import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ExportUtils } from '@/utils/exportUtils';
import { Search, Phone, Mail, MapPin, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

const CustomerDirectory = () => {
  const { customers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'all' || customer.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const areas = Array.from(new Set(customers.map(c => c.area))).filter(Boolean);

  const exportDirectory = async () => {
    try {
      const headers = ['Name', 'Phone', 'Email', 'Area', 'Address'];
      const data = filteredCustomers.map(customer => [
        customer.name,
        customer.phone || '',
        customer.email || '',
        customer.area || '',
        customer.address || ''
      ]);
      
      await ExportUtils.exportToExcel(data, headers, 'Customer Directory');
      toast.success('Directory exported successfully!');
    } catch (error) {
      toast.error('Failed to export directory');
    }
  };

  const printDirectory = async () => {
    try {
      const headers = ['Name', 'Phone', 'Email', 'Area', 'Address'];
      const data = filteredCustomers.map(customer => [
        customer.name,
        customer.phone || '',
        customer.email || '',
        customer.area || '',
        customer.address || ''
      ]);
      
      await ExportUtils.printData(data, headers, 'Customer Directory');
      toast.success('Directory sent to printer!');
    } catch (error) {
      toast.error('Failed to print directory');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Directory</h1>
          <p className="text-muted-foreground">Browse and search customer contacts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportDirectory} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={printDirectory} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <Badge variant="secondary">{customer.area}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{customer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No customers found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDirectory;