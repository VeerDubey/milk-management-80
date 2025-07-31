import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Key,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  History,
  Smartphone
} from 'lucide-react';
import { SecurityService } from '@/services/pro/SecurityService';
import { ProLicenseService } from '@/services/pro/ProLicenseService';
import { toast } from '@/hooks/use-toast';

export function SecurityCenter() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = () => {
    const logs = SecurityService.getAuditLogs('current_user', 10);
    setAuditLogs(logs);
    
    const twoFactorConfig = SecurityService.getTwoFactorConfig('current_user');
    setTwoFactorEnabled(twoFactorConfig?.isEnabled || false);
  };

  const handleEnableTwoFactor = async () => {
    if (!ProLicenseService.hasFeature('advanced_security')) {
      toast({
        title: "Upgrade Required",
        description: "Advanced Security features require a Pro license",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await SecurityService.enableTwoFactor('current_user');
      setTwoFactorEnabled(true);
      
      toast({
        title: "Two-Factor Authentication Enabled",
        description: "Scan the QR code with your authenticator app",
      });
      
      // In a real app, show QR code modal
      console.log('2FA Setup:', result);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setIsLoading(true);
    try {
      await SecurityService.disableTwoFactor('current_user');
      setTwoFactorEnabled(false);
      
      toast({
        title: "Two-Factor Authentication Disabled",
        description: "Your account is now using single-factor authentication",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable two-factor authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const securityFeatures = [
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: Smartphone,
      enabled: twoFactorEnabled,
      toggle: twoFactorEnabled ? handleDisableTwoFactor : handleEnableTwoFactor,
      pro: true
    },
    {
      id: 'audit_logging',
      title: 'Security Audit Logging',
      description: 'Track all security-related events and access attempts',
      icon: History,
      enabled: true,
      pro: true
    },
    {
      id: 'data_encryption',
      title: 'Data Encryption',
      description: 'Encrypt sensitive data at rest and in transit',
      icon: Lock,
      enabled: true,
      pro: true
    }
  ];

  const hasSecurityAccess = ProLicenseService.hasFeature('advanced_security');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-400" />
            Security Center
          </h2>
          <p className="text-slate-400">Manage security settings and monitor access</p>
        </div>
        <Badge className={hasSecurityAccess 
          ? "bg-green-600/20 text-green-400 border-green-500/30"
          : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
        }>
          {hasSecurityAccess ? 'Security Enabled' : 'Upgrade Required'}
        </Badge>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <Card key={feature.id} className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={feature.enabled && hasSecurityAccess ? 'h-5 w-5 text-green-400' : 'h-5 w-5 text-slate-400'} />
                  <div className="flex gap-2">
                    {feature.pro && (
                      <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                        PRO
                      </Badge>
                    )}
                    {feature.enabled && hasSecurityAccess && (
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                
                {feature.toggle ? (
                  <Button 
                    onClick={feature.toggle}
                    disabled={!hasSecurityAccess || isLoading}
                    className={hasSecurityAccess 
                      ? `w-full ${feature.enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`
                      : "w-full bg-slate-700 text-slate-400 cursor-not-allowed"
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : hasSecurityAccess ? (
                      feature.enabled ? 'Disable' : 'Enable'
                    ) : (
                      'Upgrade Required'
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={feature.enabled && hasSecurityAccess}
                      disabled={!hasSecurityAccess}
                    />
                    <span className="text-xs text-slate-400">
                      {feature.enabled && hasSecurityAccess ? 'ON' : 'OFF'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Audit Logs */}
      {hasSecurityAccess && auditLogs.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {log.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">
                        {log.action.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {log.resource} • {log.ipAddress}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tips */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Security Best Practices</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Enable two-factor authentication for enhanced security</li>
                <li>• Regularly review audit logs for suspicious activity</li>
                <li>• Use strong, unique passwords for all accounts</li>
                <li>• Keep your software and devices updated</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}