
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  FileText,
  MessageSquare,
  Truck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  DollarSign,
  Mail,
  MessageCircle,
  Calculator,
  Palette,
  UserCheck,
  Grid3X3,
  FileSpreadsheet,
  Calendar,
  Shield,
  MapPin,
  Route,
  Bell,
  History,
  Receipt,
  TrendingUp,
  Factory,
  Wrench
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['customers', 'inventory', 'orders', 'delivery']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (paths: string[]) => paths.some(path => location.pathname === path);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      title: 'Master',
      icon: Factory,
      path: '/master',
    },
    {
      title: 'Customers',
      icon: Users,
      key: 'customers',
      children: [
        { title: 'Customer List', path: '/customer-list' },
        { title: 'Customer Directory', path: '/customer-directory' },
        { title: 'Customer Ledger', path: '/customer-ledger' },
        { title: 'Customer Rates', path: '/customer-rates' },
        { title: 'Customer Report', path: '/customer-report' },
        { title: 'Outstanding Dues', path: '/outstanding-dues' },
        { title: 'Outstanding Amounts', path: '/outstanding-amounts' },
      ]
    },
    {
      title: 'Products & Inventory',
      icon: Package,
      key: 'inventory',
      children: [
        { title: 'Product List', path: '/product-list' },
        { title: 'Product Rates', path: '/product-rates' },
        { title: 'Stock Management', path: '/stock-management' },
        { title: 'Stock Settings', path: '/stock-settings' },
        { title: 'Product Categories', path: '/product-categories' },
        { title: 'Bulk Rate Update', path: '/bulk-rates' },
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      key: 'orders',
      children: [
        { title: 'Order List', path: '/order-list' },
        { title: 'Order Entry', path: '/order-entry' },
        { title: 'Order History', path: '/order-history' },
      ]
    },
    {
      title: 'Payments',
      icon: CreditCard,
      key: 'payments',
      children: [
        { title: 'Payment List', path: '/payment-list' },
        { title: 'Create Payment', path: '/payment-create' },
        { title: 'Outstanding', path: '/outstanding' },
      ]
    },
    {
      title: 'Invoices',
      icon: FileText,
      key: 'invoices',
      children: [
        { title: 'Invoice History', path: '/invoice-history' },
        { title: 'Create Invoice', path: '/invoice-create' },
        { title: 'Invoice Templates', path: '/invoice-templates' },
        { title: 'Invoice Generator', path: '/invoices' },
      ]
    },
    {
      title: 'Delivery & Tracking',
      icon: Truck,
      key: 'delivery',
      children: [
        { title: 'Delivery Sheet', path: '/delivery-sheet' },
        { title: 'Track Sheet', path: '/track-sheet' },
        { title: 'Advanced Track Sheet', path: '/track-sheet-advanced' },
        { title: 'Track Sheet History', path: '/track-sheet-history' },
        { title: 'Vehicle Tracking', path: '/vehicle-tracking' },
        { title: 'Vehicle/Salesman', path: '/vehicle-salesman-create' },
      ]
    },
    {
      title: 'Suppliers',
      icon: Building2,
      key: 'suppliers',
      children: [
        { title: 'Supplier Directory', path: '/supplier-directory' },
        { title: 'Supplier Ledger', path: '/supplier-ledger' },
        { title: 'Supplier Payments', path: '/supplier-payments' },
        { title: 'Supplier Rates', path: '/supplier-rates' },
        { title: 'Purchase Management', path: '/purchase-management' },
        { title: 'Purchase History', path: '/purchase-history' },
      ]
    },
    {
      title: 'Communication',
      icon: MessageSquare,
      key: 'communication',
      children: [
        { title: 'Messaging', path: '/messaging' },
        { title: 'Email Templates', path: '/email-templates' },
        { title: 'SMS Templates', path: '/sms-templates' },
        { title: 'Bulk Communication', path: '/bulk-communication' },
      ]
    },
    {
      title: 'Reports & Analytics',
      icon: BarChart3,
      key: 'reports',
      children: [
        { title: 'Reports Dashboard', path: '/reports' },
        { title: 'Sales Report', path: '/sales-report' },
        { title: 'Analytics', path: '/analytics' },
        { title: 'AI Analytics', path: '/ai-analytics' },
        { title: 'Smart Inventory', path: '/smart-inventory' },
      ]
    },
    {
      title: 'Settings & Configuration',
      icon: Settings,
      key: 'settings',
      children: [
        { title: 'General Settings', path: '/settings' },
        { title: 'Company Profile', path: '/company-profile' },
        { title: 'Area Management', path: '/area-management' },
        { title: 'Financial Year', path: '/financial-year' },
        { title: 'Tax Settings', path: '/tax-settings' },
        { title: 'UI Settings', path: '/ui-settings' },
        { title: 'User Access', path: '/user-access' },
        { title: 'Expenses', path: '/expenses' },
      ]
    },
  ];

  return (
    <div className={cn(
      'flex h-screen flex-col border-r bg-card transition-all duration-300 border-teal-200',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex h-16 items-center justify-between px-4 bg-teal-50">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-teal-700">Navigation</h2>
        )}
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {menuItems.map((item) => {
            if (item.children) {
              const sectionPaths = item.children.map(child => child.path);
              const isOpen = openSections.includes(item.key);
              const hasActiveChild = isSectionActive(sectionPaths);

              return (
                <Collapsible
                  key={item.key}
                  open={isOpen}
                  onOpenChange={() => toggleSection(item.key)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={hasActiveChild ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start hover:bg-teal-50 hover:text-teal-700",
                        collapsed && "justify-center px-2",
                        hasActiveChild && "bg-teal-100 text-teal-700"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="ml-2">{item.title}</span>
                          {isOpen ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent className="pl-6 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.path} to={child.path}>
                          <Button
                            variant={isActive(child.path) ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start hover:bg-teal-50 hover:text-teal-700",
                              isActive(child.path) && "bg-teal-200 text-teal-800"
                            )}
                          >
                            {child.title}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            }

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start hover:bg-teal-50 hover:text-teal-700",
                    collapsed && "justify-center px-2",
                    isActive(item.path) && "bg-teal-200 text-teal-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
