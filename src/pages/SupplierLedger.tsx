import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';

export default function SupplierLedger() {
  const { suppliers, supplierPayments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !selectedSupplier || supplier.id === selectedSupplier;
    return matchesSearch && matchesSupplier;
  });

  const getSupplierBalance = (supplierId: string) => {
    const payments = supplierPayments.filter(p => p.supplierId === supplierId);
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getSupplierTransactions = (supplierId: string) => {
    return supplierPayments.filter(p => p.supplierId === supplierId).length;
  };

  const getLastPaymentDate = (supplierId: string) => {
    const payments = supplierPayments.filter(p => p.supplierId === supplierId);
    if (payments.length === 0) return null;
    return new Date(Math.max(...payments.map(p => new Date(p.paymentDate).getTime())));
  };

  const totalPaid = supplierPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => getSupplierBalance(s.id) > 0).length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Supplier Ledger
          </h1>
          <p className="text-slate-300 mt-2">Track supplier account balances and transactions</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{totalPaid.toFixed(2)}</div>
            <p className="text-green-300 text-sm">All time payments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Active Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeSuppliers}</div>
            <p className="text-blue-300 text-sm">out of {totalSuppliers} total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{supplierPayments.length}</div>
            <p className="text-purple-300 text-sm">Total payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Suppliers</SelectItem>
            {suppliers.map(supplier => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Supplier Ledger</CardTitle>
          <CardDescription className="text-slate-300">
            View account balances and transaction history for all suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-700 bg-slate-800/50">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Supplier</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">Total Paid</TableHead>
                  <TableHead className="text-slate-300">Transactions</TableHead>
                  <TableHead className="text-slate-300">Last Payment</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map(supplier => {
                  const balance = getSupplierBalance(supplier.id);
                  const transactions = getSupplierTransactions(supplier.id);
                  const lastPayment = getLastPaymentDate(supplier.id);
                  
                  return (
                    <TableRow key={supplier.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{supplier.name}</div>
                          <div className="text-slate-400 text-sm">{supplier.contactPerson || 'No contact person'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-300">
                          <div>{supplier.phone}</div>
                          <div className="text-slate-400 text-sm">{supplier.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">₹{balance.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-slate-300 border-slate-500">
                          {transactions}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-300">
                          {lastPayment ? lastPayment.toLocaleDateString() : 'No payments'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={balance > 0 ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                          {balance > 0 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredSuppliers.length === 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Suppliers Found</h3>
            <p className="text-slate-400 text-center max-w-md">
              No suppliers match your search criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
