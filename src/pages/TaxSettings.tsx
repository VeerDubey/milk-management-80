
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Calculator, Plus, Edit, Trash2, Settings, FileText, Percent, Save } from 'lucide-react';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'GST' | 'CGST' | 'SGST' | 'IGST' | 'VAT' | 'Service Tax';
  isActive: boolean;
  applicableFrom: string;
  hsnCodes: string[];
  description: string;
}

interface TaxSettings {
  gstEnabled: boolean;
  gstNumber: string;
  defaultTaxRate: number;
  taxInclusive: boolean;
  roundingMethod: 'none' | 'round' | 'floor' | 'ceil';
  showTaxBreakup: boolean;
  companyState: string;
}

const TaxSettings = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    {
      id: '1',
      name: 'GST 18%',
      rate: 18,
      type: 'GST',
      isActive: true,
      applicableFrom: '2024-01-01',
      hsnCodes: ['0401', '0402'],
      description: 'Standard GST rate for dairy products'
    },
    {
      id: '2',
      name: 'GST 5%',
      rate: 5,
      type: 'GST',
      isActive: true,
      applicableFrom: '2024-01-01',
      hsnCodes: ['0403'],
      description: 'Reduced GST rate for specific dairy items'
    }
  ]);

  const [settings, setSettings] = useState<TaxSettings>({
    gstEnabled: true,
    gstNumber: '27ABCDE1234F1Z5',
    defaultTaxRate: 18,
    taxInclusive: false,
    roundingMethod: 'round',
    showTaxBreakup: true,
    companyState: 'Maharashtra'
  });

  const [showDialog, setShowDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    type: 'GST' as TaxRate['type'],
    applicableFrom: '',
    hsnCodes: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRate) {
      setTaxRates(taxRates.map(rate => 
        rate.id === editingRate.id 
          ? { 
              ...rate, 
              ...formData, 
              rate: parseFloat(formData.rate),
              hsnCodes: formData.hsnCodes.split(',').map(code => code.trim())
            }
          : rate
      ));
      toast.success('Tax rate updated successfully');
    } else {
      const newRate: TaxRate = {
        id: Date.now().toString(),
        ...formData,
        rate: parseFloat(formData.rate),
        hsnCodes: formData.hsnCodes.split(',').map(code => code.trim()),
        isActive: true
      };
      setTaxRates([...taxRates, newRate]);
      toast.success('Tax rate created successfully');
    }
    
    setShowDialog(false);
    setEditingRate(null);
    setFormData({ name: '', rate: '', type: 'GST', applicableFrom: '', hsnCodes: '', description: '' });
  };

  const handleEdit = (rate: TaxRate) => {
    setEditingRate(rate);
    setFormData({
      name: rate.name,
      rate: rate.rate.toString(),
      type: rate.type,
      applicableFrom: rate.applicableFrom,
      hsnCodes: rate.hsnCodes.join(', '),
      description: rate.description
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setTaxRates(taxRates.filter(rate => rate.id !== id));
    toast.success('Tax rate deleted successfully');
  };

  const toggleActive = (id: string) => {
    setTaxRates(taxRates.map(rate => 
      rate.id === id 
        ? { ...rate, isActive: !rate.isActive }
        : rate
    ));
    toast.success('Tax rate status updated');
  };

  const handleSettingsChange = (field: keyof TaxSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('taxSettings', JSON.stringify(settings));
    localStorage.setItem('taxRates', JSON.stringify(taxRates));
    toast.success('Tax settings saved successfully');
  };

  const taxTypes = ['GST', 'CGST', 'SGST', 'IGST', 'VAT', 'Service Tax'];
  const states = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 
    'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Madhya Pradesh'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tax Settings
            </h1>
            <p className="text-slate-300 mt-2">Configure tax rates and GST settings</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Rate
            </Button>
            <Button 
              onClick={saveSettings}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Tax Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tax Configuration
            </CardTitle>
            <CardDescription className="text-slate-300">
              Configure general tax settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Enable GST</Label>
                  <Switch
                    checked={settings.gstEnabled}
                    onCheckedChange={(checked) => handleSettingsChange('gstEnabled', checked)}
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">GST Number</Label>
                  <Input
                    value={settings.gstNumber}
                    onChange={(e) => handleSettingsChange('gstNumber', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Enter GST number"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Default Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={settings.defaultTaxRate}
                    onChange={(e) => handleSettingsChange('defaultTaxRate', parseFloat(e.target.value))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Company State</Label>
                  <Select value={settings.companyState} onValueChange={(value) => handleSettingsChange('companyState', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Tax Inclusive Pricing</Label>
                  <Switch
                    checked={settings.taxInclusive}
                    onCheckedChange={(checked) => handleSettingsChange('taxInclusive', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Show Tax Breakup</Label>
                  <Switch
                    checked={settings.showTaxBreakup}
                    onCheckedChange={(checked) => handleSettingsChange('showTaxBreakup', checked)}
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Tax Rounding Method</Label>
                  <Select value={settings.roundingMethod} onValueChange={(value) => handleSettingsChange('roundingMethod', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Rounding</SelectItem>
                      <SelectItem value="round">Round to Nearest</SelectItem>
                      <SelectItem value="floor">Round Down</SelectItem>
                      <SelectItem value="ceil">Round Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Rates */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Rates ({taxRates.length})
            </CardTitle>
            <CardDescription className="text-slate-300">
              Manage tax rates and their applicable HSN codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Rate</TableHead>
                  <TableHead className="text-slate-300">HSN Codes</TableHead>
                  <TableHead className="text-slate-300">Applicable From</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRates.map(rate => (
                  <TableRow key={rate.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{rate.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        {rate.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{rate.rate}%</TableCell>
                    <TableCell className="text-slate-300">
                      {rate.hsnCodes.slice(0, 2).join(', ')}
                      {rate.hsnCodes.length > 2 && <span className="text-slate-400"> +{rate.hsnCodes.length - 2} more</span>}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(rate.applicableFrom).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={rate.isActive ? "default" : "secondary"}
                        className={rate.isActive ? "bg-green-600/20 text-green-300" : "bg-slate-600/20 text-slate-300"}
                      >
                        {rate.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rate)}
                          className="text-blue-300 border-blue-300 hover:bg-blue-600/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(rate.id)}
                          className="text-yellow-300 border-yellow-300 hover:bg-yellow-600/20"
                        >
                          {rate.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(rate.id)}
                          className="text-red-300 border-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRate ? 'Edit Tax Rate' : 'Create New Tax Rate'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {editingRate ? 'Update tax rate information' : 'Add a new tax rate configuration'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Tax Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="GST 18%"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-slate-300">Tax Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as TaxRate['type']})}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taxTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rate" className="text-slate-300">Tax Rate (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={formData.rate}
                    onChange={(e) => setFormData({...formData, rate: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicableFrom" className="text-slate-300">Applicable From</Label>
                  <Input
                    id="applicableFrom"
                    type="date"
                    value={formData.applicableFrom}
                    onChange={(e) => setFormData({...formData, applicableFrom: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hsnCodes" className="text-slate-300">HSN Codes (comma-separated)</Label>
                <Input
                  id="hsnCodes"
                  value={formData.hsnCodes}
                  onChange={(e) => setFormData({...formData, hsnCodes: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="0401, 0402, 0403"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Tax rate description"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingRate ? 'Update' : 'Create'} Tax Rate
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaxSettings;
