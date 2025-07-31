
import { Invoice, OrderItem } from "@/types";
import { generateInvoiceNumber } from "@/utils/invoiceUtils";

/**
 * Creates an invoice from an order
 */
export const createInvoice = (orderId: string, customerId: string, customerName: string, items: OrderItem[]): Invoice => {
  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // Create invoice object
  return {
    id: `INV-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    customerId,
    customerName,
    number: generateInvoiceNumber(),
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    items: items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productCode: item.productCode || '',
      description: item.productName || "Product",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      rate: item.rate || item.unitPrice,
      price: item.price || item.unitPrice,
      total: item.quantity * item.unitPrice,
      amount: item.quantity * item.unitPrice,
      unit: item.unit,
      id: item.id || `item-${Date.now()}`
    })),
    status: "draft",
    subtotal: total,
    tax: 0,
    taxRate: 0,
    taxAmount: 0,
    total,
    notes: "",
    termsAndConditions: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Additional fields for compatibility 
    orderId
  };
};

/**
 * Creates an invoice from form data
 */
export const createInvoiceFromForm = (formData: {
  customerId: string;
  customerName: string;
  items: OrderItem[];
  date?: string;
  notes?: string;
}): Invoice => {
  // Calculate total
  const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  const date = formData.date || new Date().toISOString();
  const dueDate = new Date(new Date(date).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 days from now
  
  // Create invoice object
  return {
    id: `INV-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    customerId: formData.customerId,
    customerName: formData.customerName,
    number: generateInvoiceNumber(),
    date,
    dueDate,
    items: formData.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productCode: item.productCode || '',
      description: item.productName || "Product",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      rate: item.rate || item.unitPrice,
      price: item.price || item.unitPrice,
      total: item.quantity * item.unitPrice,
      amount: item.quantity * item.unitPrice,
      unit: item.unit,
      id: item.id || `item-${Date.now()}`
    })),
    status: "draft",
    subtotal: total,
    tax: 0,
    taxRate: 0,
    taxAmount: 0,
    total,
    notes: formData.notes || "",
    termsAndConditions: "",
    createdAt: date,
    updatedAt: date
  };
};

/**
 * Creates a new blank invoice
 */
export const createBlankInvoice = (): Invoice => {
  const today = new Date().toISOString();
  const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 days from now
  
  return {
    id: `INV-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    customerId: "",
    customerName: "",
    number: generateInvoiceNumber(),
    date: today,
    dueDate,
    items: [],
    status: "draft",
    subtotal: 0,
    tax: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: "",
    termsAndConditions: "",
    createdAt: today,
    updatedAt: today
  };
};

/**
 * Service class for invoices
 */
class InvoiceService {
  /**
   * Creates a new invoice
   */
  static createInvoice(data: any): Invoice {
    return {
      id: data.id,
      customerId: data.customerId,
      customerName: data.customerName || "",
      number: generateInvoiceNumber(),
      date: data.date,
      dueDate: new Date(new Date(data.date).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      items: data.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode || '',
        description: item.productName || "Product",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        rate: item.rate || item.unitPrice,
        price: item.price || item.unitPrice,
        total: item.quantity * item.unitPrice,
        amount: item.quantity * item.unitPrice,
        unit: item.unit,
        id: item.id || `item-${Date.now()}`
      })),
      status: "draft",
      subtotal: data.total,
      tax: 0,
      taxRate: 0,
      taxAmount: 0,
      total: data.total,
      invoiceNumber: generateInvoiceNumber(),
      notes: "",
      termsAndConditions: "",
      createdAt: data.date,
      updatedAt: data.date,
      // Additional fields for compatibility
      orderId: data.orderId
    };
  }
}

export default InvoiceService;
