
import { useState, useEffect } from 'react';
import { Invoice, ProductRate } from '@/types';

export function useOtherStates() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [customerProductRates, setCustomerProductRates] = useState<ProductRate[]>(() => {
    const saved = localStorage.getItem("customerProductRates");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("customerProductRates", JSON.stringify(customerProductRates));
  }, [customerProductRates]);

  const addInvoice = (invoice: Omit<Invoice, "id">) => {
    const newInvoice = { ...invoice, id: `inv${Date.now()}` };
    setInvoices([...invoices, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, ...invoiceData } : i));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
  };

  const addProductRate = (rate: Omit<ProductRate, "id">) => {
    const newRate = { ...rate, id: `pr${Date.now()}` };
    setCustomerProductRates([...customerProductRates, newRate]);
    return newRate;
  };

  const updateProductRate = (id: string, rateData: Partial<ProductRate>) => {
    setCustomerProductRates(customerProductRates.map(r => r.id === id ? { ...r, ...rateData } : r));
  };

  const deleteProductRate = (id: string) => {
    setCustomerProductRates(customerProductRates.filter(r => r.id !== id));
  };

  const addCustomerProductRate = (rate: Omit<ProductRate, "id">) => {
    const newRate = { ...rate, id: `cpr${Date.now()}` };
    setCustomerProductRates([...customerProductRates, newRate]);
    return newRate;
  };

  const updateCustomerProductRate = (id: string, rateData: Partial<ProductRate>) => {
    setCustomerProductRates(customerProductRates.map(r => r.id === id ? { ...r, ...rateData } : r));
  };

  return {
    invoices,
    customerProductRates,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addProductRate,
    updateProductRate,
    deleteProductRate,
    addCustomerProductRate,
    updateCustomerProductRate
  };
}
