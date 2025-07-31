
import { useState, useEffect } from 'react';
import { StockTransaction, StockEntry } from '@/types';

export function useStockState() {
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem("stockTransactions");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem("stockEntries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("stockTransactions", JSON.stringify(stockTransactions));
  }, [stockTransactions]);

  useEffect(() => {
    localStorage.setItem("stockEntries", JSON.stringify(stockEntries));
  }, [stockEntries]);

  const addStockTransaction = (transaction: Omit<StockTransaction, "id">) => {
    const newTransaction = { ...transaction, id: `st${Date.now()}` };
    setStockTransactions([...stockTransactions, newTransaction]);
    return newTransaction;
  };

  const updateStockTransaction = (id: string, transactionData: Partial<StockTransaction>) => {
    setStockTransactions(stockTransactions.map(t => t.id === id ? { ...t, ...transactionData } : t));
  };

  const deleteStockTransaction = (id: string) => {
    setStockTransactions(stockTransactions.filter(t => t.id !== id));
  };

  const addStockEntry = (entry: Omit<StockEntry, "id">) => {
    const newEntry = { ...entry, id: `se${Date.now()}` };
    setStockEntries([...stockEntries, newEntry]);
    return newEntry;
  };

  const updateStockEntry = (id: string, entryData: Partial<StockEntry>) => {
    setStockEntries(stockEntries.map(e => e.id === id ? { ...e, ...entryData } : e));
  };

  const deleteStockEntry = (id: string) => {
    setStockEntries(stockEntries.filter(e => e.id !== id));
  };

  return {
    stockTransactions,
    stockEntries,
    addStockTransaction,
    updateStockTransaction,
    deleteStockTransaction,
    addStockEntry,
    updateStockEntry,
    deleteStockEntry
  };
}
