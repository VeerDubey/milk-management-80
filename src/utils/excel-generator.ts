
import * as XLSX from 'xlsx';
import { DeliverySheetData } from '@/types/delivery';
import { format } from 'date-fns';

export const exportDeliverySheetToExcel = (data: DeliverySheetData) => {
  try {
    // Create worksheet data
    const worksheetData = [
      ['VIKAS MILK CENTRE'],
      ['SINCE 1975'],
      [],
      ['DELIVERY SHEET'],
      [],
      [`Date: ${format(new Date(data.date), 'dd/MM/yyyy')}`],
      [`Area: ${data.area}`],
      [],
      ['S.No', 'Customer Name', 'GGH', 'GGH450', 'GTSF', 'GSD1KG', 'GPC', 'F&L', 'QTY', 'AMOUNT']
    ];
    
    // Add item rows
    data.items.forEach((item, index) => {
      worksheetData.push([
        (index + 1).toString(),
        item.customerName,
        item.GGH.toString(),
        item.GGH450.toString(),
        item.GTSF.toString(),
        item.GSD1KG.toString(),
        item.GPC.toString(),
        item.FL.toString(),
        item.totalQty.toString(),
        item.amount.toString()
      ]);
    });
    
    // Add totals row
    worksheetData.push([
      '',
      'TOTAL',
      data.totals.GGH.toString(),
      data.totals.GGH450.toString(),
      data.totals.GTSF.toString(),
      data.totals.GSD1KG.toString(),
      data.totals.GPC.toString(),
      data.totals.FL.toString(),
      data.totals.QTY.toString(),
      data.totals.AMOUNT.toString()
    ]);
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    const colWidths = [
      { wch: 8 },  // S.No
      { wch: 25 }, // Customer Name
      { wch: 10 }, // GGH
      { wch: 10 }, // GGH450
      { wch: 10 }, // GTSF
      { wch: 12 }, // GSD1KG
      { wch: 10 }, // GPC
      { wch: 10 }, // F&L
      { wch: 10 }, // QTY
      { wch: 15 }  // AMOUNT
    ];
    worksheet['!cols'] = colWidths;
    
    // Style the header
    const headerCells = ['A1', 'A4'];
    headerCells.forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: 'center' }
        };
      }
    });
    
    // Style the table headers
    const tableHeaderRow = 9;
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    columns.forEach(col => {
      const cell = `${col}${tableHeaderRow}`;
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'D9E1F2' } },
          alignment: { horizontal: 'center' }
        };
      }
    });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Sheet');
    
    // Generate filename and save
    const filename = `delivery-sheet-${data.area}-${format(new Date(data.date), 'dd-MM-yyyy')}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
    console.log(`Excel file generated: ${filename}`);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw new Error('Failed to generate Excel file');
  }
};
