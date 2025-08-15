
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Customer, 
  Product, 
  Order, 
  Payment, 
  TrackSheet, 
  Invoice, 
  ProductRate, 
  Supplier, 
  SupplierPayment,
  Vehicle,
  Salesman,
  VehicleTrip,
  Expense,
  StockTransaction,
  StockEntry,
  SupplierProductRate,
  UISettings
} from '@/types';
import { DataContextType } from './types';
import { useCustomerState } from './useCustomerState';
import { useProductState } from './useProductState';
import { useOrderState } from './useOrderState';
import { usePaymentState } from './usePaymentState';
import { useVehicleState } from './useVehicleState';
import { useSalesmanState } from './useSalesmanState';
import { useExpenseState } from './useExpenseState';
import { useTrackSheetState } from './useTrackSheetState';
import { useStockState } from './useStockState';
import { useSupplierState } from './useSupplierState';
import { useOtherStates } from './useOtherStates';
import { useUISettingsState } from './useUISettingsState';
import { useAreasState } from './useAreasState';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🟡 DataProvider rendering');
  // Use individual state hooks
  const customerState = useCustomerState();
  const productState = useProductState();
  const orderState = useOrderState();
  const paymentState = usePaymentState();
  const vehicleState = useVehicleState();
  const salesmanState = useSalesmanState();
  const expenseState = useExpenseState();
  const trackSheetState = useTrackSheetState();
  const stockState = useStockState();
  const supplierState = useSupplierState();
  const otherStates = useOtherStates();
  const uiSettingsState = useUISettingsState();
  const areasState = useAreasState();

  const value: DataContextType = {
    // Customer state
    customers: customerState.customers,
    addCustomer: customerState.addCustomer,
    updateCustomer: customerState.updateCustomer,
    deleteCustomer: customerState.deleteCustomer,
    getCustomerById: (id: string) => customerState.customers.find(c => c.id === id),
    
    // Product state
    products: productState.products,
    addProduct: productState.addProduct,
    updateProduct: productState.updateProduct,
    deleteProduct: productState.deleteProduct,
    getProductById: (id: string) => productState.products.find(p => p.id === id),
    
    // Order state
    orders: orderState.orders,
    addOrder: orderState.addOrder,
    updateOrder: orderState.updateOrder,
    deleteOrder: orderState.deleteOrder,
    getOrderById: (id: string) => orderState.orders.find(o => o.id === id),
    
    // Payment state
    payments: paymentState.payments,
    addPayment: paymentState.addPayment,
    updatePayment: paymentState.updatePayment,
    deletePayment: paymentState.deletePayment,
    
    // Vehicle state
    vehicles: vehicleState.vehicles,
    addVehicle: vehicleState.addVehicle,
    updateVehicle: vehicleState.updateVehicle,
    deleteVehicle: vehicleState.deleteVehicle,
    
    // Salesman state
    salesmen: salesmanState.salesmen,
    addSalesman: salesmanState.addSalesman,
    updateSalesman: salesmanState.updateSalesman,
    deleteSalesman: salesmanState.deleteSalesman,
    
    // Vehicle trip
    addVehicleTrip: (trip: Omit<VehicleTrip, "id">) => {
      return { ...trip, id: Date.now().toString() } as VehicleTrip;
    },
    
    // Expense state
    expenses: expenseState.expenses,
    addExpense: expenseState.addExpense,
    updateExpense: expenseState.updateExpense,
    deleteExpense: expenseState.deleteExpense,
    
    // Stock state
    stockTransactions: stockState.stockTransactions,
    addStockTransaction: stockState.addStockTransaction,
    updateStockTransaction: stockState.updateStockTransaction,
    deleteStockTransaction: stockState.deleteStockTransaction,
    
    stockEntries: stockState.stockEntries,
    addStockEntry: stockState.addStockEntry,
    updateStockEntry: stockState.updateStockEntry,
    deleteStockEntry: stockState.deleteStockEntry,
    
    // Track sheet state
    trackSheets: trackSheetState.trackSheets,
    addTrackSheet: trackSheetState.addTrackSheet,
    updateTrackSheet: trackSheetState.updateTrackSheet,
    deleteTrackSheet: trackSheetState.deleteTrackSheet,
    
    // Invoice state
    invoices: otherStates.invoices,
    addInvoice: otherStates.addInvoice,
    updateInvoice: otherStates.updateInvoice,
    deleteInvoice: otherStates.deleteInvoice,
    getInvoiceById: (id: string) => otherStates.invoices.find(i => i.id === id),
    generateInvoiceFromOrder: (orderId: string) => {
      const order = orderState.orders.find(o => o.id === orderId);
      if (!order) return null;
      
      const invoice = otherStates.addInvoice({
        number: `INV-${Date.now().toString().slice(-6)}`,
        customerId: order.customerId,
        customerName: order.customerName,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: order.items.map(item => ({
          productId: item.productId,
          description: item.productName || '',
          quantity: item.quantity,
          rate: item.rate,
          amount: item.total || (item.quantity * item.rate)
        })),
        subtotal: order.total || order.amount,
        tax: 0,
        total: order.total || order.amount,
        status: 'draft' as const
      });
      
      return invoice.id;
    },
    
    // Product rates
    customerProductRates: otherStates.customerProductRates,
    addProductRate: otherStates.addProductRate,
    updateProductRate: otherStates.updateProductRate,
    deleteProductRate: otherStates.deleteProductRate,
    getProductRateForCustomer: (customerId: string, productId: string) => {
      const rate = otherStates.customerProductRates.find(r => 
        r.customerId === customerId && r.productId === productId && r.isActive
      );
      return rate?.rate || null;
    },
    addCustomerProductRate: otherStates.addCustomerProductRate,
    updateCustomerProductRate: otherStates.updateCustomerProductRate,
    
    // Supplier state
    suppliers: supplierState.suppliers,
    addSupplier: supplierState.addSupplier,
    updateSupplier: supplierState.updateSupplier,
    deleteSupplier: supplierState.deleteSupplier,
    
    supplierPayments: supplierState.supplierPayments,
    addSupplierPayment: supplierState.addSupplierPayment,
    updateSupplierPayment: supplierState.updateSupplierPayment,
    deleteSupplierPayment: supplierState.deleteSupplierPayment,
    
    supplierProductRates: supplierState.supplierProductRates,
    addSupplierProductRate: supplierState.addSupplierProductRate,
    updateSupplierProductRate: supplierState.updateSupplierProductRate,
    deleteSupplierProductRate: supplierState.deleteSupplierProductRate,
    
    // UI settings
    uiSettings: uiSettingsState.uiSettings,
    updateUISettings: uiSettingsState.updateUISettings,
    
    // Areas
    areas: areasState.areas,
    saveDeliverySheetData: (data: any) => {
      localStorage.setItem('deliverySheetData', JSON.stringify(data));
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
