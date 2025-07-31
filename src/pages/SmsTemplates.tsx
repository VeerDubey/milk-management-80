
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface SmsTemplate {
  id: string;
  name: string;
  message: string;
  category: string;
}

export default function SmsTemplates() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([
    {
      id: '1',
      name: 'Order Confirmation',
      message: 'Dear {customerName}, your order #{orderNumber} has been confirmed. Total amount: ₹{amount}. Thank you!',
      category: 'Orders'
    },
    {
      id: '2',
      name: 'Payment Reminder',
      message: 'Dear {customerName}, your payment of ₹{amount} is due on {dueDate}. Please make the payment to avoid late fees.',
      category: 'Payments'
    },
    {
      id: '3',
      name: 'Delivery Update',
      message: 'Your order #{orderNumber} is out for delivery and will reach you by {deliveryTime}. Thank you for choosing us!',
      category: 'Delivery'
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    message: '',
    category: 'Orders'
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isEditing) {
      setTemplates(prev => prev.map(template => 
        template.id === isEditing 
          ? { ...template, ...newTemplate }
          : template
      ));
      setIsEditing(null);
      toast.success('Template updated successfully');
    } else {
      const template: SmsTemplate = {
        id: Date.now().toString(),
        ...newTemplate
      };
      setTemplates(prev => [...prev, template]);
      toast.success('Template created successfully');
    }

    setNewTemplate({ name: '', message: '', category: 'Orders' });
  };

  const handleEditTemplate = (template: SmsTemplate) => {
    setNewTemplate({
      name: template.name,
      message: template.message,
      category: template.category
    });
    setIsEditing(template.id);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    toast.success('Template deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SMS Templates</h1>
        <p className="text-muted-foreground">
          Create and manage SMS templates for customer communication
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {isEditing ? 'Edit Template' : 'Create Template'}
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Update the existing template' : 'Create a new SMS template'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input
                placeholder="Enter template name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Orders">Orders</option>
                <option value="Payments">Payments</option>
                <option value="Delivery">Delivery</option>
                <option value="Marketing">Marketing</option>
                <option value="General">General</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Enter SMS message (use {customerName}, {orderNumber}, {amount}, etc. for variables)"
                rows={4}
                value={newTemplate.message}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, message: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Characters: {newTemplate.message.length}/160
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSaveTemplate} className="flex-1">
                {isEditing ? 'Update Template' : 'Save Template'}
              </Button>
              {isEditing && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(null);
                    setNewTemplate({ name: '', message: '', category: 'Orders' });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SMS Templates</CardTitle>
            <CardDescription>
              Manage your SMS templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.category}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {template.message}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
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
      </div>
    </div>
  );
}
