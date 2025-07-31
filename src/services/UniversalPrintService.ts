
import { DownloadService } from './DownloadService';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface PrintableDocument {
  title: string;
  subtitle?: string;
  date: string;
  area?: string;
  vehicle?: string;
  headers: string[];
  rows: (string | number)[][];
  totals?: Record<string, string | number>;
  footer?: string;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    gstin?: string;
  };
}

export class UniversalPrintService {
  private static defaultCompanyInfo = {
    name: 'VIKAS MILK CENTRE',
    address: 'Main Road, Dairy Farm Area\nCity, State - 123456',
    phone: '+91 98765 43210',
    email: 'info@vikasmilk.com',
    gstin: '27AABCV1234F1Z5'
  };

  /**
   * Generate PDF document
   */
  static async generatePDF(document: PrintableDocument): Promise<void> {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Company Header
    const companyInfo = document.companyInfo || this.defaultCompanyInfo;
    
    // Company Logo (if available)
    try {
      const logoImg = '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png';
      doc.addImage(logoImg, 'PNG', 15, yPosition, 20, 20);
    } catch (error) {
      console.log('Logo not available for PDF');
    }

    // Company Name and Details
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, 45, yPosition + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SINCE 1975', 45, yPosition + 15);
    
    // Company Info - Right Side
    doc.setFontSize(9);
    const companyLines = [
      companyInfo.address.split('\n')[0],
      companyInfo.address.split('\n')[1] || '',
      `Phone: ${companyInfo.phone}`,
      companyInfo.email ? `Email: ${companyInfo.email}` : '',
      companyInfo.gstin ? `GSTIN: ${companyInfo.gstin}` : ''
    ].filter(line => line);

    companyLines.forEach((line, index) => {
      doc.text(line, pageWidth - 15, yPosition + 5 + (index * 4), { align: 'right' });
    });

    yPosition += 35;

    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 10;

    // Document Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(document.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Subtitle
    if (document.subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(document.subtitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    }

    // Document Info
    doc.setFontSize(10);
    const infoText = [
      `Date: ${document.date}`,
      document.area ? `Area: ${document.area}` : '',
      document.vehicle ? `Vehicle: ${document.vehicle}` : ''
    ].filter(text => text).join(' | ');
    
    doc.text(infoText, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Table
    (doc as any).autoTable({
      head: [document.headers],
      body: document.rows,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { halign: 'left' },
        [document.headers.length - 1]: { halign: 'right', fontStyle: 'bold' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Totals Section
    if (document.totals) {
      Object.entries(document.totals).forEach(([key, value]) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${key}: ${value}`, pageWidth - 15, yPosition, { align: 'right' });
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Signature Section
    if (yPosition < pageHeight - 40) {
      yPosition = pageHeight - 40;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Signature boxes
    const signatureY = yPosition;
    doc.rect(15, signatureY, 60, 20);
    doc.text('Driver\'s Signature', 45, signatureY + 25, { align: 'center' });
    
    doc.rect(pageWidth - 75, signatureY, 60, 20);
    doc.text('Supervisor\'s Signature', pageWidth - 45, signatureY + 25, { align: 'center' });

    // Footer
    if (document.footer) {
      doc.setFontSize(8);
      doc.text(document.footer, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save PDF
    const filename = `${document.title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
    await DownloadService.downloadPDF(doc, filename);
  }

  /**
   * Generate Excel document
   */
  static async generateExcel(document: PrintableDocument): Promise<void> {
    const wb = XLSX.utils.book_new();
    
    // Prepare worksheet data
    const wsData: any[][] = [];
    
    // Header information
    wsData.push([document.title]);
    wsData.push([]);
    wsData.push([`Date: ${document.date}`]);
    if (document.area) wsData.push([`Area: ${document.area}`]);
    if (document.vehicle) wsData.push([`Vehicle: ${document.vehicle}`]);
    wsData.push([]);
    
    // Table headers and data
    wsData.push(document.headers);
    document.rows.forEach(row => wsData.push(row));
    
    // Totals
    if (document.totals) {
      wsData.push([]);
      Object.entries(document.totals).forEach(([key, value]) => {
        wsData.push([key, value]);
      });
    }

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const colWidths = document.headers.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;
    
    // Style the title
    if (ws['A1']) {
      ws['A1'].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      };
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, document.title);
    
    // Save file
    const filename = `${document.title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  /**
   * Print document (opens browser print dialog)
   */
  static printDocument(document: PrintableDocument): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = this.generatePrintHTML(document);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  /**
   * Generate HTML for printing
   */
  private static generatePrintHTML(document: PrintableDocument): string {
    const companyInfo = document.companyInfo || this.defaultCompanyInfo;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${document.title}</title>
        <style>
          @page { 
            margin: 1in; 
            size: A4; 
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            line-height: 1.4;
            margin: 0;
            padding: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .company-info h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .company-info .tagline {
            font-size: 10px;
            color: #666;
          }
          .contact-info {
            text-align: right;
            font-size: 10px;
            line-height: 1.2;
          }
          .document-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
          }
          .document-info {
            text-align: center;
            margin-bottom: 20px;
            font-size: 11px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          .number-cell {
            text-align: right;
          }
          .totals {
            text-align: right;
            margin: 20px 0;
          }
          .totals div {
            font-weight: bold;
            margin: 5px 0;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }
          .signature-box {
            width: 200px;
            height: 60px;
            border: 1px solid #333;
            text-align: center;
            position: relative;
          }
          .signature-label {
            position: absolute;
            bottom: -20px;
            width: 100%;
            text-align: center;
            font-size: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body { font-size: 11px; }
            .signatures { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>${companyInfo.name}</h1>
            <div class="tagline">SINCE 1975</div>
          </div>
          <div class="contact-info">
            ${companyInfo.address.split('\n').join('<br>')}<br>
            Phone: ${companyInfo.phone}<br>
            ${companyInfo.email ? `Email: ${companyInfo.email}<br>` : ''}
            ${companyInfo.gstin ? `GSTIN: ${companyInfo.gstin}` : ''}
          </div>
        </div>
        
        <div class="document-title">${document.title}</div>
        
        <div class="document-info">
          Date: ${document.date}${document.area ? ` | Area: ${document.area}` : ''}${document.vehicle ? ` | Vehicle: ${document.vehicle}` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              ${document.headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${document.rows.map(row => 
              `<tr>${row.map((cell, index) => 
                `<td class="${index === row.length - 1 ? 'number-cell' : ''}">${cell}</td>`
              ).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
        
        ${document.totals ? `
          <div class="totals">
            ${Object.entries(document.totals).map(([key, value]) => 
              `<div>${key}: ${value}</div>`
            ).join('')}
          </div>
        ` : ''}
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-label">Driver's Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-label">Supervisor's Signature</div>
          </div>
        </div>
        
        ${document.footer ? `<div class="footer">${document.footer}</div>` : ''}
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 100);
          };
        </script>
      </body>
      </html>
    `;
  }
}
