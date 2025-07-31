
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Edit, Trash2, Eye, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoiceTemplates() {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Standard Invoice',
      description: 'Basic invoice template with company details',
      type: 'standard',
      isDefault: true,
      fields: ['company', 'customer', 'items', 'totals']
    },
    {
      id: '2',
      name: 'Detailed Invoice',
      description: 'Comprehensive invoice with product details',
      type: 'detailed',
      isDefault: false,
      fields: ['company', 'customer', 'items', 'totals', 'notes', 'terms']
    },
    {
      id: '3',
      name: 'Minimal Invoice',
      description: 'Clean, minimal invoice design',
      type: 'minimal',
      isDefault: false,
      fields: ['company', 'customer', 'items', 'totals']
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'standard',
    fields: [] as string[]
  });

  const availableFields = [
    { id: 'company', label: 'Company Information' },
    { id: 'customer', label: 'Customer Details' },
    { id: 'items', label: 'Invoice Items' },
    { id: 'totals', label: 'Totals & Calculations' },
    { id: 'notes', label: 'Notes & Comments' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'payment', label: 'Payment Information' },
    { id: 'shipping', label: 'Shipping Details' }
  ];

  const createTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error('Please enter template name');
      return;
    }

    const template = {
      ...newTemplate,
      id: Date.now().toString(),
      isDefault: false
    };

    setTemplates([...templates, template]);
    toast.success('Template created successfully');
    setNewTemplate({ name: '', description: '', type: 'standard', fields: [] });
  };

  const duplicateTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const duplicated = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        isDefault: false
      };
      setTemplates([...templates, duplicated]);
      toast.success('Template duplicated successfully');
    }
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully');
  };

  const setAsDefault = (templateId: string) => {
    setTemplates(templates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    })));
    toast.success('Default template updated');
  };

  const toggleField = (fieldId: string) => {
    const isSelected = newTemplate.fields.includes(fieldId);
    if (isSelected) {
      setNewTemplate({
        ...newTemplate,
        fields: newTemplate.fields.filter(f => f !== fieldId)
      });
    } else {
      setNewTemplate({
        ...newTemplate,
        fields: [...newTemplate.fields, fieldId]
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Invoice Templates
          </h1>
          <p className="text-slate-300 mt-2">Create and manage invoice templates</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter template name"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Template description"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Template Type</Label>
                <Select value={newTemplate.type} onValueChange={(value) => setNewTemplate({...newTemplate, type: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Include Fields</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableFields.map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={field.id}
                        checked={newTemplate.fields.includes(field.id)}
                        onChange={() => toggleField(field.id)}
                        className="rounded"
                      />
                      <label htmlFor={field.id} className="text-sm text-slate-300">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={createTemplate} className="w-full bg-blue-600 hover:bg-blue-700">
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {template.name}
                    {template.isDefault && (
                      <Badge className="ml-2 bg-green-600 text-white">Default</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-2">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="outline" className="text-slate-300 border-slate-500">
                  {template.type}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Included Fields:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.fields.map(fieldId => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return field ? (
                      <Badge key={fieldId} variant="secondary" className="text-xs">
                        {field.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => duplicateTemplate(template.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex gap-1">
                  {!template.isDefault && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setAsDefault(template.id)}
                      className="text-xs px-2"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="h-8 w-8 p-0"
                    onClick={() => deleteTemplate(template.id)}
                    disabled={template.isDefault}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Template Preview</CardTitle>
          <CardDescription className="text-slate-300">
            Preview how your invoice templates will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600 min-h-[300px] flex items-center justify-center">
            <div className="text-center text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a template to preview</p>
              <p className="text-sm mt-2">Template preview will be shown here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
