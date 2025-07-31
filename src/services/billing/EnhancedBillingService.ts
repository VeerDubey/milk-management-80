import { InvoiceItem } from "@/types";

/**
 * Enhanced Billing Service
 */
export class EnhancedBillingService {
  static calculateSubtotal(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  static calculateTax(subtotal: number, taxRate: number): number {
    return subtotal * (taxRate / 100);
  }

  static calculateTotal(subtotal: number, taxAmount: number): number {
    return subtotal + taxAmount;
  }

  static applyDiscount(total: number, discountRate: number): number {
    return total - (total * (discountRate / 100));
  }

  static formatCurrency(amount: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }

  static generateInvoiceNumber(): string {
    const now = Date.now();
    return `INV-${now.toString().slice(-6)}`;
  }

  static validateInvoiceData(invoiceData: any): boolean {
    // Implement detailed validation logic here
    if (!invoiceData.customerId) return false;
    if (!invoiceData.items || invoiceData.items.length === 0) return false;
    return true;
  }

  static enhanceInvoiceData(invoiceData: any): any {
    // Enrich invoice data with additional information
    return {
      ...invoiceData,
      invoiceNumber: EnhancedBillingService.generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static generateInvoiceFromOrder(order: any, companyInfo: any, template: string = 'standard') {
    // Basic calculations
    const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = 0.10; // 10% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const invoice = {
      id: order.id,
      number: `INV-${Date.now().toString().slice(-6)}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      customerId: order.customerId,
      customerName: order.customerName,
      date: order.date,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      items: order.items.map((item: any) => ({
        id: item.id || `item-${Date.now()}`,
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode || '',
        description: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        rate: item.rate || item.unitPrice,
        price: item.price || item.unitPrice,
        total: item.total || (item.quantity * item.unitPrice),
        amount: item.amount || (item.quantity * item.unitPrice),
        unit: item.unit || 'pcs',
        hsnCode: item.hsnCode || '',
        gstRate: item.gstRate || 0
      })),
      subtotal: order.totalAmount,
      tax: 0,
      taxRate: 0,
      taxAmount: 0,
      total: order.totalAmount,
      status: 'draft' as const,
      notes: order.notes || '',
      termsAndConditions: 'Payment due within 15 days.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return invoice;
  }
}
