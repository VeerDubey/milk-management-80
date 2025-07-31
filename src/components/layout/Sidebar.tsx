
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, CreditCard, 
  FileText, TruckIcon, Receipt, BarChart3, Brain, Scan,
  Zap, Target, Activity
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Delivery Sheet', href: '/delivery-sheet', icon: TruckIcon },
  { name: 'Invoice Generator', href: '/invoices', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'AI Analytics', href: '/ai-analytics', icon: Brain },
  { name: 'Smart Inventory', href: '/smart-inventory', icon: Scan },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto border-r border-slate-700">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">VMC Pro</span>
          </div>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto">
                        <Activity className="w-4 h-4 text-white/70 animate-pulse" />
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          {/* AI Status Footer */}
          <div className="px-4 py-4 mt-auto border-t border-slate-700/50">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-xs font-medium text-green-400">AI Systems Online</p>
                <p className="text-xs text-slate-400">All modules active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
