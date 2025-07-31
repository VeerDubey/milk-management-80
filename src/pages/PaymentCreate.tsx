
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Search, CreditCard, DollarSign, Save, ArrowLeft } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function PaymentCreate() {
  const { customers } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentData, setPaymentData] = useState({
    customerId: '',
    amount: '',
    paymentMethod: '',
    date: new Date(),
    reference: '',
    notes: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === paymentData.customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.customerId || !paymentData.amount || !paymentData.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to backend
    toast.success('Payment recorded successfully');
    navigate('/payment-list');
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="neo-noir-bg min-h-screen">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/payment-list')}
                className="neo-noir-button-outline"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold neo-noir-gradient-text">
                Create Payment
              </h1>
            </div>
            <p className="neo-noir-text-muted">
              Record a new customer payment transaction
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <Card className="neo-noir-card">
            <CardHeader>
              <CardTitle className="neo-noir-text">Customer Information</CardTitle>
              <CardDescription className="neo-noir-text-muted">
                Select the customer making the payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="neo-noir-text">Search Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 neo-noir-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="neo-noir-text">Select Customer *</Label>
                  <Select 
                    value={paymentData.customerId} 
                    onValueChange={(value) => setPaymentData({ ...paymentData, customerId: value })}
                  >
                    <SelectTrigger className="neo-noir-input">
                      <SelectValue placeholder="Choose customer" />
                    </SelectTrigger>
                    <SelectContent className="neo-noir-surface">
                      {filteredCustomers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center gap-2">
                            {customer.name}
                            <Badge variant="outline" className="text-xs">
                              Customer
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedCustomer && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="neo-noir-text-muted">Phone</p>
                      <p className="neo-noir-text">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="neo-noir-text-muted">Email</p>
                      <p className="neo-noir-text">{selectedCustomer.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="neo-noir-text-muted">Area</p>
                      <p className="neo-noir-text">{selectedCustomer.area}</p>
                    </div>
                    <div>
                      <p className="neo-noir-text-muted">Balance</p>
                      <p className="neo-noir-text font-medium">₹{selectedCustomer.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="neo-noir-card">
            <CardHeader>
              <CardTitle className="neo-noir-text">Payment Details</CardTitle>
              <CardDescription className="neo-noir-text-muted">
                Enter the payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="neo-noir-text">Payment Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="neo-noir-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="neo-noir-text">Payment Method *</Label>
                  <Select 
                    value={paymentData.paymentMethod} 
                    onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                  >
                    <SelectTrigger className="neo-noir-input">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="neo-noir-surface">
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Cash
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Card
                        </div>
                      </SelectItem>
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          UPI
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="neo-noir-text">Payment Date</Label>
                  <DatePicker
                    date={paymentData.date}
                    setDate={(date) => setPaymentData({ ...paymentData, date: date || new Date() })}
                    className="neo-noir-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference" className="neo-noir-text">Reference Number</Label>
                  <Input
                    id="reference"
                    placeholder="Transaction reference"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                    className="neo-noir-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="neo-noir-text">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the payment..."
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  className="neo-noir-input"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          {paymentData.amount && selectedCustomer && (
            <Card className="neo-noir-card">
              <CardHeader>
                <CardTitle className="neo-noir-text">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="neo-noir-text-muted">Customer:</span>
                    <span className="neo-noir-text font-medium">{selectedCustomer.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="neo-noir-text-muted">Payment Amount:</span>
                    <span className="neo-noir-text font-medium text-lg">₹{parseFloat(paymentData.amount || '0').toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="neo-noir-text-muted">Payment Method:</span>
                    <div className="flex items-center gap-2">
                      {paymentData.paymentMethod && getPaymentMethodIcon(paymentData.paymentMethod)}
                      <span className="neo-noir-text capitalize">
                        {paymentData.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/payment-list')}
              className="neo-noir-button-outline"
            >
              Cancel
            </Button>
            <Button type="submit" className="neo-noir-button-accent">
              <Save className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
