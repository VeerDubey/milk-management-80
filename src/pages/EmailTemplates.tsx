
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, Plus, Edit, Trash2, Send, Eye, Copy, Search, Filter } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Payment Reminder',
      subject: 'Payment Due Reminder - {customerName}',
      body: 'Dear {customerName},\n\nThis is a friendly reminder that your payment of ₹{amount} is due on {dueDate}.\n\nPlease make the payment at your earliest convenience.\n\nThank you,\nVikas Milk Centre',
      category: 'Payment',
      isActive: true,
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20'
    },
    {
      id: '2',
      name: 'Order Confirmation',
      subject: 'Order Confirmation - #{orderNumber}',
      body: 'Dear {customerName},\n\nThank you for your order #{orderNumber}. Your order has been confirmed and will be delivered on {deliveryDate}.\n\nOrder Details:\n{orderDetails}\n\nTotal: ₹{total}\n\nThank you for your business!\n\nVikas Milk Centre',
      category: 'Order',
      isActive: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'General'
  });

  const categories = ['General', 'Payment', 'Order', 'Delivery', 'Marketing', 'Support'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { ...template, ...formData }
          : template
      ));
      toast.success('Template updated successfully');
    } else {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTemplates([...templates, newTemplate]);
      toast.success('Template created successfully');
    }
    
    setShowDialog(false);
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', body: '', category: 'General' });
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      category: template.category
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast.success('Template deleted successfully');
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, newTemplate]);
    toast.success('Template duplicated successfully');
  };

  const toggleActive = (id: string) => {
    setTemplates(templates.map(template => 
      template.id === id 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
    toast.success('Template status updated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Email Templates
            </h1>
            <p className="text-slate-300 mt-2">Manage your email templates for automated communications</p>
          </div>
          <Button 
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates List */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Templates ({filteredTemplates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Subject</TableHead>
                  <TableHead className="text-slate-300">Category</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-300">Last Used</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map(template => (
                  <TableRow key={template.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{template.name}</TableCell>
                    <TableCell className="text-slate-300">{template.subject}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        {template.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={template.isActive ? "default" : "secondary"}
                        className={template.isActive ? "bg-green-600/20 text-green-300" : "bg-slate-600/20 text-slate-300"}
                      >
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{template.createdAt}</TableCell>
                    <TableCell className="text-slate-300">{template.lastUsed || 'Never'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewTemplate(template)}
                          className="text-blue-300 border-blue-300 hover:bg-blue-600/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(template)}
                          className="text-green-300 border-green-300 hover:bg-green-600/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(template)}
                          className="text-purple-300 border-purple-300 hover:bg-purple-600/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(template.id)}
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
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {editingTemplate ? 'Update your email template' : 'Create a new email template for automated communications'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-slate-300">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject" className="text-slate-300">Subject Line</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Use {customerName}, {amount}, etc. for variables"
                  required
                />
              </div>
              <div>
                <Label htmlFor="body" className="text-slate-300">Email Body</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white h-32"
                  placeholder="Use {customerName}, {amount}, {dueDate}, etc. for variables"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Template Preview</DialogTitle>
              <DialogDescription className="text-slate-300">
                Preview of "{previewTemplate?.name}" template
              </DialogDescription>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Subject:</Label>
                  <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                    {previewTemplate.subject}
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Body:</Label>
                  <div className="bg-slate-700/50 p-3 rounded border border-slate-600 whitespace-pre-wrap">
                    {previewTemplate.body}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Send className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmailTemplates;
