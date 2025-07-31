import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowDownToLine, File } from 'lucide-react';
import { toast } from 'sonner';
import { generateDeliverySheetPDF } from '@/utils/pdf-generator';
import { exportDeliverySheetToExcel } from '@/utils/excel-generator';
import { DeliverySheetData, DeliverySheetItem, DeliverySheetTotals } from '@/types/delivery';

export default function DeliveryChallan() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedArea, setSelectedArea] = useState('');
  const [deliveryItems, setDeliveryItems] = useState<
    { customerName: string; GGH?: number; GGH450?: number; GTSF?: number; GSD1KG?: number; GPC?: number; FL?: number; totalQty: number; amount: number }[]
  >([]);
  const [customerName, setCustomerName] = useState('');
  const [GGH, setGGH] = useState<number | undefined>(undefined);
  const [GGH450, setGGH450] = useState<number | undefined>(undefined);
  const [GTSF, setGTSF] = useState<number | undefined>(undefined);
  const [GSD1KG, setGSD1KG] = useState<number | undefined>(undefined);
  const [GPC, setGPC] = useState<number | undefined>(undefined);
  const [FL, setFL] = useState<number | undefined>(undefined);
  const [totalQty, setTotalQty] = useState(0);
  const [amount, setAmount] = useState(0);
  const [areas, setAreas] = useState(['Area 1', 'Area 2', 'Area 3']);
  const [totals, setTotals] = useState({
    GGH: 0,
    GGH450: 0,
    GTSF: 0,
    GSD1KG: 0,
    GPC: 0,
    FL: 0,
    totalQty: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    calculateTotals();
  }, [deliveryItems]);

  const calculateTotals = () => {
    let newGGH = 0;
    let newGGH450 = 0;
    let newGTSF = 0;
    let newGSD1KG = 0;
    let newGPC = 0;
    let newFL = 0;
    let newTotalQty = 0;
    let newTotalAmount = 0;

    deliveryItems.forEach(item => {
      newGGH += item.GGH || 0;
      newGGH450 += item.GGH450 || 0;
      newGTSF += item.GTSF || 0;
      newGSD1KG += item.GSD1KG || 0;
      newGPC += item.GPC || 0;
      newFL += item.FL || 0;
      newTotalQty += item.totalQty || 0;
      newTotalAmount += item.amount || 0;
    });

    setTotals({
      GGH: newGGH,
      GGH450: newGGH450,
      GTSF: newGTSF,
      GSD1KG: newGSD1KG,
      GPC: newGPC,
      FL: newFL,
      totalQty: newTotalQty,
      totalAmount: newTotalAmount,
    });
  };

  const addDeliveryItem = () => {
    if (!customerName || !totalQty || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem = {
      customerName,
      GGH,
      GGH450,
      GTSF,
      GSD1KG,
      GPC,
      FL,
      totalQty,
      amount,
    };

    setDeliveryItems([...deliveryItems, newItem]);
    setCustomerName('');
    setGGH(undefined);
    setGGH450(undefined);
    setGTSF(undefined);
    setGSD1KG(undefined);
    setGPC(undefined);
    setFL(undefined);
    setTotalQty(0);
    setAmount(0);
  };

  const removeDeliveryItem = (index: number) => {
    const newItems = [...deliveryItems];
    newItems.splice(index, 1);
    setDeliveryItems(newItems);
  };

  const generatePDF = () => {
    const sheetData: DeliverySheetData = {
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      area: selectedArea,
      items: deliveryItems.map(item => ({
        customerName: item.customerName,
        area: selectedArea,
        GGH: item.GGH || 0,
        GGH450: item.GGH450 || 0,
        GTSF: item.GTSF || 0,
        GSD1KG: item.GSD1KG || 0,
        GPC: item.GPC || 0,
        FL: item.FL || 0,
        totalQty: item.totalQty,
        amount: item.amount
      })),
      totals: {
        GGH: totals.GGH,
        GGH450: totals.GGH450,
        GTSF: totals.GTSF,
        GSD1KG: totals.GSD1KG,
        GPC: totals.GPC,
        FL: totals.FL,
        QTY: totals.totalQty,
        AMOUNT: totals.totalAmount
      }
    };
    
    generateDeliverySheetPDF(sheetData);
  };

  const exportToExcel = () => {
    const sheetData: DeliverySheetData = {
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      area: selectedArea,
      items: deliveryItems.map(item => ({
        customerName: item.customerName,
        area: selectedArea,
        GGH: item.GGH || 0,
        GGH450: item.GGH450 || 0,
        GTSF: item.GTSF || 0,
        GSD1KG: item.GSD1KG || 0,
        GPC: item.GPC || 0,
        FL: item.FL || 0,
        totalQty: item.totalQty,
        amount: item.amount
      })),
      totals: {
        GGH: totals.GGH,
        GGH450: totals.GGH450,
        GTSF: totals.GTSF,
        GSD1KG: totals.GSD1KG,
        GPC: totals.GPC,
        FL: totals.FL,
        QTY: totals.totalQty,
        AMOUNT: totals.totalAmount
      }
    };
    
    exportDeliverySheetToExcel(sheetData);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Delivery Challan</CardTitle>
          <CardDescription>Create and manage delivery challans</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2020-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Input type="number" placeholder="GGH (L)" value={GGH !== undefined ? GGH.toString() : ''} onChange={(e) => setGGH(e.target.value ? parseFloat(e.target.value) : undefined)} />
            <Input type="number" placeholder="GGH450 (L)" value={GGH450 !== undefined ? GGH450.toString() : ''} onChange={(e) => setGGH450(e.target.value ? parseFloat(e.target.value) : undefined)} />
            <Input type="number" placeholder="GTSF (L)" value={GTSF !== undefined ? GTSF.toString() : ''} onChange={(e) => setGTSF(e.target.value ? parseFloat(e.target.value) : undefined)} />
            <Input type="number" placeholder="GSD 1KG (KG)" value={GSD1KG !== undefined ? GSD1KG.toString() : ''} onChange={(e) => setGSD1KG(e.target.value ? parseFloat(e.target.value) : undefined)} />
            <Input type="number" placeholder="GPC (L)" value={GPC !== undefined ? GPC.toString() : ''} onChange={(e) => setGPC(e.target.value ? parseFloat(e.target.value) : undefined)} />
            <Input type="number" placeholder="FL (L)" value={FL !== undefined ? FL.toString() : ''} onChange={(e) => setFL(e.target.value ? parseFloat(e.target.value) : undefined)} />
            <Input type="number" placeholder="Total Quantity" value={totalQty.toString()} onChange={(e) => setTotalQty(e.target.value ? parseInt(e.target.value) : 0)} />
            <Input type="number" placeholder="Amount" value={amount.toString()} onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : 0)} />
          </div>

          <Button onClick={addDeliveryItem}>Add Delivery Item</Button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>GGH (L)</TableHead>
                <TableHead>GGH450 (L)</TableHead>
                <TableHead>GTSF (L)</TableHead>
                <TableHead>GSD 1KG (KG)</TableHead>
                <TableHead>GPC (L)</TableHead>
                <TableHead>FL (L)</TableHead>
                <TableHead>Total Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.GGH}</TableCell>
                  <TableCell>{item.GGH450}</TableCell>
                  <TableCell>{item.GTSF}</TableCell>
                  <TableCell>{item.GSD1KG}</TableCell>
                  <TableCell>{item.GPC}</TableCell>
                  <TableCell>{item.FL}</TableCell>
                  <TableCell>{item.totalQty}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => removeDeliveryItem(index)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={1}>Totals</TableCell>
                <TableCell>{totals.GGH}</TableCell>
                <TableCell>{totals.GGH450}</TableCell>
                <TableCell>{totals.GTSF}</TableCell>
                <TableCell>{totals.GSD1KG}</TableCell>
                <TableCell>{totals.GPC}</TableCell>
                <TableCell>{totals.FL}</TableCell>
                <TableCell>{totals.totalQty}</TableCell>
                <TableCell>{totals.totalAmount}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="flex justify-end gap-4">
            <Button onClick={generatePDF}><File className="w-4 h-4 mr-2" /> Generate PDF</Button>
            <Button onClick={exportToExcel}><ArrowDownToLine className="w-4 h-4 mr-2" /> Export to Excel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
