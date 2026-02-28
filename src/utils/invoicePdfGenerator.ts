
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface InvoiceData {
  id: string;
  number?: string;
  date: string;
  dueDate?: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  items: Array<{
    description?: string;
    productName?: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  status?: string;
  notes?: string;
}

export function generateInvoicePDF(invoice: InvoiceData, companyName = 'Vikas Milk Centre') {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company name
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(companyName, 14, 20);

  // Invoice label
  doc.setFontSize(12);
  doc.text('INVOICE', pageWidth - 14, 15, { align: 'right' });
  doc.setFontSize(10);
  doc.text(`#${invoice.number || invoice.id}`, pageWidth - 14, 22, { align: 'right' });
  doc.text(`Date: ${format(new Date(invoice.date), 'dd/MM/yyyy')}`, pageWidth - 14, 29, { align: 'right' });
  if (invoice.dueDate) {
    doc.text(`Due: ${format(new Date(invoice.dueDate), 'dd/MM/yyyy')}`, pageWidth - 14, 36, { align: 'right' });
  }

  // Bill To
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Bill To:', 14, 55);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(invoice.customerName, 14, 62);
  if (invoice.customerAddress) doc.text(invoice.customerAddress, 14, 68);
  if (invoice.customerPhone) doc.text(`Phone: ${invoice.customerPhone}`, 14, 74);

  // Status badge
  if (invoice.status) {
    const statusColors: Record<string, [number, number, number]> = {
      paid: [39, 174, 96],
      unpaid: [243, 156, 18],
      overdue: [231, 76, 60],
      draft: [149, 165, 166],
    };
    const color = statusColors[invoice.status.toLowerCase()] || [149, 165, 166];
    doc.setFillColor(...color);
    const statusText = invoice.status.toUpperCase();
    const statusWidth = doc.getTextWidth(statusText) + 10;
    doc.roundedRect(pageWidth - 14 - statusWidth, 50, statusWidth, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(statusText, pageWidth - 14 - statusWidth / 2, 57, { align: 'center' });
  }

  // Items table
  const tableData = invoice.items.map((item, i) => [
    (i + 1).toString(),
    item.description || item.productName || '',
    item.quantity.toString(),
    `₹${item.rate.toFixed(2)}`,
    `₹${item.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    startY: 82,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 15 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 30 },
      4: { halign: 'right', cellWidth: 30 },
    },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = pageWidth - 80;

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text('Subtotal:', summaryX, finalY);
  doc.text(`₹${invoice.subtotal.toFixed(2)}`, pageWidth - 14, finalY, { align: 'right' });

  if (invoice.tax) {
    doc.text('Tax:', summaryX, finalY + 7);
    doc.text(`₹${invoice.tax.toFixed(2)}`, pageWidth - 14, finalY + 7, { align: 'right' });
  }

  if (invoice.discount) {
    doc.text('Discount:', summaryX, finalY + 14);
    doc.text(`-₹${invoice.discount.toFixed(2)}`, pageWidth - 14, finalY + 14, { align: 'right' });
  }

  const totalY = finalY + (invoice.tax ? 7 : 0) + (invoice.discount ? 7 : 0) + 7;
  doc.setDrawColor(41, 128, 185);
  doc.line(summaryX, totalY - 3, pageWidth - 14, totalY - 3);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', summaryX, totalY + 4);
  doc.text(`₹${invoice.total.toFixed(2)}`, pageWidth - 14, totalY + 4, { align: 'right' });

  // Notes
  if (invoice.notes) {
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', 14, totalY + 20);
    doc.setTextColor(100, 100, 100);
    doc.text(invoice.notes, 14, totalY + 27);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text(`Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
}

export function downloadInvoicePDF(invoice: InvoiceData, companyName?: string) {
  const doc = generateInvoicePDF(invoice, companyName);
  doc.save(`invoice_${invoice.number || invoice.id}_${format(new Date(), 'yyyyMMdd')}.pdf`);
}

export function printInvoicePDF(invoice: InvoiceData, companyName?: string) {
  const doc = generateInvoicePDF(invoice, companyName);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
