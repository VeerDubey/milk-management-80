
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Package, 
  Truck, 
  MapPin, 
  Building2, 
  Settings,
  FileText,
  DollarSign
} from 'lucide-react';

const Master = () => {
  const navigate = useNavigate();

  const masterData = [
    {
      title: 'Customer Management',
      description: 'Manage customer information and contacts',
      icon: Users,
      items: [
        { name: 'Customer List', path: '/customer-list' },
        { name: 'Customer Directory', path: '/customer-directory' },
        { name: 'Customer Rates', path: '/customer-rates' }
      ]
    },
    {
      title: 'Product Management',
      description: 'Manage products, categories and pricing',
      icon: Package,
      items: [
        { name: 'Product List', path: '/product-list' },
        { name: 'Product Categories', path: '/product-categories' },
        { name: 'Bulk Rate Update', path: '/bulk-rates' }
      ]
    },
    {
      title: 'Delivery Management',
      description: 'Manage vehicles, routes and delivery tracking',
      icon: Truck,
      items: [
        { name: 'Track Sheet', path: '/track-sheet' },
        { name: 'Vehicle Tracking', path: '/vehicle-tracking' },
        { name: 'Delivery Sheet', path: '/delivery-sheet' }
      ]
    },
    {
      title: 'Area Management',
      description: 'Manage delivery areas and zones',
      icon: MapPin,
      items: [
        { name: 'Area Management', path: '/area-management' },
        { name: 'Route Planning', path: '/route-planning' }
      ]
    },
    {
      title: 'Supplier Management',
      description: 'Manage suppliers and purchase orders',
      icon: Building2,
      items: [
        { name: 'Supplier Directory', path: '/supplier-directory' },
        { name: 'Supplier Payments', path: '/supplier-payments' },
        { name: 'Purchase Management', path: '/purchase-management' }
      ]
    },
    {
      title: 'Financial Management',
      description: 'Manage payments, invoices and accounting',
      icon: DollarSign,
      items: [
        { name: 'Payment Management', path: '/payment-list' },
        { name: 'Invoice Management', path: '/invoices' },
        { name: 'Outstanding Amounts', path: '/outstanding-amounts' }
      ]
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate reports and view analytics',
      icon: FileText,
      items: [
        { name: 'Sales Report', path: '/sales-report' },
        { name: 'Analytics Dashboard', path: '/analytics' },
        { name: 'Customer Report', path: '/customer-report' }
      ]
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      items: [
        { name: 'Company Profile', path: '/company-profile' },
        { name: 'Tax Settings', path: '/tax-settings' },
        { name: 'User Access', path: '/user-access' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Master Data</h1>
        <p className="text-muted-foreground">Manage all master data and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {masterData.map((section, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <section.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2 text-left"
                    onClick={() => navigate(item.path)}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Master;
