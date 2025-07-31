
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Enhanced export utilities with proper functionality
export class ExportUtils {
  static async exportToPDF(data: any[], headers: string[], title: string, filename?: string) {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.text(title, 14, 20);
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
      
      // Table
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 40,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
      
      // Save
      const finalFilename = filename || `${title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
      doc.save(finalFilename);
      
      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      return false;
    }
  }

  static async exportToExcel(data: any[], headers: string[], title: string, filename?: string) {
    try {
      const wb = XLSX.utils.book_new();
      const worksheetData = [headers, ...data];
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      ws['!cols'] = headers.map(() => ({ wch: 15 }));
      
      XLSX.utils.book_append_sheet(wb, ws, title);
      
      const finalFilename = filename || `${title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
      XLSX.writeFile(wb, finalFilename);
      
      return true;
    } catch (error) {
      console.error('Excel export error:', error);
      return false;
    }
  }

  static async printData(data: any[], headers: string[], title: string) {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return false;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
            </div>
            <div class="info">
              <p><strong>Generated on:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  ${headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${data.map(row => `
                  <tr>
                    ${row.map((cell: any) => `<td>${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      
      return true;
    } catch (error) {
      console.error('Print error:', error);
      return false;
    }
  }
}

// Export individual functions for backward compatibility
export const exportToExcel = (data: any[], fileName: string) => {
  const headers = Object.keys(data[0] || {});
  const rows = data.map(item => headers.map(header => item[header]));
  return ExportUtils.exportToExcel(rows, headers, 'Data Export', fileName);
};

export const exportToPdf = (headers: string[], rows: any[], options: {
  title: string;
  subtitle?: string;
  dateInfo?: string;
  filename?: string;
}) => {
  return ExportUtils.exportToPDF(rows, headers, options.title, options.filename);
};
