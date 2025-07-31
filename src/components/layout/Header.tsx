
import React from 'react';
import { Bell, Search, User, Settings, Zap, Activity, Shield, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-gradient-to-r from-slate-900/95 to-slate-950/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors md:hidden" />
          
          {/* Search */}
          <div className="relative w-96 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Neural search across all modules..."
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              <Activity className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">
                {user?.name || 'Neural Admin'}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                System Administrator
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="h-9 w-9 bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 hover:text-white transition-all duration-200"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
