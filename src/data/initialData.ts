
import { Customer, Product, Order, Payment, TrackSheet, Invoice, Vehicle, Salesman, Expense, StockEntry, Supplier, SupplierPayment, Area } from '@/types';

export const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john@example.com",
    area: "Downtown",
    address: "123 Main Street, Downtown",
    outstandingBalance: 500,
    totalPaid: 2000,
    balanceDue: 500,
    balance: 500,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    lastPaymentDate: "2024-01-10",
    lastPaymentAmount: 300
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane@example.com",
    area: "Uptown",
    address: "456 Oak Avenue, Uptown",
    outstandingBalance: 0,
    totalPaid: 1500,
    balanceDue: 0,
    balance: 0,
    isActive: true,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    lastPaymentDate: "2024-01-12",
    lastPaymentAmount: 200
  },
  {
    id: "3",
    name: "Bob Johnson",
    phone: "+91 9876543212",
    area: "Midtown",
    address: "789 Pine Road, Midtown",
    outstandingBalance: 250,
    totalPaid: 800,
    balanceDue: 250,
    balance: 250,
    isActive: true,
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z"
  }
];

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Whole Milk",
    code: "WM001",
    price: 60,
    category: "Dairy",
    unit: "liter",
    description: "Fresh whole milk",
    gstRate: 5,
    stock: 100,
    minStock: 20,
    costPrice: 45,
    isActive: true,
    sku: "WM001",
    minStockLevel: 20
  },
  {
    id: "2",
    name: "Skimmed Milk",
    code: "SM001",
    price: 55,
    category: "Dairy",
    unit: "liter",
    description: "Low-fat skimmed milk",
    gstRate: 5,
    stock: 80,
    minStock: 15,
    costPrice: 40,
    isActive: true,
    sku: "SM001",
    minStockLevel: 15
  },
  {
    id: "3",
    name: "Butter",
    code: "BT001",
    price: 120,
    category: "Dairy",
    unit: "pack",
    description: "Fresh butter 500g pack",
    gstRate: 12,
    stock: 50,
    minStock: 10,
    costPrice: 90,
    isActive: true,
    sku: "BT001",
    minStockLevel: 10
  },
  {
    id: "4",
    name: "Cheese",
    code: "CH001",
    price: 200,
    category: "Dairy",
    unit: "pack",
    description: "Processed cheese 200g pack",
    gstRate: 12,
    stock: 30,
    minStock: 5,
    costPrice: 150,
    isActive: true,
    sku: "CH001",
    minStockLevel: 5
  }
];

export const initialOrders: Order[] = [
  {
    id: "order1",
    customerId: "1",
    customerName: "John Doe",
    date: "2024-01-15",
    items: [
      {
        productId: "1",
        productName: "Whole Milk",
        quantity: 5,
        rate: 60,
        unitPrice: 60,
        total: 300
      }
    ],
    amount: 300,
    totalAmount: 300,
    status: "completed",
    paymentStatus: "completed"
  },
  {
    id: "order2",
    customerId: "2",
    customerName: "Jane Smith",
    date: "2024-01-14",
    items: [
      {
        productId: "2",
        productName: "Skimmed Milk",
        quantity: 3,
        rate: 55,
        unitPrice: 55,
        total: 165
      },
      {
        productId: "3",
        productName: "Butter",
        quantity: 1,
        rate: 120,
        unitPrice: 120,
        total: 120
      }
    ],
    amount: 285,
    totalAmount: 285,
    status: "completed",
    paymentStatus: "completed"
  }
];

export const initialPayments: Payment[] = [
  {
    id: "pay1",
    customerId: "1",
    customerName: "John Doe",
    amount: 300,
    date: "2024-01-15",
    method: "cash",
    paymentMethod: "cash",
    referenceNumber: "REF001",
    notes: "Payment for order #order1",
    status: "completed"
  },
  {
    id: "pay2",
    customerId: "2",
    customerName: "Jane Smith",
    amount: 285,
    date: "2024-01-14",
    method: "upi",
    paymentMethod: "upi",
    referenceNumber: "UPI123456",
    notes: "Payment for order #order2",
    status: "completed"
  }
];

export const initialTrackSheets: TrackSheet[] = [
  {
    id: "ts1",
    date: "2024-01-15",
    vehicleId: "v1",
    salesmanId: "s1",
    route: "Route A",
    routeName: "Downtown Route",
    rows: [
      {
        id: "row1",
        customerId: "1",
        name: "John Doe",
        customerName: "John Doe",
        quantities: { "1": 5, "2": 2 },
        total: 410,
        amount: 410,
        products: ["1", "2"],
        delivered: true,
        notes: "Delivered on time"
      }
    ],
    status: "completed",
    name: "Morning Delivery",
    title: "Morning Delivery Route",
    notes: "All deliveries completed successfully",
    summary: {
      totalItems: 7,
      totalAmount: 410,
      productTotals: { "1": 5, "2": 2 }
    },
    vehicleName: "Truck 1",
    salesmanName: "Mike Wilson",
    area: "Downtown",
    orders: ["order1"],
    totalAmount: 410
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv1",
    number: "INV-001",
    invoiceNumber: "INV-001",
    customerId: "1",
    customerName: "John Doe",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    items: [
      {
        id: "item1",
        productId: "1",
        productName: "Whole Milk",
        description: "Fresh whole milk",
        quantity: 5,
        rate: 60,
        unitPrice: 60,
        amount: 300,
        total: 300
      }
    ],
    subtotal: 300,
    tax: 15,
    taxRate: 5,
    taxAmount: 15,
    total: 315,
    status: "sent",
    notes: "Thank you for your business",
    termsAndConditions: "Payment due within 15 days",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    discount: 0,
    discountAmount: 0,
    shipping: 0,
    orderId: "order1"
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Truck 1",
    number: "MH12AB1234",
    registrationNumber: "MH12AB1234",
    type: "Truck",
    capacity: 1000,
    driverId: "d1",
    driverName: "Driver One"
  },
  {
    id: "v2",
    name: "Van 1",
    number: "MH12CD5678",
    registrationNumber: "MH12CD5678",
    type: "Van",
    capacity: 500,
    driverId: "d2",
    driverName: "Driver Two"
  }
];

export const initialSalesmen: Salesman[] = [
  {
    id: "s1",
    name: "Mike Wilson",
    phone: "+91 9876543213",
    email: "mike@company.com",
    area: "Downtown"
  },
  {
    id: "s2",
    name: "Sarah Davis",
    phone: "+91 9876543214",
    email: "sarah@company.com",
    area: "Uptown"
  }
];

export const initialExpenses: Expense[] = [
  {
    id: "exp1",
    date: "2024-01-15",
    category: "Fuel",
    description: "Vehicle fuel expense",
    amount: 2000,
    paymentMethod: "cash",
    receipt: "REC001",
    notes: "Fuel for delivery vehicles",
    title: "Vehicle Fuel",
    reference: "FUEL001",
    recurring: false
  },
  {
    id: "exp2",
    date: "2024-01-14",
    category: "Maintenance",
    description: "Vehicle maintenance",
    amount: 1500,
    paymentMethod: "bank_transfer",
    receipt: "REC002",
    notes: "Regular vehicle servicing",
    title: "Vehicle Service",
    reference: "MAINT001",
    recurring: true,
    recurringFrequency: "monthly"
  }
];

export const initialStockEntries: StockEntry[] = [
  {
    id: "se1",
    date: "2024-01-10",
    supplierId: "sup1",
    items: [
      {
        id: "sei1",
        productId: "1",
        productName: "Whole Milk",
        quantity: 100,
        rate: 45,
        unitPrice: 45,
        totalPrice: 4500,
        total: 4500,
        amount: 4500
      }
    ],
    totalAmount: 4500,
    notes: "Weekly stock replenishment",
    referenceNumber: "PO001",
    paymentStatus: "paid",
    createdAt: "2024-01-10T00:00:00Z"
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: "sup1",
    name: "Dairy Farm Co.",
    contactPerson: "Farm Manager",
    phone: "+91 9876543215",
    email: "contact@dairyfarm.com",
    address: "Farm Road, Rural Area",
    gstNumber: "29ABCDE1234F1Z5",
    isActive: true,
    notes: "Primary milk supplier"
  },
  {
    id: "sup2",
    name: "Packaging Supplies Ltd.",
    contactPerson: "Sales Manager",
    phone: "+91 9876543216",
    email: "sales@packaging.com",
    address: "Industrial Area, City",
    gstNumber: "29FGHIJ5678K2A6",
    isActive: true,
    notes: "Packaging materials supplier"
  }
];

export const initialSupplierPayments: SupplierPayment[] = [
  {
    id: "sp1",
    supplierId: "sup1",
    amount: 4500,
    paymentDate: "2024-01-10",
    method: "bank_transfer",
    paymentMethod: "bank_transfer",
    referenceNumber: "TXN123456",
    reference: "TXN123456",
    notes: "Payment for stock purchase",
    status: "completed"
  }
];

export const initialAreas: Area[] = [
  {
    id: "area1",
    name: "Downtown",
    description: "Central business district",
    isActive: true
  },
  {
    id: "area2",
    name: "Uptown",
    description: "Residential area north of city",
    isActive: true
  },
  {
    id: "area3",
    name: "Midtown",
    description: "Mixed commercial and residential",
    isActive: true
  }
];
