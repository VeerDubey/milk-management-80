import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  Zap, 
  CheckCircle, 
  Star,
  Rocket,
  Shield,
  Globe,
  Users,
  Brain,
  Lock,
  CreditCard
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProLicenseService } from '@/services/pro/ProLicenseService';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureRequested?: string;
}

export function UpgradeDialog({ open, onOpenChange, featureRequested }: UpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [licenseKey, setLicenseKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Pro',
      price: '₹999',
      period: '/month',
      description: 'Essential features for growing businesses',
      features: [
        'Advanced Reports',
        'Real-time Sync',
        'Cloud Storage (10GB)',
        'Email Support',
        'Basic Analytics'
      ],
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '₹2,499',
      period: '/month',
      description: 'Advanced automation and AI features',
      features: [
        'All Basic Features',
        'AI Predictions & Analytics',
        'Marketing Automation',
        'Advanced Security (2FA)',
        'API Access',
        'Customer Segmentation',
        'Priority Support'
      ],
      icon: Crown,
      color: 'from-yellow-500 to-orange-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹4,999',
      period: '/month',
      description: 'Complete solution with unlimited features',
      features: [
        'All Pro Features',
        'Multi-Company Management',
        'White Label Solution',
        'AI Chatbot',
        'Advanced Security Suite',
        'Unlimited Storage',
        'Custom Integrations',
        'Dedicated Support Manager'
      ],
      icon: Rocket,
      color: 'from-purple-500 to-pink-600',
      popular: false
    }
  ];

  const handleActivateLicense = async () => {
    if (!licenseKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid license key",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const isValid = await ProLicenseService.validateLicense(licenseKey);
      if (isValid) {
        toast({
          title: "License Activated!",
          description: "Your Pro features have been activated successfully",
        });
        onOpenChange(false);
        setLicenseKey('');
        // Refresh the page to update feature access
        window.location.reload();
      } else {
        toast({
          title: "Invalid License",
          description: "Please check your license key and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = () => {
    toast({
      title: "Redirecting to Payment",
      description: "You will be redirected to our secure payment portal",
    });
    // In a real app, this would redirect to payment processor
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {featureRequested 
              ? `Unlock ${featureRequested} and many more powerful features`
              : 'Choose the perfect plan for your business needs'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* License Key Activation */}
          <Card className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Already have a license key?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="license" className="text-slate-300">License Key</Label>
                  <Input
                    id="license"
                    type="text"
                    placeholder="PRO-2024-XXXX-XXXX-XXXX"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleActivateLicense}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Activating...
                      </div>
                    ) : (
                      'Activate'
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Try: <code className="bg-slate-800 px-2 py-1 rounded">PRO-2024-VIKAS-MILK-ENTERPRISE</code>
              </p>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative bg-slate-800/50 border-slate-700 transition-all duration-300 hover:scale-105 cursor-pointer ${
                    isSelected ? 'ring-2 ring-yellow-500/50' : ''
                  } ${
                    plan.popular ? 'ring-2 ring-yellow-500/30' : ''
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={handlePurchase}
                      className={`w-full mt-6 bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Brain, title: 'AI Analytics', desc: 'Smart predictions' },
              { icon: Shield, title: 'Security', desc: '2FA & encryption' },
              { icon: Globe, title: 'API Access', desc: 'Full integration' },
              { icon: Users, title: 'Multi-User', desc: 'Team collaboration' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 bg-slate-800/30 rounded-lg">
                  <Icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="text-white font-medium">{feature.title}</h4>
                  <p className="text-slate-400 text-xs">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="text-center p-4 bg-slate-800/30 rounded-lg">
            <p className="text-slate-400 text-sm">
              Need help choosing? Contact us at{' '}
              <a href="mailto:support@vikasmilkcentre.com" className="text-blue-400 hover:underline">
                support@vikasmilkcentre.com
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}