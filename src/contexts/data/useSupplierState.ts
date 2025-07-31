
import { useState, useEffect } from 'react';
import { Supplier, SupplierPayment, SupplierProductRate } from '@/types';

export function useSupplierState() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem("suppliers");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>(() => {
    const saved = localStorage.getItem("supplierPayments");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [supplierProductRates, setSupplierProductRates] = useState<SupplierProductRate[]>(() => {
    const saved = localStorage.getItem("supplierProductRates");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("supplierPayments", JSON.stringify(supplierPayments));
  }, [supplierPayments]);

  useEffect(() => {
    localStorage.setItem("supplierProductRates", JSON.stringify(supplierProductRates));
  }, [supplierProductRates]);

  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier = { ...supplier, id: `sup${Date.now()}` };
    setSuppliers([...suppliers, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...supplierData } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const addSupplierPayment = (payment: Omit<SupplierPayment, "id">) => {
    const newPayment = { ...payment, id: `sp${Date.now()}` };
    setSupplierPayments([...supplierPayments, newPayment]);
    return newPayment;
  };

  const updateSupplierPayment = (id: string, paymentData: Partial<SupplierPayment>) => {
    setSupplierPayments(supplierPayments.map(p => p.id === id ? { ...p, ...paymentData } : p));
  };

  const deleteSupplierPayment = (id: string) => {
    setSupplierPayments(supplierPayments.filter(p => p.id !== id));
  };

  const addSupplierProductRate = (rate: Omit<SupplierProductRate, "id">) => {
    const newRate = { ...rate, id: `spr${Date.now()}` };
    setSupplierProductRates([...supplierProductRates, newRate]);
    return newRate;
  };

  const updateSupplierProductRate = (id: string, rateData: Partial<SupplierProductRate>) => {
    setSupplierProductRates(supplierProductRates.map(r => r.id === id ? { ...r, ...rateData } : r));
  };

  const deleteSupplierProductRate = (id: string) => {
    setSupplierProductRates(supplierProductRates.filter(r => r.id !== id));
  };

  return {
    suppliers,
    supplierPayments,
    supplierProductRates,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addSupplierPayment,
    updateSupplierPayment,
    deleteSupplierPayment,
    addSupplierProductRate,
    updateSupplierProductRate,
    deleteSupplierProductRate
  };
}
