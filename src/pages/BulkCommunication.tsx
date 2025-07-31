
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Users, Send, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';

export default function BulkCommunication() {
  const { customers } = useData();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [filterArea, setFilterArea] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'whatsapp'>('sms');
  const [subject, setSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);

  const areas = Array.from(new Set(customers.map(c => c.area).filter(Boolean)));
  
  const filteredCustomers = customers.filter(customer => {
    const matchesArea = !filterArea || customer.area === filterArea;
    const matchesStatus = !filterStatus || customer.area; // Simple status filter
    return matchesArea && matchesStatus;
  });

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(filteredCustomers.map(c => c.id));
  };

  const handleClearSelection = () => {
    setSelectedCustomers([]);
  };

  const handleSelectByArea = (area: string) => {
    const areaCustomers = customers.filter(c => c.area === area);
    setSelectedCustomers(areaCustomers.map(c => c.id));
  };

  const handleSendBulkMessage = async () => {
    if (!messageContent.trim() || selectedCustomers.length === 0) {
      toast.error('Please select customers and enter a message');
      return;
    }

    setIsSending(true);
    setSendingProgress(0);

    // Simulate sending progress
    const interval = setInterval(() => {
      setSendingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSending(false);
          toast.success(`Bulk ${messageType.toUpperCase()} sent to ${selectedCustomers.length} customer(s)`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const messageTemplates = [
    { id: 'payment_reminder', name: 'Payment Reminder', content: 'Dear {name}, your payment of ₹{amount} is due. Please pay at your earliest convenience.' },
    { id: 'delivery_update', name: 'Delivery Update', content: 'Hi {name}, your milk delivery for {date} is confirmed. Thank you for your business!' },
    { id: 'promotion', name: 'Promotional Offer', content: 'Special offer for {name}! Get 10% off on your next order. Valid till {date}.' },
    { id: 'festival_wishes', name: 'Festival Greetings', content: 'Wishing you and your family a very happy {festival}! - Vikas Milk Centre' },
    { id: 'new_product', name: 'New Product Launch', content: 'Introducing our new {product}! Fresh, quality dairy products delivered to your doorstep.' }
  ];

  const getEstimatedCost = () => {
    const rates = { sms: 0.50, email: 0.10, whatsapp: 0.25 };
    return (selectedCustomers.length * rates[messageType]).toFixed(2);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bulk Communication
          </h1>
          <p className="text-slate-300 mt-2">Send messages to multiple customers at once</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{customers.length}</div>
            <p className="text-blue-300 text-sm">Available for messaging</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedCustomers.length}</div>
            <p className="text-green-300 text-sm">Ready to send</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Est. Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{getEstimatedCost()}</div>
            <p className="text-purple-300 text-sm">Per {messageType.toUpperCase()}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{areas.length}</div>
            <p className="text-yellow-300 text-sm">Service areas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Select Recipients</CardTitle>
            <CardDescription className="text-slate-300">
              Choose customers for bulk messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Areas</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSelectAll} variant="outline" className="border-slate-600 text-white">
                  Select All
                </Button>
                <Button size="sm" onClick={handleClearSelection} variant="outline" className="border-slate-600 text-white">
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Quick Select by Area</Label>
              <div className="flex flex-wrap gap-2">
                {areas.map(area => (
                  <Badge
                    key={area}
                    variant="outline"
                    className="cursor-pointer border-slate-500 text-slate-300 hover:bg-slate-700"
                    onClick={() => handleSelectByArea(area)}
                  >
                    {area} ({customers.filter(c => c.area === area).length})
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCustomers.includes(customer.id)
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                  }`}
                  onClick={() => handleCustomerSelect(customer.id)}
                >
                  <Checkbox 
                    checked={selectedCustomers.includes(customer.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{customer.name}</div>
                    <div className="text-slate-400 text-sm">{customer.area} • {customer.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Compose Campaign</CardTitle>
            <CardDescription className="text-slate-300">
              Create your bulk message campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Campaign Name</Label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter campaign name"
              />
            </div>

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
              <Label className="text-slate-300">Quick Templates</Label>
              <div className="grid grid-cols-1 gap-2">
                {messageTemplates.map(template => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="justify-start border-slate-600 text-white hover:bg-slate-700"
                    onClick={() => setMessageContent(template.content)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
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
              <Label className="text-slate-300">Message Content</Label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-32"
                placeholder="Type your message here... Use {name} for customer name, {amount} for amounts, {date} for dates"
              />
              <div className="text-right text-slate-400 text-sm">
                Variables: {'{name}'}, {'{amount}'}, {'{date}'}, {'{product}'}, {'{festival}'}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="schedule"
                checked={isScheduled}
                onCheckedChange={(checked) => setIsScheduled(checked === true)}
              />
              <Label htmlFor="schedule" className="text-slate-300">Schedule for later</Label>
            </div>

            {isScheduled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Date</Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Time</Label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            )}

            {isSending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Sending messages...</span>
                  <span>{sendingProgress}%</span>
                </div>
                <Progress value={sendingProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleSendBulkMessage}
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
                  {isScheduled ? 'Schedule Campaign' : 'Send Now'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
