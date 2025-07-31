
import { 
  Customer, 
  Product, 
  Order, 
  OrderItem, 
  Payment, 
  StockTransaction,
  Vehicle,
  Salesman,
  VehicleTrip,
  Expense,
  TrackSheet,
  TrackSheetRow,
  SupplierPayment,
  StockEntry,
  ProductRate,
  CustomerProductRate,
  Supplier,
  Invoice,
  SupplierProductRate,
  StockRecord,
  UISettings,
  Area
} from '@/types';

export interface DataContextType {
  // Customer state
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => Customer;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  
  // Product state
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  
  // Order state
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => Order;
  updateOrder: (id: string, orderData: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  addBatchOrders?: (orders: Omit<Order, "id">[]) => Order[];
  duplicateOrder?: (orderId: string, newDate?: string) => Order | null;
  calculateOrderTotal?: (items: OrderItem[]) => number;
  
  // Payment state
  payments: Payment[];
  addPayment: (payment: Omit<Payment, "id">) => Payment;
  updatePayment: (id: string, paymentData: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  deleteMultiplePayments?: (ids: string[]) => void;
  
  // Product rate state
  customerProductRates: ProductRate[];
  addProductRate: (rate: Omit<ProductRate, "id">) => ProductRate;
  updateProductRate: (id: string, rateData: Partial<ProductRate>) => void;
  deleteProductRate: (id: string) => void;
  getProductRateForCustomer: (customerId: string, productId: string) => number | null;
  
  // Customer product rates
  addCustomerProductRate: (rate: Omit<CustomerProductRate, "id">) => CustomerProductRate;
  updateCustomerProductRate: (id: string, rateData: Partial<CustomerProductRate>) => void;
  
  // Stock state
  stockTransactions: StockTransaction[];
  addStockTransaction: (transaction: Omit<StockTransaction, "id">) => StockTransaction;
  updateStockTransaction: (id: string, transactionData: Partial<StockTransaction>) => void;
  deleteStockTransaction: (id: string) => void;
  getProductStock?: (productId: string) => number;
  
  // Stock entries
  stockEntries: StockEntry[];
  addStockEntry: (entry: Omit<StockEntry, "id">) => StockEntry;
  updateStockEntry: (id: string, entryData: Partial<StockEntry>) => void;
  deleteStockEntry: (id: string) => void;
  
  // Supplier state
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, "id">) => Supplier;
  updateSupplier: (id: string, supplierData: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Supplier product rates
  supplierProductRates: SupplierProductRate[];
  addSupplierProductRate: (rate: Omit<SupplierProductRate, "id">) => SupplierProductRate;
  updateSupplierProductRate: (id: string, rateData: Partial<SupplierProductRate>) => void;
  deleteSupplierProductRate: (id: string) => void;
  
  // Supplier payment state
  supplierPayments: SupplierPayment[];
  addSupplierPayment: (payment: Omit<SupplierPayment, "id">) => SupplierPayment;
  updateSupplierPayment: (id: string, paymentData: Partial<SupplierPayment>) => void;
  deleteSupplierPayment: (id: string) => void;
  
  // UI settings state
  uiSettings: UISettings;
  updateUISettings: (settings: Partial<UISettings>) => void;
  
  // Vehicle and Salesman state
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id">) => Vehicle;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  salesmen: Salesman[];
  addSalesman: (salesman: Omit<Salesman, "id">) => Salesman;
  updateSalesman: (id: string, salesmanData: Partial<Salesman>) => void;
  deleteSalesman: (id: string) => void;
  
  addVehicleTrip: (trip: Omit<VehicleTrip, "id">) => VehicleTrip;
  
  // Expense state
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => Expense;
  updateExpense: (id: string, expenseData: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory?: (category: string) => Expense[];
  getExpensesByDateRange?: (startDate: string, endDate: string) => Expense[];
  getTotalExpenses?: (startDate?: string, endDate?: string) => number;
  getExpenseStatsByCategory?: (startDate?: string, endDate?: string) => { category: string; total: number }[];
  
  // TrackSheet state
  trackSheets: TrackSheet[];
  addTrackSheet: (trackSheet: Omit<TrackSheet, "id">) => TrackSheet | null;
  updateTrackSheet: (id: string, trackSheetData: Partial<TrackSheet>) => void;
  deleteTrackSheet: (id: string) => void;
  trackSheetTemplates?: any[];
  createTemplate?: (name: string, rows: TrackSheetRow[]) => any;
  deleteTemplate?: (id: string) => void;
  createTrackSheetFromOrder?: (orderId: string) => TrackSheet | null;
  
  // Invoice state
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, "id">) => Invoice;
  updateInvoice: (id: string, invoiceData: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  generateInvoiceFromOrder: (orderId: string) => string | null;
  
  // Areas state
  areas?: string[];
  saveDeliverySheetData?: (data: any) => void;
}

export type {
  Customer,
  Product,
  Order,
  OrderItem,
  Payment,
  StockTransaction,
  Vehicle,
  Salesman,
  VehicleTrip,
  Expense,
  TrackSheet,
  TrackSheetRow,
  SupplierPayment,
  StockEntry,
  ProductRate,
  CustomerProductRate,
  Supplier,
  Invoice,
  SupplierProductRate,
  StockRecord,
  UISettings,
  Area
};
