
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Building2, MapPin, Phone, Mail, Globe, Upload, Save, Edit, Eye, Calendar, Users, TrendingUp } from 'lucide-react';

interface CompanyInfo {
  name: string;
  tagline: string;
  logo: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    fax?: string;
  };
  business: {
    type: string;
    gstNumber: string;
    panNumber: string;
    licenseNumber: string;
    establishedYear: string;
  };
  banking: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Vikas Milk Centre',
    tagline: 'Fresh Dairy Products Since 1975',
    logo: '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png',
    address: {
      street: '123 Dairy Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'info@vikasmilk.com',
      website: 'www.vikasmilk.com',
      fax: '+91 22 1234 5678'
    },
    business: {
      type: 'Dairy Products',
      gstNumber: '27ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      licenseNumber: 'DL-2024-001',
      establishedYear: '1975'
    },
    banking: {
      bankName: 'State Bank of India',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      branchName: 'Mumbai Main Branch'
    },
    social: {
      facebook: 'https://facebook.com/vikasmilk',
      twitter: 'https://twitter.com/vikasmilk',
      instagram: 'https://instagram.com/vikasmilk'
    }
  });

  const handleSave = () => {
    // Save company info logic here
    localStorage.setItem('companyProfile', JSON.stringify(companyInfo));
    setIsEditing(false);
    toast.success('Company profile updated successfully');
  };

  const handleInputChange = (section: keyof CompanyInfo, field: string, value: string) => {
    setCompanyInfo(prev => {
      const currentSection = prev[section];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const handleDirectChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const businessTypes = [
    'Dairy Products',
    'Food & Beverages',
    'Retail',
    'Distribution',
    'Manufacturing',
    'Services'
  ];

  const stats = [
    { label: 'Years in Business', value: '49', icon: Calendar },
    { label: 'Active Customers', value: '2,500+', icon: Users },
    { label: 'Monthly Revenue', value: '₹12L+', icon: TrendingUp },
    { label: 'Products', value: '50+', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Company Profile
            </h1>
            <p className="text-slate-300 mt-2">Manage your company information and business details</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Overview */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                {companyInfo.logo ? (
                  <img src={companyInfo.logo} alt="Company Logo" className="w-16 h-16 object-contain" />
                ) : (
                  <Building2 className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300">Company Name</Label>
                      <Input
                        value={companyInfo.name}
                        onChange={(e) => handleDirectChange('name', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Tagline</Label>
                      <Input
                        value={companyInfo.tagline}
                        onChange={(e) => handleDirectChange('tagline', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white">{companyInfo.name}</h2>
                    <p className="text-slate-300">{companyInfo.tagline}</p>
                    <Badge className="mt-2 bg-green-600/20 text-green-300">
                      Established {companyInfo.business.establishedYear}
                    </Badge>
                  </div>
                )}
              </div>
              {isEditing && (
                <Button variant="outline" className="text-slate-300 border-slate-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Address Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-slate-300">Street Address</Label>
                  {isEditing ? (
                    <Input
                      value={companyInfo.address.street}
                      onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white">{companyInfo.address.street}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">City</Label>
                    {isEditing ? (
                      <Input
                        value={companyInfo.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{companyInfo.address.city}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-300">State</Label>
                    {isEditing ? (
                      <Input
                        value={companyInfo.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{companyInfo.address.state}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Pincode</Label>
                    {isEditing ? (
                      <Input
                        value={companyInfo.address.pincode}
                        onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{companyInfo.address.pincode}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-300">Country</Label>
                    {isEditing ? (
                      <Input
                        value={companyInfo.address.country}
                        onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{companyInfo.address.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Phone</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.contact.phone}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.contact.phone}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">Email</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.contact.email}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.contact.email}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">Website</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.contact.website}
                    onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.contact.website}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">Fax (Optional)</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.contact.fax || ''}
                    onChange={(e) => handleInputChange('contact', 'fax', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.contact.fax || 'Not provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Business Type</Label>
                {isEditing ? (
                  <Select value={companyInfo.business.type} onValueChange={(value) => handleInputChange('business', 'type', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-white">{companyInfo.business.type}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">GST Number</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.business.gstNumber}
                    onChange={(e) => handleInputChange('business', 'gstNumber', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.business.gstNumber}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">PAN Number</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.business.panNumber}
                    onChange={(e) => handleInputChange('business', 'panNumber', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.business.panNumber}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">License Number</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.business.licenseNumber}
                    onChange={(e) => handleInputChange('business', 'licenseNumber', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.business.licenseNumber}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Banking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Bank Name</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.banking.bankName}
                    onChange={(e) => handleInputChange('banking', 'bankName', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.banking.bankName}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">Account Number</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.banking.accountNumber}
                    onChange={(e) => handleInputChange('banking', 'accountNumber', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{'*'.repeat(companyInfo.banking.accountNumber.length - 4) + companyInfo.banking.accountNumber.slice(-4)}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">IFSC Code</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.banking.ifscCode}
                    onChange={(e) => handleInputChange('banking', 'ifscCode', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.banking.ifscCode}</p>
                )}
              </div>
              <div>
                <Label className="text-slate-300">Branch Name</Label>
                {isEditing ? (
                  <Input
                    value={companyInfo.banking.branchName}
                    onChange={(e) => handleInputChange('banking', 'branchName', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-white">{companyInfo.banking.branchName}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
