import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExportUtils } from '@/utils/exportUtils';
import { Download, Printer, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CustomerLedger = () => {
  const { customers, orders, payments } = useData();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLedgerData = () => {
    if (!selectedCustomer) return [];
    
    const customerOrders = orders.filter(order => order.customerId === selectedCustomer);
    const customerPayments = payments.filter(payment => payment.customerId === selectedCustomer);
    
    const transactions = [
      ...customerOrders.map(order => ({
        ...order,
        type: 'order',
        date: order.date,
        description: `Order #${order.id}`,
        debit: order.amount,
        credit: 0
      })),
      ...customerPayments.map(payment => ({
        ...payment,
        type: 'payment',
        date: payment.date,
        description: `Payment #${payment.id}`,
        debit: 0,
        credit: payment.amount
      }))
    ];

    return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const ledgerData = getLedgerData();
  const runningBalance = ledgerData.reduce((acc, transaction, index) => {
    const balance = (acc[index - 1]?.balance || 0) + transaction.debit - transaction.credit;
    return [...acc, { ...transaction, balance }];
  }, [] as any[]);

  const totalDebit = ledgerData.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = ledgerData.reduce((sum, t) => sum + t.credit, 0);
  const finalBalance = totalDebit - totalCredit;

  const exportLedger = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }

    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      const headers = ['Date', 'Description', 'Debit', 'Credit', 'Balance'];
      const data = runningBalance.map(transaction => [
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.description,
        transaction.debit.toFixed(2),
        transaction.credit.toFixed(2),
        transaction.balance.toFixed(2)
      ]);
      
      await ExportUtils.exportToExcel(data, headers, `${customer?.name} Ledger`);
      toast.success('Ledger exported successfully!');
    } catch (error) {
      toast.error('Failed to export ledger');
    }
  };

  const printLedger = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }

    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      const headers = ['Date', 'Description', 'Debit', 'Credit', 'Balance'];
      const data = runningBalance.map(transaction => [
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.description,
        transaction.debit.toFixed(2),
        transaction.credit.toFixed(2),
        transaction.balance.toFixed(2)
      ]);
      
      await ExportUtils.printData(data, headers, `${customer?.name} Ledger`);
      toast.success('Ledger sent to printer!');
    } catch (error) {
      toast.error('Failed to print ledger');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Ledger</h1>
          <p className="text-muted-foreground">View customer transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportLedger} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={printLedger} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {filteredCustomers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCustomer && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Debit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{totalDebit.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalCredit.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(finalBalance).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={finalBalance >= 0 ? 'default' : 'destructive'}>
                {finalBalance >= 0 ? 'Credit' : 'Debit'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runningBalance.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      {transaction.debit > 0 ? `₹${transaction.debit.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.credit > 0 ? `₹${transaction.credit.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(transaction.balance).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!selectedCustomer && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select a customer to view their ledger</p>
        </div>
      )}
    </div>
  );
};

export default CustomerLedger;