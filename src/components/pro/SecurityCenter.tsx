import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye, 
  KeyRound,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  FileText,
  Smartphone,
  Globe
} from 'lucide-react';

export function SecurityCenter() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    encryption: true,
    auditLogs: true,
    loginAlerts: false,
    ipWhitelist: false,
    sessionTimeout: true,
    dataBackup: true,
    accessControl: true
  });

  const toggleSetting = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const securityFeatures = [
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with 2FA',
      icon: Smartphone,
      status: 'active',
      category: 'Authentication'
    },
    {
      id: 'encryption',
      title: 'End-to-End Encryption',
      description: 'All data encrypted in transit and at rest',
      icon: Lock,
      status: 'active',
      category: 'Data Protection'
    },
    {
      id: 'auditLogs',
      title: 'Security Audit Logs',
      description: 'Complete audit trail of all user activities',
      icon: FileText,
      status: 'active',
      category: 'Monitoring'
    },
    {
      id: 'accessControl',
      title: 'Role-Based Access Control',
      description: 'Granular permissions and role management',
      icon: UserCheck,
      status: 'active',
      category: 'Access Management'
    },
    {
      id: 'ipWhitelist',
      title: 'IP Address Whitelisting',
      description: 'Restrict access to approved IP addresses',
      icon: Globe,
      status: 'inactive',
      category: 'Network Security'
    },
    {
      id: 'loginAlerts',
      title: 'Login Alert System',
      description: 'Real-time notifications for login attempts',
      icon: AlertTriangle,
      status: 'inactive',
      category: 'Monitoring'
    }
  ];

  const securityMetrics = [
    { title: 'Security Score', value: '94%', icon: Shield, color: 'text-green-400' },
    { title: 'Active Sessions', value: '12', icon: Eye, color: 'text-blue-400' },
    { title: 'Failed Logins', value: '0', icon: AlertTriangle, color: 'text-yellow-400' },
    { title: 'Audit Logs', value: '1,247', icon: FileText, color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-green-400" />
          Security Center
        </h2>
        <p className="text-slate-300">Enterprise-grade security for your data and operations</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon;
          const isActive = securitySettings[feature.id];
          
          return (
            <Card key={feature.id} className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isActive ? 'bg-green-600/20' : 'bg-slate-800/50'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive ? 'text-green-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">{feature.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1 border-slate-600 text-slate-400">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleSetting(feature.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-400 text-sm mb-3">{feature.description}</p>
                
                {isActive && (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active & Secured</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Security Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-slate-600 text-slate-300 h-auto p-4 flex-col gap-2">
              <Lock className="h-6 w-6" />
              <span>Generate Backup Codes</span>
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 h-auto p-4 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Download Audit Report</span>
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 h-auto p-4 flex-col gap-2">
              <Shield className="h-6 w-6" />
              <span>Run Security Scan</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">System Security Status</h3>
                <p className="text-slate-300">All security measures are active and functioning normally</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Fully Secured</span>
              </div>
              <p className="text-slate-400 text-sm">Last scan: 5 minutes ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}