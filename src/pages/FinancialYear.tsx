
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Calendar, Plus, Edit, Archive, TrendingUp, DollarSign, BarChart3, FileText, AlertCircle } from 'lucide-react';

interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  createdAt: string;
  closedAt?: string;
}

const FinancialYear = () => {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([
    {
      id: '1',
      name: 'FY 2024-25',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      isActive: true,
      isClosed: false,
      totalRevenue: 1250000,
      totalExpenses: 850000,
      netProfit: 400000,
      createdAt: '2024-04-01'
    },
    {
      id: '2',
      name: 'FY 2023-24',
      startDate: '2023-04-01',
      endDate: '2024-03-31',
      isActive: false,
      isClosed: true,
      totalRevenue: 1180000,
      totalExpenses: 780000,
      netProfit: 400000,
      createdAt: '2023-04-01',
      closedAt: '2024-04-01'
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [editingYear, setEditingYear] = useState<FinancialYear | null>(null);
  const [yearToClose, setYearToClose] = useState<FinancialYear | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const activeYear = financialYears.find(fy => fy.isActive);
  const currentDate = new Date();
  const yearProgress = activeYear ? 
    ((currentDate.getTime() - new Date(activeYear.startDate).getTime()) / 
     (new Date(activeYear.endDate).getTime() - new Date(activeYear.startDate).getTime())) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingYear) {
      setFinancialYears(financialYears.map(fy => 
        fy.id === editingYear.id 
          ? { ...fy, ...formData }
          : fy
      ));
      toast.success('Financial year updated successfully');
    } else {
      // Deactivate current active year
      const updatedYears = financialYears.map(fy => ({ ...fy, isActive: false }));
      
      const newYear: FinancialYear = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        isClosed: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setFinancialYears([...updatedYears, newYear]);
      toast.success('New financial year created successfully');
    }
    
    setShowDialog(false);
    setEditingYear(null);
    setFormData({ name: '', startDate: '', endDate: '' });
  };

  const handleEdit = (year: FinancialYear) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate
    });
    setShowDialog(true);
  };

  const handleCloseYear = () => {
    if (yearToClose) {
      setFinancialYears(financialYears.map(fy => 
        fy.id === yearToClose.id 
          ? { ...fy, isClosed: true, isActive: false, closedAt: new Date().toISOString().split('T')[0] }
          : fy
      ));
      toast.success('Financial year closed successfully');
      setShowCloseDialog(false);
      setYearToClose(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Financial Year Management
            </h1>
            <p className="text-slate-300 mt-2">Manage financial years and year-end processing</p>
          </div>
          <Button 
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New FY
          </Button>
        </div>

        {/* Current Year Overview */}
        {activeYear && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Current Financial Year: {activeYear.name}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {formatDate(activeYear.startDate)} - {formatDate(activeYear.endDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Year Progress</span>
                    <span className="text-white font-semibold">{Math.round(yearProgress)}%</span>
                  </div>
                  <Progress value={yearProgress} className="h-2 bg-slate-700" />
                  <div className="text-sm text-slate-400">
                    {Math.max(0, Math.round((365 - (yearProgress / 100) * 365)))} days remaining
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">Total Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(activeYear.totalRevenue)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Net Profit</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(activeYear.netProfit)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total FY</p>
                  <p className="text-2xl font-bold text-white">{financialYears.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Active FY</p>
                  <p className="text-2xl font-bold text-white">{financialYears.filter(fy => fy.isActive).length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Closed FY</p>
                  <p className="text-2xl font-bold text-white">{financialYears.filter(fy => fy.isClosed).length}</p>
                </div>
                <Archive className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Profit</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(financialYears.reduce((sum, fy) => sum + fy.netProfit, 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Years List */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Financial Years
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Financial Year</TableHead>
                  <TableHead className="text-slate-300">Period</TableHead>
                  <TableHead className="text-slate-300">Revenue</TableHead>
                  <TableHead className="text-slate-300">Expenses</TableHead>
                  <TableHead className="text-slate-300">Net Profit</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialYears.map(year => (
                  <TableRow key={year.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{year.name}</TableCell>
                    <TableCell className="text-slate-300">
                      {formatDate(year.startDate)} - {formatDate(year.endDate)}
                    </TableCell>
                    <TableCell className="text-green-400">{formatCurrency(year.totalRevenue)}</TableCell>
                    <TableCell className="text-red-400">{formatCurrency(year.totalExpenses)}</TableCell>
                    <TableCell className="text-blue-400">{formatCurrency(year.netProfit)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {year.isActive && (
                          <Badge className="bg-green-600/20 text-green-300">Active</Badge>
                        )}
                        {year.isClosed && (
                          <Badge className="bg-gray-600/20 text-gray-300">Closed</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(year)}
                          className="text-blue-300 border-blue-300 hover:bg-blue-600/20"
                          disabled={year.isClosed}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {year.isActive && !year.isClosed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setYearToClose(year);
                              setShowCloseDialog(true);
                            }}
                            className="text-orange-300 border-orange-300 hover:bg-orange-600/20"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
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
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingYear ? 'Edit Financial Year' : 'Create New Financial Year'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {editingYear ? 'Update financial year details' : 'Create a new financial year period'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Financial Year Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="FY 2024-25"
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-slate-300">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingYear ? 'Update' : 'Create'} Financial Year
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Close Year Dialog */}
        <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                Close Financial Year
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Are you sure you want to close the financial year "{yearToClose?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
              <p className="text-orange-300 text-sm">
                <strong>Warning:</strong> Closing a financial year will:
              </p>
              <ul className="text-orange-300 text-sm mt-2 space-y-1">
                <li>• Lock all financial data for this period</li>
                <li>• Prevent further modifications to this year's records</li>
                <li>• Generate final reports and statements</li>
                <li>• Archive the year's data</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCloseYear} className="bg-gradient-to-r from-orange-600 to-red-600">
                <Archive className="mr-2 h-4 w-4" />
                Close Financial Year
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FinancialYear;
