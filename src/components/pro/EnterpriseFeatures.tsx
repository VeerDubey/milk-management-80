import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  Crown, 
  Globe,
  Palette,
  Users,
  Database,
  Cloud,
  Shield,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react';
import { ProLicenseService } from '@/services/pro/ProLicenseService';
import { toast } from '@/hooks/use-toast';

export function EnterpriseFeatures() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [currentCompany, setCurrentCompany] = useState<any>(null);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const companyList = ProLicenseService.getCompanies();
    setCompanies(companyList);
    
    const current = ProLicenseService.getCurrentCompany();
    setCurrentCompany(current);
  };

  const createCompany = async () => {
    if (!ProLicenseService.hasFeature('multi_company')) {
      toast({
        title: "Upgrade Required",
        description: "Multi-company management requires Enterprise license",
        variant: "destructive"
      });
      return;
    }

    if (!newCompanyName.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a company name",
        variant: "destructive"
      });
      return;
    }

    try {
      await ProLicenseService.createCompany({
        name: newCompanyName,
        slug: newCompanyName.toLowerCase().replace(/\s+/g, '-'),
        settings: {
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          fiscalYearStart: '04-01',
          theme: {}
        },
        subscription: {
          id: 'sub_enterprise',
          companyId: '',
          tier: 'enterprise',
          features: ['multi_company', 'white_label', 'api_integration'],
          maxUsers: 100,
          maxCompanies: 10,
          isActive: true,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      });

      loadCompanies();
      setNewCompanyName('');
      setIsCreatingCompany(false);
      
      toast({
        title: "Company Created",
        description: "New company has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive"
      });
    }
  };

  const switchCompany = (companyId: string) => {
    const success = ProLicenseService.switchCompany(companyId);
    if (success) {
      loadCompanies();
      toast({
        title: "Company Switched",
        description: "You are now managing a different company"
      });
    }
  };

  const enterpriseFeatures = [
    {
      id: 'multi_company',
      title: 'Multi-Company Management',
      description: 'Manage multiple businesses from one dashboard',
      icon: Building,
      feature: 'multi_company',
      status: ProLicenseService.hasFeature('multi_company') ? 'available' : 'premium'
    },
    {
      id: 'white_label',
      title: 'White Label Solution',
      description: 'Custom branding and domain configuration',
      icon: Palette,
      feature: 'white_label',
      status: ProLicenseService.hasFeature('white_label') ? 'available' : 'premium'
    },
    {
      id: 'api_integration',
      title: 'Enterprise API',
      description: 'Full REST API access for integrations',
      icon: Globe,
      feature: 'api_integration',
      status: ProLicenseService.hasFeature('api_integration') ? 'available' : 'premium'
    },
    {
      id: 'advanced_security',
      title: 'Enterprise Security',
      description: 'Advanced security and compliance features',
      icon: Shield,
      feature: 'advanced_security',
      status: ProLicenseService.hasFeature('advanced_security') ? 'available' : 'premium'
    },
    {
      id: 'cloud_storage',
      title: 'Enterprise Storage',
      description: 'Unlimited cloud storage and backup',
      icon: Cloud,
      feature: 'cloud_storage',
      status: ProLicenseService.hasFeature('cloud_storage') ? 'available' : 'premium'
    },
    {
      id: 'user_management',
      title: 'Advanced User Management',
      description: 'Role-based access control and permissions',
      icon: Users,
      feature: 'user_management',
      status: 'available'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            Enterprise Features
          </h2>
          <p className="text-slate-400">Scale your business with enterprise-grade capabilities</p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
          Enterprise Ready
        </Badge>
      </div>

      {/* Multi-Company Management */}
      {ProLicenseService.hasFeature('multi_company') && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-400" />
              Company Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current Company */}
              {currentCompany && (
                <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{currentCompany.name}</h4>
                      <p className="text-slate-400 text-sm">Current active company</p>
                    </div>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                      Active
                    </Badge>
                  </div>
                </div>
              )}

              {/* Company List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map((company) => (
                  <div 
                    key={company.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      currentCompany?.id === company.id 
                        ? 'bg-blue-600/10 border-blue-500/30' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => switchCompany(company.id)}
                  >
                    <h4 className="text-white font-medium">{company.name}</h4>
                    <p className="text-slate-400 text-sm">{company.slug}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {company.subscription.tier} plan
                    </p>
                  </div>
                ))}

                {/* Add Company Card */}
                {!isCreatingCompany ? (
                  <div 
                    className="p-4 rounded-lg border-2 border-dashed border-slate-600 hover:border-slate-500 cursor-pointer transition-all flex items-center justify-center"
                    onClick={() => setIsCreatingCompany(true)}
                  >
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Add Company</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="company-name" className="text-white">Company Name</Label>
                        <Input
                          id="company-name"
                          value={newCompanyName}
                          onChange={(e) => setNewCompanyName(e.target.value)}
                          placeholder="Enter company name"
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={createCompany} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Create
                        </Button>
                        <Button 
                          onClick={() => setIsCreatingCompany(false)} 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enterprise Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enterpriseFeatures.map((feature) => {
          const Icon = feature.icon;
          const isAvailable = feature.status === 'available';
          
          return (
            <Card 
              key={feature.id} 
              className={`bg-slate-900/50 border-slate-700/50 transition-all duration-300 hover:scale-105 ${
                isAvailable ? 'ring-2 ring-green-500/30' : 'ring-2 ring-yellow-500/30'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={isAvailable ? 'h-5 w-5 text-green-400' : 'h-5 w-5 text-yellow-400'} />
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      Enterprise
                    </Badge>
                    {isAvailable ? (
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        PREMIUM
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                
                {isAvailable ? (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Feature Active & Ready
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-yellow-600/80 to-orange-600/80 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Upgrade to Enterprise
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enterprise CTA */}
      <Card className="bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ready for Enterprise?</h3>
                <p className="text-slate-300">Scale your business with advanced features and dedicated support</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Contact Sales
              </Button>
              <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}