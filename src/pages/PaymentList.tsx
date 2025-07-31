
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Search, Plus, Eye, Edit, Download, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference?: string;
  notes?: string;
}

const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    customerId: 'cust1',
    customerName: 'Rajesh Kumar',
    amount: 2500.00,
    paymentMethod: 'upi',
    status: 'completed',
    date: '2024-01-15',
    reference: 'UPI/123456789',
    notes: 'Monthly payment'
  },
  {
    id: 'PAY002',
    customerId: 'cust2',
    customerName: 'Priya Sharma',
    amount: 1800.50,
    paymentMethod: 'cash',
    status: 'completed',
    date: '2024-01-14',
    notes: 'Cash payment received'
  }
];

export default function PaymentList() {
  const { customers } = useData();
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = paymentMethodFilter === 'all' || payment.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'completed').length;

  return (
    <div className="neo-noir-bg min-h-screen">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold neo-noir-gradient-text">
              Payment List
            </h1>
            <p className="neo-noir-text-muted">
              Track and manage all customer payments
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="neo-noir-button-outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="neo-noir-button-accent">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Total Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">₹{totalPayments.toFixed(2)}</div>
              <p className="text-xs neo-noir-text-muted">
                {filteredPayments.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">{completedPayments}</div>
              <p className="text-xs neo-noir-text-muted">
                Successful payments
              </p>
            </CardContent>
          </Card>

          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Average Payment</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">
                ₹{filteredPayments.length > 0 ? (totalPayments / filteredPayments.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs neo-noir-text-muted">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text">Payment Filters</CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Filter payments by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="neo-noir-text text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 neo-noir-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="neo-noir-text text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="neo-noir-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="neo-noir-surface">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="neo-noir-text text-sm font-medium">Payment Method</label>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger className="neo-noir-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="neo-noir-surface">
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="neo-noir-text text-sm font-medium">From Date</label>
                <DatePicker
                  date={dateFrom}
                  setDate={setDateFrom}
                  className="neo-noir-input"
                />
              </div>
              
              <div className="space-y-2">
                <label className="neo-noir-text text-sm font-medium">To Date</label>
                <DatePicker
                  date={dateTo}
                  setDate={setDateTo}
                  className="neo-noir-input"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text">Payment Transactions</CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Complete list of all payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <Table className="neo-noir-table">
                <TableHeader>
                  <TableRow className="neo-noir-table-header">
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="neo-noir-table-row">
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.customerName}</TableCell>
                      <TableCell className="font-medium">₹{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-sm">{payment.reference || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="neo-noir-button-outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="neo-noir-button-outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold neo-noir-text mb-2">No payments found</h3>
                <p className="neo-noir-text-muted">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No payment transactions recorded yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
