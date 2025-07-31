export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  area: string;
  address?: string;
  outstandingBalance?: number;
  totalPaid?: number;
  balanceDue?: number;
  balance?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  category?: string;
  unit?: string;
  description?: string;
  gstRate?: number;
  stock?: number;
  minStock?: number;
  costPrice?: number;
  isActive?: boolean;
  sku?: string;
  minStockLevel?: number;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  productCode?: string;
  quantity: number;
  rate: number;
  price?: number;
  unitPrice?: number;
  total?: number;
  unit?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  area?: string;
  vehicleId?: string;
  salesmanId?: string;
  date: string;
  amount: number;
  total?: number;
  totalAmount?: number;
  totalQty?: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'completed' | 'partial';
  items: OrderItem[];
  notes?: string;
  discount?: number;
  orderId?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName?: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'cheque' | 'online' | 'bank';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'cheque' | 'online' | 'bank';
  referenceNumber?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'failed';
  orderId?: string;
}

export interface TrackSheet {
  id: string;
  date: string;
  vehicleId?: string;
  salesmanId?: string;
  route?: string;
  routeName?: string;
  rows: TrackSheetRow[];
  status?: 'pending' | 'in_progress' | 'completed';
  name?: string;
  title?: string;
  notes?: string;
  summary?: TrackSheetSummary;
  vehicleName?: string;
  salesmanName?: string;
  area?: string;
  orders?: string[];
  totalAmount?: number;
}

export interface TrackSheetRow {
  id?: string;
  customerId: string;
  name: string;
  customerName?: string;
  quantities: Record<string, number | string>;
  total: number;
  amount: number;
  products?: string[];
  delivered?: boolean;
  notes?: string;
}

export interface TrackSheetSummary {
  totalItems: number;
  totalAmount: number;
  productTotals: Record<string, number>;
}

export interface Invoice {
  id: string;
  number: string;
  invoiceNumber?: string;
  customerId: string;
  customerName?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
  discount?: number;
  discountAmount?: number;
  shipping?: number;
  orderId?: string;
}

export interface InvoiceItem {
  id?: string;
  productId: string;
  productName?: string;
  description: string;
  quantity: number;
  rate: number;
  unitPrice?: number;
  amount: number;
  total?: number;
}

export interface ProductRate {
  id: string;
  customerId: string;
  productId: string;
  rate: number;
  effectiveDate: string;
  isActive: boolean;
}

export interface CustomerProductRate {
  id: string;
  customerId: string;
  productId: string;
  rate: number;
  effectiveDate: string;
  isActive: boolean;
}

export interface SupplierProductRate {
  id: string;
  supplierId: string;
  productId: string;
  rate: number;
  effectiveDate: string;
  isActive: boolean;
  validUntil?: string;
  minimumQuantity?: string;
  unit?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  isActive?: boolean;
  notes?: string;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'bank_transfer' | 'cheque';
  paymentMethod?: string;
  referenceNumber?: string;
  reference?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface Vehicle {
  id: string;
  name: string;
  number: string;
  registrationNumber?: string;
  type: string;
  capacity: number;
  driverId?: string;
  driverName?: string;
}

export interface Salesman {
  id: string;
  name: string;
  phone: string;
  email?: string;
  area?: string;
}

export interface VehicleTrip {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  route: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description?: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'cheque' | 'online';
  receipt?: string;
  notes?: string;
  title?: string;
  reference?: string;
  recurring?: boolean;
  recurringFrequency?: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName?: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reference?: string;
  notes?: string;
}

export interface StockEntry {
  id: string;
  date: string;
  supplierId?: string;
  items: StockEntryItem[];
  totalAmount: number;
  notes?: string;
  referenceNumber?: string;
  paymentStatus?: 'paid' | 'partial' | 'unpaid';
  createdAt?: string;
  productId?: string;
  type?: 'in' | 'out';
  quantity?: number;
}

export interface StockEntryItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
  unitPrice?: number;
  totalPrice?: number;
  total?: number;
}

export interface StockRecord {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  type: 'in' | 'out' | 'adjustment';
  reference?: string;
  notes?: string;
  openingStock?: number;
  closingStock?: number;
  minStockLevel?: number;
}

export interface UISettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  currency: string;
  dateFormat: string;
  sidebarCollapsed: boolean;
  defaultPaymentMethod: string;
  defaultReportPeriod: string;
  stockSettings?: {
    autoUpdateStock: boolean;
    lowStockAlerts: boolean;
    stockValueMethod: string;
    showStockInList: boolean;
    stockUnit: string;
    stockAlertThreshold: number;
    stockValuation: string;
    stockAging: string;
    stockReports: string;
    stockAudit: string;
    lowStockThreshold?: number;
    mediumStockThreshold?: number;
    autoReorderEnabled?: boolean;
    reorderQuantity?: number;
    alertsEnabled?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    trackExpiry?: boolean;
    expiryAlertDays?: number;
    batchTracking?: boolean;
  };
}

export interface Area {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber?: string;
  logo?: string;
}

// Purchase-related interfaces
export interface PurchaseItem {
  tempId?: string;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
  unitPrice?: number;
  totalPrice?: number;
}
