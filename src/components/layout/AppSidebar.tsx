
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  FileText,
  Truck,
  Settings,
  BarChart3,
  MessageSquare,
  Clipboard,
  Factory,
  UserCog,
  TrendingUp,
  Mail,
  Building2,
  MapPin,
  History,
  Receipt,
  Grid3X3,
  Calculator,
  Calendar,
  Shield,
  Bell,
  Route,
  Wrench,
  Zap,
  Brain,
  Scan,
  Activity,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Cpu,
  Wifi,
  FileSpreadsheet
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, color: "text-blue-400" },
  { title: "Master Control", url: "/master", icon: Factory, color: "text-purple-400" },
];

const customerItems = [
  { title: "Customer List", url: "/customer-list", icon: Users, color: "text-green-400" },
  { title: "Customer Directory", url: "/customer-directory", icon: Users, color: "text-green-400" },
  { title: "Customer Ledger", url: "/customer-ledger", icon: FileText, color: "text-green-400" },
  { title: "Customer Rates", url: "/customer-rates", icon: TrendingUp, color: "text-green-400" },
  { title: "Customer Report", url: "/customer-report", icon: BarChart3, color: "text-green-400" },
  { title: "Outstanding Dues", url: "/outstanding-dues", icon: DollarSign, color: "text-red-400" },
  { title: "Outstanding Amounts", url: "/outstanding-amounts", icon: DollarSign, color: "text-red-400" },
];

const inventoryItems = [
  { title: "Product List", url: "/product-list", icon: Package, color: "text-purple-400" },
  { title: "Product Rates", url: "/product-rates", icon: TrendingUp, color: "text-purple-400" },
  { title: "Stock Management", url: "/stock-management", icon: Package, color: "text-purple-400" },
  { title: "Stock Settings", url: "/stock-settings", icon: Settings, color: "text-purple-400" },
  { title: "Product Categories", url: "/product-categories", icon: Grid3X3, color: "text-purple-400" },
  { title: "Bulk Rate Update", url: "/bulk-rates", icon: Calculator, color: "text-purple-400" },
];

const orderItems = [
  { title: "Order List", url: "/order-list", icon: ShoppingCart, color: "text-orange-400" },
  { title: "Order Entry", url: "/order-entry", icon: ShoppingCart, color: "text-orange-400" },
  { title: "Order History", url: "/order-history", icon: History, color: "text-orange-400" },
];

const paymentItems = [
  { title: "Payment List", url: "/payment-list", icon: CreditCard, color: "text-green-400" },
  { title: "Create Payment", url: "/payment-create", icon: CreditCard, color: "text-green-400" },
  { title: "Outstanding", url: "/outstanding", icon: DollarSign, color: "text-red-400" },
];

const invoiceItems = [
  { title: "Invoice Generator", url: "/invoices", icon: Receipt, color: "text-blue-400" },
  { title: "Invoice History", url: "/invoice-history", icon: History, color: "text-blue-400" },
  { title: "Create Invoice", url: "/invoice-create", icon: FileText, color: "text-blue-400" },
  { title: "Invoice Templates", url: "/invoice-templates", icon: FileText, color: "text-blue-400" },
];

const deliveryItems = [
  { title: "Delivery Manager", url: "/delivery-sheet-manager", icon: Building2, color: "text-cyan-400" },
  { title: "Delivery Sheet", url: "/delivery-sheet", icon: Truck, color: "text-cyan-400" },
  { title: "Bulk Delivery Sheet", url: "/delivery-sheet-bulk", icon: FileSpreadsheet, color: "text-cyan-400" },
  { title: "Track Sheet", url: "/track-sheet", icon: Clipboard, color: "text-cyan-400" },
  { title: "Advanced Track Sheet", url: "/track-sheet-advanced", icon: Clipboard, color: "text-cyan-400" },
  { title: "Track Sheet History", url: "/track-sheet-history", icon: History, color: "text-cyan-400" },
  { title: "Vehicle Tracking", url: "/vehicle-tracking", icon: Truck, color: "text-cyan-400" },
  { title: "Vehicle/Salesman", url: "/vehicle-salesman-create", icon: UserCog, color: "text-cyan-400" },
];

const supplierItems = [
  { title: "Supplier Directory", url: "/supplier-directory", icon: Building2, color: "text-yellow-400" },
  { title: "Supplier Ledger", url: "/supplier-ledger", icon: FileText, color: "text-yellow-400" },
  { title: "Supplier Payments", url: "/supplier-payments", icon: CreditCard, color: "text-yellow-400" },
  { title: "Supplier Rates", url: "/supplier-rates", icon: TrendingUp, color: "text-yellow-400" },
  { title: "Purchase Management", url: "/purchase-management", icon: ShoppingCart, color: "text-yellow-400" },
  { title: "Purchase History", url: "/purchase-history", icon: History, color: "text-yellow-400" },
];

const communicationItems = [
  { title: "Messaging", url: "/messaging", icon: MessageSquare, color: "text-pink-400" },
  { title: "Email Templates", url: "/email-templates", icon: Mail, color: "text-pink-400" },
  { title: "SMS Templates", url: "/sms-templates", icon: MessageSquare, color: "text-pink-400" },
  { title: "Bulk Communication", url: "/bulk-communication", icon: Mail, color: "text-pink-400" },
];

const reportsItems = [
  { title: "Reports Dashboard", url: "/reports", icon: BarChart3, color: "text-indigo-400" },
  { title: "Sales Report", url: "/sales-report", icon: TrendingUp, color: "text-indigo-400" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, color: "text-indigo-400" },
  { title: "AI Analytics", url: "/ai-analytics", icon: Brain, color: "text-purple-400" },
  { title: "Smart Inventory", url: "/smart-inventory", icon: Scan, color: "text-purple-400" },
];

const settingsItems = [
  { title: "General Settings", url: "/settings", icon: Settings, color: "text-gray-400" },
  { title: "Company Profile", url: "/company-profile", icon: Building2, color: "text-gray-400" },
  { title: "Area Management", url: "/area-management", icon: MapPin, color: "text-gray-400" },
  { title: "Financial Year", url: "/financial-year", icon: Calendar, color: "text-gray-400" },
  { title: "Tax Settings", url: "/tax-settings", icon: Calculator, color: "text-gray-400" },
  { title: "UI Settings", url: "/ui-settings", icon: Settings, color: "text-gray-400" },
  { title: "User Access", url: "/user-access", icon: Shield, color: "text-gray-400" },
  { title: "Role Management", url: "/role-management", icon: Shield, color: "text-gray-400" },
  { title: "Expenses", url: "/expenses", icon: DollarSign, color: "text-gray-400" },
  { title: "Advanced Features", url: "/advanced-features", icon: Zap, color: "text-yellow-400" },
  { title: "Notifications", url: "/notifications", icon: Bell, color: "text-blue-400" },
];

const advancedItems = [
  { title: "Business Intelligence", url: "/business-intelligence", icon: Brain, color: "text-purple-400" },
  { title: "Advanced Reports", url: "/advanced-reports", icon: BarChart3, color: "text-indigo-400" },
  { title: "Testing Report", url: "/testing-report", icon: FileText, color: "text-green-400" },
  { title: "Inventory Dashboard", url: "/inventory-dashboard", icon: Package, color: "text-orange-400" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'main', 'customers', 'inventory', 'orders', 'reports'
  ]);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 font-medium border-r-2 border-blue-400 shadow-lg shadow-blue-500/20" 
      : "hover:bg-slate-800/50 hover:text-white transition-all duration-200";

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  const renderMenuSection = (items: typeof mainMenuItems, label: string, groupKey: string, icon: any) => {
    const isExpanded = expandedGroups.includes(groupKey);
    const hasActiveChild = items.some(item => isActive(item.url));
    const IconComponent = icon;

    return (
      <SidebarGroup key={label}>
        <div 
          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all duration-200 ${
            hasActiveChild ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'hover:bg-slate-800/30'
          }`}
          onClick={() => toggleGroup(groupKey)}
        >
          <SidebarGroupLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            {state === 'expanded' && (
              <>
                <IconComponent className="h-4 w-4 text-blue-400" />
                {label}
                <div className="flex items-center gap-1 ml-auto">
                  {hasActiveChild && <Activity className="h-3 w-3 text-blue-400 animate-pulse" />}
                  {isExpanded ? 
                    <ChevronDown className="h-3 w-3 text-slate-400" /> : 
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  }
                </div>
              </>
            )}
          </SidebarGroupLabel>
        </div>
        
        {(isExpanded || state === 'collapsed') && (
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${item.color || 'text-slate-400'}`} />
                      {state === 'expanded' && (
                        <span className="ml-2 text-sm">{item.title}</span>
                      )}
                      {state === 'expanded' && isActive(item.url) && (
                        <Sparkles className="h-3 w-3 text-blue-400 ml-auto animate-pulse" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    );
  };

  return (
    <Sidebar
      className={`${state === 'collapsed' ? "w-16" : "w-72"} border-r border-slate-700/50 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl transition-all duration-300`}
      collapsible="icon"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {state === 'expanded' && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 relative overflow-hidden">
              <Zap className="w-6 h-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VMC Pro
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Futuristic Dairy System
              </p>
            </div>
          </div>
        )}
        <SidebarTrigger className="h-8 w-8 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors" />
      </div>

      <SidebarContent className="py-4 space-y-2">
        {renderMenuSection(mainMenuItems, "Main Control", "main", Cpu)}
        {renderMenuSection(customerItems, "Customer Hub", "customers", Users)}
        {renderMenuSection(inventoryItems, "Inventory Core", "inventory", Package)}
        {renderMenuSection(orderItems, "Order Matrix", "orders", ShoppingCart)}
        {renderMenuSection(paymentItems, "Payment Gateway", "payments", CreditCard)}
        {renderMenuSection(invoiceItems, "Invoice Engine", "invoices", Receipt)}
        {renderMenuSection(deliveryItems, "Delivery Network", "delivery", Truck)}
        {renderMenuSection(supplierItems, "Supplier Grid", "suppliers", Building2)}
        {renderMenuSection(communicationItems, "Comm Center", "communication", MessageSquare)}
        {renderMenuSection(reportsItems, "Analytics Hub", "reports", Brain)}
        {renderMenuSection(advancedItems, "Pro Features", "advanced", Zap)}
        {renderMenuSection(settingsItems, "System Config", "settings", Settings)}
      </SidebarContent>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-700/50 mt-auto">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          {state === 'expanded' && (
            <div className="flex-1">
              <p className="text-xs font-medium text-green-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                All Systems Online
              </p>
              <p className="text-xs text-slate-400">Neural Network Active</p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
