
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Search, Plus, Eye, Edit, Download, FileText, Receipt, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  date: string;
  dueDate: string;
  items: number;
  notes?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    customerId: 'cust1',
    customerName: 'Rajesh Kumar',
    amount: 3250.00,
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-01-30',
    items: 12,
    notes: 'Monthly order'
  },
  {
    id: 'INV002',
    customerId: 'cust2',
    customerName: 'Priya Sharma',
    amount: 2180.50,
    status: 'sent',
    date: '2024-01-14',
    dueDate: '2024-01-29',
    items: 8
  },
  {
    id: 'INV003',
    customerId: 'cust3',
    customerName: 'Amit Patel',
    amount: 1850.00,
    status: 'overdue',
    date: '2024-01-10',
    dueDate: '2024-01-25',
    items: 6
  }
];

export default function InvoiceHistory() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30';
      case 'sent': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30';
      case 'overdue': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30';
      case 'draft': return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const totalInvoices = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = filteredInvoices.filter(i => i.status === 'paid').length;
  const overdueInvoices = filteredInvoices.filter(i => i.status === 'overdue').length;

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} sent to customer`);
  };

  return (
    <div className="neo-noir-bg min-h-screen">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold neo-noir-gradient-text">
              Invoice History
            </h1>
            <p className="neo-noir-text-muted">
              View and manage all generated invoices
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="neo-noir-button-outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
            <Button className="neo-noir-button-accent">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">₹{totalInvoices.toFixed(2)}</div>
              <p className="text-xs neo-noir-text-muted">
                {filteredInvoices.length} invoices
              </p>
            </CardContent>
          </Card>

          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Paid</CardTitle>
              <Receipt className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">{paidInvoices}</div>
              <p className="text-xs neo-noir-text-muted">
                Completed payments
              </p>
            </CardContent>
          </Card>

          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Overdue</CardTitle>
              <FileText className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">{overdueInvoices}</div>
              <p className="text-xs neo-noir-text-muted">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card className="neo-noir-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium neo-noir-text">Average</CardTitle>
              <Receipt className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold neo-noir-text">
                ₹{filteredInvoices.length > 0 ? (totalInvoices / filteredInvoices.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs neo-noir-text-muted">
                Per invoice
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text">Invoice Filters</CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Filter invoices by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="neo-noir-text text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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

        {/* Invoices Table */}
        <Card className="neo-noir-card">
          <CardHeader>
            <CardTitle className="neo-noir-text">Invoice List</CardTitle>
            <CardDescription className="neo-noir-text-muted">
              Complete list of all generated invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length > 0 ? (
              <Table className="neo-noir-table">
                <TableHeader>
                  <TableRow className="neo-noir-table-header">
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="neo-noir-table-row">
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell className="font-medium">₹{invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>{invoice.items}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(invoice.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="neo-noir-button-outline"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
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
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold neo-noir-text mb-2">No invoices found</h3>
                <p className="neo-noir-text-muted">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No invoices have been generated yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
