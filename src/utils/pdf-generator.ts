
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DeliverySheetData } from '@/types/delivery';
import { format } from 'date-fns';

export const generateDeliverySheetPDF = (data: DeliverySheetData) => {
  try {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for better table fit
    
    // Add company header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('VIKAS MILK CENTRE', doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SINCE 1975', doc.internal.pageSize.width / 2, 22, { align: 'center' });
    
    // Add delivery sheet info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DELIVERY SHEET', doc.internal.pageSize.width / 2, 32, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(new Date(data.date), 'dd/MM/yyyy')}`, 20, 42);
    doc.text(`Area: ${data.area}`, 20, 48);
    
    // Prepare table data
    const headers = ['S.No', 'Customer Name', 'GGH', 'GGH450', 'GTSF', 'GSD1KG', 'GPC', 'F&L', 'QTY', 'AMOUNT'];
    const rows = data.items.map((item, index) => [
      (index + 1).toString(),
      item.customerName,
      item.GGH.toString(),
      item.GGH450.toString(),
      item.GTSF.toString(),
      item.GSD1KG.toString(),
      item.GPC.toString(),
      item.FL.toString(),
      item.totalQty.toString(),
      `₹${item.amount.toFixed(2)}`
    ]);
    
    // Add totals row
    rows.push([
      '',
      'TOTAL',
      data.totals.GGH.toString(),
      data.totals.GGH450.toString(),
      data.totals.GTSF.toString(),
      data.totals.GSD1KG.toString(),
      data.totals.GPC.toString(),
      data.totals.FL.toString(),
      data.totals.QTY.toString(),
      `₹${data.totals.AMOUNT.toFixed(2)}`
    ]);
    
    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 55,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 }, // S.No
        1: { halign: 'left', cellWidth: 50 },   // Customer Name
        2: { halign: 'center', cellWidth: 20 }, // GGH
        3: { halign: 'center', cellWidth: 20 }, // GGH450
        4: { halign: 'center', cellWidth: 20 }, // GTSF
        5: { halign: 'center', cellWidth: 22 }, // GSD1KG
        6: { halign: 'center', cellWidth: 20 }, // GPC
        7: { halign: 'center', cellWidth: 20 }, // F&L
        8: { halign: 'center', cellWidth: 20 }, // QTY
        9: { halign: 'right', cellWidth: 30 }   // AMOUNT
      },
      didParseCell: function(data) {
        // Style the totals row
        if (data.row.index === rows.length - 1) {
          data.cell.styles.fillColor = [240, 240, 240];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    
    // Add signature section
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Driver signature
    doc.rect(20, finalY, 80, 20);
    doc.text('Driver\'s Signature', 60, finalY + 25, { align: 'center' });
    
    // Supervisor signature
    doc.rect(doc.internal.pageSize.width - 100, finalY, 80, 20);
    doc.text('Supervisor\'s Signature', doc.internal.pageSize.width - 60, finalY + 25, { align: 'center' });
    
    // Save the PDF
    const filename = `delivery-sheet-${data.area}-${format(new Date(data.date), 'dd-MM-yyyy')}.pdf`;
    doc.save(filename);
    
    console.log(`PDF generated: ${filename}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
