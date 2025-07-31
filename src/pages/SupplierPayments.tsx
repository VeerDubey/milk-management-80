import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { toast } from 'sonner';

export default function SupplierPayments() {
  const { suppliers, supplierPayments, addSupplierPayment } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    supplierId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as 'cash' | 'bank_transfer' | 'cheque',
    reference: '',
    notes: '',
    status: 'completed' as 'pending' | 'completed' | 'failed'
  });

  const filteredPayments = supplierPayments.filter(payment => {
    const supplier = suppliers.find(s => s.id === payment.supplierId);
    const matchesSearch = supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !selectedSupplier || payment.supplierId === selectedSupplier;
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplierPayment({
      ...newPayment,
      amount: Number(newPayment.amount),
      method: newPayment.paymentMethod
    });
    toast.success('Supplier payment recorded successfully');
    setIsDialogOpen(false);
    setNewPayment({
      supplierId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash' as 'cash' | 'bank_transfer' | 'cheque',
      reference: '',
      notes: '',
      status: 'completed' as 'pending' | 'completed' | 'failed'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      case 'failed': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'bank': return '🏦';
      case 'card': return '💳';
      case 'upi': return '📱';
      default: return '💰';
    }
  };

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Supplier Payments
          </h1>
          <p className="text-slate-300 mt-2">Track and manage supplier payments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Record Supplier Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Supplier</Label>
                <Select value={newPayment.supplierId} onValueChange={(value) => setNewPayment({...newPayment, supplierId: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Amount</Label>
                  <Input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Payment Date</Label>
                  <Input
                    type="date"
                    value={newPayment.paymentDate}
                    onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Payment Method</Label>
                <Select value={newPayment.paymentMethod} onValueChange={(value: 'cash' | 'bank_transfer' | 'cheque') => setNewPayment({...newPayment, paymentMethod: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Reference</Label>
                <Input
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({...newPayment, reference: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Transaction ID, cheque number, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Input
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Additional notes..."
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Record Payment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{totalPayments.toFixed(2)}</div>
            <p className="text-green-300 text-sm">All time payments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{filteredPayments.filter(p => 
                new Date(p.paymentDate).getMonth() === new Date().getMonth()
              ).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </div>
            <p className="text-blue-300 text-sm">Current month total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredPayments.length}</div>
            <p className="text-purple-300 text-sm">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search payments..."
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
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPayments.map(payment => {
          const supplier = suppliers.find(s => s.id === payment.supplierId);
          
          return (
            <Card key={payment.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <div className="text-2xl">
                       {getPaymentMethodIcon(payment.method)}
                     </div>
                    <div>
                      <h3 className="font-semibold text-white">{supplier?.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">₹{payment.amount.toFixed(2)}</div>
                       <div className="text-slate-400 text-sm capitalize">
                         {payment.method}
                       </div>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
                
                {payment.reference && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">
                      Reference: <span className="text-white">{payment.reference}</span>
                    </p>
                  </div>
                )}
                
                {payment.notes && (
                  <div className="mt-2">
                    <p className="text-slate-400 text-sm">
                      Notes: <span className="text-white">{payment.notes}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPayments.length === 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Payments Found</h3>
            <p className="text-slate-400 text-center max-w-md">
              No supplier payments match your search criteria. Try adjusting your filters or record a new payment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
