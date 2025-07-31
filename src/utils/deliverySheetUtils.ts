
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DeliverySheetItem {
  customerName: string;
  GGH: number;
  GGH450: number;
  GTSF: number;
  GSD1KG: number;
  GPC: number;
  FL: number;
  totalQty: number;
  amount: number;
}

interface DeliverySheetData {
  date: string;
  area: string;
  items: DeliverySheetItem[];
  totals: {
    GGH: number;
    GGH450: number;
    GTSF: number;
    GSD1KG: number;
    GPC: number;
    FL: number;
    QTY: number;
    AMOUNT: number;
  };
}

export const downloadDeliverySheetPDF = (data: DeliverySheetData) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Vikas Milk Centre', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Delivery Sheet', 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Date: ${data.date}`, 20, 35);
    doc.text(`Area: ${data.area}`, 20, 42);

    // Table data
    const tableData = data.items.map(item => [
      item.customerName,
      item.GGH || 0,
      item.GGH450 || 0,
      item.GTSF || 0,
      item.GSD1KG || 0,
      item.GPC || 0,
      item.FL || 0,
      item.totalQty || 0,
      `₹${(item.amount || 0).toFixed(2)}`
    ]);

    // Add totals row
    tableData.push([
      'TOTAL',
      data.totals.GGH || 0,
      data.totals.GGH450 || 0,
      data.totals.GTSF || 0,
      data.totals.GSD1KG || 0,
      data.totals.GPC || 0,
      data.totals.FL || 0,
      data.totals.QTY || 0,
      `₹${(data.totals.AMOUNT || 0).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Customer', 'GGH', 'GGH450', 'GTSF', 'GSD1KG', 'GPC', 'F&L', 'QTY', 'AMOUNT']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      footStyles: { fillColor: [245, 245, 245], fontStyle: 'bold' }
    });

    doc.save(`delivery-sheet-${data.date}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const exportToExcel = (data: DeliverySheetData) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      data.items.map(item => ({
        Customer: item.customerName,
        GGH: item.GGH || 0,
        GGH450: item.GGH450 || 0,
        GTSF: item.GTSF || 0,
        GSD1KG: item.GSD1KG || 0,
        GPC: item.GPC || 0,
        'F&L': item.FL || 0,
        QTY: item.totalQty || 0,
        AMOUNT: (item.amount || 0).toFixed(2)
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Sheet');
    XLSX.writeFile(workbook, `delivery-sheet-${data.date}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

export const printDeliverySheet = (data: DeliverySheetData) => {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Sheet - ${data.date}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .total-row { background-color: #e8f4f8; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Vikas Milk Centre</h1>
            <h2>Delivery Sheet</h2>
          </div>
          <div class="info">
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Area:</strong> ${data.area}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>GGH</th>
                <th>GGH450</th>
                <th>GTSF</th>
                <th>GSD1KG</th>
                <th>GPC</th>
                <th>F&L</th>
                <th>QTY</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.customerName}</td>
                  <td>${item.GGH || 0}</td>
                  <td>${item.GGH450 || 0}</td>
                  <td>${item.GTSF || 0}</td>
                  <td>${item.GSD1KG || 0}</td>
                  <td>${item.GPC || 0}</td>
                  <td>${item.FL || 0}</td>
                  <td>${item.totalQty || 0}</td>
                  <td>₹${(item.amount || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL</td>
                <td>${data.totals.GGH || 0}</td>
                <td>${data.totals.GGH450 || 0}</td>
                <td>${data.totals.GTSF || 0}</td>
                <td>${data.totals.GSD1KG || 0}</td>
                <td>${data.totals.GPC || 0}</td>
                <td>${data.totals.FL || 0}</td>
                <td>${data.totals.QTY || 0}</td>
                <td>₹${(data.totals.AMOUNT || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } catch (error) {
    console.error('Error printing delivery sheet:', error);
    throw error;
  }
};
