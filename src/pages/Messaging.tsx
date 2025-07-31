
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, MessageSquare, Mail, Phone, Users, Clock, CheckCircle } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';

export default function Messaging() {
  const { customers } = useData();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'whatsapp'>('sms');
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messageTemplates = {
    sms: [
      { id: 'reminder', name: 'Payment Reminder', content: 'Dear {name}, your payment of ₹{amount} is due. Please make payment at your earliest convenience.' },
      { id: 'delivery', name: 'Delivery Update', content: 'Hi {name}, your milk delivery is scheduled for {date} at {time}. Thank you!' },
      { id: 'welcome', name: 'Welcome Message', content: 'Welcome to Vikas Milk Centre! We appreciate your business and look forward to serving you.' },
      { id: 'promo', name: 'Promotional', content: 'Special offer! Get 10% off on bulk orders this month. Contact us for more details.' }
    ],
    email: [
      { id: 'invoice', name: 'Invoice', content: 'Dear {name},\n\nPlease find attached your invoice for the recent order. Total amount: ₹{amount}\n\nThank you for your business.' },
      { id: 'newsletter', name: 'Newsletter', content: 'Monthly newsletter with updates about our products and services.' },
      { id: 'feedback', name: 'Feedback Request', content: 'We value your feedback! Please share your experience with our products and services.' }
    ],
    whatsapp: [
      { id: 'order_confirm', name: 'Order Confirmation', content: 'Order confirmed! Your order #{orderNumber} will be delivered on {date}.' },
      { id: 'status_update', name: 'Status Update', content: 'Your order is {status}. Track your delivery for real-time updates.' }
    ]
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(customers.map(c => c.id));
  };

  const handleClearSelection = () => {
    setSelectedCustomers([]);
  };

  const handleTemplateSelect = (templateId: string) => {
    const templates = messageTemplates[messageType];
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setMessageContent(selectedTemplate.content);
      setTemplate(templateId);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || selectedCustomers.length === 0) {
      toast.error('Please select customers and enter a message');
      return;
    }

    setIsSending(true);
    
    // Simulate sending messages
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${messageType.toUpperCase()} sent to ${selectedCustomers.length} customer(s)`);
    setIsSending(false);
    setMessageContent('');
    setSubject('');
    setSelectedCustomers([]);
  };

  const getMessageStats = () => {
    return {
      totalSent: 1250,
      delivered: 1180,
      pending: 45,
      failed: 25
    };
  };

  const stats = getMessageStats();

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Messaging Center
          </h1>
          <p className="text-slate-300 mt-2">Send SMS, email, and WhatsApp messages to customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.delivered}</div>
            <p className="text-green-300 text-sm">Messages delivered</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSent}</div>
            <p className="text-blue-300 text-sm">All messages</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
            <p className="text-yellow-300 text-sm">In queue</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.failed}</div>
            <p className="text-red-300 text-sm">Delivery failed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Select Recipients</CardTitle>
                <CardDescription className="text-slate-300">
                  Choose customers to send messages to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSelectAll} variant="outline" className="border-slate-600 text-white">
                      Select All
                    </Button>
                    <Button size="sm" onClick={handleClearSelection} variant="outline" className="border-slate-600 text-white">
                      Clear All
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    {selectedCustomers.length} selected
                  </Badge>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {customers.map(customer => (
                    <div
                      key={customer.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCustomers.includes(customer.id)
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                      }`}
                      onClick={() => handleCustomerSelect(customer.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-slate-400 text-sm">{customer.phone}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Compose Message</CardTitle>
                <CardDescription className="text-slate-300">
                  Create and send your message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Message Type</Label>
                  <Select value={messageType} onValueChange={(value: 'sms' | 'email' | 'whatsapp') => setMessageType(value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Template</Label>
                  <Select value={template} onValueChange={handleTemplateSelect}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTemplates[messageType].map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {messageType === 'email' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Subject</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Email subject"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-slate-300">Message</Label>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-32"
                    placeholder="Type your message here..."
                  />
                  <div className="text-right text-slate-400 text-sm">
                    {messageContent.length}/160 characters
                  </div>
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={isSending || !messageContent.trim() || selectedCustomers.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Message Templates</CardTitle>
              <CardDescription className="text-slate-300">
                Pre-built templates for common messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(messageTemplates).map(([type, templates]) => (
                  <div key={type} className="space-y-4">
                    <h3 className="font-semibold text-white capitalize">{type} Templates</h3>
                    {templates.map(template => (
                      <Card key={template.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-white mb-2">{template.name}</h4>
                          <p className="text-slate-300 text-sm">{template.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Message History</CardTitle>
              <CardDescription className="text-slate-300">
                View previously sent messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Message History</h3>
                <p className="text-slate-400">Message history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
